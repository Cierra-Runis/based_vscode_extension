import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { Utils } from "../../utils";

export async function createPersistence(
  context: vscode.ExtensionContext
): Promise<void> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

  if (workspaceFolder === undefined) {
    vscode.window.showErrorMessage("💢 No workspace opened.");
    return;
  }

  const projectName = await Pubspec.getProjectName();
  if (projectName === undefined) {
    vscode.window.showErrorMessage("💢 Can't get project name.");
    return;
  }

  const selected = await vscode.window.showOpenDialog({
    defaultUri: vscode.workspace.workspaceFolders?.[0].uri,
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
  });

  if (selected === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  }

  const selectedFolder = selected[0];
  const persistencePath = vscode.Uri.joinPath(
    selectedFolder,
    "persistence.dart"
  );

  const template = await Utils.getTemplate("persistence", context);
  const replaced = Utils.replaceTemplate(template, {
    projectName: projectName,
    prefix: projectName,
  });

  await vscode.workspace.fs.writeFile(
    persistencePath,
    new TextEncoder().encode(replaced)
  );

  vscode.window.showInformationMessage(
    `🚀 Created persistence.dart for ${projectName}!`
  );

  Pubspec.runBuilder(workspaceFolder.uri.fsPath);
}
