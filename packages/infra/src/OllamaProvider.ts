import axios, {
  type AxiosInstance
} from 'axios';

import {
  AIAnalysisInput,
  AIAnalysisResult,
  AIProvider
} from './interfaces';

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

      console.log(
        'OLLAMA FULL RESPONSE:',
        JSON.stringify(response.data, null, 2)
      );

      const content =
        response.data?.message?.content;

      console.log(
        'OLLAMA RAW CONTENT:',
        content
      );

      let parsed: any;

      try {
        const cleaned =
          content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        parsed =
          JSON.parse(cleaned);

      } catch {

        console.error(
          'INVALID OLLAMA JSON:',
          content
        );

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

      console.log(
        'OLLAMA PARSED:',
        JSON.stringify(parsed, null, 2)
      );

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
}