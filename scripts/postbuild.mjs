import { copyFile } from "node:fs/promises";
import path from "node:path";

const distDirectory = path.join(process.cwd(), "dist");
await copyFile(
  path.join(distDirectory, "index.html"),
  path.join(distDirectory, "404.html"),
);
