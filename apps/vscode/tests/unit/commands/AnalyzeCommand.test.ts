import { describe, expect, it } from 'vitest';
import * as vscode from 'vscode';
import { AnalyzeCommand } from '../../../src/commands/AnalyzeCommand';
import { createDependencies } from '../../fixtures/dependencies.fixture';

describe('AnalyzeCommand', () => {
  it('registra o comando code-review.analyze no VS Code', () => {
    const dependencies = createDependencies();

    new AnalyzeCommand(dependencies).register();

    expect(vscode.commands.registerCommand).toHaveBeenCalledWith(
      'code-review.analyze',
      expect.any(Function)
    );
    expect(dependencies.context.subscriptions).toHaveLength(1);
  });
});
