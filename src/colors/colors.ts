import * as vscode from "vscode";

export class Colors {
  static register(context: vscode.ExtensionContext): void {
    const disposable = vscode.languages.registerColorProvider(
      {
        scheme: "file",
        language: "dart",
      },
      {
        provideDocumentColors(document, token) {
          let colors: Array<vscode.ColorInformation> = [];

          const doc = document.getText();
          const fileName = document.uri.path
            .split("/")
            .pop()!
            .split(".dart")[0];

          if (fileName === "main") {
            return colors;
          }

          const lowerCaseFileName = fileName
            .replace(/[^a-z0-9]/gi, "")
            .toLowerCase();

          const reg = RegExp(/class (.*?) .*?{/gm);
          const matches = doc.matchAll(reg);

          for (const match of matches) {
            if (match.index === undefined) {
              continue;
            }

            const className = match[1].toLowerCase();
            const lowerCaseClassName = match[1].toLowerCase();

            if (className.startsWith("_")) {
              continue;
            }
            const offset = match.index + "class ".length;
            const color =
              lowerCaseClassName === lowerCaseFileName
                ? new vscode.Color(0, 1, 0, 1)
                : new vscode.Color(1, 0.5, 0, 1);

            colors = [
              ...colors,
              new vscode.ColorInformation(
                new vscode.Range(
                  document.positionAt(offset),
                  document.positionAt(offset + className.length)
                ),
                color
              ),
            ];
          }
          return colors;
        },
        provideColorPresentations(color, context, token) {
          return [];
        },
      }
    );
    context.subscriptions.push(disposable);
    console.log(`Registered Colors`);
  }
}
