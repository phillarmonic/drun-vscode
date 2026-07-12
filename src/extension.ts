import * as vscode from "vscode";
import { createExtensionServices, disposeExtensionServices, type ExtensionServices } from "./core/services";
import { didAffectLanguageServerConfiguration, restartClient } from "./lsp/client";

let services: ExtensionServices | undefined;

export function activate(context: vscode.ExtensionContext): void {
  services = createExtensionServices(context);

  void restartClient(services).catch((error: unknown) => {
    services?.outputChannel.appendLine(`Failed to start Drun language server: ${formatError(error)}`);
  });

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (!services || !didAffectLanguageServerConfiguration(event)) {
        return;
      }

      void restartClient(services).catch((error: unknown) => {
        services?.outputChannel.appendLine(`Failed to restart Drun language server: ${formatError(error)}`);
      });
    })
  );

  context.subscriptions.push({
    dispose: () => {
      void services?.client?.stop();
    }
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!services) {
    return undefined;
  }

  const activeServices = services;
  services = undefined;
  return disposeExtensionServices(activeServices);
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
