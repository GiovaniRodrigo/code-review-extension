import { describe, it, expect } from 'vitest';
import { PinoLogger } from '../../src/infra/PinoLogger';
import { CommandTestTool } from '../../src/infra/CommandTestTool';
import { NodeCommandRunner } from '../../src/infra/NodeCommandRunner';
import { createDefaultTestTools } from '../../src/infra/createDefaultTestTools';

describe('Testing Wrappers Smoke Tests', () => {
  it('PinoLogger should log without throwing', () => {
    const logger = new PinoLogger();
    expect(() => logger.info('test')).not.toThrow();
  });

  it('CommandTestTool should be instantiable and run', async () => {
    const runner = { run: vi.fn().mockResolvedValue({ exitCode: 0, stdout: '' }) };
    const tool = new CommandTestTool('name', 'unit', 'npm', [], runner as any);
    const result = await tool.run();
    expect(result.passed).toBe(true);
  });

  it('NodeCommandRunner should be instantiable', () => {
    const runner = new NodeCommandRunner();
    expect(runner).toBeDefined();
    expect(runner.run).toBeDefined();
  });

  it('createDefaultTestTools should return array of tools', () => {
    const tools = createDefaultTestTools({} as any);
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
  });
});
