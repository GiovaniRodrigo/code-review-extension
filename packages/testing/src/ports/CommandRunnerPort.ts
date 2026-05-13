export interface CommandResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface CommandRunnerPort {
  run(command: string, args: string[]): Promise<CommandResult>;
}
