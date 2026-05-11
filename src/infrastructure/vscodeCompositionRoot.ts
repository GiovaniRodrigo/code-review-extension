import * as vscode from 'vscode';
import { ReviewSessionService } from '../application/reviewSessionService';
import { ReviewSessionUseCases } from '../application/useCases';
import { GitCliService } from './gitCliService';
import { LocalJsonReviewSessionRepository } from './localJsonReviewSessionRepository';
import { WorkspaceSourceFileProvider } from './workspaceSourceFileProvider';
import { FileAuditService } from './audit/fileAuditService';
import { VscodePremiumPlanProvider } from './premium/vscodePremiumPlanProvider';
import { HttpRemoteReviewDatabaseClient } from './premium/httpRemoteReviewDatabaseClient';
import { createLocalAIProviderFromVSCodeSettings } from './vscodeLocalAIProviderFactory';

export interface ExtensionComposition {
  reviewSessionService: ReviewSessionUseCases;
  gitService: GitCliService;
}

export function buildExtensionComposition(context: vscode.ExtensionContext): ExtensionComposition {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  const repository = new LocalJsonReviewSessionRepository(context);
  const gitService = new GitCliService(workspaceFolder);
  const sourceFileProvider = new WorkspaceSourceFileProvider(workspaceFolder);
  const auditService = new FileAuditService(context);
  const premiumPlan = new VscodePremiumPlanProvider().getPlan();
  const remoteClient = premiumPlan.edition === 'premium' ? new HttpRemoteReviewDatabaseClient(premiumPlan) : undefined;
  const communityAIProvider = createLocalAIProviderFromVSCodeSettings();

  return {
    gitService,
    reviewSessionService: new ReviewSessionService(repository, gitService, sourceFileProvider, auditService, premiumPlan, remoteClient, communityAIProvider)
  };
}
