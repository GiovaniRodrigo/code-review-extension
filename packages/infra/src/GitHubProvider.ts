import axios, { type AxiosInstance } from 'axios';
import { GitProviderPort, PRComment } from '@code-review/core';

export class GitHubProvider implements GitProviderPort {

  constructor(
    private token: string,
    private readonly httpClient: AxiosInstance = axios
  ) { }

  async publishComments(owner: string, repo: string, prNumber: number, comments: PRComment[]): Promise<void> {
    console.log(`[GitHub] Publishing ${comments.length} comments to GitHub PR #${prNumber} on ${owner}/${repo}`);

    const prDetails = await this._getPullRequestDetails(owner, repo, prNumber);
    const headSha = prDetails?.head?.sha;

    for (const comment of comments) {
      await this._postComment(owner, repo, prNumber, comment, headSha);
    }
  }

  private async _getPullRequestDetails(owner: string, repo: string, prNumber: number): Promise<any> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
    const headers = this._getHeaders();

    try {
      const response = await this.httpClient.get(url, { headers });
      return response.data;
    } catch (error: any) {
      console.warn(`[GitHub] Failed to fetch PR details: ${error.message}. Falling back to simple comments.`);
      return null;
    }
  }

  private async _postComment(owner: string, repo: string, prNumber: number, comment: PRComment, headSha?: string): Promise<void> {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/comments`;
    const headers = this._getHeaders();

    const body: any = {
      body: comment.body
    };

    if (headSha) {
      body.commit_id = headSha;
      body.path = comment.file;
      body.line = comment.line;
      body.side = 'RIGHT';
    }

    try {
      await this.httpClient.post(url, body, { headers });
    } catch (error: any) {
      throw new Error(`[GitHub] Failed to publish comment: ${error.message}`);
    }
  }

  private _getHeaders(): Record<string, string> {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }
}
