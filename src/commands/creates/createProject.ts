import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Pubspec } from "../../pubspec";
import { AddDependencies } from "../addDependencies";
import { Utils } from "../../utils";

export async function createProject(
  context: vscode.ExtensionContext,
  workspaceFolder: vscode.WorkspaceFolder
): Promise<void> {
  const projectName = await vscode.window.showInputBox({
    title: "🧊 Please enter the project name",
    value: "example",
  });

  if (projectName === undefined) {
    vscode.window.showInformationMessage("🧊 Canceled.");
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
    await Pubspec.createProject(
      projectName,
      org,
      description,
      workspaceFolder.uri.fsPath
    );

    const extensionPath = context.extensionUri;
    const examplePath = vscode.Uri.joinPath(extensionPath, `./example/`);
    const needCopy = [".vscode", "assets", "lib", "analysis_options.yaml"];
    for (const file of needCopy) {
      await vscode.workspace.fs.copy(
        vscode.Uri.joinPath(examplePath, file),
        vscode.Uri.joinPath(workspaceFolder.uri, file),
        { overwrite: true }
      );
    }

    const pubspecExtent = vscode.Uri.joinPath(
      examplePath,
      "pubspec.extent"
    ).fsPath;

    const pubspecFile = vscode.Uri.joinPath(
      workspaceFolder.uri,
      "pubspec.yaml"
    ).fsPath;

    fs.writeFileSync(
      pubspecFile,
      fs.readFileSync(pubspecFile, "utf-8") +
        fs.readFileSync(pubspecExtent, "utf-8")
    );

    replaceInFiles(workspaceFolder.uri.fsPath, "example_app", projectName);

    replaceInFiles(
      workspaceFolder.uri.fsPath,
      "ExampleApp",
      Utils.toTitleCase(projectName)
    );

    await new Promise<void>((resolve) =>
      setTimeout(async () => {
        await new AddDependencies().register(context);
        resolve();
      }, 3000)
    );

    vscode.window.showInformationMessage(`🚀 Created project ${projectName}!`);
  } catch (e) {
    console.log(e);
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
