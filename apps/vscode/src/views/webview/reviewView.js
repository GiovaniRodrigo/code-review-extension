const vscode =
    acquireVsCodeApi();

const app =
    document.getElementById('app');

window.addEventListener(
    'message',
    event => {

        const message =
            event.data;

        renderState(message);
    }
);

function renderState(message) {

    if (message.state === 'loading') {

        app.innerHTML = `
      <div class="loading-box">

        <div>
          <span class="spinner"></span>

          <strong>
            ${message.message}
          </strong>
        </div>

      </div>
    `;

        return;
    }
}