import { describe, it, expect, vi } from 'vitest';
import { AuthenticateWithVpsUseCase } from '../../../../../src/application/use-cases/vps/AuthenticateWithVpsUseCase';
import { CheckAccessUseCase } from '../../../../../src/application/use-cases/vps/CheckAccessUseCase';
import { SyncWithVpsUseCase } from '../../../../../src/application/use-cases/vps/SyncWithVpsUseCase';

describe('VPS Use Cases Smoke Tests', () => {
  it('should instantiate AuthenticateWithVpsUseCase', () => {
    expect(new AuthenticateWithVpsUseCase({} as any)).toBeDefined();
  });

  it('should instantiate CheckAccessUseCase', () => {
    expect(new CheckAccessUseCase({} as any)).toBeDefined();
  });

  it('should instantiate SyncWithVpsUseCase', () => {
    expect(new SyncWithVpsUseCase({} as any)).toBeDefined();
  });
});
