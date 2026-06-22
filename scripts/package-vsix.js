const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { existsSync, mkdirSync, readFileSync, rmSync } = require("node:fs");

const pkg = require("../package.json");
const outputPath = `dist/${pkg.name}-${pkg.version}.vsix`;

mkdirSync("dist", { recursive: true });
if (existsSync(outputPath)) {
  rmSync(outputPath);
}

execFileSync("npx", ["@vscode/vsce", "package", "--out", outputPath], {
  stdio: "inherit"
});

const sha1 = createHash("sha1").update(readFileSync(outputPath)).digest("hex");
console.log(`VSIX generated: ${outputPath}`);
console.log(`SHA1: ${sha1}`);
console.log(`Extension version in VSIX: ${pkg.version}`);
console.log("If VS Code still shows an older extension, bump package.json version or reinstall with --force.");
