import * as vscode from "vscode";
import * as fs from "fs";

export abstract class Pubspec {
  static async getPubspecContent(): Promise<string | undefined> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace opened.");
      return;
    }

    const pubspecFile = (
      await vscode.workspace.findFiles("**/pubspec.yaml", null, 1)
    ).at(0);

    if (pubspecFile) {
      const fileContent = fs.readFileSync(pubspecFile.fsPath, "utf8");
      return fileContent;
    }
  }

  static async getProjectName(): Promise<string | undefined> {
    const content = await Pubspec.getPubspecContent();

    if (!content) {
      return;
    }

    const lines = content.split("\n");

    for (const line of lines) {
      if (line.includes("name")) {
        return line.split(":")[1].trim();
      }
    }
  }
}
