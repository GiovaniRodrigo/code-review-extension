import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AnalyzeWorkspaceUseCase } from '../../../../../src/application/use-cases/review/AnalyzeWorkspaceUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';
import { IdeWorkspacePort } from '../../../../../src/ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../../../src/ports/ide/IdeFileSystemPort';
import { AuditLogService } from '@code-review/domain';

describe('AnalyzeWorkspaceUseCase', () => {
  let mockWorkspace: any;
  let mockFS: any;
  let mockAI: any;
  let mockReviewService: any;
  let mockAuditLog: any;

  beforeEach(() => {
    mockWorkspace = { findFiles: vi.fn().mockResolvedValue(['file1.ts', 'file2.ts']) };
    mockFS = { readFile: vi.fn().mockResolvedValue('code') };
    mockAI = { analyze: vi.fn().mockResolvedValue({ findings: [] }) };
    mockReviewService = {
      getByBranch: vi.fn().mockResolvedValue({ id: 's1', findings: [], branch: 'main' }),
      update: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue({ id: 's-new', findings: [], branch: 'main' })
    };
    mockAuditLog = { log: vi.fn().mockResolvedValue(undefined) };
  });

  it('should analyze multiple files in the workspace', async () => {
    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    const result = await useCase.execute({ branch: 'main' });

    expect(mockWorkspace.findFiles).toHaveBeenCalledWith('**/*.{ts,tsx,js,jsx}');
    expect(mockFS.readFile).toHaveBeenCalledTimes(2);
    expect(mockAI.analyze).toHaveBeenCalledTimes(2);
    expect(mockReviewService.update).toHaveBeenCalled();
  });

  it('should log to audit service if provided', async () => {
    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService, mockAuditLog);
    await useCase.execute({ branch: 'main' });
    expect(mockAuditLog.log).toHaveBeenCalledWith('workspace_analysis_start', 'developer', expect.any(Object));
  });

  it('should create a session if one does not exist', async () => {
    mockReviewService.getByBranch.mockResolvedValue(null);
    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    await useCase.execute({ branch: 'main' });
    expect(mockReviewService.create).toHaveBeenCalled();
  });

  it('should skip empty files', async () => {
    mockFS.readFile.mockResolvedValue('   ');
    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    await useCase.execute({ branch: 'main' });
    expect(mockAI.analyze).not.toHaveBeenCalled();
  });

  it('should report progress and handle file read errors gracefully', async () => {
    mockFS.readFile.mockImplementation((path: string) => path === 'fail.ts' ? Promise.reject(new Error('Read error')) : Promise.resolve('code'));
    mockWorkspace.findFiles.mockResolvedValue(['ok.ts', 'fail.ts']);

    const onProgress = vi.fn();
    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    
    await useCase.execute({ branch: 'main', onProgress });

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenNthCalledWith(1, { current: 1, total: 2, file: 'ok.ts' });
    expect(mockAI.analyze).toHaveBeenCalledTimes(1); 
  });

  it('should respect abort signal', async () => {
    const controller = new AbortController();
    controller.abort();

    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    await useCase.execute({ branch: 'main', signal: controller.signal });

    expect(mockAI.analyze).not.toHaveBeenCalled();
  });

  it('should limit findings to 500', async () => {
    const manyFindings = Array(600).fill({}).map((_, i) => ({
        id: `f-${i}`, file: 'a.ts', line: i, message: 'm', severity: 'info'
    }));
    mockAI.analyze.mockResolvedValue({ findings: manyFindings });
    mockWorkspace.findFiles.mockResolvedValue(['a.ts']);

    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    const result = await useCase.execute({ branch: 'main' });

    expect(result.findings.length).toBe(500);
  });

  it('should deduplicate findings by file, line and message', async () => {
    const f1 = { file: 'a.ts', line: 1, message: 'msg', severity: 'info' };
    const f2 = { file: 'a.ts', line: 1, message: 'msg', severity: 'info' }; // Duplicate
    const f3 = { file: 'a.ts', line: 2, message: 'msg', severity: 'info' }; // Different line
    
    mockAI.analyze.mockResolvedValueOnce({ findings: [f1, f2] });
    mockAI.analyze.mockResolvedValueOnce({ findings: [f3] });
    mockWorkspace.findFiles.mockResolvedValue(['a.ts', 'b.ts']);

    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    const result = await useCase.execute({ branch: 'main' });

    expect(result.findings).toHaveLength(2);
  });
});

