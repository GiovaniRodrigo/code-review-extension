export interface AccessControlProviderPort {
  canAccess(resource: string): Promise<boolean>;
}
