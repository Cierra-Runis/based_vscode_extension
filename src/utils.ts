import * as vscode from "vscode";

export abstract class Utils {
  static isCamelCase(str: string): boolean {
    return /^[a-zA-Z]+([A-Z][a-z]*)*$/.test(str);
  }

  static toSnakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
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
      console.log(match, replacements);
      return replacements[p1] || match;
    });
  }
}
