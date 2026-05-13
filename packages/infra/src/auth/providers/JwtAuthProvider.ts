import type { AuthProviderPort } from '../../../../core/src/ports/vps/AuthProviderPort';

export class JwtAuthProvider implements AuthProviderPort {
  async authenticate(): Promise<boolean> {
    return true;
  }
}
