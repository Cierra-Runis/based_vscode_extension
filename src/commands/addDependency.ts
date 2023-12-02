import * as vscode from "vscode";
import { Command } from "./commands";
import { Pubspec } from "../pubspec";

export class AddDependency implements Command {
  command: string = "based.addDependency";
  register(context: vscode.ExtensionContext): void {}
}
