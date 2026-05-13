import type { AuthProviderPort } from '../../../../core/src/ports/vps/AuthProviderPort';

export class OAuthProvider implements AuthProviderPort {
  async authenticate(): Promise<boolean> {
    return true;
  }
}
