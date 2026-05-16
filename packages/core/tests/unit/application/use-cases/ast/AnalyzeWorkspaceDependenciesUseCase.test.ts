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
    expect(report.nodes).toEqual([
      { id: 'a.ts', dependsOn: ['b.ts'] },
      { id: 'b.ts', dependsOn: [] }
    ]);
    expect(mockWorkspace.findFiles).toHaveBeenCalledWith('**/*.{ts,tsx,js,jsx}');
    expect(mockFS.readFile).toHaveBeenCalledWith('a.ts');
    expect(mockFS.readFile).toHaveBeenCalledWith('b.ts');
    expect(mockBuilder.buildGraph).toHaveBeenCalledWith([
      { filePath: 'a.ts', code: 'code' },
      { filePath: 'b.ts', code: 'code' }
    ]);
  });

  it('should limit graph input to 50 files while keeping total workspace count', async () => {
    const filePaths = Array.from({ length: 55 }, (_, index) => `file-${index}.ts`);

    const mockWorkspace = {
      findFiles: vi.fn().mockResolvedValue(filePaths)
    } as unknown as IdeWorkspacePort;

    const mockFS = {
      readFile: vi.fn().mockImplementation(async filePath => `code:${filePath}`)
    } as unknown as IdeFileSystemPort;

    const mockGraph: any = {
      nodes: new Map([
        ['file-0.ts', { filePath: 'file-0.ts', dependsOn: ['file-1.ts'] }]
      ])
    };

    const mockBuilder = {
      buildGraph: vi.fn().mockResolvedValue(mockGraph)
    } as unknown as DependencyGraphPort;

    const useCase = new AnalyzeWorkspaceDependenciesUseCase(mockWorkspace, mockFS, mockBuilder);
    const report = await useCase.execute();

    expect(report.totalFiles).toBe(55);
    expect(mockFS.readFile).toHaveBeenCalledTimes(50);
    expect(mockFS.readFile).not.toHaveBeenCalledWith('file-50.ts');
    expect(mockBuilder.buildGraph).toHaveBeenCalledWith(
      filePaths.slice(0, 50).map(filePath => ({
        filePath,
        code: `code:${filePath}`
      }))
    );
    expect(report.nodes).toEqual([
      { id: 'file-0.ts', dependsOn: ['file-1.ts'] }
    ]);
  });
});
