import { AuthProviderPort } from '../../../ports/vps/AuthProviderPort';

export class AuthenticateWithVpsUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  execute(): Promise<boolean> {
    return this.authProvider.authenticate();
  }
}
