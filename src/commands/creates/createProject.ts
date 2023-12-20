import * as vscode from "vscode";
import { Pubspec } from "../../pubspec";
import { AddDependencies } from "../addDependencies";

export async function createProject(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder
): Promise<void> {
  const projectName = await vscode.window.showInputBox({
    title: "🧊 Please enter the project name",
    value: "example",
  });

  if (projectName === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  }

  const org = await vscode.window.showInputBox({
    title: "🧊 Please enter org name",
    value: "com.example",
  });

  if (org === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  }

  const description = await vscode.window.showInputBox({
    title: "🧊 Please enter description",
    value: "A new Flutter project created with Based.",
  });

  if (description === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
    return;
  }

  try {
    await Pubspec.createProject(
      projectName,
      org,
      description,
      workspaceFolder.uri.fsPath
    );

    new Promise<void>((resolve) =>
      setTimeout(async () => {
        await new AddDependencies().register(context);
        resolve();
      }, 3000)
    );

    vscode.window.showInformationMessage(`🚀 Created project ${projectName}!`);
  } catch (e) {
    console.log(e);
  }
}
