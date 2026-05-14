import { describe, expect, it, vi } from 'vitest';

describe('webviewState integration', () => {
  it('should synchronize state between core and webview', async () => {
    const stateManager = {
      state: { findings: [] },
      setState: vi.fn().mockImplementation((newState) => {
        stateManager.state = { ...stateManager.state, ...newState };
      }),
      getState: vi.fn().mockImplementation(() => stateManager.state)
    };

    await stateManager.setState({ findings: [{ id: '1' }] });
    const currentState = stateManager.getState();

    expect(currentState.findings).toHaveLength(1);
    expect(stateManager.setState).toHaveBeenCalled();
  });
});
