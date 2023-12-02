import * as vscode from "vscode";
import { Command } from "./commands";

export class HelloWorld implements Command {
  command: string = "based.helloWorld";

  register(context: vscode.ExtensionContext): void {
    let disposable = vscode.commands.registerCommand(this.command, () => {});
    context.subscriptions.push(disposable);
  }
}
