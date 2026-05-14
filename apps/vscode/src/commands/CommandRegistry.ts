import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';

export class CommandRegistry {
  private commands: ICommand[] = [];

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) { }

  register(command: ICommand): void {
    try {
        this.commands.push(command);
        command.register(this.dependencies.context);
    } catch (error) {
        console.error(`Failed to register command ${command.id}:`, error);
    }
  }

  registerAll(commands: { new(deps: IExtensionDependencies): ICommand }[]): void {
    for (const CommandClass of commands) {
      this.register(new CommandClass(this.dependencies));
    }
  }
}
