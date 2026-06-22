const { build } = require("esbuild");
const { mkdirSync, rmSync } = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, "dist");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

build({
  entryPoints: [path.join(repoRoot, "src", "extension.ts")],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node18",
  outfile: path.join(outDir, "extension.js"),
  external: ["vscode"],
  sourcemap: false,
  logLevel: "info"
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
