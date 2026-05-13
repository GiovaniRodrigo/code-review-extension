import * as vscode from 'vscode';
import { bootstrapContainer } from './bootstrapContainer';
import { bootstrapProviders } from './bootstrapProviders';
import { registerCommands } from '../registers/registerCommands';
import { registerMenus } from '../registers/registerMenus';

export function activateExtension(context: vscode.ExtensionContext): void {
  const container = bootstrapContainer(context);

  bootstrapProviders(context, container);
  registerCommands(container);
  registerMenus(context, container);
}
