import { describe, expect, it, vi, beforeEach } from 'vitest';
import { 
  AnalyzeWorkspaceUseCase, 
  RevalidateCodeReviewUseCase,
  AIAnalysisService,
  CodeReviewService,
  ContextPruningService
} from '@code-review/core';
import { performance } from 'node:perf_hooks';

describe('Main Flow Performance', () => {
  let mockWorkspace: any;
  let mockFS: any;
  let mockAI: any;
  let mockReviewService: any;
  let mockPruning: any;
  let mockAstBuilder: any;

  beforeEach(() => {
    mockWorkspace = { findFiles: vi.fn() };
    mockFS = { readFile: vi.fn() };
    mockAI = { analyze: vi.fn() };
    mockReviewService = {
      getByBranch: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    };
    mockPruning = new ContextPruningService();
    mockAstBuilder = { build: vi.fn() };
  });

  const measure = async (fn: () => Promise<any>) => {
    const start = performance.now();
    await fn();
    return performance.now() - start;
  };

  it('AnalyzeWorkspaceUseCase: should handle 100 files within budget', async () => {
    const totalFiles = 100;
    const filePaths = Array.from({ length: totalFiles }, (_, i) => `file${i}.ts`);
    mockWorkspace.findFiles.mockResolvedValue(filePaths);
    mockFS.readFile.mockResolvedValue('const x = 1;');
    mockAI.analyze.mockResolvedValue({ findings: [{ file: 'f.ts', line: 1, message: 'm', severity: 'info', confidence: 0.9 }] });
    mockReviewService.getByBranch.mockResolvedValue(null);
    mockReviewService.create.mockImplementation((branch, findings) => Promise.resolve({ id: 's1', branch, findings }));

    const useCase = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    
    const duration = await measure(() => useCase.execute({ branch: 'perf-test' }));
    
    console.log(`[PERF] AnalyzeWorkspace (100 files): ${duration.toFixed(2)}ms`);
    
    // Budget: 100 files should be processed quickly if AI is mocked (overhead test)
    // In a real scenario, this would take much longer due to AI latency.
    // Here we are measuring the Core overhead + Mock overhead.
    expect(duration).toBeLessThan(500); // 500ms budget for core overhead with 100 files
  });

  it('RevalidateCodeReviewUseCase: should handle large file within budget', async () => {
    const largeCode = 'console.log("hello world");\n'.repeat(5000); // 5000 lines
    mockAI.analyze.mockResolvedValue({ findings: [] });
    mockReviewService.getByBranch.mockResolvedValue({ id: 's1', branch: 'perf-test', findings: [] });

    const useCase = new RevalidateCodeReviewUseCase(mockAI, mockReviewService);
    
    const duration = await measure(() => useCase.execute({ 
        branch: 'perf-test', 
        code: largeCode, 
        filePath: 'large.ts' 
    }));
    
    console.log(`[PERF] RevalidateCodeReview (5000 lines): ${duration.toFixed(2)}ms`);
    
    expect(duration).toBeLessThan(300); // 300ms budget for a single large file revalidation overhead
  });

  it('RevalidateCodeReviewUseCase: incremental mode overhead', async () => {
    const code = 'function a() {}\nfunction b() {}\nfunction c() {}\n';
    mockAI.analyze.mockResolvedValue({ findings: [] });
    mockReviewService.getByBranch.mockResolvedValue({ id: 's1', branch: 'perf-test', findings: [] });
    
    // Realistic AST mock for ContextPruningService
    mockAstBuilder.build.mockResolvedValue({ 
        code: code,
        root: {
            kind: 'sourceFile',
            startLine: 1,
            endLine: 3,
            children: [
                { kind: 'function', startLine: 1, endLine: 1, name: 'a' },
                { kind: 'function', startLine: 2, endLine: 2, name: 'b' },
                { kind: 'function', startLine: 3, endLine: 3, name: 'c' }
            ]
        }
    });

    const useCase = new RevalidateCodeReviewUseCase(mockAI, mockReviewService, mockPruning, mockAstBuilder);
    
    const duration = await measure(() => useCase.execute({ 
        branch: 'perf-test', 
        code: code, 
        filePath: 'small.ts',
        targetLines: [2]
    }));
    
    console.log(`[PERF] RevalidateCodeReview (Incremental): ${duration.toFixed(2)}ms`);
    
    expect(duration).toBeLessThan(200);
  });

  it('End-to-End Session: typical developer session overhead', async () => {
    // 1. Setup
    mockWorkspace.findFiles.mockResolvedValue(['a.ts', 'b.ts', 'c.ts']);
    mockFS.readFile.mockResolvedValue('const x = 1;');
    mockAI.analyze.mockResolvedValue({ findings: [] });
    let session: any = null;
    mockReviewService.getByBranch.mockImplementation(() => Promise.resolve(session));
    mockReviewService.create.mockImplementation((branch, findings) => {
        session = { id: 's1', branch, findings };
        return Promise.resolve(session);
    });
    mockReviewService.update.mockImplementation((s) => {
        session = s;
        return Promise.resolve();
    });

    const analyzeWorkspace = new AnalyzeWorkspaceUseCase(mockWorkspace, mockFS, mockAI, mockReviewService);
    const revalidate = new RevalidateCodeReviewUseCase(mockAI, mockReviewService);

    const duration = await measure(async () => {
        // Step 1: Initial workspace analysis
        await analyzeWorkspace.execute({ branch: 'session-perf' });

        // Step 2: 5 sequential revalidations (simulating typing/saves)
        for (let i = 0; i < 5; i++) {
            await revalidate.execute({
                branch: 'session-perf',
                code: `const x = ${i};`,
                filePath: 'a.ts'
            });
        }
    });

    console.log(`[PERF] End-to-End Session (1 Analysis + 5 Revalidations): ${duration.toFixed(2)}ms`);
    
    expect(duration).toBeLessThan(1000); // 1s budget for total core overhead
  });
});
