import { describe, expect, it } from 'vitest';
import { buildContainer } from '../../../src/dependencies/buildContainer';

describe('Analyze command runtime wiring', () => {
  it('should register revalidateCodeReviewUseCase with execute method', async () => {
    const mockContext: any = {
      subscriptions: [],
      globalStorageUri: { fsPath: '/tmp' },
      secrets: { get: async () => '', store: async () => {} },
      extensionPath: process.cwd(),
      globalState: { get: () => undefined, update: async () => {} }
    };

    const container = await buildContainer(mockContext);

    const useCase = container.revalidateCodeReviewUseCase;

    expect(useCase).toBeTruthy();
    expect(typeof useCase.execute).toBe('function');
  });
});
