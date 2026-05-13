export interface IdeNotificationPort {
  info(message: string): Promise<void>;
  warning(message: string): Promise<void>;
  error(message: string): Promise<void>;
}
