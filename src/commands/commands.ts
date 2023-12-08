import * as vscode from "vscode";
import { Create } from "./create";
import { AddDependencies } from "./addDependencies";

export interface Command {
  command: string;
  register(context: vscode.ExtensionContext): void;
}

export abstract class Commands {
  static register(context: vscode.ExtensionContext): void {
    for (const command of this.commands) {
      console.log(`Registering Command ${command.command}`);
      let disposable = vscode.commands.registerCommand(command.command, () =>
        command.register(context)
      );
      context.subscriptions.push(disposable);
    }
    console.log(`Registered Commands`);
  }

  static commands: Array<Command> = [new Create(), new AddDependencies()];
}
