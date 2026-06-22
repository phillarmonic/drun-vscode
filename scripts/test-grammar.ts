import fs from "node:fs";
import path from "node:path";

import * as vscodeOniguruma from "vscode-oniguruma";
import * as vscodeTextmate from "vscode-textmate";

const grammarPath = path.resolve("syntaxes/drun.tmLanguage.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8")) as { scopeName: string };
const wasmPath = require.resolve("vscode-oniguruma/release/onig.wasm");
const wasmBin = fs.readFileSync(wasmPath).buffer;

void (async () => {
  await vscodeOniguruma.loadWASM(wasmBin);

  const onigLib = Promise.resolve({
    createOnigScanner(patterns: string[]) {
      return new vscodeOniguruma.OnigScanner(patterns);
    },
    createOnigString(text: string) {
      return new vscodeOniguruma.OnigString(text);
    }
  });

  const registry = new vscodeTextmate.Registry({
    onigLib,
    loadGrammar: async (scopeName) => {
      if (scopeName !== grammar.scopeName) {
        return null;
      }

      return vscodeTextmate.parseRawGrammar(JSON.stringify(grammar), grammarPath);
    }
  });

  const tmGrammar = await registry.loadGrammar(grammar.scopeName);
  if (!tmGrammar) {
    throw new Error(`Failed to load grammar for scope ${grammar.scopeName}`);
  }

  const testFiles = fs
    .readdirSync(path.resolve("tests/grammar"), { recursive: true })
    .filter((entry): entry is string => typeof entry === "string" && entry.endsWith(".test.json"))
    .map((entry) => path.resolve("tests/grammar", entry))
    .sort();

  let failures = 0;

  for (const testFile of testFiles) {
    const fixture = JSON.parse(fs.readFileSync(testFile, "utf8")) as {
      file: string;
      assertions: Array<{ line: number; column: number; scopes: string[] }>;
    };
    const sourcePath = path.resolve(fixture.file);
    const lines = fs.readFileSync(sourcePath, "utf8").split(/\r?\n/);

    let ruleStack = vscodeTextmate.INITIAL;
    const actual = [];

    for (const line of lines) {
      const result = tmGrammar.tokenizeLine(line, ruleStack);
      actual.push(result.tokens);
      ruleStack = result.ruleStack;
    }

    for (const assertion of fixture.assertions) {
      const tokens = actual[assertion.line - 1] ?? [];
      const token = tokens.find((entry) => entry.startIndex <= assertion.column && entry.endIndex > assertion.column);

      if (!token) {
        console.error(`${path.basename(testFile)}:${assertion.line}:${assertion.column} no token found`);
        failures++;
        continue;
      }

      const ok = assertion.scopes.every((scope) => token.scopes.includes(scope));
      if (!ok) {
        console.error(
          `${path.basename(testFile)}:${assertion.line}:${assertion.column} expected scopes ${assertion.scopes.join(", ")} got ${token.scopes.join(", ")}`
        );
        failures++;
      }
    }
  }

  if (failures > 0) {
    process.exit(1);
  }

  console.log(`Grammar tests passed for ${testFiles.length} fixture(s).`);
})().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
