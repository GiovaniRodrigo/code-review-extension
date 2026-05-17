import { vi } from 'vitest';

export class AnalyzeCodeUseCase {
  static executeMock = vi.fn(async () => ({ id: 'session-1', findings: [] }));

  constructor(
    public readonly aiProvider: unknown,
    public readonly ideAdapter: unknown,
    public readonly reviewRepository: unknown,
    public readonly contextEngine: unknown
  ) {}

  execute() {
    return AnalyzeCodeUseCase.executeMock();
  }
}

export class ValidateFindingUseCase {
  execute = vi.fn(async (sessionId: string, findingId: string, status: string) => ({
    id: sessionId,
    findings: [{ id: findingId, status }]
  }));
}

export class ContextEngine {}
