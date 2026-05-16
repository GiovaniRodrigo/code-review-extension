import { AstParser } from '../ports/ast/AstParser';
import { AstNodeSummary, AstMetrics } from '../shared/astTypes';

export class PythonAstParser implements AstParser {
    supports(language: string): boolean {
        return ['python', 'py'].includes(language.toLowerCase());
    }

    async parse(filePath: string, code: string): Promise<{ root: AstNodeSummary, metrics: AstMetrics }> {
        const lines = code.split('\n');
        const root: AstNodeSummary = {
            kind: 'sourceFile',
            name: filePath,
            startLine: 1,
            endLine: lines.length,
            children: []
        };

        const metrics: AstMetrics = {
            imports: 0, exports: 0, classes: 0, interfaces: 0,
            functions: 0, methods: 0, properties: 0, variables: 0,
            maxDepth: 1
        };

        // Simple Regex-based parser for Python (Phase 1)
        // In a real scenario, we'd use a real Python parser or WASM.
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            // Class detection
            const classMatch = line.match(/^class\s+([\w\d_]+)/);
            if (classMatch) {
                root.children.push({
                    kind: 'class',
                    name: classMatch[1],
                    startLine: lineNum,
                    endLine: this._findBlockEnd(lines, index),
                    children: []
                });
                metrics.classes++;
            }

            // Function detection
            const funcMatch = line.match(/^\s*def\s+([\w\d_]+)\(/);
            if (funcMatch) {
                const isMethod = line.startsWith(' ');
                root.children.push({
                    kind: isMethod ? 'method' : 'function',
                    name: funcMatch[1],
                    startLine: lineNum,
                    endLine: this._findBlockEnd(lines, index),
                    children: [],
                    metadata: { complexity: 1, cognitive: 1 } // Basic fallback
                });
                if (isMethod) metrics.methods++; else metrics.functions++;
            }

            // Import detection
            if (line.startsWith('import ') || line.startsWith('from ')) {
                metrics.imports++;
            }
        });

        return { root, metrics };
    }

    private _findBlockEnd(lines: string[], startIndex: number): number {
        const startIndent = this._getIndent(lines[startIndex]);
        for (let i = startIndex + 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const currentIndent = this._getIndent(lines[i]);
            if (currentIndent <= startIndent) return i;
        }
        return lines.length;
    }

    private _getIndent(line: string): number {
        return line.search(/\S/);
    }
}
