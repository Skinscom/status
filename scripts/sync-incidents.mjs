import { incidentsSnapshotPath } from "./lib/fs.mjs";
import { syncIncidentsSnapshot } from "./lib/incidents.mjs";

await syncIncidentsSnapshot({
  owner: process.env.GITHUB_REPOSITORY?.split("/")[0],
  repo: process.env.GITHUB_REPOSITORY?.split("/")[1],
  token: process.env.STATUS_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN ?? null,
  snapshotPath: incidentsSnapshotPath,
});

await import("./build-data.mjs");
