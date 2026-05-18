import { describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import fs from 'node:fs';
import path from 'node:path';
import { buildContainer } from '../../src/dependencies/buildContainer';
import { registerCommands } from '../../src/bootstrap/registerCommands';
function createContext(): any { return { subscriptions: [], globalStorageUri: { fsPath: '/tmp/ai-code-review-test-storage' }, secrets: { get: vi.fn(async () => ''), store: vi.fn(async () => undefined) }, extensionPath: process.cwd(), extensionMode: 3, globalState: { get: vi.fn(() => undefined), update: vi.fn(async () => undefined) }, workspaceState: { get: vi.fn((_key: string, fallback: unknown) => fallback), update: vi.fn(async () => undefined) } }; }
describe('production wiring gate', () => {
  it('registers every contributed command without missing runtime handlers', async () => { const extensionPackage = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')); const contributedCommands = extensionPackage.contributes.commands.map((command: any) => command.command).sort(); const context = createContext(); const container = await buildContainer(context); registerCommands(context, container); const registeredCommands = (vscode.commands.registerCommand as any).mock.calls.map((call: any[]) => call[0]).sort(); for (const command of contributedCommands) expect(registeredCommands).toContain(command); });
  it('registers production use cases used by command handlers', async () => { const container = await buildContainer(createContext()) as any; for (const key of ['analyzeCodeWithAIUseCase','analyzeWorkspaceUseCase','analyzeBranchCommitsUseCase','analyzePrUseCase','generatePRSummaryUseCase','generateQualityReportUseCase','publishCodeReviewUseCase','approveFindingUseCase','addCommentToFindingUseCase','refactorFindingUseCase','indexRepositoryRagUseCase','clearRepositoryRagUseCase','searchRagContextUseCase','projectChatUseCase','syncWithVpsUseCase']) { expect(container[key], key).toBeTruthy(); expect(typeof container[key].execute, key).toBe('function'); } });
  it('uses mock provider as a safe default so first run does not crash when Ollama is offline', async () => { const container = await buildContainer(createContext()); const health = await container.aiProviderRegistry.checkHealth(); expect(health.status).toBe('available'); });
});
