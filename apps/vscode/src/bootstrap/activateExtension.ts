import * as vscode from 'vscode';
import { bootstrapContainer } from './bootstrapContainer';
import { registerCommands } from './registerCommands';
import { registerViews } from './registerViews';
import { registerMenus } from './registerMenus';
import { registerEvents } from './registerEvents';
import { registerProviders } from './registerProviders';
import { restoreCurrentBranchSession } from './restoreCurrentBranchSession';

export function activateExtension(context: vscode.ExtensionContext): void {
  try {
    const container = bootstrapContainer(context);
    registerCommands(context, container);
    registerViews(context, container);
    registerMenus(context, container);
    registerEvents(context, container);
    registerProviders(context, container);
    
    void restoreCurrentBranchSession(context, container);
  } catch (error) {
    console.error('Critical failure during activation', error);
  }
}
