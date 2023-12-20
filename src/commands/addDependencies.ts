import * as vscode from "vscode";
import { Command } from "./commands";
import { Pubspec } from "../pubspec";
import { Utils } from "../utils";

export class AddDependencies implements Command {
  command: string = "based.addDependencies";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = await Utils.getWorkspace();
    if (workspaceFolder === undefined) {
      vscode.window.showErrorMessage("💢 No opened workspace.");
      return;
    }

    vscode.window.showInformationMessage("🔥 Adding dependencies...");

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "🔥 Adding dependencies...",
        cancellable: false,
      },
      async (progress, token) => {
        await AddDependencies.add(workspaceFolder.uri);
        vscode.window.showInformationMessage("🚀 Added dependencies!");
        progress.report({ increment: 100 });
      }
    );
  }

  static async add(workspaceFolder: vscode.Uri) {
    try {
      await Pubspec.addSdkDependencies(
        ["flutter_localizations"],
        workspaceFolder.fsPath
      );
    } catch {}

    try {
      await Pubspec.addDependencies(
        [
          "based_list",
          "based_splash_page",
          "based_split_view",
          "dart_date",
          "dynamic_color",
          "flutter_displaymode",
          "flutter_hooks",
          "flutter_svg",
          "freezed_annotation",
          "hooks_riverpod",
          "intl",
          "json_annotation",
          "material_color_utilities",
          "path_provider",
          "package_info_plus",
          "riverpod_annotation",
          "shared_preferences",
          "system_tray",
          "url_launcher",
          "window_manager",
        ],
        workspaceFolder.fsPath
      );
    } catch {}

    try {
      await Pubspec.addDevDependencies(
        [
          "build_runner",
          "custom_lint",
          "freezed",
          "json_serializable",
          "riverpod_generator",
          "riverpod_lint",
        ],
        workspaceFolder.fsPath
      );
    } catch {}
  }
}
