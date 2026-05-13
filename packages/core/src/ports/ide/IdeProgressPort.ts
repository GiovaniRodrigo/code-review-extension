export interface IdeProgressPort {
  run<T>(title: string, task: () => Promise<T>): Promise<T>;
}
