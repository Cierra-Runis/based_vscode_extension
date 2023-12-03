import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { Utils } from "../../utils";

export async function createStateWithPersistence(
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

  const name = await vscode.window.showInputBox({
    placeHolder: "Enter state name here",
  });

  console.log(name);

  if (name === undefined) {
    vscode.window.showInformationMessage("Canceled.");
    return;
  } else if (name.length <= 1 || !Utils.isCamelCase(name)) {
    vscode.window.showErrorMessage(`Invalid name: ${name}`);
    return createStateWithPersistence(context);
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
    vscode.window.showInformationMessage("No selected folder.");
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
