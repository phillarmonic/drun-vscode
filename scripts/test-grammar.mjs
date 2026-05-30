import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadOptional(name) {
  try {
    return require(name);
  } catch (error) {
    if (error && error.code === "MODULE_NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

const vscodeTextmate = loadOptional("vscode-textmate");
const vscodeOniguruma = loadOptional("vscode-oniguruma");

if (!vscodeTextmate || !vscodeOniguruma) {
  console.error("Missing dev dependencies. Run `pnpm install` before `pnpm test`.");
  process.exit(1);
}

const grammarPath = path.resolve("syntaxes/drun.tmLanguage.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const wasmPath = require.resolve("vscode-oniguruma/release/onig.wasm");
const wasmBin = fs.readFileSync(wasmPath).buffer;

await vscodeOniguruma.loadWASM(wasmBin);

const onigLib = Promise.resolve({
  createOnigScanner(patterns) {
    return new vscodeOniguruma.OnigScanner(patterns);
  },
  createOnigString(text) {
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
  .filter((entry) => typeof entry === "string" && entry.endsWith(".test.json"))
  .map((entry) => path.resolve("tests/grammar", entry))
  .sort();

let failures = 0;

for (const testFile of testFiles) {
  const fixture = JSON.parse(fs.readFileSync(testFile, "utf8"));
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
    const token = tokens.find((entry) => {
      if (entry.startIndex > assertion.column) {
        return false;
      }
      if (entry.endIndex <= assertion.column) {
        return false;
      }
      return true;
    });

    if (!token) {
      console.error(`${path.basename(testFile)}:${assertion.line}:${assertion.column} no token found`);
      failures++;
      continue;
    }

    const scopes = token.scopes;
    const ok = assertion.scopes.every((scope) => scopes.includes(scope));
    if (!ok) {
      console.error(
        `${path.basename(testFile)}:${assertion.line}:${assertion.column} expected scopes ${assertion.scopes.join(", ")} got ${scopes.join(", ")}`
      );
      failures++;
    }
  }
}

if (failures > 0) {
  process.exit(1);
}

console.log(`Grammar tests passed for ${testFiles.length} fixture(s).`);
