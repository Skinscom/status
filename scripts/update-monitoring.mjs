import {
  loadServicesConfig,
  pruneChecks,
  readServiceChecks,
  runServiceCheck,
  writeServiceChecks,
} from "./lib/monitoring.mjs";
import { incidentsSnapshotPath } from "./lib/fs.mjs";
import { syncIncidentsSnapshot } from "./lib/incidents.mjs";

const servicesConfig = await loadServicesConfig();

for (const service of servicesConfig.services) {
  const checks = await readServiceChecks(service.slug);
  const nextCheck = await runServiceCheck(service);
  checks.push(nextCheck);
  await writeServiceChecks(service.slug, pruneChecks(checks));
}

await syncIncidentsSnapshot({
  owner: process.env.GITHUB_REPOSITORY?.split("/")[0],
  repo: process.env.GITHUB_REPOSITORY?.split("/")[1],
  token: process.env.STATUS_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN ?? null,
  snapshotPath: incidentsSnapshotPath,
});

await import("./build-data.mjs");
