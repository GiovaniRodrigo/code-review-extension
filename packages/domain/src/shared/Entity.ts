export abstract class Entity<TId = string> {
  constructor(public readonly id: TId) {}
}
