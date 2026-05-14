import { describe, it, expect } from 'vitest';
import { VSCodeWebviewAdapter } from '../../../src/adapters/ide/VSCodeWebviewAdapter';

describe('VSCodeWebviewAdapter Integration', () => {
  it('deve retornar false ao enviar mensagem (implementação atual)', async () => {
    const adapter = new VSCodeWebviewAdapter();
    const result = await adapter.postMessage({ type: 'test' });
    expect(result).toBe(false);
  });
});
