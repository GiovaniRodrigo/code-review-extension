import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { SetOpenAIKeyCommandHandler } from '../../../src/command-handlers/SetOpenAIKeyCommandHandler';
import { createDependencies } from '../../fixtures/dependencies.fixture';

describe('SetOpenAIKeyCommandHandler', () => {
  it('salva a chave da OpenAI em secrets quando usuário informa valor', async () => {
    const dependencies = createDependencies();
    vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce('sk-test');

    await new SetOpenAIKeyCommandHandler(dependencies).execute();

    expect(dependencies.context.secrets.store).toHaveBeenCalledWith('codeReview.openai.apiKey', 'sk-test');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('OpenAI API key saved securely.');
  });

  it('não salva nada quando usuário cancela o input', async () => {
    const dependencies = createDependencies();
    vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce(undefined);

    await new SetOpenAIKeyCommandHandler(dependencies).execute();

    expect(dependencies.context.secrets.store).not.toHaveBeenCalled();
  });
});
