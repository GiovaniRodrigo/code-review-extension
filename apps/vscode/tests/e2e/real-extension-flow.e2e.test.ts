import * as assert from 'node:assert';
import * as vscode from 'vscode';

suite('Real VSCode Extension E2E', () => {
  test('should activate extension and register critical commands', async () => {
    const extension = vscode.extensions.getExtension(
      'CodeReviewExtension.git-code-review'
    );

    assert.ok(extension, 'Extension should exist');

    await extension.activate();

    assert.ok(extension.isActive, 'Extension should be active');

    const commands = await vscode.commands.getCommands(true);

    const requiredCommands = [
      'code-review.analyze',
      'code-review.analyzeWorkspace',
      'code-review.setProvider',
      'code-review.setup',
      'code-review.indexRepositoryRag',
      'code-review.clearRepositoryRag',
      'code-review.restoreSession',
      'code-review.approveFinding'
    ];

    for (const command of requiredCommands) {
      assert.ok(
        commands.includes(command),
        `Command not registered: ${command}`
      );
    }
  });

  test('should execute setup command without crashing', async () => {
    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand('code-review.setup');
    });
  });

  test('should execute clear RAG command without crashing', async () => {
    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand('code-review.clearRepositoryRag');
    });
  });

  test('should execute restore session command without crashing', async () => {
    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand('code-review.restoreSession');
    });
  });
});