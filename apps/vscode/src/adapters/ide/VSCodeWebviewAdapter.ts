import { IdeWebviewPort } from '@code-review/core';

export class VSCodeWebviewAdapter implements IdeWebviewPort {
  async postMessage(_message: unknown): Promise<boolean> {
    return false;
  }
}
