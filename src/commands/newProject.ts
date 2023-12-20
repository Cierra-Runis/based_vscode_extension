import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./commands";
import { Utils } from "../utils";
import { Pubspec } from "../pubspec";
import { AddDependencies } from "./addDependencies";

function validateUserInput(
  input: string | undefined
): string | undefined | null {
  if (input === undefined) {
    return;
  }
  if (!/^[a-z_][a-z0-9_]*$/.test(input)) {
    return "Illegal project name.";
  }
}

export class NewProject implements Command {
  command: string = "based.newProject";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolders = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
    });

    const selectFolder = workspaceFolders?.[0];

    if (selectFolder === undefined) {
      vscode.window.showInformationMessage("🧊 Canceled.");
      return;
    }

    const projectName = await vscode.window.showInputBox({
      title: "🧊 Please enter the project name",
      value: "example",
      validateInput: validateUserInput,
    });

    if (projectName === undefined) {
      vscode.window.showInformationMessage("🧊 Canceled.");
      return;
    }

    if (projectName.length === 0) {
      vscode.window.showErrorMessage("💢 Illegal project name");
      return;
    }

    const org = await vscode.window.showInputBox({
      title: "🧊 Please enter org name",
      value: "com.example",
    });

    if (org === undefined) {
      vscode.window.showInformationMessage("🧊 Canceled.");
      return;
    }

    const description = await vscode.window.showInputBox({
      title: "🧊 Please enter description",
      value: `${Utils.toTitleCase(
        projectName
      )} - A new Flutter project created with Based.`,
    });

    if (description === undefined) {
      vscode.window.showInformationMessage("🧊 Canceled.");
      return;
    }

    try {
      vscode.window.showInformationMessage("🔥 Creating project...");

      await Pubspec.createProject(
        projectName,
        org,
        description,
        selectFolder.fsPath
      );

      const workspaceFolder = vscode.Uri.joinPath(selectFolder, projectName);

      vscode.window.showInformationMessage("🔥 Copying files...");

      const extensionPath = context.extensionUri;
      const examplePath = vscode.Uri.joinPath(extensionPath, `./example/`);
      const needCopy = [".vscode", "assets", "lib", "analysis_options.yaml"];
      for (const file of needCopy) {
        await vscode.workspace.fs.copy(
          vscode.Uri.joinPath(examplePath, file),
          vscode.Uri.joinPath(workspaceFolder, file),
          { overwrite: true }
        );
      }

      const pubspecExtent = vscode.Uri.joinPath(
        examplePath,
        "pubspec.extent"
      ).fsPath;

      const pubspecFile = vscode.Uri.joinPath(
        workspaceFolder,
        "pubspec.yaml"
      ).fsPath;

      fs.writeFileSync(
        pubspecFile,
        fs.readFileSync(pubspecFile, "utf-8") +
          fs.readFileSync(pubspecExtent, "utf-8")
      );

      replaceInFiles(workspaceFolder.fsPath, "example_app", projectName);

      replaceInFiles(
        workspaceFolder.fsPath,
        "ExampleApp",
        Utils.toTitleCase(projectName)
      );

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "🔥 Adding dependencies...",
          cancellable: false,
        },
        async (progress, token) => {
          await new Promise<void>((resolve) =>
            setTimeout(async () => {
              await AddDependencies.add(workspaceFolder);
              resolve();
            }, 3000)
          );
          await Pubspec.runBuilder(workspaceFolder.fsPath);
          await progress.report({ increment: 100 });
        }
      );
      vscode.commands.executeCommand("vscode.openFolder", workspaceFolder);
    } catch (e) {
      console.log(e);
    }
  }
}

function replaceInFiles(
  folderPath: string,
  searchString: string,
  replaceString: string
) {
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      let content = fs.readFileSync(filePath, "utf-8");

      if (content.match(searchString)) {
        content = content.replaceAll(searchString, replaceString);
        fs.writeFileSync(filePath, content, "utf-8");
      }
    } else if (stats.isDirectory()) {
      replaceInFiles(filePath, searchString, replaceString);
    }
  });
}
