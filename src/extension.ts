import * as vscode from "vscode";
import { Commands } from "./commands/commands";

export async function activate(context: vscode.ExtensionContext) {
  const flutterExt = vscode.extensions.getExtension("Dart-Code.flutter");
  if (!flutterExt) {
    return vscode.window.showWarningMessage("No Flutter extension found.");
  }

  console.log("Based extension is now active");

  Commands.register(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
