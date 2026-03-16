import { readdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

const checksDir = path.resolve("data/checks");
const minIntervalMs = Number(process.env.MONITOR_MIN_INTERVAL_MS ?? "240000");
const githubOutputPath = process.env.GITHUB_OUTPUT ?? null;

const latestTimestamp = await findLatestCheckTimestamp(checksDir);
const shouldRun =
  latestTimestamp === null || Date.now() - latestTimestamp >= minIntervalMs;

if (latestTimestamp === null) {
  console.log("No existing checks found. Monitoring should run.");
} else {
  console.log(
    `Latest check is ${Math.round((Date.now() - latestTimestamp) / 1000)}s old.`,
  );
}

if (githubOutputPath) {
  await appendFile(
    githubOutputPath,
    `should_run=${shouldRun ? "true" : "false"}\n`,
    "utf8",
  );
}

async function findLatestCheckTimestamp(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  let latest = null;

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const filePath = path.join(directory, entry.name);
    const raw = await readFile(filePath, "utf8");
    const checks = JSON.parse(raw);
    const lastCheck = Array.isArray(checks) ? checks.at(-1) : null;
    const timestamp =
      typeof lastCheck?.timestamp === "string"
        ? Date.parse(lastCheck.timestamp)
        : Number.NaN;

    if (!Number.isNaN(timestamp) && (latest === null || timestamp > latest)) {
      latest = timestamp;
    }
  }

  return latest;
}
