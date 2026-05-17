import { describe, expect, it, vi } from 'vitest';
import { AnalyzeCommandHandler } from '../../../src/commands/handlers/AnalyzeCommandHandler';

describe('AnalyzeCommandHandler runtime', () => {
  it('should fail with explicit error when use case is missing', async () => {
    const handler = new AnalyzeCommandHandler({
      revalidateCodeReviewUseCase: undefined,
    } as any);

    await expect(handler.execute()).rejects.toThrow(
      'revalidateCodeReviewUseCase not registered'
    );
  });

  it('should call execute from use case when available', async () => {
    const execute = vi.fn().mockResolvedValue({ findings: [] });

    const handler = new AnalyzeCommandHandler({
      revalidateCodeReviewUseCase: { execute },
      ide: { 
          getActiveFileContent: vi.fn().mockResolvedValue('code'),
          getActiveFilePath: vi.fn().mockResolvedValue('file.ts'),
          getActiveBranch: vi.fn().mockResolvedValue('main'),
          getUncommittedChangesLines: vi.fn().mockResolvedValue([]),
          syncDiagnostics: vi.fn()
      },
      reviewPanelProvider: { refresh: vi.fn() },
      dashboardProvider: { refresh: vi.fn() },
      notifications: { info: vi.fn() }
    } as any);

    await handler.execute();

    expect(execute).toHaveBeenCalled();
  });
});
