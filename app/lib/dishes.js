import { readFile } from "node:fs/promises";
import path from "node:path";

export async function getDishes() {
  const file = await readFile(path.join(process.cwd(), "public", "dishes.json"), "utf8");
  return JSON.parse(file);
}
