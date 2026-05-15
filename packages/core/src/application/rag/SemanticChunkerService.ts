import { AstBuilderPort } from '../../ports/ast/AstBuilderPort';
import { CodeChunk } from './CodeChunk';
import { randomUUID } from 'crypto';

export class SemanticChunkerService {
  constructor(private readonly astBuilder: AstBuilderPort) {}

  async chunk(filePath: string, code: string): Promise<CodeChunk[]> {
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
}
