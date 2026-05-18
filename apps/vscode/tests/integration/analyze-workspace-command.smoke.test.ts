import { describe, expect, it, vi } from 'vitest';
import { AnalyzeWorkspaceCommandHandler } from '../../src/commands/handlers/AnalyzeWorkspaceCommandHandler';

describe('AnalyzeWorkspaceCommandHandler', () => {
  it('passes branch and progress contract to the registered use case', async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const container: any = {
      analyzeWorkspaceUseCase: { execute },
      ide: { getActiveBranch: vi.fn().mockResolvedValue('feature/test') },
      reviewPanelProvider: { refresh: vi.fn().mockResolvedValue(undefined) },
      dashboardProvider: { refresh: vi.fn().mockResolvedValue(undefined) },
      notifications: {
        info: vi.fn().mockResolvedValue(undefined),
        error: vi.fn().mockResolvedValue(undefined)
      }
    };

    const handler = new AnalyzeWorkspaceCommandHandler(container);
    await handler.execute();

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute.mock.calls[0][0]).toMatchObject({ branch: 'feature/test' });
    expect(container.notifications.error).not.toHaveBeenCalled();
  });
});
