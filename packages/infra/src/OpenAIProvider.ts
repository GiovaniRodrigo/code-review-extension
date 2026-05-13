import { AIAnalysisInput, AIAnalysisResult, AIProvider } from './interfaces';

export class OpenAIProvider implements AIProvider {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private apiKey: string,
    private httpClient: { post: (url: string, data: any, config: any) => Promise<any> }
  ) {}

  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    const prompt = `Review the following ${input.language || 'code'} from file ${input.filePath}. 
    Return a JSON object with a list of "findings" (line, message, severity, suggestedFix) and a "confidenceScore" (0-1).
    Code:
    ${input.code}`;

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
          }
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
