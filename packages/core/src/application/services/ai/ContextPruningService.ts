import { AstBuildResult, AstNodeSummary } from '../../../AstBuilder';
import { flattenAstNodes } from '../../../shared/astUtils';

export interface PruningInput {
    ast: AstBuildResult;
    targetLines: number[];
    maxLines?: number;
}

export class ContextPruningService {
  constructor(private readonly maxLinesLimit = 300) {}

  prune(input: PruningInput): string {
    const { ast, targetLines, maxLines = this.maxLinesLimit } = input;
    const lines = ast.code.split('\n');

    if (lines.length <= maxLines) {
        return ast.code;
    }

    const allNodes = flattenAstNodes(ast.root);
    const relevantNodes = new Set<AstNodeSummary>();

    // 1. Identify nodes containing target lines
    targetLines.forEach(line => {
        const node = allNodes.find(n => line >= n.startLine && line <= n.endLine && n.kind !== 'sourceFile');
        if (node) {
            relevantNodes.add(node);
            this._addParents(node, allNodes, relevantNodes);
        }
    });

    // 2. Identify "Structural" nodes (imports, exports, etc) for context
    allNodes
        .filter(n => ['import', 'interface'].includes(n.kind))
        .forEach(n => relevantNodes.add(n));

    // 3. Assemble the pruned code
    const sortedNodes = Array.from(relevantNodes).sort((a, b) => a.startLine - b.startLine);
    let prunedCode = `// [PRUNED CONTEXT] Only showing relevant sections for lines: ${targetLines.join(', ')}\n\n`;
    
    let lastLine = 0;
    sortedNodes.forEach(node => {
        if (node.startLine > lastLine + 1) {
            prunedCode += `\n// ... lines ${lastLine + 1}-${node.startLine - 1} hidden ...\n\n`;
        }
        
        prunedCode += lines.slice(node.startLine - 1, node.endLine).join('\n') + '\n';
        lastLine = node.endLine;
    });

    if (lastLine < lines.length) {
        prunedCode += `\n// ... rest of file hidden ...\n`;
    }

    return prunedCode;
  }

  private _addParents(node: AstNodeSummary, allNodes: AstNodeSummary[], set: Set<AstNodeSummary>) {
      // Very simple parent detection based on line ranges
      allNodes.forEach(potentialParent => {
          if (
              potentialParent !== node &&
              node.startLine >= potentialParent.startLine &&
              node.endLine <= potentialParent.endLine &&
              ['class'].includes(potentialParent.kind)
          ) {
              set.add(potentialParent);
          }
      });
  }
}
