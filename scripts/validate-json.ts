import fs from "node:fs";
import path from "node:path";

const files = [
  "package.json",
  "language-configuration.json",
  "syntaxes/drun.tmLanguage.json"
];

for (const file of files) {
  const fullPath = path.resolve(file);
  JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

console.log(`Validated ${files.length} JSON files.`);
