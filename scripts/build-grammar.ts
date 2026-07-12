import fs from "node:fs";
import path from "node:path";

import grammar from "../syntaxes/drun.tmLanguage.source";

const outputPath = path.join(__dirname, "..", "..", "syntaxes", "drun.tmLanguage.json");
const content = `${JSON.stringify(grammar, null, 2)}\n`;

fs.writeFileSync(outputPath, content, "utf8");
