import { describe, expect, it } from 'vitest';
import * as vscode from 'vscode';
import { registerCommands } from '../../src/commands/registerCommands';
import { createDependencies } from '../fixtures/dependencies.fixture';

describe('registerCommands', () => {
  it('registra todos os comandos públicos da extensão', () => {
    const dependencies = createDependencies();

    registerCommands(dependencies);

    expect(vscode.commands.registerCommand).toHaveBeenCalledWith('code-review.analyze', expect.any(Function));
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith('code-review.clearSession', expect.any(Function));
    expect(vscode.commands.registerCommand).toHaveBeenCalledWith('code-review.setOpenAIApiKey', expect.any(Function));
    expect(dependencies.context.subscriptions).toHaveLength(3);
  });
});
