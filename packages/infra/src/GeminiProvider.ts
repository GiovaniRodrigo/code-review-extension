import { 
  AIAnalysisRequestDTO, 
  AIAnalysisResponseDTO, 
  AIProviderPort, 
  HealthStatusDTO 
} from '@code-review/core';

import axios, {
  type AxiosInstance
} from 'axios';

export class GeminiProvider implements AIProviderPort {

  constructor(
    private readonly apiKey: string | (() => Promise<string>),
    private readonly model: string = 'gemini-flash-latest',
    private readonly httpClient: AxiosInstance = axios
  ) {}

  private getApiUrl(model: string): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  }

  async checkHealth(): Promise<HealthStatus> {
    try {
      const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
      if (!key) {
        return { status: 'unauthorized', message: 'Gemini API Key is missing' };
      }

      const response = await this.httpClient.get('https://generativelanguage.googleapis.com/v1beta/models', {
        params: { key },
        timeout: 5000
      });

      const models = response.data?.models || [];
      const modelExists = models.some((m: any) => m.name === `models/${this.model}` || m.name === this.model);

      if (!modelExists) {
        return { status: 'model_not_found', message: `Model ${this.model} not found in Gemini` };
      }

      return { status: 'available' };
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { status: 'unauthorized', message: 'Invalid Gemini API Key' };
      }
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return { status: 'timeout', message: 'Gemini health check timed out' };
      }
      return { status: 'unavailable', message: error.message };
    }
  }

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;

    if (!key) {
      throw new Error('Gemini API Key is missing. Please set it using the "Code Review: Set Gemini API Key" command.');
    }

    const prompt = `
You are a senior software engineer performing a Pull Request review.

Analyze the following git diff carefully.

Return ONLY valid JSON in this format:

{
  "findings": [
    {
      "file": "path/to/file.ts",
      "line": 10,
      "severity": "info|warning|error|critical",
      "category": "architecture|solid|security|code_smell|test|dependency|rag",
      "message": "Problem description",
      "suggestedFix": "Optional fix",
      "confidence": 0.9
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
        this.getApiUrl(this.model),
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key
          },
          signal: (input as any).signal
        }
      );

      if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
        throw new Error('Invalid response from Gemini API: No candidates returned.');
      }

      const contentText = response.data.candidates[0].content.parts[0].text;
      
      if (!contentText) {
          throw new Error('Empty response from Gemini API.');
      }

      const jsonContent = this.extractJson(contentText);
      const content = JSON.parse(jsonContent);

      const findings = (content.findings || []).map((f: any) => ({
        file: f.file || input.filePath,
        line: typeof f.line === 'number' ? f.line : 0,
        severity: ['info', 'warning', 'error', 'critical'].includes(f.severity) ? f.severity : 'info',
        category: [
          'architecture', 'solid', 'security', 'code_smell', 'test', 'dependency', 'rag'
        ].includes(f.category) ? f.category : 'code_smell',
        message: f.message || '',
        suggestedFix: f.suggestedFix,
        confidence: typeof f.confidence === 'number' ? f.confidence : 0.5
      }));

      return {
        findings,
        confidenceScore: typeof content.confidenceScore === 'number' ? content.confidenceScore : 0
      };
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      throw new Error(`Gemini Analysis failed: ${error.message}`);
    }
  }

  private extractJson(content: string): string {
    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1) {
      // If it doesn't look like JSON at all, maybe it's just the content
      return cleaned;
    }

    return cleaned.slice(start, end + 1);
  }
}
