const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");

const pkg = require("../package.json");
const outputPath = `dist/${pkg.name}-${pkg.version}.vsix`;
const repoRoot = path.resolve(__dirname, "..");
const stageRoot = mkdtempSync(path.join(tmpdir(), "drun-vsce-"));
const stageExtensionRoot = path.join(stageRoot, "extension");

mkdirSync("dist", { recursive: true });
if (existsSync(outputPath)) {
  rmSync(outputPath);
}

try {
  execFileSync("pnpm", ["run", "compile"], {
    cwd: repoRoot,
    stdio: "inherit"
  });

  mkdirSync(stageExtensionRoot, { recursive: true });

  for (const entry of ["README.md", "LICENSE", "language-configuration.json", "dist", "syntaxes"]) {
    cpSync(path.join(repoRoot, entry), path.join(stageExtensionRoot, entry), { recursive: true });
  }

  const stagedPackage = {
    ...pkg,
    files: [
      "dist/**",
      "syntaxes/**",
      "language-configuration.json",
      "README.md",
      "LICENSE",
      "package.json"
    ],
    dependencies: undefined,
    scripts: undefined,
    devDependencies: undefined
  };
  writeFileSync(path.join(stageExtensionRoot, "package.json"), `${JSON.stringify(stagedPackage, null, 2)}\n`, "utf8");

  execFileSync("npx", ["@vscode/vsce", "package", "--no-dependencies", "--out", path.resolve(repoRoot, outputPath)], {
    cwd: stageExtensionRoot,
    stdio: "inherit"
  });
} finally {
  rmSync(stageRoot, { recursive: true, force: true });
}

const sha1 = createHash("sha1").update(readFileSync(outputPath)).digest("hex");
console.log(`VSIX generated: ${outputPath}`);
console.log(`SHA1: ${sha1}`);
console.log(`Extension version in VSIX: ${pkg.version}`);
console.log("If VS Code still shows an older extension, bump package.json version or reinstall with --force.");
