import { 
  AIAnalysisRequestDTO, 
  AIAnalysisResponseDTO, 
  AIProviderPort, 
  HealthStatusDTO,
  AIChatRequestDTO,
  AIChatResponseDTO
} from '@code-review/core';
import axios, { AxiosInstance } from 'axios';

export class ClaudeProvider implements AIProviderPort {
  private readonly apiUrl = 'https://api.anthropic.com/v1/messages';

  constructor(
    private readonly apiKey: string | (() => Promise<string>),
    private readonly model: string = 'claude-3-5-sonnet-20240620',
    private readonly httpClient: AxiosInstance = axios
  ) {}

  async checkHealth(): Promise<HealthStatusDTO> {
    const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
    if (!key) {
        return { status: 'unauthorized', message: 'Claude API Key is missing' };
    }
    // We don't have a simple health endpoint for Anthropic without a real request,
    // so we return available if the key is present for now, or unavailable if we want to be safe.
    return { status: 'available' };
  }

  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
    if (!key) throw new Error('Claude API Key is missing.');

    const prompt = `Analyze this code and return JSON with findings: ${input.code}`;

    try {
        const response = await this.httpClient.post(this.apiUrl, {
            model: this.model,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
            system: "You are a code review assistant. Output ONLY valid JSON."
        }, {
            headers: {
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            signal: input.signal
        });

        const content = response.data.content[0].text;
        const parsed = JSON.parse(content);

        return {
            findings: parsed.findings || [],
            confidenceScore: parsed.confidenceScore || 0.8
        };
    } catch (error: any) {
        throw new Error(`Claude Analysis failed: ${error.message}`);
    }
  }

  async chat(input: AIChatRequestDTO): Promise<AIChatResponseDTO> {
    const key = typeof this.apiKey === 'function' ? await this.apiKey() : this.apiKey;
    if (!key) throw new Error('Claude API Key is missing.');

    try {
        const systemMessage = input.messages.find(m => m.role === 'system');
        const userMessages = input.messages.filter(m => m.role !== 'system');

        const response = await this.httpClient.post(this.apiUrl, {
            model: input.model || this.model,
            max_tokens: 4096,
            system: systemMessage?.content,
            messages: userMessages.map(m => ({ role: m.role, content: m.content }))
        }, {
            headers: {
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            signal: input.signal
        });

        return {
            answer: response.data.content[0].text,
            usage: {
                promptTokens: response.data.usage?.input_tokens || 0,
                completionTokens: response.data.usage?.output_tokens || 0,
                totalTokens: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0)
            }
        };
    } catch (error: any) {
        if (error.name === 'AbortError') throw error;
        throw new Error(`Claude Chat failed: ${error.message}`);
    }
  }
}
