import { AuthProviderPort } from '@code-review/core';

export class OAuthProvider implements AuthProviderPort {
  async authenticate(): Promise<boolean> {
    return true;
  }
}
