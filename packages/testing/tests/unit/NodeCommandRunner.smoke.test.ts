import { describe, it, expect, vi } from 'vitest';
import { NodeCommandRunner } from '../../src/infra/NodeCommandRunner';

describe('NodeCommandRunner', () => {
  it('should instantiate', () => {
    const runner = new NodeCommandRunner();
    expect(runner).toBeDefined();
  });

  it('should execute command method without crashing', async () => {
    const runner = new NodeCommandRunner();
    // Using a command that exists and returns quickly
    const result = await runner.run('ls', ['.']);
    expect(result).toBeDefined();
  });
});
