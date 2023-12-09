import * as vscode from "vscode";
import { Command } from "./commands";
import { Pubspec } from "../pubspec";

export class AddDependencies implements Command {
  command: string = "based.addDependencies";
  async register(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder === undefined) {
      vscode.window.showErrorMessage("💢 No opened workspace.");
      return;
    }

    vscode.window.showInformationMessage("🔥 Adding dependencies...");

    try {
      await Pubspec.addSdkDependencies(
        ["flutter_localizations"],
        workspaceFolder.uri.fsPath
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
          "flutter_riverpod",
          "flutter_svg",
          "freezed_annotation",
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
        workspaceFolder.uri.fsPath
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
        workspaceFolder.uri.fsPath
      );
    } catch {}

    vscode.window.showInformationMessage("🚀 Added dependencies!");
  }
}
