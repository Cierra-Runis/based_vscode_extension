import * as vscode from "vscode";

export abstract class Utils {
  static isCamelCase(str: string): boolean {
    return /^[a-zA-Z]+([A-Z][a-z]*)*$/.test(str);
  }

  static toSnakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  }

  static async getWorkspace(): Promise<vscode.WorkspaceFolder | undefined> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders === undefined || workspaceFolders?.length === 0) {
      return;
    } else if (workspaceFolders.length === 1) {
      return workspaceFolders[0];
    }

    const items = workspaceFolders.map((e) => {
      return { label: e.name };
    });

    const config = {
      title: "🧊 Which workspace would you use?",
      placeHolder: workspaceFolders[0].name,
    };

    const workspaceFolder = await vscode.window.showQuickPick(items, config);
    return workspaceFolders.find((e) => e.name === workspaceFolder?.label);
  }

  static async getTemplate(
    templateName: string,
    context: vscode.ExtensionContext
  ): Promise<string> {
    const extensionPath = context.extensionUri;
    const templatePath = vscode.Uri.joinPath(
      extensionPath,
      `./assets/templates/${templateName}.template`
    );
    return (await vscode.workspace.fs.readFile(templatePath)).toString();
  }

  static replaceTemplate(
    template: string,
    replacements: Record<string, string>
  ): string {
    return template.replace(/{{(\w+)}}/g, (match, p1) => {
      return replacements[p1] || match;
    });
  }
}
