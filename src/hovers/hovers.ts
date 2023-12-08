import * as vscode from "vscode";
import { PubLatestVersion } from "./pubLatestVersion";

export interface Hover {
  hover: string;
  selector: vscode.DocumentSelector;
  provider: vscode.HoverProvider;
}

export class Hovers {
  static register(context: vscode.ExtensionContext): void {
    for (const hover of this.hovers) {
      console.log(`Registering Hover ${hover.hover}`);
      let disposable = vscode.languages.registerHoverProvider(
        hover.selector,
        hover.provider
      );
      context.subscriptions.push(disposable);
    }
    console.log(`Registered Hovers`);
  }

  static hovers: Array<Hover> = [new PubLatestVersion()];
}
