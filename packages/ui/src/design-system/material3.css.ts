export const material3Css = `
:root {
  --m3-primary: var(--vscode-button-background, #6750a4);
  --m3-on-primary: var(--vscode-button-foreground, #ffffff);

  --m3-surface: var(--vscode-editor-background, #1e1e1e);
  --m3-surface-container: var(--vscode-sideBar-background, #252526);
  --m3-on-surface: var(--vscode-foreground, #ffffff);

  --m3-outline: var(--vscode-widget-border, rgba(255,255,255,.12));
  --m3-error: var(--vscode-errorForeground, #f2b8b5);

  --m3-radius-sm: 8px;
  --m3-radius-md: 12px;
  --m3-radius-lg: 16px;
  --m3-radius-xl: 24px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--vscode-font-family, system-ui, sans-serif);
  color: var(--m3-on-surface);
  background: var(--m3-surface);
}

.cr-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}

.cr-card {
  background: var(--m3-surface-container);
  border: 1px solid var(--m3-outline);
  border-radius: var(--m3-radius-lg);
  padding: 12px;
}

.cr-button {
  border: 0;
  border-radius: 999px;
  padding: 7px 14px;
  background: var(--m3-primary);
  color: var(--m3-on-primary);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.cr-button.secondary {
  background: transparent;
  color: var(--m3-on-surface);
  border: 1px solid var(--m3-outline);
}

.cr-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid var(--m3-outline);
  padding: 2px 8px;
  font-size: 11px;
}

.cr-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
}

.cr-muted {
  opacity: .72;
  font-size: 12px;
}

.cr-empty {
  border: 1px dashed var(--m3-outline);
  border-radius: var(--m3-radius-lg);
  padding: 16px;
  text-align: center;
  opacity: .8;
}
`;
