import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { Utils } from "../../utils";

export async function createColorSchemes(
  context: vscode.ExtensionContext
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (workspaceFolder === undefined) {
    vscode.window.showErrorMessage("No opened workspace.");
    return;
  }

  const projectName = await Pubspec.getProjectName();
  if (projectName === undefined) {
    vscode.window.showErrorMessage("Can't get project name.");
    return;
  }

  const selected = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.joinPath(workspaceFolder.uri, `color_schemes.dart`),
    filters: { ["Dart"]: ["dart"] },
  });

  if (selected === undefined) {
    vscode.window.showInformationMessage("No selected folder.");
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
