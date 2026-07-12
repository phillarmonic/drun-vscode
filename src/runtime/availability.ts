import * as fs from "node:fs";
import * as path from "node:path";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";

const execFileAsync = promisify(execFileCallback);

export async function commandExists(command: string): Promise<boolean> {
  const trimmed = command.trim();
  if (!trimmed) {
    return false;
  }

  if (looksLikeFilesystemPath(trimmed)) {
    try {
      await fs.promises.access(trimmed, fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  }

  const tool = process.platform === "win32" ? "where" : "which";
  try {
    await execFileAsync(tool, [trimmed], { windowsHide: true });
    return true;
  } catch {
    return false;
  }
}

function looksLikeFilesystemPath(value: string): boolean {
  return path.isAbsolute(value) || value.includes(path.sep) || value.includes("/") || value.includes("\\");
}
