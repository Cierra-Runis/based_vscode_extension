import * as vscode from "vscode";
import * as fs from "fs";
import * as childProcess from "child_process";

export abstract class Pubspec {
  static async getPubspecContent(): Promise<string | undefined> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (workspaceFolder === undefined) {
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

    if (content === undefined) {
      return;
    }

    const lines = content.split("\n");

    for (const line of lines) {
      if (line.includes("name")) {
        return line.split(":")[1].trim();
      }
    }
  }

  static async runBuilder(cwd: string) {
    await runCommand("dart run build_runner build", { cwd });
  }

  static async addSdkDependency(
    dependency: string,
    cwd: string
  ): Promise<void> {
    await this.addSdkDependencies([dependency], cwd);
  }

  static async addSdkDependencies(
    dependencies: Array<string>,
    cwd: string
  ): Promise<void> {
    await runCommand(
      `flutter pub add ${dependencies
        .map((e) => `'${e}:{"sdk":"flutter"}'`)
        .join(" ")}`,
      { cwd }
    );
  }

  static async addDependency(dependency: string, cwd: string): Promise<void> {
    await this.addDependencies([dependency], cwd);
  }

  static async addDependencies(
    dependencies: Array<string>,
    cwd: string
  ): Promise<void> {
    await runCommand(`flutter pub add ${dependencies.join(" ")}`, { cwd });
  }

  static async addDevDependencies(
    dependencies: Array<string>,
    cwd: string
  ): Promise<void> {
    await runCommand(
      `flutter pub add ${dependencies.map((e) => `dev:${e}`).join(" ")}`,
      { cwd }
    );
  }
}

function runCommand(
  command: string,
  options?: childProcess.ExecOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(new Error(stderr.toString()));
      } else {
        resolve(stdout.toString().trim());
      }
    });
  });
}
