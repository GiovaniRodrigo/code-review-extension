import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';

import axios, {
  type AxiosInstance
} from 'axios';

export class OpenAIProvider {
  constructor(
    private readonly apiKey: string,
    private readonly httpClient: AxiosInstance = axios
  ) { }

  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
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
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
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
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }
}
