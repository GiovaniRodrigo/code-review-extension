import * as vscode from 'vscode';
import { buildContainer, VSCodeContainer } from '../dependencies/buildContainer';
import { registerPorts } from '../dependencies/registerPorts';
import { registerProviders } from '../dependencies/registerProviders';
import { registerUseCases } from '../dependencies/registerUseCases';

export function bootstrapContainer(context: vscode.ExtensionContext): VSCodeContainer {
  const container = buildContainer(context);
  registerPorts(container);
  registerProviders(container);
  registerUseCases(container);
  return container;
}
