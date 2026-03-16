import {
  averageResponseTime,
  aggregateDailyBars,
  buildSparkline,
  calculateUptime,
  loadServicesConfig,
  readServiceChecks,
} from "./lib/monitoring.mjs";
import {
  generatedDataPath,
  incidentsSnapshotPath,
  readJson,
  writeJson,
} from "./lib/fs.mjs";

const servicesConfig = await loadServicesConfig();
const incidents = await readJson(incidentsSnapshotPath, []);
const services = await Promise.all(
  servicesConfig.services.map(async (service) => {
    const checks = await readServiceChecks(service.slug);
    const dailyBars = aggregateDailyBars(checks, 90);
    const lastCheck = checks.at(-1) ?? null;
    const coverageHours = getCoverageHours(checks);
    const uptime90d =
      coverageHours >= 24
        ? calculateUptime(
            checks.filter(
              (check) =>
                Date.parse(check.timestamp) >=
                Date.now() - 90 * 24 * 60 * 60 * 1000,
            ),
          )
        : null;

    return {
      slug: service.slug,
      name: service.name,
      shortName: service.shortName,
      description: service.description,
      target:
        service.kind === "tcp"
          ? `${service.host}:${service.port}`
          : service.url,
      kind: service.kind,
      currentStatus: lastCheck?.status ?? "unknown",
      lastCheckedAt: lastCheck?.timestamp ?? null,
      responseTime: lastCheck?.responseTime ?? null,
      httpCode: lastCheck?.code ?? null,
      latestError: lastCheck?.error ?? null,
      uptime90d,
      uptime24h: checks.length >= 6 ? calculateUptime(checks, 24) : null,
      averageResponseTime24h:
        checks.length >= 3 ? averageResponseTime(checks, 24) : null,
      sparkline: buildSparkline(checks, 48),
      dailyBars,
    };
  }),
);

const overall = buildOverallStatus(services);
const data = {
  site: servicesConfig.site,
  generatedAt: new Date().toISOString(),
  overall,
  metrics: {
    monitoredServices: services.length,
    operationalServices: services.filter(
      (service) => service.currentStatus === "operational",
    ).length,
    averageResponseTime24h: calculateAverageResponseTime(services),
    uptime90d: calculateAverageUptime(services),
  },
  services,
  incidents,
};

await writeJson(generatedDataPath, data);

function buildOverallStatus(services) {
  const outages = services.filter((service) => service.currentStatus === "outage");
  const degraded = services.filter(
    (service) => service.currentStatus === "degraded",
  );
  const unknown = services.filter((service) => service.currentStatus === "unknown");

  if (outages.length > 0) {
    return {
      status: "outage",
      title:
        outages.length === services.length
          ? "Major Service Outage"
          : "Partial Service Outage",
      message:
        outages.length === 1
          ? `${outages[0].name} is currently unavailable.`
          : `${outages.length} monitored services are currently unavailable.`,
    };
  }

  if (degraded.length > 0) {
    return {
      status: "degraded",
      title: "Minor Service Degradation",
      message:
        degraded.length === 1
          ? `${degraded[0].name} is experiencing elevated errors or slower responses.`
          : `${degraded.length} services are experiencing elevated errors or slower responses.`,
    };
  }

  if (unknown.length > 0) {
    return {
      status: "unknown",
      title: "Monitoring Baseline In Progress",
      message:
        "Some services are still collecting enough data to establish a baseline.",
    };
  }

  return {
    status: "operational",
    title: "All Systems Operational",
    message: "All monitored services are responding normally.",
  };
}

function calculateAverageResponseTime(services) {
  const responseTimes = services
    .map((service) => service.averageResponseTime24h)
    .filter((value) => typeof value === "number");

  if (responseTimes.length === 0) {
    return null;
  }

  return Math.round(
    responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length,
  );
}

function calculateAverageUptime(services) {
  const uptimes = services
    .map((service) => service.uptime90d)
    .filter((value) => typeof value === "number");

  if (uptimes.length === 0) {
    return null;
  }

  return uptimes.reduce((sum, value) => sum + value, 0) / uptimes.length;
}

function getCoverageHours(checks) {
  const firstCheck = checks.at(0);
  if (!firstCheck) {
    return 0;
  }

  return (Date.now() - Date.parse(firstCheck.timestamp)) / (60 * 60 * 1000);
}
