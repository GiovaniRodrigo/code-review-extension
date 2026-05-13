import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { registerProviders } from '../registers/registerProviders';
import { registerViews } from '../registers/registerViews';

export function bootstrapProviders(
  context: vscode.ExtensionContext,
  container: VSCodeContainer
): void {
  registerProviders(context, container);
  registerViews(context, container);
}
