import { AIAnalysisInput, AIAnalysisResult, AIProvider, HealthStatus } from './interfaces';

import axios, {
  type AxiosInstance
} from 'axios';

export class OpenAIProvider implements AIProvider {
  constructor(
    private readonly apiKey: string | (() => Promise<string>),
    private readonly model: string = 'gpt-4o-mini',
    private readonly httpClient: AxiosInstance = axios
  ) { }

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private modelsUrl = 'https://api.openai.com/v1/models';

  async checkHealth(): Promise<HealthStatus> {
    try {
      const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
      if (!key) {
        return { status: 'unauthorized', message: 'OpenAI API Key is missing' };
      }

      const response = await this.httpClient.get(this.modelsUrl, {
        headers: { 'Authorization': `Bearer ${key}` },
        timeout: 5000
      });

      const models = response.data?.data || [];
      const modelExists = models.some((m: any) => m.id === this.model);

      if (!modelExists) {
        return { status: 'model_not_found', message: `Model ${this.model} not found in OpenAI` };
      }

      return { status: 'available' };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { status: 'unauthorized', message: 'Invalid OpenAI API Key' };
      }
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return { status: 'timeout', message: 'OpenAI health check timed out' };
      }
      return { status: 'unavailable', message: error.message };
    }
  }

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
    
    if (!key) {
        throw new Error('OpenAI API Key is missing. Please set it using the "Code Review: Set OpenAI API Key" command.');
    }

    const prompt = `
You are a senior software engineer performing a Pull Request review.

Analyze the following git diff carefully.

Return ONLY valid JSON in this format:

{
  "findings": [
    {
      "id": "unique-id",
      "line": 10,
      "message": "Problem description",
      "severity": "info|warning|error",
      "suggestedFix": "Optional fix",
      "file": "path/to/file.ts"
    }
  ],
  "confidenceScore": 0.0
}

Rules:
- Return findings only for real problems.
- Focus on:
  - bugs
  - security
  - architecture
  - performance
  - null safety
  - async issues
  - bad practices
  - clean code violations
- Ignore formatting issues.
- If no problems exist, return empty findings.

Git diff:
${input.code}
`;

    try {
      const response = await this.httpClient.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          signal: (input as any).signal
        }
      );

      const content = JSON.parse(response.data.choices[0].message.content);

      const findings = (content.findings || []).map((f: any) => ({
        file: f.file || input.filePath,
        line: typeof f.line === 'number' ? f.line : 1,
        severity: ['info', 'warning', 'error', 'critical'].includes(f.severity) ? f.severity : 'info',
        category: [
          'architecture', 'solid', 'security', 'code_smell', 'test', 'dependency', 'rag'
        ].includes(f.category) ? f.category : 'code_smell',
        message: f.message || '',
        suggestedFix: f.suggestedFix,
        confidence: typeof f.confidence === 'number' ? f.confidence : 0.8
      }));

      return {
        findings,
        confidenceScore: content.confidenceScore || 0
      };
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }
}
