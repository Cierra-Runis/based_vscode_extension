import * as vscode from "vscode";
import { Command } from "./commands";
import { createPersistence } from "./creates/createPersistence";
import { createColorSchemes } from "./creates/createColorSchemes";
import { createStateWithPersistence } from "./creates/createStateWithPersistence";
import { createStateWithFuture } from "./creates/createStateWithFuture";
import { Utils } from "../utils";
import { Pubspec } from "../pubspec";

export enum Choice {
  createPersistence = "$(database) Create persistence.dart",
  createColorSchemes = "$(symbol-color) Create color_schemes.dart",
  createStateWithPersistence = "$(pencil) Create state with Persistence",
  createStateWithFuture = "$(timeline-open) Create state with Future",
}

export class Create implements Command {
  command: string = "based.create";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const choice = await vscode.window.showQuickPick(Object.values(Choice), {
      title: "🧊 Which kind of file would you create?",
    });

    const workspaceFolder = await Utils.getWorkspace();

    if (workspaceFolder === undefined) {
      vscode.window.showErrorMessage("💢 No workspace opened.");
      return;
    }

    const projectName = await Pubspec.getProjectName(workspaceFolder);
    if (projectName === undefined) {
      vscode.window.showErrorMessage("💢 Can't get project name.");
      return;
    }

    switch (choice) {
      case Choice.createPersistence:
        return createPersistence(context, workspaceFolder, projectName);
      case Choice.createColorSchemes:
        return createColorSchemes(context, workspaceFolder, projectName);
      case Choice.createStateWithPersistence:
        return createStateWithPersistence(
          context,
          workspaceFolder,
          projectName
        );
      case Choice.createStateWithFuture:
        return createStateWithFuture(context, workspaceFolder, projectName);
    }

    vscode.window.showInformationMessage("🧊 Canceled.");
  }
}
