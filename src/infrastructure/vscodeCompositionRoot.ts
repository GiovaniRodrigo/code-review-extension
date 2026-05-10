import * as vscode from 'vscode';
import { ReviewSessionService } from '../application/reviewSessionService';
import { ReviewSessionUseCases } from '../application/useCases';
import { GitCliService } from './gitCliService';
import { LocalJsonReviewSessionRepository } from './localJsonReviewSessionRepository';
import { WorkspaceSourceFileProvider } from './workspaceSourceFileProvider';
import { FileAuditService } from './audit/fileAuditService';

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

  return {
    gitService,
    reviewSessionService: new ReviewSessionService(repository, gitService, sourceFileProvider, auditService)
  };
}
