import { TestToolKind, TestToolResult } from '../domain/TestTool';
import { CommandRunnerPort } from '../ports/CommandRunnerPort';
import { TestToolPort } from '../ports/TestToolPort';

export class CommandTestTool implements TestToolPort {
  constructor(
    public readonly name: string,
    public readonly kind: TestToolKind,
    private readonly command: string,
    private readonly args: string[],
    private readonly runner: CommandRunnerPort
  ) {}

  async run(): Promise<TestToolResult> {
    const result = await this.runner.run(this.command, this.args);

    return {
      tool: this.name,
      kind: this.kind,
      passed: result.exitCode === 0,
      details: result.stdout || result.stderr
    };
  }
}
