export const material3Css = `
:root {
  --gcr-primary: #534AB7;
  --gcr-primary-soft: rgba(83, 74, 183, .14);
  --gcr-success: #3B6D11;
  --gcr-warning: #BA7517;
  --gcr-danger: #E24B4A;
  --gcr-info: #2F7FD7;

  --m3-primary: var(--vscode-button-background, #534AB7);
  --m3-on-primary: var(--vscode-button-foreground, #ffffff);
  --m3-surface: var(--vscode-editor-background, #1e1e1e);
  --m3-surface-container: var(--vscode-sideBar-background, #252526);
  --m3-surface-container-high: var(--vscode-editorWidget-background, #2d2d30);
  --m3-on-surface: var(--vscode-foreground, #ffffff);
  --m3-on-surface-muted: var(--vscode-descriptionForeground, rgba(255,255,255,.68));
  --m3-outline: var(--vscode-widget-border, rgba(255,255,255,.12));
  --m3-outline-soft: color-mix(in srgb, var(--vscode-widget-border, rgba(255,255,255,.12)) 55%, transparent);
  --m3-error: var(--vscode-errorForeground, #f2b8b5);

  --m3-radius-sm: 8px;
  --m3-radius-md: 12px;
  --m3-radius-lg: 16px;
  --m3-radius-xl: 24px;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--vscode-font-family, system-ui, sans-serif);
  color: var(--m3-on-surface);
  background: var(--m3-surface);
  font-size: 12px;
}

.cr-page { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
.cr-card { background: var(--m3-surface-container); border: 1px solid var(--m3-outline); border-radius: var(--m3-radius-lg); padding: 12px; }
.cr-card.soft { background: color-mix(in srgb, var(--m3-surface-container) 78%, transparent); }
.cr-button { border: 0; border-radius: 999px; padding: 7px 14px; background: var(--gcr-primary); color: #fff; cursor: pointer; font-size: 12px; font-weight: 650; }
.cr-button.secondary { background: transparent; color: var(--m3-on-surface); border: 1px solid var(--m3-outline); }
.cr-button.ghost { background: transparent; color: var(--m3-on-surface-muted); border: 0; padding: 5px 8px; }
.cr-button:hover { filter: brightness(1.08); }
.cr-button[disabled] { opacity: .55; cursor: not-allowed; }
.cr-badge { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; border: 1px solid var(--m3-outline); padding: 2px 8px; font-size: 10px; white-space: nowrap; }
.cr-badge.success { color: var(--gcr-success); background: rgba(99,153,34,.10); border-color: rgba(99,153,34,.22); }
.cr-badge.warning { color: var(--gcr-warning); background: rgba(186,117,23,.10); border-color: rgba(186,117,23,.22); }
.cr-badge.destructive { color: var(--gcr-danger); background: rgba(226,75,74,.10); border-color: rgba(226,75,74,.22); }
.cr-title { font-size: 16px; font-weight: 750; margin: 0 0 8px; }
.cr-muted { color: var(--m3-on-surface-muted); font-size: 12px; }
.cr-empty { border: 1px dashed var(--m3-outline); border-radius: var(--m3-radius-lg); padding: 18px; text-align: center; color: var(--m3-on-surface-muted); }
.cr-kicker { text-transform: uppercase; letter-spacing: .08em; font-size: 10px; color: var(--m3-on-surface-muted); }
.cr-grid { display: grid; gap: 10px; }
.cr-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.cr-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 360px) { .cr-grid-2,.cr-grid-3 { grid-template-columns: 1fr; } }
.cr-stat { background: var(--m3-surface-container-high); border: 1px solid var(--m3-outline-soft); border-radius: var(--m3-radius-md); padding: 10px; }
.cr-stat-label { color: var(--m3-on-surface-muted); font-size: 10px; text-transform: uppercase; letter-spacing: .06em; }
.cr-stat-value { font-size: 18px; font-weight: 760; margin-top: 4px; }
.cr-row { display: flex; align-items: center; gap: 8px; padding: 7px 0; border-bottom: 1px solid var(--m3-outline-soft); }
.cr-row:last-child { border-bottom: 0; }
.cr-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--m3-outline); flex: 0 0 auto; }
.cr-dot.ok { background: var(--gcr-success); } .cr-dot.warn { background: var(--gcr-warning); } .cr-dot.err { background: var(--gcr-danger); } .cr-dot.info { background: var(--gcr-info); }
.cr-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.cr-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.cr-tab { padding: 5px 11px; border-radius: 999px; border: 1px solid var(--m3-outline); background: transparent; color: var(--m3-on-surface-muted); cursor: pointer; font-size: 11px; }
.cr-tab.active { background: var(--gcr-primary-soft); color: var(--m3-on-surface); border-color: color-mix(in srgb, var(--gcr-primary) 55%, var(--m3-outline)); }
.cr-section-title { font-size: 10px; font-weight: 700; color: var(--m3-on-surface-muted); text-transform: uppercase; letter-spacing: .07em; margin: 10px 0 6px; }
`;
