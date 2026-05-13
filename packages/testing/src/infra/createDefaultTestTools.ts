import { CommandRunnerPort } from '../ports/CommandRunnerPort';
import { CommandTestTool } from './CommandTestTool';

export function createDefaultTestTools(runner: CommandRunnerPort): CommandTestTool[] {
  return [
    new CommandTestTool('vitest-unit', 'unit', 'npm', ['run', 'test:unit'], runner),
    new CommandTestTool('vitest-integration', 'integration', 'npm', ['run', 'test:integration'], runner),
    new CommandTestTool('eslint', 'lint', 'npm', ['run', 'lint'], runner),
    new CommandTestTool('dependency-cruiser', 'architecture', 'npm', ['run', 'arch:depcruise'], runner),
    new CommandTestTool('madge', 'dependencies', 'npm', ['run', 'arch:madge'], runner)
  ];
}
