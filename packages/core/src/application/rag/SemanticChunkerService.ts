import { AstBuilderPort } from '../../ports/ast/AstBuilderPort';
import { CodeChunk } from './CodeChunk';
import { randomUUID } from 'crypto';

export class SemanticChunkerService {
  constructor(private readonly astBuilder: AstBuilderPort) {}

  async chunk(filePath: string, code: string): Promise<CodeChunk[]> {
    if (filePath.toLowerCase().endsWith('.md')) {
      return this._chunkMarkdown(filePath, code);
    }

    const ast = await this.astBuilder.build({ filePath, code });
    const chunks: CodeChunk[] = [];

    // Chunks by top-level nodes (classes, functions, interfaces)
    for (const node of ast.root.children) {
      if (['class', 'function', 'interface'].includes(node.kind)) {
        chunks.push({
          id: randomUUID(),
          file: filePath,
          content: this._extractNodeContent(code, node.startLine, node.endLine),
          language: ast.language,
          startLine: node.startLine,
          endLine: node.endLine
        });
      }
    }

    return chunks;
  }

  private _extractNodeContent(code: string, startLine: number, endLine: number): string {
    const lines = code.split('\n');
    return lines.slice(startLine - 1, endLine).join('\n');
  }

  private _chunkMarkdown(filePath: string, content: string): CodeChunk[] {
    const chunks: CodeChunk[] = [];
    const lines = content.split('\n');
    let currentChunk: string[] = [];
    let startLine = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('#') && currentChunk.length > 0) {
        chunks.push({
          id: randomUUID(),
          file: filePath,
          content: currentChunk.join('\n'),
          language: 'markdown',
          startLine,
          endLine: i
        });
        currentChunk = [];
        startLine = i + 1;
      }
      currentChunk.push(line);
    }

    if (currentChunk.length > 0) {
      chunks.push({
        id: randomUUID(),
        file: filePath,
        content: currentChunk.join('\n'),
        language: 'markdown',
        startLine,
        endLine: lines.length
      });
    }

    return chunks;
  }
}
