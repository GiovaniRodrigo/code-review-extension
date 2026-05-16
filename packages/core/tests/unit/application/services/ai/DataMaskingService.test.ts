import { describe, expect, it } from 'vitest';
import { DataMaskingService } from '../../../../../src/application/services/ai/DataMaskingService';

describe('DataMaskingService', () => {
  it('should mask emails', () => {
    const service = new DataMaskingService();
    const code = 'const contact = "test@example.com";';
    expect(service.mask(code)).toBe('const contact = "[EMAIL_REDACTED]";');
  });

  it('should mask IPv4 addresses', () => {
    const service = new DataMaskingService();
    const code = 'const ip = "192.168.1.1";';
    expect(service.mask(code)).toBe('const ip = "[IP_REDACTED]";');
  });

  it('should mask hardcoded API keys and tokens', () => {
    const service = new DataMaskingService();
    const code = 'const apiKey = "abcdef1234567890abcdef1234567890";';
    const result = service.mask(code);
    expect(result).toContain('[SECRET_REDACTED]');
    expect(result).not.toContain('abcdef1234567890');
  });

  it('should mask generic long strings that look like secrets', () => {
    const service = new DataMaskingService();
    const code = 'const key = "hR8xP2qW9zL1mN4bV7cX5kY0jH3gS6fD9aQ2wE5rT8yU";';
    const result = service.mask(code);
    expect(result).toContain('[SECRET_REDACTED]');
  });

  it('should mask long random strings in the middle of code', () => {
    const service = new DataMaskingService();
    const code = 'send("hR8xP2qW9zL1mN4bV7cX5kY0jH3gS6fD9aQ2wE5rT8yU");';
    const result = service.mask(code);
    expect(result).toContain('[POTENTIAL_SECRET_REDACTED]');
  });
});
