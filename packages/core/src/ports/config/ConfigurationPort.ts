export interface ConfigurationPort {
  get<T>(key: string, defaultValue?: T): T;
  update<T>(key: string, value: T): Promise<void>;
}
