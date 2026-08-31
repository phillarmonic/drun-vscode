import * as vscode from "vscode";
import { LanguageClient, type LanguageClientOptions, type ServerOptions } from "vscode-languageclient/node";
import type { ExtensionServices } from "../core/services";
import { resolveCommand } from "../runtime/availability";
import { isLanguageServerEnabled, resolveXdrunCommand } from "../runtime/config";

export function createClient(services: ExtensionServices, command: string): LanguageClient {

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
  const resolved = await resolveCommand(command);
  if (!resolved) {
    services.outputChannel.appendLine(
      `Skipping Drun language server startup because '${command}' could not be found. ` +
        `Searched PATH, well-known install locations, and the login shell. ` +
        `Install drun (https://github.com/phillarmonic/drun#install), set 'drun.xdrunPath' to the xdrun binary, ` +
        `or restart the editor so it picks up PATH changes (required on Windows after installing).`
    );
    return;
  }
  if (resolved !== command) {
    services.outputChannel.appendLine(`Resolved '${command}' to '${resolved}'.`);
  }

  const nextClient = createClient(services, resolved);
  services.client = nextClient;
  await nextClient.start();
  services.outputChannel.appendLine(`Started Drun language server using '${resolved} cmd:lsp'.`);
}

export function didAffectLanguageServerConfiguration(event: vscode.ConfigurationChangeEvent): boolean {
  return (
    event.affectsConfiguration("drun") ||
    event.affectsConfiguration("drun.enableLanguageServer") ||
    event.affectsConfiguration("drun.xdrunPath")
  );
}
