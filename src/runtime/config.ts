import * as vscode from "vscode";
import type { ExtensionServices } from "../core/services";

export function isLanguageServerEnabled(): boolean {
  return vscode.workspace.getConfiguration("drun").get<boolean>("enableLanguageServer", true);
}

export function resolveXdrunCommand(_services: ExtensionServices): string {
  const configured = vscode.workspace.getConfiguration("drun").get<string>("xdrunPath", "xdrun").trim();
  return configured || "xdrun";
}
