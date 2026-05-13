import axios, {
  type AxiosInstance
} from 'axios';

import {
  AIAnalysisInput,
  AIAnalysisResult,
  AIProvider
} from './interfaces';
import { match } from 'node:assert';

export class OllamaProvider
  implements AIProvider {

  constructor(
    public readonly baseUrl: string,
    public readonly model: string,
    private readonly httpClient: AxiosInstance = axios
  ) { }

  async analyzeCode(
    input: AIAnalysisInput
  ): Promise<AIAnalysisResult> {

    const prompt = `
You are a strict JSON API.

Analyze the following code diff.

Return ONLY valid JSON.

DO NOT explain.
DO NOT use markdown.
DO NOT use \`\`\`.
DO NOT write comments.

Valid format:

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

Code diff:
${input.code}
`;

    try {

      const response =
        await this.httpClient.post(
          `${this.baseUrl}/api/chat`,
          {
            model: this.model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            stream: false
          }
        );

      const content =
        response.data?.message?.content;

      let parsed: any;

      if (typeof content !== 'string') {
        try {
          const cleaned =
            content
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();

          parsed =
            JSON.parse(cleaned);

        } catch {
          return {
            findings: [
              {
                line: 1,
                severity: 'warning',
                message:
                  'AI returned invalid JSON response.',
                suggestedFix:
                  'Adjust Ollama prompt formatting.'
              }
            ],
            confidenceScore: 0
          };
        }
      } else {
        parsed = content;
      }

      let parseToResponse;
      if (typeof parsed === 'string') {
        parseToResponse = parsed.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      }
      if (Array.isArray(parsed.findings)) {
        parseToResponse = parsed.findings;
      }


      return {
        findings:
          parseToResponse,

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
}