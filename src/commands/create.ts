import * as vscode from "vscode";
import { Command } from "./commands";
import { Pubspec } from "../pubspec";

enum Choice {
  initPersistance = "Init persistance.dart",
  createStateWithPersistance = "New state with persistance",
  createStateWithFuture = "New state with Future",
}

export class Create implements Command {
  command: string = "based.create";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const choice = await vscode.window.showQuickPick(Object.values(Choice));

    switch (choice) {
      case Choice.initPersistance:
        return initPersistance(context);
      case Choice.createStateWithPersistance:
        return createStateWithPersistance();
      case Choice.createStateWithFuture:
        return createStateWithFuture();
    }
  }
}

async function initPersistance(
  context: vscode.ExtensionContext
): Promise<void> {
  console.log(Choice.initPersistance);
  const projectName = await Pubspec.getProjectName();
  if (!projectName) {
    vscode.window.showErrorMessage("Can't get project name.");
    return;
  }

  const selected = await vscode.window.showOpenDialog({
    defaultUri: vscode.workspace.workspaceFolders?.[0].uri,
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
  });

  if (!selected) {
    vscode.window.showInformationMessage("No selected folder.");
    return;
  }

  const selectedFolder = selected[0];
  const persistancePath = vscode.Uri.joinPath(
    selectedFolder,
    "persistance.dart"
  );

  const template = await getTemplate("persistence", context);
  const replaced = replaceTemplate(template, { projectName: projectName });

  await vscode.workspace.fs.writeFile(
    persistancePath,
    new TextEncoder().encode(replaced)
  );

  vscode.window.showInformationMessage(
    `Created persistence.dart for ${projectName}!`
  );
}

async function createStateWithPersistance(): Promise<void> {
  console.log(Choice.createStateWithPersistance);
}

async function createStateWithFuture(): Promise<void> {
  console.log(Choice.createStateWithFuture);
}

async function getTemplate(
  templateName: string,
  context: vscode.ExtensionContext
): Promise<string> {
  const extensionPath = context.extensionUri;
  const templatePath = vscode.Uri.joinPath(
    extensionPath,
    `/src/templates/${templateName}.template`
  );
  return (await vscode.workspace.fs.readFile(templatePath)).toString();
}

function replaceTemplate(
  template: string,
  replacements: Record<string, string>
): string {
  return template.replace(/{{(\w+)}}/g, (match, p1) => {
    return replacements[p1] || match;
  });
}
