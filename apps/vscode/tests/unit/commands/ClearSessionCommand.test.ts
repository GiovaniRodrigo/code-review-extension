import { describe, expect, it } from 'vitest';
import * as vscode from 'vscode';
import { ClearSessionCommand } from '../../../src/commands/ClearSessionCommand';
import { createDependencies } from '../../fixtures/dependencies.fixture';

describe('ClearSessionCommand', () => {
  it('registra o comando code-review.clearSession no VS Code', () => {
    const dependencies = createDependencies();

    new ClearSessionCommand(dependencies).register();

    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      'code-review.clearSession',
      expect.any(Function)
    );
    expect(dependencies.context.subscriptions).toHaveLength(1);
  });
});
