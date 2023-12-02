import * as vscode from "vscode";
import { Create } from "./create";
import { AddDependency } from "./addDependency";

export interface Command {
  command: string;
  register(context: vscode.ExtensionContext): void;
}

export abstract class Commands {
  static register(context: vscode.ExtensionContext): void {
    for (const command of this.commands) {
      console.log(`Registering ${command.command}`);
      let disposable = vscode.commands.registerCommand(command.command, () =>
        command.register(context)
      );
      context.subscriptions.push(disposable);
    }
    console.log(`Registered`);
  }

  static commands: Array<Command> = [new Create(), new AddDependency()];
}
