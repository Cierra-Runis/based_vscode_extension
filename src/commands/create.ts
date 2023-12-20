import * as vscode from "vscode";
import { Command } from "./commands";
import { createPersistence } from "./creates/createPersistence";
import { createColorSchemes } from "./creates/createColorSchemes";
import { createStateWithPersistence } from "./creates/createStateWithPersistence";
import { createStateWithFuture } from "./creates/createStateWithFuture";
import { Utils } from "../utils";
import { Pubspec } from "../pubspec";
import { createProject } from "./creates/createProject";

export enum Choice {
  createProject = "$(project) Create new project",
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

    if (choice === undefined) {
      vscode.window.showInformationMessage("🧊 Canceled.");
      return;
    }

    const workspaceFolder = await Utils.getWorkspace();

    if (workspaceFolder === undefined) {
      vscode.window.showErrorMessage("💢 No workspace opened.");
      return;
    }

    if (choice === Choice.createProject) {
      return createProject(context, workspaceFolder);
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
  }
}
