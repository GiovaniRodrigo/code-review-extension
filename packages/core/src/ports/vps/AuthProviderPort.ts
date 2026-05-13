export interface AuthProviderPort {
  authenticate(): Promise<boolean>;
}
