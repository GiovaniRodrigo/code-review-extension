export interface ICommandHandler {
  execute(): Promise<void>;
}