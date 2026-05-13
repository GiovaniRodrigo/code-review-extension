import { AuthProviderPort } from '@code-review/core';

export class JwtAuthProvider implements AuthProviderPort {
  async authenticate(): Promise<boolean> {
    return true;
  }
}
