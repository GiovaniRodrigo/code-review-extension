import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { CommandRegistry } from './CommandRegistry';
import { AnalyzeCommand } from './AnalyzeCommand';
import { ClearSessionCommand } from './ClearSessionCommand';
import { SetOpenAIKeyCommand } from './SetOpenAIKeyCommand';
import { AnalyzeBranchCommitsCommand } from './AnalyzeBranchCommitsCommand';
import { AnalyzePrCommand } from './AnalyzePrCommand';
import { IndexRepositoryRagCommand } from './IndexRepositoryRagCommand';
import { SetProviderCommand } from './SetProviderCommand';
import { ClearRepositoryRagCommand } from './ClearRepositoryRagCommand';
import { SearchRepositoryContextCommand } from './SearchRepositoryContextCommand';
import { FocusCommand } from './FocusCommand';
import { RestoreSessionCommand } from './RestoreSessionCommand';
import { PublishPrReviewCommand } from './PublishPrReviewCommand';
import { SyncRemotePRCommand } from './SyncRemotePRCommand';
import { SetGitLabTokenCommand } from './SetGitLabTokenCommand';
import { SetGitLabCredentialsCommand } from './SetGitLabCredentialsCommand';
import { SetGitLabUrlCommand } from './SetGitLabUrlCommand';

export function registerCommands(
  dependencies: IExtensionDependencies
): void {
  console.log('[DEBUG] Registering old system commands...');
  const registry = new CommandRegistry(dependencies);

  registry.registerAll([
    AnalyzeCommand,
    ClearSessionCommand,
    SetOpenAIKeyCommand,
    AnalyzeBranchCommitsCommand,
    AnalyzePrCommand,
    IndexRepositoryRagCommand,
    SetProviderCommand,
    ClearRepositoryRagCommand,
    SearchRepositoryContextCommand,
    FocusCommand,
    RestoreSessionCommand,
    PublishPrReviewCommand,
    SyncRemotePRCommand,
    SetGitLabTokenCommand,
    SetGitLabCredentialsCommand,
    SetGitLabUrlCommand
  ]);
}