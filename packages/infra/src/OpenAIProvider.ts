import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';

import axios, {
  type AxiosInstance
} from 'axios';

export class OpenAIProvider implements AIProvider {
  constructor(
    private readonly apiKey: string | (() => Promise<string>),
    private readonly httpClient: AxiosInstance = axios
  ) { }

  private apiUrl = 'https://api.openai.com/v1/chat/completions';

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
          model: (input as any).model || 'gpt-4o-mini',
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

      return {
        findings: content.findings || [],
        confidenceScore: content.confidenceScore || 0
      };
    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }
}
