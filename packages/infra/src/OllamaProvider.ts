import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';
import axios, { type AxiosInstance } from "axios";

export class OllamaProvider {
  constructor(
    public readonly baseUrl: string,
    public readonly model: string,
    private readonly httpClient: AxiosInstance = axios
  ) { }


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
