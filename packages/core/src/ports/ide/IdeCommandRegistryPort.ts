export interface IdeCommandRegistryPort {
  register(commandId: string, handler: (...args: unknown[]) => unknown): void;
}
