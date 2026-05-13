export abstract class ValueObject<TProps extends Record<string, unknown>> {
  constructor(protected readonly props: TProps) {}

  equals(other: ValueObject<TProps>): boolean {
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
