import * as vscode from "vscode";
import { LanguageClient, type LanguageClientOptions, type ServerOptions } from "vscode-languageclient/node";
import type { ExtensionServices } from "../core/services";
import { commandExists } from "../runtime/availability";
import { isLanguageServerEnabled, resolveXdrunCommand } from "../runtime/config";

export function createClient(services: ExtensionServices): LanguageClient {
  const command = resolveXdrunCommand(services);

  const serverOptions: ServerOptions = {
    command,
    args: ["cmd:lsp"]
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: "file", language: "drun" },
      { scheme: "untitled", language: "drun" }
    ],
    outputChannel: services.outputChannel
  };

  return new LanguageClient("drunLanguageServer", "Drun Language Server", serverOptions, clientOptions);
}

export async function restartClient(services: ExtensionServices): Promise<void> {
  const previousClient = services.client;
  services.client = undefined;

  if (previousClient) {
    await previousClient.stop();
  }

  if (!isLanguageServerEnabled()) {
    services.outputChannel.appendLine("Drun language server is disabled by configuration.");
    return;
  }

  const command = resolveXdrunCommand(services);
  if (!(await commandExists(command))) {
    services.outputChannel.appendLine(`Skipping Drun language server startup because '${command}' is unavailable.`);
    return;
  }

  const nextClient = createClient(services);
  services.client = nextClient;
  await nextClient.start();
  services.outputChannel.appendLine(`Started Drun language server using '${command} cmd:lsp'.`);
}

export function didAffectLanguageServerConfiguration(event: vscode.ConfigurationChangeEvent): boolean {
  return (
    event.affectsConfiguration("drun") ||
    event.affectsConfiguration("drun.enableLanguageServer") ||
    event.affectsConfiguration("drun.xdrunPath")
  );
}
