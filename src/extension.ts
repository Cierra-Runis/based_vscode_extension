import * as vscode from "vscode";
import { Commands } from "./commands/commands";
import { Hovers } from "./hovers/hovers";
import { Colors } from "./colors/colors";

export async function activate(context: vscode.ExtensionContext) {
  const flutterExt = vscode.extensions.getExtension("Dart-Code.flutter");
  if (flutterExt === undefined) {
    return vscode.window.showErrorMessage("💢 No Flutter extension found.");
  }

  console.log("Based extension is now active");

  Hovers.register(context);
  Commands.register(context);
  Colors.register(context);

  console.log(`All registered`);
}

// This method is called when your extension is deactivated
export function deactivate() {}
