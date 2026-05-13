export interface AccessPolicy {
  canAccess(resource: string): boolean;
}
