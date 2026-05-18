import { material3Css } from '../design-system/material3.css';

export interface BaseHtmlInput {
  title: string;
  body: string;
  styles?: string;
  script?: string;
}

export function baseHtml(input: BaseHtmlInput): string {
  const defaultScript = `
    (function () {
      const api = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
      window.__codeReviewVsCodeApi = api;
      window.postCodeReviewMessage = function (message) {
        if (api) {
          api.postMessage(message);
        }
      };

      document.addEventListener('click', function (event) {
        const target = event.target && event.target.closest ? event.target.closest('[data-command]') : null;
        if (!target || !target.dataset || !target.dataset.command) {
          return;
        }

        window.postCodeReviewMessage({
          command: target.dataset.command,
          ...target.dataset
        });
      });
    })();
  `;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${input.title}</title>
<style>
${material3Css}
${input.styles ?? ''}
</style>
</head>
<body>
${input.body}
<script>${defaultScript}</script>
${input.script ? `<script>${input.script}</script>` : ''}
</body>
</html>`;
}
