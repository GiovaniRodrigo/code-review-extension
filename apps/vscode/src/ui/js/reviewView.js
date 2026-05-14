let vscode;
function acquireApi() {
    try {
        vscode = acquireVsCodeApi();
    } catch {
        // For tests
    }
}

const reviewView = {
    renderState,
    renderFinding,
    bindEvents,
    escapeHtml,
    initialize,
    setApi: (api) => { vscode = api; }
};

function initialize() {
    acquireApi();
    window.addEventListener('message', event => {
        renderState(event.data);
    });
}

function renderState(message) {
    const app = document.getElementById('app');
    if (!app || message.type !== 'state') return;

    const findings = message.findings || [];

    if (message.state === 'loading') {
        app.innerHTML = `
      <section class="panel loading-panel">
        <span class="spinner"></span>
        <div>
          <strong>${escapeHtml(message.message)}</strong>
          ${renderSteps(message.steps || [])}
        </div>
      </section>
    `;
        return;
    }

    if (message.state === 'ready') {
        const hasPr = findings.some(f => f.prNumber);

        app.innerHTML = `
      <section class="summary">
        <div>
          <strong>${findings.length}</strong>
          <span>finding(s) encontrados</span>
        </div>
        ${hasPr 
            ? `<button type="button" data-action="publish" class="publish-button">Publicar Review</button>`
            : ''
        }
      </section>

      <section class="findings-list">
        ${findings.map(renderFinding).join('')}
      </section>
    `;

        bindEvents();
        return;
    }

    if (message.state === 'error') {
        app.innerHTML = `
      <section class="panel error-panel">
        ${escapeHtml(message.message)}
      </section>
    `;
        return;
    }

    app.innerHTML = `
    <section class="panel empty-panel">
      ${escapeHtml(message.message)}
    </section>
  `;
}

function renderFinding(finding) {
    const id = escapeAttr(finding.id);
    const severity = finding.severity || 'info';
    const message = finding.message || 'Sem mensagem.';
    const file = finding.file || '';

    return `
    <article class="finding finding-${escapeAttr(severity)}">
      <header class="finding-header">
        <span class="severity">${escapeHtml(severity)}</span>
        <span class="status">${escapeHtml(finding.status || 'pending')}</span>
      </header>

      <div class="finding-file">${escapeHtml(file)}</div>

      <p class="finding-message">
        ${escapeHtml(message)}
      </p>

      ${finding.suggestedFix
            ? `<pre class="suggested-fix">${escapeHtml(finding.suggestedFix)}</pre>`
            : ''
        }

      <footer class="actions">
        <button type="button" data-action="select" data-id="${id}">
          Abrir
        </button>

        <button type="button" data-action="approve" data-id="${id}">
          Aprovar
        </button>

        <button type="button" data-action="reject" data-id="${id}">
          Rejeitar
        </button>

        ${finding.suggestedFix
            ? `
              <button type="button" data-action="applyFix" data-id="${id}">
                Aplicar fix
              </button>
            `
            : ''
        }
      </footer>
    </article>
  `;
}

function bindEvents() {
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            if (vscode) {
                vscode.postMessage({
                    type: button.dataset.action,
                    id: button.dataset.id
                });
            }
        });
    });
}

function renderSteps(steps) {
    if (!steps.length) return '';

    return `
    <ul class="steps">
      ${steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
    </ul>
  `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
    return escapeHtml(value);
}

// Export for tests or attach to window for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = reviewView;
} else {
    window.reviewView = reviewView;
    initialize();
}
