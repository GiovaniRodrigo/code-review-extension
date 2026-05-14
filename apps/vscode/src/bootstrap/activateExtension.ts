import * as vscode from 'vscode';
import { bootstrapContainer } from './bootstrapContainer';
import { bootstrapProviders } from './bootstrapProviders';
import { registerCommands as registerNewCommands } from '../registers/registerCommands';
import { registerMenus } from '../registers/registerMenus';
import { ExtensionBootstrap } from './ExtensionBootstrap';

export function activateExtension(context: vscode.ExtensionContext): void {
  try {
    const container = bootstrapContainer(context);

    try {
        bootstrapProviders(context, container);
    } catch (e) { console.error('Failed to bootstrap providers', e); }

    try {
        registerNewCommands(container);
    } catch (e) { console.error('Failed to register new commands', e); }

    try {
        registerMenus(context, container);
    } catch (e) { console.error('Failed to register menus', e); }

    try {
        // Initialize old system for compatibility/E2E
        const oldBootstrap = new ExtensionBootstrap(context);
        oldBootstrap.initialize();
    } catch (e) { console.error('Failed to initialize old bootstrap', e); }

  } catch (error) {
    console.error('Critical failure during activation', error);
  }
}
