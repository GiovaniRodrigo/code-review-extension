import { AnalyzeBranchCommitsCommand }
  from './AnalyzeBranchCommitsCommand';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

import { AnalyzeCommand }
  from './AnalyzeCommand';

import { ClearSessionCommand }
  from './ClearSessionCommand';

import { SetOpenAIKeyCommand }
  from './SetOpenAIKeyCommand';

export function registerCommands(
  dependencies: IExtensionDependencies
): void {

  new AnalyzeCommand(
    dependencies
  ).register();

  new ClearSessionCommand(
    dependencies
  ).register();

  new SetOpenAIKeyCommand(
    dependencies
  ).register();

  new AnalyzeBranchCommitsCommand(
    dependencies
  ).register();
}