import { DependencyGraphPort } from '../../../ports/ast/DependencyGraphPort';
import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';
import { DependencyAnalysisService, Cycle } from '../../services/ast/DependencyAnalysisService';

export interface DependencyAnalysisReport {
  totalFiles: number;
  cycles: Cycle[];
}

export class AnalyzeWorkspaceDependenciesUseCase {
  constructor(
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly graphBuilder: DependencyGraphPort,
    private readonly analysisService = new DependencyAnalysisService()
  ) {}

  async execute(): Promise<DependencyAnalysisReport> {
    const filePaths = await this.workspace.findFiles('**/*.{ts,tsx,js,jsx}');
    const files = await Promise.all(
      filePaths.slice(0, 100).map(async filePath => ({ // Limit to 100 files for performance
        filePath,
        code: await this.fileSystem.readFile(filePath)
      }))
    );

    const graph = await this.graphBuilder.buildGraph(files);
    const cycles = this.analysisService.findCycles(graph);

    return {
      totalFiles: filePaths.length,
      cycles
    };
  }
}
