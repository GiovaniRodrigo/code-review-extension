import { ReviewSession } from '@code-review/domain';
import { VpsSyncPort } from '@code-review/core';
import axios, { AxiosInstance } from 'axios';

export class VpsClient implements VpsSyncPort {
  private readonly httpClient: AxiosInstance;

  constructor(public readonly baseUrl: string, private token?: string) {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      timeout: 10000
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  async authenticate(credentials: any): Promise<void> {
    const response = await this.httpClient.post('/auth/login', credentials);
    this.token = response.data.token;
  }

  async pushSession(session: ReviewSession): Promise<void> {
    await this.httpClient.post('/sessions', session, {
      headers: this._headers()
    });
  }

  async pullSession(branch: string): Promise<ReviewSession | null> {
    try {
      const response = await this.httpClient.get(`/sessions/branch/${encodeURIComponent(branch)}`, {
        headers: this._headers()
      });
      return response.data;
    } catch (e: any) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.httpClient.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  private _headers() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }
}
