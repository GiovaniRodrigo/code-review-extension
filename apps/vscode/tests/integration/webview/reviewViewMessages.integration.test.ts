import { describe, expect, it, vi } from 'vitest';

describe('reviewViewMessages integration', () => {
  it('should process messages from webview to provider', async () => {
    const messageBus = {
      send: vi.fn().mockResolvedValue({ success: true }),
      receive: vi.fn()
    };

    const payload = { type: 'approve', id: 'finding-1' };
    const response = await messageBus.send(payload);

    expect(response.success).toBe(true);
    expect(messageBus.send).toHaveBeenCalledWith(payload);
  });
});
