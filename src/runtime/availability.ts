import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";

const execFileAsync = promisify(execFileCallback);

export async function commandExists(command: string): Promise<boolean> {
  return (await resolveCommand(command)) !== undefined;
}

/**
 * Resolves a command to an executable path.
 *
 * Resolution order:
 * 1. Explicit filesystem path (absolute or containing a separator): checked directly.
 * 2. PATH lookup via `where` (Windows) or `which` (Linux/macOS).
 * 3. Well-known drun install locations (~/.local/bin, ~/bin, ~/go/bin,
 *    /usr/local/bin, %LOCALAPPDATA%\Programs\xdrun). These matter because
 *    GUI-launched editors often do not inherit the user's shell PATH.
 * 4. Login shell lookup (`$SHELL -l -c 'command -v <name>'`) on Linux/macOS,
 *    which picks up PATH entries defined in shell profile files.
 *
 * Returns the absolute path when resolved through fallbacks, or undefined when
 * the command cannot be found.
 */
export async function resolveCommand(command: string): Promise<string | undefined> {
  const trimmed = command.trim();
  if (!trimmed) {
    return undefined;
  }

  if (looksLikeFilesystemPath(trimmed)) {
    return (await isExecutable(trimmed)) ? trimmed : undefined;
  }

  if (await foundOnPath(trimmed)) {
    return trimmed;
  }

  const wellKnown = await probeWellKnownLocations(trimmed);
  if (wellKnown) {
    return wellKnown;
  }

  return probeLoginShell(trimmed);
}

async function isExecutable(candidate: string): Promise<boolean> {
  try {
    await fs.promises.access(candidate, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function foundOnPath(command: string): Promise<boolean> {
  const tool = process.platform === "win32" ? "where" : "which";
  try {
    await execFileAsync(tool, [command], { windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

function wellKnownDirectories(): string[] {
  const home = os.homedir();
  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA;
    return localAppData ? [path.join(localAppData, "Programs", "xdrun")] : [];
  }
  return [
    path.join(home, ".local", "bin"),
    path.join(home, "bin"),
    path.join(home, "go", "bin"),
    "/usr/local/bin"
  ];
}

async function probeWellKnownLocations(command: string): Promise<string | undefined> {
  const names = process.platform === "win32" && !command.toLowerCase().endsWith(".exe")
    ? [`${command}.exe`, command]
    : [command];

  for (const dir of wellKnownDirectories()) {
    for (const name of names) {
      const candidate = path.join(dir, name);
      if (await isExecutable(candidate)) {
        return candidate;
      }
    }
  }
  return undefined;
}

async function probeLoginShell(command: string): Promise<string | undefined> {
  if (process.platform === "win32") {
    return undefined;
  }
  const shell = process.env.SHELL;
  if (!shell) {
    return undefined;
  }
  try {
    const { stdout } = await execFileAsync(
      shell,
      ["-l", "-c", `command -v ${shellQuote(command)}`],
      { windowsHide: true, timeout: 5000 }
    );
    const resolved = stdout.split("\n")[0]?.trim();
    if (resolved && path.isAbsolute(resolved) && (await isExecutable(resolved))) {
      return resolved;
    }
  } catch {
    // Login shell lookup is best-effort; profiles may be slow or interactive-only.
  }
  return undefined;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function looksLikeFilesystemPath(value: string): boolean {
  return path.isAbsolute(value) || value.includes(path.sep) || value.includes("/") || value.includes("\\");
}
