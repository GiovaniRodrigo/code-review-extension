import { describe, expect, it } from 'vitest';
import { DataMaskingService } from '../../../packages/core/src/application/services/ai/DataMaskingService';

describe('LLM Safety - Data Masking', () => {
  it('should mask emails before sending content to LLM', () => {
    const service = new DataMaskingService();

    const result = service.mask('Contact me at user@example.com');

    expect(result).not.toContain('user@example.com');
  });
});
