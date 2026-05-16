export interface BaseHtmlInput {
  title: string;
  body: string;
  styles?: string;
  script?: string;
}

export function baseHtml(input: BaseHtmlInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${input.title}</title>
<style>
body {
  font-family: var(--vscode-font-family);
  color: var(--vscode-foreground);
  background: var(--vscode-editor-background);
  padding: 12px;
}
${input.styles ?? ''}
</style>
</head>
<body>
${input.body}
${input.script ? `<script>${input.script}</script>` : ''}
</body>
</html>`;
}
