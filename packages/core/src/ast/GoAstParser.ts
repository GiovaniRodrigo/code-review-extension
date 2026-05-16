import { AstParser } from '../../ports/ast/AstParser';
import { AstNodeSummary, AstMetrics } from './AstBuilder';

export class GoAstParser implements AstParser {
    supports(language: string): boolean {
        return ['go'].includes(language.toLowerCase());
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

        // Go Structural Parser
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const trimmed = line.trim();

            // 1. Package detection
            if (trimmed.startsWith('package ')) {
                // Not a metrics item but good to have in children if needed
            }

            // 2. Import detection
            if (trimmed.startsWith('import "') || trimmed.startsWith('import (')) {
                metrics.imports++;
            }

            // 3. Interface detection: type Name interface {
            const interfaceMatch = trimmed.match(/^type\s+([\w\d_]+)\s+interface\s*{/);
            if (interfaceMatch) {
                root.children.push({
                    kind: 'interface',
                    name: interfaceMatch[1],
                    startLine: lineNum,
                    endLine: this._findClosingBrace(lines, index),
                    children: []
                });
                metrics.interfaces++;
            }

            // 4. Struct detection: type Name struct {
            const structMatch = trimmed.match(/^type\s+([\w\d_]+)\s+struct\s*{/);
            if (structMatch) {
                root.children.push({
                    kind: 'class', // We map Struct to Class for consistent UI/Metrics
                    name: structMatch[1],
                    startLine: lineNum,
                    endLine: this._findClosingBrace(lines, index),
                    children: []
                });
                metrics.classes++;
            }

            // 5. Method detection: func (r *Receiver) Name(...) ... {
            const methodMatch = trimmed.match(/^func\s+\(([^)]+)\)\s+([\w\d_]+)\(/);
            if (methodMatch) {
                root.children.push({
                    kind: 'method',
                    name: methodMatch[2],
                    startLine: lineNum,
                    endLine: this._findClosingBrace(lines, index),
                    children: [],
                    metadata: { receiver: methodMatch[1], complexity: 1, cognitive: 1 }
                });
                metrics.methods++;
            }

            // 6. Function detection: func Name(...) ... {
            const funcMatch = trimmed.match(/^func\s+([\w\d_]+)\(/);
            if (funcMatch && !trimmed.startsWith('func (')) { 
                root.children.push({
                    kind: 'function',
                    name: funcMatch[1],
                    startLine: lineNum,
                    endLine: this._findClosingBrace(lines, index),
                    children: [],
                    metadata: { complexity: 1, cognitive: 1 }
                });
                metrics.functions++;
            }
        });

        return { root, metrics };
    }

    private _findClosingBrace(lines: string[], startIndex: number): number {
        let openBraces = 0;
        let started = false;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            for (const char of line) {
                if (char === '{') {
                    openBraces++;
                    started = true;
                } else if (char === '}') {
                    openBraces--;
                }
            }
            if (started && openBraces === 0) return i + 1;
        }
        return lines.length;
    }
}
