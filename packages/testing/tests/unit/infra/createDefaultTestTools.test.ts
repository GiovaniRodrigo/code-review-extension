import { describe, expect, it, vi } from 'vitest';
import { createDefaultTestTools } from '../../../src/infra/createDefaultTestTools';
import { CommandRunnerPort } from '../../../src/ports/CommandRunnerPort';

describe('createDefaultTestTools', () => {
  it('deve registrar todas as ferramentas obrigatórias', () => {
    const runner = { run: vi.fn() } as unknown as CommandRunnerPort;
    const tools = createDefaultTestTools(runner);

    const kinds = tools.map(t => t.kind);
    expect(kinds).toContain('unit');
    expect(kinds).toContain('integration');
    expect(kinds).toContain('lint');
    expect(kinds).toContain('architecture');
    expect(kinds).toContain('dependencies');
    expect(kinds).toContain('coverage');
    expect(kinds).toContain('regression');
  });
});
