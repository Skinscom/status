import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const rootDirectory = process.cwd();
export const dataDirectory = path.join(rootDirectory, "data");
export const checksDirectory = path.join(dataDirectory, "checks");
export const incidentsSnapshotPath = path.join(
  dataDirectory,
  "incidents",
  "snapshot.json",
);
export const generatedDataPath = path.join(
  rootDirectory,
  "public",
  "data",
  "status-data.json",
);
export const servicesConfigPath = path.join(dataDirectory, "services.json");

export async function ensureDirectory(directory) {
  await mkdir(directory, { recursive: true });
}

export async function readJson(filePath, fallback) {
  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents);
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, value) {
  await ensureDirectory(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(value, null, 2) + "\n");
}
