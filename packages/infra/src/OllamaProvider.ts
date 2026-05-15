import axios, {
  type AxiosInstance
} from 'axios';

import {
  AIAnalysisInput,
  AIAnalysisResult,
  AIProvider
} from './interfaces';

export class OllamaProvider implements AIProvider {

  constructor(
    public readonly baseUrl: string,
    public readonly model: string,
    private readonly httpClient: AxiosInstance = axios
  ) { }

  async analyzeCode(
    input: AIAnalysisInput
  ): Promise<AIAnalysisResult> {

    const prompt = `
You MUST return ONLY valid JSON.

Rules:
- No markdown
- No explanation
- No comments
- No trailing commas
- Use double quotes in all properties
- Output must start with {
- Output must end with }

Schema:
{
  "findings": [
    {
      "line": 1,
      "message": "string",
      "severity": "info",
      "suggestedFix": "string"
    }
  ],
  "confidenceScore": 0.85
}

Allowed severity values:
info, warning, critical

Code:
${input.code}
`;

    try {
      const response =
        await this.httpClient.post(
          `${this.baseUrl}/api/generate`,
          {
            model: this.model,
            prompt,
            stream: false,
            format: 'json',
            options: {
              temperature: 0
            }
          },
          {
            signal: (input as any).signal
          }
        );

      const content =
        response.data?.response;

      if (typeof content !== 'string') {
        throw new Error('Invalid Ollama response');
      }

      const jsonContent =
        this.extractJson(content);

      let parsed: any;

      try {
        parsed = JSON.parse(jsonContent);
      } catch {
        return {
          findings: [
            {
              line: 1,
              severity: 'warning',
              message: content.slice(0, 500),
              suggestedFix:
                'A IA local retornou JSON inválido. Revise o prompt ou use outro modelo.'
            }
          ],
          confidenceScore: 0
        };
      }

      return {
        findings:
          Array.isArray(parsed.findings)
            ? parsed.findings
            : [],

        confidenceScore:
          typeof parsed.confidenceScore === 'number'
            ? parsed.confidenceScore
            : 0
      };

    } catch (error: any) {
      throw new Error(
        `Local AI analysis failed: ${error.message}`
      );
    }
  }

  private extractJson(content: string): string {
    const cleaned =
      content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1) {
      throw new Error('JSON not found in AI response');
    }

    return cleaned.slice(start, end + 1);
  }
}