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
    
    // Load custom heuristics for the workspace
    void (async () => {
        try {
            const { StaticRuleEngine, LoadCustomHeuristicsUseCase } = await import('@code-review/core');
            const ruleEngine = (container as any).ruleEngine || new StaticRuleEngine();
            const loadHeuristics = new LoadCustomHeuristicsUseCase(
                container.workspace,
                (container as any).fileSystem || (container as any).ide,
                ruleEngine
            );
            await loadHeuristics.execute();
            (container as any).ruleEngine = ruleEngine;
        } catch (e) {
            console.error('[ACTIVATION] Failed to load heuristics', e);
        }
    })();

    context.subscriptions.push(container.ide);

    const config = vscode.workspace.getConfiguration('codeReview');
    if (config.get<boolean>('autoRestoreSession', true)) {
        void restoreCurrentBranchSession(context, container);
    }
  } catch (error) {
    console.error('Critical failure during activation', error);
  }
}
