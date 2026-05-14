import { describe, it, expect } from 'vitest';
import { FileAuditLogService } from '../../src/FileAuditLogService';

describe('FileAuditLogService', () => {
  it('should log messages to internal array', async () => {
    const service = new FileAuditLogService();
    await service.log('test message', 'actor', {});
    const logs = await service.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('test message');
  });

  it('should handle log with storage path', async () => {
    const service = new FileAuditLogService('audit.log');
    await service.log('test', 'actor', {});
    expect(service).toBeDefined();
  });
});
