import * as vscode from 'vscode';
import { buildContainer, VSCodeContainer } from '../dependencies/buildContainer';
import { registerPorts } from '../dependencies/registerPorts';
import { registerProviders } from '../dependencies/registerProviders';
import { registerUseCases } from '../dependencies/registerUseCases';

export async function bootstrapContainer(context: vscode.ExtensionContext): Promise<VSCodeContainer> {
  const container = await buildContainer(context);
  registerPorts(container);
  registerProviders(container);
  registerUseCases(container);
  return container;
}
