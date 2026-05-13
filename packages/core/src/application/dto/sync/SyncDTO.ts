export interface RepositorySyncInputDTO {
  provider: string;
  repositoryUrl?: string;
  pullRequestNumber?: number | string;
}

export interface RepositorySyncResultDTO {
  provider: string;
  remoteUrl?: string;
  reference?: string;
  title?: string;
}
