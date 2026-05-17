export class MockAIProvider {}
export class OllamaProvider {
  constructor(public readonly baseUrl: string, public readonly model: string) {}
}
export class OpenAIProvider {
  constructor(public readonly apiKey: string) {}
}
export class FileReviewRepository {
  getSessionByBranch = async (_branch: string) => undefined;
}
export class IDEAdapter {}
export type AIProvider = MockAIProvider | OllamaProvider | OpenAIProvider;
