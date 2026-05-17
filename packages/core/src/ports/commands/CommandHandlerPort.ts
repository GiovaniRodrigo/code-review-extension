export interface CommandHandlerPort {
  execute(...args: any[]): Promise<any>;
}
