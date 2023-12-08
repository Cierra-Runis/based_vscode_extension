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
      const reg = RegExp("(.*?): (.*)");
      const match = line.match(reg);
      if (match !== null) {
        const name = match[1].trim();
        const version = match[2].trim();
        const latestVersion = await Pubspec.getPackageLatestVersion(name);
        if (latestVersion) {
          return new vscode.Hover([
            `🚀 Latest version of ${name} is [${latestVersion}](https://pub.dev/packages/${name}). 🚀`,
            version.match(latestVersion)
              ? `🔥 You are using the latest version! 🔥`
              : `🧊 Please consider to update it! 🧊`,
          ]);
        }
      }
    },
  };
}
