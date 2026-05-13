import { promises as fs } from 'node:fs';

export class MarkdownLoader {
  async load(paths: string[]): Promise<Array<{ path: string; content: string }>> {
    return Promise.all(paths.map(async path => ({
      path,
      content: await fs.readFile(path, 'utf8')
    })));
  }
}
