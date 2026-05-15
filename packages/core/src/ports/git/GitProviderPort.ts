export interface PRComment {
  file: string;
  line: number;
  body: string;
}

export interface GitProviderPort {
  publishComments(
    owner: string,
    repo: string,
    prNumber: number,
    comments: PRComment[]
  ): Promise<void>;
}
