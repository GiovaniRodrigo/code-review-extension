export interface SelectAIProviderRequest {
  providerId: string;
}

export class SelectAIProviderUseCase {
  async execute(request: SelectAIProviderRequest, saveSettings: (providerId: string) => Promise<void>): Promise<void> {
    await saveSettings(request.providerId);
  }
}
