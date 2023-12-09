import * as vscode from "vscode";
import * as fs from "fs";
import * as childProcess from "child_process";
import axios from "axios";

export abstract class Pubspec {
  static async getPubspecContent(
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<string | undefined> {
    const pubspecFiles = await vscode.workspace.findFiles(
      new vscode.RelativePattern(workspaceFolder.uri, `**/pubspec.yaml`),
      "**/{windows,linux,ios,macos,web,android}/**"
    );

    if (pubspecFiles.length === 0) {
      return;
    }

    if (pubspecFiles.length === 1) {
      const fileContent = fs.readFileSync(pubspecFiles[0].fsPath, "utf8");
      return fileContent;
    }

    const pubspecFile = await vscode.window.showQuickPick(
      pubspecFiles.map((e) => e.fsPath),
      { title: "🧊 Which pubspec.yaml would you use?" }
    );

    if (pubspecFile) {
      const fileContent = fs.readFileSync(pubspecFile, "utf8");
      return fileContent;
    }
  }

  static async getPackageLatestVersion(
    name: string
  ): Promise<string | undefined> {
    try {
      const url = `https://pub.dev/packages/${name}.json`;
      const res = await axios.get(url);
      const latestVersion = res.data["versions"][0] as string;
      return latestVersion;
    } catch (e) {
      return undefined;
    }
  }

  static async getProjectName(
    workspaceFolder: vscode.WorkspaceFolder
  ): Promise<string | undefined> {
    const content = await Pubspec.getPubspecContent(workspaceFolder);

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
        .map((e) => `${e} --sdk=flutter`)
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
