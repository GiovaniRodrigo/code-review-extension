
export class ContextReducer {
  reduce(code: string): string {
    const lines = code.split('\n');

    return lines
      .slice(0, 300)
      .join('\n');
  }
}
