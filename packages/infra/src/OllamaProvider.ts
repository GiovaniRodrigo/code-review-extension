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

    const code =
      input.code.length > 12000
        ? input.code.slice(0, 12000)
        : input.code;
    const prompt = `
You are a senior software engineer performing CODE REVIEW.

You MUST analyze the code and return ONLY valid JSON.

Do NOT summarize what the code does.
Do NOT return success messages.
Do NOT return {"error": false}.
Do NOT say the services were registered successfully.

Rules:
- No markdown
- No explanation outside JSON
- No comments
- No trailing commas
- Use double quotes in all properties
- Output must start with {
- Output must end with }

Required schema:
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
- info
- warning
- critical

Review checklist:
- duplicated bindings
- duplicated service registrations
- unused imports
- excessive responsibility in one class
- unsafe global configuration
- misleading feature flags
- inconsistent dependency injection patterns
- hardcoded environment behavior
- maintainability issues

Important:
If the code has duplicated bindings or duplicated service registrations, findings MUST NOT be empty.

Code:
${code}
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
              temperature: 0,
              num_ctx: 8192
            }
          },
          {
            signal: (input as any).signal
          }
        );

      console.log(
        '[OLLAMA RAW RESPONSE]',
        JSON.stringify(response.data, null, 2)
      );

      const content =
        response.data?.response;

      if (typeof content !== 'string') {
        throw new Error('Invalid Ollama response');
      }

      console.log('[OLLAMA CONTENT]', content);

      const jsonContent =
        this.extractJson(content);

      let parsed: any;

      try {
        parsed =
          JSON.parse(jsonContent);
      } catch {
        return {
          findings: [
            {
              line: 1,
              severity: 'warning',
              message: content.slice(0, 500),
              suggestedFix:
                'A IA local retornou JSON inválido.'
            }
          ],
          confidenceScore: 0
        };
      }

      if (!Array.isArray(parsed.findings)) {
        return {
          findings: [
            {
              line: 1,
              severity: 'warning',
              message: content.slice(0, 500),
              suggestedFix:
                'A IA retornou JSON válido, mas fora do schema esperado para code review.'
            }
          ],
          confidenceScore: 0
        };
      }

      return {
        findings: parsed.findings,

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