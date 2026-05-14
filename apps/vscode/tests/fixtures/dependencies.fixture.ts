import { vi } from 'vitest';

export function createDependencies(overrides: Record<string, unknown> = {}) {
  const dependencies = {
    context: {
      subscriptions: [],
      secrets: {
        get: vi.fn(async () => undefined),
        store: vi.fn(async () => undefined)
      }
    },
    vscodeAdapter: {
      getActiveBranch: vi.fn(async () => 'main'),
      focusFinding: vi.fn(async () => undefined),
      applyFix: vi.fn(async () => undefined)
    },
    reviewRepository: {
      getSessionByBranch: vi.fn(async () => undefined),
      getSessionById: vi.fn(async () => undefined),
      saveSession: vi.fn(async () => undefined)
    },
    contextEngine: {},
    validateFindingUseCase: {
      execute: vi.fn(async (sessionId: string, findingId: string, status: string) => ({
        id: sessionId,
        findings: [{ id: findingId, status }]
      }))
    },
    reviewViewProvider: {
      setLoading: vi.fn(),
      updateFindings: vi.fn(),
      setError: vi.fn(),
      clear: vi.fn(),
      getCurrentSessionId: vi.fn()
    }
  };

  return { ...dependencies, ...overrides } as any;
}
