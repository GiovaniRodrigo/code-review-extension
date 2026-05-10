import { SourceFile } from '../architectureRules';
import { AstNode, SourceAst, SourceAstBuilder, createAstNode } from './sourceAst';

interface DeclarationScope {
  node: AstNode;
  braceDepth: number;
}

interface SanitizedLine {
  content: string;
  inBlockComment: boolean;
  startedInBlockComment: boolean;
}

const IMPORT_PATTERN = /^\s*import\s+(?:[^'"`]+from\s+)?['"`]([^'"`]+)['"`]/;
const CLASS_PATTERN = /\b(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z_]\w*)(?:\s+extends\s+([A-Za-z_]\w*))?/g;
const INTERFACE_PATTERN = /\b(?:export\s+)?interface\s+([A-Za-z_]\w*)/g;
const METHOD_PATTERN = /\b(?:public\s+|private\s+|protected\s+|static\s+|async\s+|readonly\s+)*([A-Za-z_]\w*)\s*\([^)]*\)\s*(?::\s*[^={]+)?[{;]/g;
const CONDITIONAL_PATTERN = /\b(if|case|switch)\b[^\n]*/g;
const THROW_PATTERN = /throw\s+new\s+Error\s*\(([^)]*)\)/g;
const THROW_ARGUMENT_PATTERN = /throw\s+new\s+Error\s*\(([^)]*)\)/;
const EXTERNAL_CALL_PATTERN = /\b(fetch|axios|vscode)\b/g;

export class RegexSourceAstBuilder implements SourceAstBuilder {
  build(file: SourceFile): SourceAst {
    const root: SourceAst = {
      kind: 'SourceFile',
      path: file.path,
      content: file.content,
      line: 1,
      children: []
    };
    const scopes: DeclarationScope[] = [{ node: root, braceDepth: 0 }];
    let braceDepth = 0;
    let inBlockComment = false;

    file.content.split(/\r?\n/).forEach((rawLineContent, index) => {
      const line = index + 1;
      const sanitized = sanitizeLine(rawLineContent, inBlockComment);
      inBlockComment = sanitized.inBlockComment;
      const lineContent = sanitized.content;
      const importLineContent = stripLineComments(rawLineContent, sanitized.startedInBlockComment);
      const declarationParent = scopes.at(-1)?.node ?? root;

      this.addImportMatches(declarationParent, importLineContent, line);

      this.addMatches(declarationParent, lineContent, line, CLASS_PATTERN, (match) => {
        const node = createAstNode({
          kind: 'ClassDeclaration',
          name: match[1],
          line,
          metadata: { extends: match[2] ?? '' }
        });
        scopes.push({ node, braceDepth: braceDepth + countChar(lineContent, '{') - countChar(lineContent, '}') });
        return node;
      });

      this.addMatches(declarationParent, lineContent, line, INTERFACE_PATTERN, (match) => {
        const node = createAstNode({ kind: 'InterfaceDeclaration', name: match[1], line });
        scopes.push({ node, braceDepth: braceDepth + countChar(lineContent, '{') - countChar(lineContent, '}') });
        return node;
      });

      const activeScope = scopes.at(-1)?.node ?? declarationParent;
      this.addMethodMatches(activeScope, lineContent, line);

      this.addMatches(activeScope, lineContent, line, CONDITIONAL_PATTERN, (match) => createAstNode({
        kind: 'ConditionalStatement',
        value: match[0],
        line
      }));

      this.addMatches(activeScope, lineContent, line, THROW_PATTERN, (match) => createAstNode({
        kind: 'ThrowStatement',
        value: extractErrorArgument(rawLineContent, match[1]),
        line
      }));

      this.addMatches(activeScope, lineContent, line, EXTERNAL_CALL_PATTERN, (match) => createAstNode({
        kind: 'ExternalCall',
        value: match[1],
        line
      }));

      braceDepth += countChar(lineContent, '{') - countChar(lineContent, '}');
      while (scopes.length > 1 && braceDepth <= (scopes.at(-1)?.braceDepth ?? 0) - 1) {
        scopes.pop();
      }
    });

    return root;
  }

  private addImportMatches(parent: AstNode, content: string, line: number): void {
    content.split(';').forEach((statement) => {
      const match = statement.match(IMPORT_PATTERN);
      if (!match) return;

      parent.children.push(createAstNode({
        kind: 'ImportDeclaration',
        value: match[1],
        line
      }));
    });
  }

  private addMethodMatches(parent: AstNode, content: string, line: number): void {
    METHOD_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = METHOD_PATTERN.exec(content)) !== null) {
      const prefix = content.slice(0, match.index);
      if (/\b(return|new|throw)\s*$/.test(prefix) || /=>\s*$/.test(prefix)) continue;
      parent.children.push(createAstNode({ kind: 'MethodDeclaration', name: match[1], line }));
      if (match.index === METHOD_PATTERN.lastIndex) METHOD_PATTERN.lastIndex += 1;
    }
  }

  private addMatches(
    parent: AstNode,
    content: string,
    line: number,
    pattern: RegExp,
    factory: (match: RegExpExecArray) => AstNode
  ): void {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      parent.children.push(factory(match));
      if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
    }
  }
}

function sanitizeLine(value: string, initialBlockCommentState: boolean): SanitizedLine {
  let result = '';
  let inBlockComment = initialBlockCommentState;
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        result += '  ';
        index += 1;
      } else {
        result += ' ';
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      result += ' ';
      continue;
    }

    if (char === '/' && next === '/') {
      result += ' '.repeat(value.length - index);
      break;
    }

    if (char === '/' && next === '*') {
      inBlockComment = true;
      result += '  ';
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      result += char;
      continue;
    }

    result += char;
  }

  return { content: result, inBlockComment, startedInBlockComment: initialBlockCommentState };
}

function extractErrorArgument(rawLineContent: string, fallback: string): string {
  return rawLineContent.match(THROW_ARGUMENT_PATTERN)?.[1] ?? fallback;
}

function stripLineComments(value: string, isInsideBlockComment: boolean): string {
  if (isInsideBlockComment) return '';

  const lineCommentIndex = value.indexOf('//');
  const blockCommentIndex = value.indexOf('/*');
  const commentIndexes = [lineCommentIndex, blockCommentIndex].filter((index) => index >= 0);
  const commentStart = commentIndexes.length > 0 ? Math.min(...commentIndexes) : -1;

  return commentStart >= 0 ? value.slice(0, commentStart) : value;
}

function countChar(value: string, char: string): number {
  return value.split(char).length - 1;
}
