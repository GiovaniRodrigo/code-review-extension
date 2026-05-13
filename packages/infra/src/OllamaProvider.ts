import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';

export class OllamaProvider implements AIProvider {
  constructor(
    private baseUrl: string,
    private model: string,
    private httpClient: { post: (url: string, data: any) => Promise<any> }
  ) {}

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const prompt = `Review the following ${input.language || 'code'} from file ${input.filePath}.
Return only JSON with "findings" (file, line, message, severity, suggestedFix) and "confidenceScore".

Code:
${input.code}`;

    try {
      const response = await this.httpClient.post(
        `${this.baseUrl}/api/chat`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
          format: 'json'
        }
      );

      const content = JSON.parse(response.data.message.content);

      return {
        findings: content.findings || [],
        confidenceScore: content.confidenceScore || 0
      };
    } catch (error: any) {
      throw new Error(`Local AI analysis failed: ${error.message}`);
    }
  }
}
