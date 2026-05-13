import { spawn } from 'node:child_process';
import { CommandResult, CommandRunnerPort } from '../ports/CommandRunnerPort';

export class NodeCommandRunner implements CommandRunnerPort {
  run(command: string, args: string[]): Promise<CommandResult> {
    return new Promise(resolve => {
      const child = spawn(command, args, {
        shell: process.platform === 'win32'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', chunk => {
        stdout += String(chunk);
      });

      child.stderr.on('data', chunk => {
        stderr += String(chunk);
      });

      child.on('close', exitCode => {
        resolve({
          exitCode: exitCode ?? 1,
          stdout,
          stderr
        });
      });
    });
  }
}
