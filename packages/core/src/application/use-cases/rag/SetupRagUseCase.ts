export class SetupRagUseCase {
  async execute(): Promise<{ enabled: boolean }> {
    return { enabled: true };
  }
}
