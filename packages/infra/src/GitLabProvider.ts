import axios, { AxiosInstance } from 'axios';
import { GitProvider, PRComment } from './interfaces';

export interface GitLabAuthConfig {
  baseUrl: string;
  token?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export class GitLabProvider implements GitProvider {
  constructor(
    private config: GitLabAuthConfig,
    private readonly httpClient: AxiosInstance = axios
  ) { }

  async publishComments(owner: string, repo: string, prNumber: number, comments: PRComment[]): Promise<void> {
    const projectId = owner === 'project' ? repo : encodeURIComponent(`${owner}/${repo}`);
    console.log(`[GitLab] Publishing ${comments.length} comments to MR !${prNumber} on project ${projectId}`);

    const mrDetails = await this._getMergeRequestDetails(projectId, prNumber);
    const diffRefs = mrDetails?.diff_refs;

    for (const comment of comments) {
      await this._postComment(projectId, prNumber, comment, diffRefs);
    }
  }

  private async _getMergeRequestDetails(projectId: string, mrIid: number): Promise<any> {
    const url = `${this.config.baseUrl}/api/v4/projects/${projectId}/merge_requests/${mrIid}`;
    const headers = this._getHeaders();

    try {
      const response = await this.httpClient.get(url, { headers });
      return response.data;
    } catch (error: any) {
      console.warn(`[GitLab] Failed to fetch MR details: ${error.message}. Falling back to simple comments.`);
      return null;
    }
  }

  private async _postComment(projectId: string, mrIid: number, comment: PRComment, diffRefs?: any): Promise<void> {
    const url = `${this.config.baseUrl}/api/v4/projects/${projectId}/merge_requests/${mrIid}/discussions`;
    const headers = this._getHeaders();

    const body: any = {
      body: comment.body
    };

    if (diffRefs) {
      body.position = {
        base_sha: diffRefs.base_sha,
        head_sha: diffRefs.head_sha,
        start_sha: diffRefs.start_sha,
        new_line: comment.line,
        new_path: comment.file,
        position_type: 'text'
      };
    }

    try {
      await this.httpClient.post(url, body, { headers });
    } catch (error: any) {
      throw new Error(`[GitLab] Failed to publish comment: ${error.message}`);
    }
  }

  private _getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.token) {
      headers['PRIVATE-TOKEN'] = this.config.token;
    } else if (this.config.credentials) {
      const auth = Buffer.from(`${this.config.credentials.username}:${this.config.credentials.password}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }
}
