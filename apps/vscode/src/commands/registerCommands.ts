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

export function registerCommands(
  dependencies: IExtensionDependencies
): void {
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
    SearchRepositoryContextCommand
  ]);
}