import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve("dist/capacitor");
const nestedIndex = path.join(rootDir, "capacitor", "index.html");
const finalIndex = path.join(rootDir, "index.html");

const html = await readFile(nestedIndex, "utf8");
const normalized = html.replaceAll("../", "./");

await mkdir(rootDir, { recursive: true });
await writeFile(finalIndex, normalized, "utf8");
await rm(path.join(rootDir, "capacitor"), { recursive: true, force: true });

console.log("Finalized dist/capacitor/index.html for Capacitor.");
