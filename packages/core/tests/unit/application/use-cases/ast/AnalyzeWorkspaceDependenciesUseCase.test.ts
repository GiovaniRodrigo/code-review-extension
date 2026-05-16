import { describe, expect, it, vi } from 'vitest';
import { AnalyzeWorkspaceDependenciesUseCase } from '../../../../../src/application/use-cases/ast/AnalyzeWorkspaceDependenciesUseCase';
import { DependencyGraphPort } from '../../../../../src/ports/ast/DependencyGraphPort';
import { IdeWorkspacePort } from '../../../../../src/ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../../../src/ports/ide/IdeFileSystemPort';

describe('AnalyzeWorkspaceDependenciesUseCase', () => {
  it('should find files and build a dependency graph', async () => {
    const mockWorkspace = {
      findFiles: vi.fn().mockResolvedValue(['a.ts', 'b.ts'])
    } as unknown as IdeWorkspacePort;

    const mockFS = {
      readFile: vi.fn().mockResolvedValue('code')
    } as unknown as IdeFileSystemPort;

    const mockGraph: any = {
      nodes: new Map([
        ['a.ts', { filePath: 'a.ts', dependsOn: ['b.ts'] }],
        ['b.ts', { filePath: 'b.ts', dependsOn: [] }]
      ])
    };

    const mockBuilder = {
      buildGraph: vi.fn().mockResolvedValue(mockGraph)
    } as unknown as DependencyGraphPort;

    const useCase = new AnalyzeWorkspaceDependenciesUseCase(mockWorkspace, mockFS, mockBuilder);
    const report = await useCase.execute();

    expect(report.totalFiles).toBe(2);
    expect(report.nodes).toHaveLength(2);
    expect(mockBuilder.buildGraph).toHaveBeenCalled();
  });
});
