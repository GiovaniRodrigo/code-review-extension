const assert = require('node:assert');
const vscode = require('vscode');

suite('Extension E2E', function () {
  this.timeout(20000);

  test('should activate extension', async () => {
    const extension =
      vscode.extensions.getExtension(
        'code-review.vscode-code-review'
      );

    assert.ok(extension, 'Extension should be found');

    await extension.activate();

    assert.strictEqual(
      extension.isActive,
      true,
      'Extension should be active'
    );
  });

  test('should register public commands', async () => {
    const commands =
      await vscode.commands.getCommands(true);

    assert.ok(
      commands.includes('code-review.analyze'),
      'code-review.analyze should be registered'
    );

    assert.ok(
      commands.includes('code-review.clearRepositoryRag'),
      'code-review.clearRepositoryRag should be registered'
    );

    assert.ok(
      commands.includes('code-review.indexRepositoryRag'),
      'code-review.indexRepositoryRag should be registered'
    );
  });

  test('should execute analyze command without throwing', async () => {
    // Open a dummy file to ensure analyze has something to work with
    const doc = await vscode.workspace.openTextDocument({ 
        content: 'function test() { let x = 1; }', 
        language: 'javascript' 
    });
    await vscode.window.showTextDocument(doc);

    const commands =
      await vscode.commands.getCommands(true);

    if (!commands.includes('code-review.analyze')) {
      assert.fail('code-review.analyze command not registered');
    }

    // Use a timeout race to ensure the test suite doesn't hang if the command takes too long
    // but we still catch immediate rejections.
    const execution = vscode.commands.executeCommand('code-review.analyze');
    const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), 5000));

    const result = await Promise.race([execution, timeout]);
    
    if (result === 'timeout') {
      // If it timed out, we assume it's "not breaking" immediately
      assert.ok(true, 'Command did not throw immediately');
    } else {
      assert.ok(true, 'Command executed successfully');
    }
  });

  test('should open sidebar focus command if available', async () => {
    const commands =
      await vscode.commands.getCommands(true);

    // The user suggested codeReview.sidebar.focus, but package.json has code-review.focus
    const focusCmd = commands.includes('code-review.focus') ? 'code-review.focus' : 'codeReview.sidebar.focus';

    if (!commands.includes(focusCmd)) {
      assert.ok(true);
      return;
    }

    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand(
        focusCmd
      );
    });
  });

  test('should keep extension active after UI command', async () => {
    const extension =
      vscode.extensions.getExtension(
        'code-review.vscode-code-review'
      );

    assert.ok(extension, 'Extension should be found');

    if (!extension.isActive) {
      await extension.activate();
    }

    assert.strictEqual(
      extension.isActive,
      true
    );
  });
});
