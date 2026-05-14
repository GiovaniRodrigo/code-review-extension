import { describe, it, expect, vi } from 'vitest';
import { SetupRagCommandHandler } from '../../../../src/command-handlers/rag/setupRagCommandHandler';

describe('SetupRagCommandHandler', () => {
  it('should call notification info', async () => {
    const mockContainer = {
      notifications: {
        info: vi.fn().mockResolvedValue(undefined)
      }
    } as any;
    const handler = new SetupRagCommandHandler(mockContainer);

    await handler.handle();

    expect(mockContainer.notifications.info).toHaveBeenCalledWith('RAG setup completed.');
  });
});
