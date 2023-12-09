import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { Utils } from "../../utils";

export async function createColorSchemes(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder,
  projectName: string
): Promise<void> {
  const selected = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.joinPath(workspaceFolder.uri, `color_schemes.dart`),
    filters: { ["Dart"]: ["dart"] },
  });

  if (selected === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  }

  const template = await Utils.getTemplate("colorSchemes", context);
  const replaced = Utils.replaceTemplate(template, {
    projectName: projectName,
  });

  await vscode.workspace.fs.writeFile(
    selected,
    new TextEncoder().encode(replaced)
  );

  Pubspec.runBuilder(workspaceFolder.uri.fsPath);
}
