import { describe, it, expect } from 'vitest';

describe('Alias Resolution Regression Test', () => {
  it('should resolve @code-review/domain alias', async () => {
    // This will fail if the alias is not correctly configured in vitest.config.ts
    // or if the underlying package structure is missing.
    try {
      // @ts-expect-error - testing alias resolution
      const domain = await import('@code-review/domain');
      expect(domain).toBeDefined();
    } catch (e: any) {
      // If it fails with "Cannot find module", then the alias is broken
      if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message.includes('Cannot find module')) {
         throw new Error('Alias @code-review/domain is NOT working: ' + e.message);
      }
      // Other errors might be expected if the package itself has issues, 
      // but the alias resolved.
    }
  });

  it('should resolve @code-review/core alias', async () => {
    try {
      // @ts-expect-error - testing alias resolution
      const core = await import('@code-review/core');
      expect(core).toBeDefined();
    } catch (e: any) {
      if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message.includes('Cannot find module')) {
         throw new Error('Alias @code-review/core is NOT working: ' + e.message);
      }
    }
  });
});
