import * as vscode from "vscode";
import { HelloWorld } from "./helloWorld";

export interface Command {
  command: string;
  register(context: vscode.ExtensionContext): void;
}

export abstract class Commands {
  static register(context: vscode.ExtensionContext): void {
    for (const command of this.commands) {
      command.register(context);
    }
  }

  static commands: Array<Command> = [new HelloWorld()];
}
