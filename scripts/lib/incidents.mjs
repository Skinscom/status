import { readJson, servicesConfigPath, writeJson } from "./fs.mjs";

const STATUS_PATTERN = /^status:\s*(.+)$/im;

export async function syncIncidentsSnapshot({
  owner,
  repo,
  token,
  snapshotPath,
}) {
  if (!owner || !repo || !token) {
    return readJson(snapshotPath, []);
  }

  const servicesConfig = await readJson(servicesConfigPath, { services: [] });
  const serviceSlugs = servicesConfig.services.map((service) => service.slug);
  const issues = await fetchIssues({ owner, repo, token });

  const incidents = [];
  for (const issue of issues) {
    if (issue.pull_request) {
      continue;
    }

    const labels = issue.labels.map((label) =>
      typeof label === "string" ? label : label.name,
    );
    if (!labels.includes("incident") && !labels.includes("maintenance")) {
      continue;
    }

    const comments = await fetchIssueComments({
      commentsUrl: issue.comments_url,
      token,
    });

    incidents.push(
      mapIssueToIncident({
        issue,
        comments,
        labels,
        serviceSlugs,
      }),
    );
  }

  incidents.sort(
    (left, right) =>
      Date.parse(right.updatedAt ?? right.startedAt) -
      Date.parse(left.updatedAt ?? left.startedAt),
  );

  await writeJson(snapshotPath, incidents);
  return incidents;
}

async function fetchIssues({ owner, repo, token }) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&sort=updated&direction=desc`,
    {
      headers: buildHeaders(token),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.status}`);
  }

  return response.json();
}

async function fetchIssueComments({ commentsUrl, token }) {
  const response = await fetch(commentsUrl, {
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

function buildHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "skinscom-status-monitor",
  };
}

function mapIssueToIncident({ issue, comments, labels, serviceSlugs }) {
  const kind = labels.includes("maintenance") ? "maintenance" : "incident";
  const impactLabel = labels.find((label) => label.startsWith("impact:"));
  const impact = impactLabel?.replace("impact:", "") ?? "minor";
  const body = issue.body ?? "";
  const summary = extractSummary(body) ?? issue.title;
  const affectedServices = extractAffectedServices(body, serviceSlugs);
  const statusFromBody = extractStatus(body);
  const status =
    kind === "maintenance"
      ? issue.state === "closed"
        ? "completed"
        : statusFromBody ?? "scheduled"
      : issue.state === "closed"
        ? "resolved"
        : statusFromBody ?? "investigating";

  return {
    id: issue.number,
    kind,
    impact,
    title: issue.title,
    summary,
    status,
    startedAt: issue.created_at,
    resolvedAt: issue.closed_at,
    updatedAt: issue.updated_at,
    url: issue.html_url,
    affectedServices,
    updates: [
      {
        id: `issue-${issue.number}`,
        label: normalizeUpdateLabel(statusFromBody ?? status),
        body: summary,
        createdAt: issue.created_at,
      },
      ...comments.map((comment) => ({
        id: `comment-${comment.id}`,
        label: normalizeUpdateLabel(extractStatus(comment.body) ?? "update"),
        body: stripMetadata(comment.body),
        createdAt: comment.created_at,
      })),
    ],
  };
}

function extractSummary(body) {
  const sections = parseSections(body);
  const summarySection = sections.summary ?? sections.description ?? "";
  const candidate = stripMetadata(summarySection).trim();

  return candidate || null;
}

function extractAffectedServices(body, serviceSlugs) {
  const sections = parseSections(body);
  const affectedSection =
    sections["affected services"] ?? sections.affected ?? body;
  const selectedServices = [];

  for (const slug of serviceSlugs) {
    const checklistPattern = new RegExp(`- \\[[xX]\\] ${slug}\\b`);
    const csvPattern = new RegExp(`\\b${slug}\\b`, "i");

    if (
      checklistPattern.test(affectedSection) ||
      csvPattern.test(affectedSection.replaceAll("\n", " "))
    ) {
      selectedServices.push(slug);
    }
  }

  return selectedServices;
}

function extractStatus(body) {
  const match = body.match(STATUS_PATTERN);
  return match?.[1]?.trim().toLowerCase() ?? null;
}

function parseSections(body) {
  const lines = body.split(/\r?\n/);
  const sections = {};
  let currentSection = "root";
  sections[currentSection] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      currentSection = headingMatch[1].trim().toLowerCase();
      sections[currentSection] = [];
      continue;
    }

    sections[currentSection].push(line);
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.join("\n").trim()]),
  );
}

function stripMetadata(body) {
  return body
    .replace(STATUS_PATTERN, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

function normalizeUpdateLabel(value) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
