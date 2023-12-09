import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { Utils } from "../../utils";

export async function createStateWithPersistence(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder,
  projectName: string
): Promise<void> {
  const name = await vscode.window.showInputBox({
    placeHolder: "Enter state name here...",
  });

  if (name === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  } else if (name.length <= 1 || !Utils.isCamelCase(name)) {
    vscode.window.showErrorMessage(`💢 Invalid name: ${name}`);
    return createStateWithPersistence(context, workspaceFolder, projectName);
  }

  const upperCaseName = name[0].toUpperCase() + name.slice(1);
  const lowerCaseName = name[0].toLowerCase() + name.slice(1);
  const snakeCaseName = Utils.toSnakeCase(lowerCaseName);

  const selected = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.joinPath(
      workspaceFolder.uri,
      `${snakeCaseName}.dart`
    ),
    filters: { ["Dart"]: ["dart"] },
  });

  if (selected === undefined) {
    vscode.window.showInformationMessage("🧊Canceled.");
    return;
  }

  const template = await Utils.getTemplate("stateWithPersistence", context);
  const replaced = Utils.replaceTemplate(template, {
    projectName: projectName,
    lowerCaseName: lowerCaseName,
    upperCaseName: upperCaseName,
    snakeCaseName: snakeCaseName,
  });

  await vscode.workspace.fs.writeFile(
    selected,
    new TextEncoder().encode(replaced)
  );

  Pubspec.runBuilder(workspaceFolder.uri.fsPath);
}
