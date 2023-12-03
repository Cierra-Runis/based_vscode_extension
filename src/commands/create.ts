import * as vscode from "vscode";
import { Command } from "./commands";
import { createPersistence } from "./creates/createPersistence";
import { createColorSchemes } from "./creates/createColorSchemes";
import { createStateWithPersistence } from "./creates/createStateWithPersistence";
import { createStateWithFuture } from "./creates/createStateWithFuture";

export enum Choice {
  createPersistence = "$(database) Create persistence.dart",
  createColorSchemes = "$(symbol-color) Create color_schemes.dart",
  createStateWithPersistence = "$(pencil) Create state with Persistence",
  createStateWithFuture = "$(timeline-open) Create state with Future",
}

export class Create implements Command {
  command: string = "based.create";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const choice = await vscode.window.showQuickPick(Object.values(Choice));

    switch (choice) {
      case Choice.createPersistence:
        return createPersistence(context);
      case Choice.createColorSchemes:
        return createColorSchemes(context);
      case Choice.createStateWithPersistence:
        return createStateWithPersistence(context);
      case Choice.createStateWithFuture:
        return createStateWithFuture(context);
    }

    vscode.window.showInformationMessage("Canceled.");
  }
}
