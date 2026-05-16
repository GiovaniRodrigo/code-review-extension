import * as vscode from 'vscode';
import { bootstrapContainer } from './bootstrapContainer';
import { registerCommands } from './registerCommands';
import { registerViews } from './registerViews';
import { registerMenus } from './registerMenus';
import { registerEvents } from './registerEvents';
import { registerProviders } from './registerProviders';
import { restoreCurrentBranchSession } from './restoreCurrentBranchSession';

export async function activateExtension(context: vscode.ExtensionContext): Promise<void> {
  try {
    const container = await bootstrapContainer(context);
    registerCommands(context, container);
    registerViews(context, container);
    registerMenus(context, container);
    registerEvents(context, container);
    registerProviders(context, container);
    
    // Load custom heuristics for the workspace
    try {
        const { StaticRuleEngine, LoadCustomHeuristicsUseCase } = await import('@code-review/core');
        const ruleEngine = (container as any).ruleEngine || new StaticRuleEngine();
        const loadHeuristics = new LoadCustomHeuristicsUseCase(
            container.workspace,
            container.fileSystem,
            ruleEngine,
            container.analysisService
        );
        await loadHeuristics.execute();
        (container as any).ruleEngine = ruleEngine;
    } catch (e) {
        console.error('[ACTIVATION] Failed to load heuristics', e);
    }

    context.subscriptions.push(container.ide);

    const config = vscode.workspace.getConfiguration('codeReview');
    if (config.get<boolean>('autoRestoreSession', true)) {
        void restoreCurrentBranchSession(context, container);
    }

    // Auto-sync with VPS
    if (config.get<boolean>('sync.enabled', false)) {
        container.ide.onBranchChange(async (branch) => {
            console.log(`[SYNC] Auto-sync triggered for branch ${branch}`);
            try {
                await container.syncWithVpsUseCase.execute(branch);
                await container.reviewPanelProvider.refresh();
                await container.dashboardProvider.refresh();
            } catch (e) {
                console.warn('[SYNC] Auto-sync failed', e);
            }
        });
    }
  } catch (error) {
    console.error('Critical failure during activation', error);
  }
}
