import * as vscode from "vscode";
import type { LanguageClient } from "vscode-languageclient/node";

export interface ExtensionServices {
  client: LanguageClient | undefined;
  context: vscode.ExtensionContext;
  outputChannel: vscode.OutputChannel;
}

export function createExtensionServices(context: vscode.ExtensionContext): ExtensionServices {
  const outputChannel = vscode.window.createOutputChannel("Drun");
  context.subscriptions.push(outputChannel);

  return {
    client: undefined,
    context,
    outputChannel
  };
}

export async function disposeExtensionServices(services: ExtensionServices): Promise<void> {
  if (services.client) {
    await services.client.stop();
    services.client = undefined;
  }
}
