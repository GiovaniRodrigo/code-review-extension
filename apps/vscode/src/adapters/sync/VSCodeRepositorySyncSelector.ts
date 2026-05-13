export class VSCodeRepositorySyncSelector {
  select(remoteUrl?: string): string {
    if (remoteUrl?.includes('gitlab')) return 'gitlab';
    if (remoteUrl?.includes('bitbucket')) return 'bitbucket';
    if (remoteUrl?.includes('github')) return 'github';
    return 'local';
  }
}
