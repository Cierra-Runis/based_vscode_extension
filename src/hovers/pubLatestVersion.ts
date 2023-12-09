import { Hover } from "./hovers";
import * as vscode from "vscode";
import { Pubspec } from "../pubspec";

export class PubLatestVersion implements Hover {
  hover = "PubLatestVersion";
  selector = { pattern: "**/pubspec.yaml" };

  provider = {
    provideHover: async (
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken
    ) => {
      const line = document.lineAt(position.line).text;

      if (line.trim() === "sdk: flutter") {
        return;
      }

      const reg = RegExp("(.*?): (.*)");
      const match = line.match(reg);
      if (match === null) {
        return;
      }

      const name = match[1].trim();
      const version = match[2].trim();
      if (version.length === 0) {
        return;
      }

      const latestVersion = await Pubspec.getPackageLatestVersion(name);

      if (latestVersion === undefined) {
        return;
      }

      const re = RegExp(/^\^(\d+\.\d+\.\d+(?:[+-]\S+)?)$/);
      const showFormat = re.exec(version);

      const details =
        showFormat === null
          ? [
              `🧊 Please consider to use [Caret syntax](https://dart.dev/tools/pub/dependencies#caret-syntax). 🧊`,
              `👀 See [Use caret syntax](https://dart.dev/tools/pub/dependencies#use-caret-syntax) in [Best practices](https://dart.dev/tools/pub/dependencies#best-practices). 👀`,
            ]
          : showFormat[0] === version
          ? [`🔥 You are using the latest version! 🔥`]
          : [`🧊 Please consider to update it! 🧊`];

      return new vscode.Hover([
        `🚀 Latest version of [${name}](https://pub.dev/packages/${name}) is [${latestVersion}](https://pub.dev/packages/${name}/changlog) 🚀`,
        ...details,
      ]);
    },
  };
}
