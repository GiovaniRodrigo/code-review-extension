export interface IdeWebviewPort {
  postMessage(message: unknown): Promise<boolean>;
}
