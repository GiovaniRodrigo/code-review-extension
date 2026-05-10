import { RegexSourceAstBuilder } from './ast/regexSourceAstBuilder';
import { SourceAst, SourceAstBuilder, countAstNodes, findAstNodes, getImportSources } from './ast/sourceAst';
import { ValidationSeverity } from './types';

export type ArchitectureRuleCategory = 'SOLID' | 'Clean Architecture' | 'DDD';

export interface SourceFile {
  path: string;
  content: string;
}

export interface ArchitectureRuleFinding {
  rule: string;
  category: ArchitectureRuleCategory;
  severity: ValidationSeverity;
  description: string;
  file: string;
  line: number;
}

export interface ArchitectureAnalyzerOptions {
  astBuilder?: SourceAstBuilder;
}

export function analyzeArchitectureRules(files: SourceFile[], options: ArchitectureAnalyzerOptions = {}): ArchitectureRuleFinding[] {
  const astBuilder = options.astBuilder ?? new RegexSourceAstBuilder();
  const astFiles = files.map((file) => astBuilder.build(file));
  const findings = astFiles.flatMap((file) => [
    ...solidRules(file),
    ...cleanArchitectureRules(file),
    ...dddRules(file)
  ]);

  return [...findings, ...detectCircularDependencies(astFiles)];
}

function solidRules(file: SourceAst): ArchitectureRuleFinding[] {
  const findings: ArchitectureRuleFinding[] = [];
  const methodCount = countAstNodes(file, 'MethodDeclaration');
  const imports = getImportSources(file);

  if (methodCount > 12) {
    findings.push(finding(file, 'SRP', 'SOLID', 'HIGH', 'Arquivo concentra muitas responsabilidades pelo volume de metodos.', 1));
  }

  const conditionalByType = findAstNodes(file, (node) =>
    node.kind === 'ConditionalStatement' && /\b(type|kind|status|role)\b/i.test(node.value ?? '')
  );
  if (conditionalByType.length > 4) {
    findings.push(finding(file, 'OCP', 'SOLID', 'MEDIUM', 'Fluxo condicional por tipo/status sugere extensao por modificacao.', conditionalByType[0].line));
  }

  const extendsClass = findAstNodes(file, (node) => node.kind === 'ClassDeclaration' && Boolean(node.metadata?.extends));
  const unsupportedThrow = findAstNodes(file, (node) =>
    node.kind === 'ThrowStatement' && /not implemented|unsupported|nao suportado/i.test(node.value ?? '')
  );
  if (extendsClass.length > 0 && unsupportedThrow.length > 0) {
    findings.push(finding(file, 'LSP', 'SOLID', 'HIGH', 'Subclasse parece invalidar comportamento esperado com erro de nao suporte.', unsupportedThrow[0].line));
  }

  const hasInterface = countAstNodes(file, 'InterfaceDeclaration') > 0;
  if (hasInterface && methodCount > 8) {
    const interfaceLine = findAstNodes(file, (node) => node.kind === 'InterfaceDeclaration')[0]?.line ?? 1;
    findings.push(finding(file, 'ISP', 'SOLID', 'MEDIUM', 'Interface grande pode obrigar consumidores a depender de metodos desnecessarios.', interfaceLine));
  }

  if (
    /src\/(domain|application)\//.test(normalizePath(file.path))
    && imports.some((item) => /infrastructure|presentation|vscode|react/.test(item))
  ) {
    findings.push(finding(file, 'DIP', 'SOLID', 'CRITICAL', 'Camada de dominio/aplicacao depende de detalhe externo ou framework.', firstImportLine(file)));
  }

  return findings;
}

function cleanArchitectureRules(file: SourceAst): ArchitectureRuleFinding[] {
  const findings: ArchitectureRuleFinding[] = [];
  const path = normalizePath(file.path);
  const imports = getImportSources(file);

  if (/src\/domain\//.test(path) && imports.some((item) => /application|infrastructure|presentation|telemetry|vscode|react/.test(item))) {
    findings.push(finding(file, 'Dependência incorreta', 'Clean Architecture', 'CRITICAL', 'Dominio deve permanecer independente das demais camadas.', firstImportLine(file)));
  }

  if (/src\/application\//.test(path) && imports.some((item) => /infrastructure|presentation|vscode|react/.test(item))) {
    findings.push(finding(file, 'Violação de camadas', 'Clean Architecture', 'HIGH', 'Aplicacao deve orquestrar contratos sem depender de infraestrutura ou UI.', firstImportLine(file)));
  }

  if (imports.length > 12) {
    findings.push(finding(file, 'Acoplamento excessivo', 'Clean Architecture', 'MEDIUM', 'Arquivo possui muitas dependencias diretas.', 1));
  }

  return findings;
}

function dddRules(file: SourceAst): ArchitectureRuleFinding[] {
  const findings: ArchitectureRuleFinding[] = [];
  const path = normalizePath(file.path);
  const declarations = findAstNodes(file, (node) => node.kind === 'ClassDeclaration' || node.kind === 'InterfaceDeclaration');
  const externalCalls = findAstNodes(file, (node) => node.kind === 'ExternalCall');

  if (/src\/domain\//.test(path) && /(user|order|payment|review|validation).*(user|order|payment|review|validation)/i.test(file.content)) {
    findings.push(finding(file, 'Bounded Context', 'DDD', 'MEDIUM', 'Arquivo de dominio mistura termos de contextos distintos.', 1));
  }

  const entity = declarations.find((node) => /Entity$/.test(node.name ?? ''));
  if (entity && !/\bid\b/.test(file.content)) {
    findings.push(finding(file, 'Entidades', 'DDD', 'HIGH', 'Entidade deve possuir identidade explicita.', entity.line));
  }

  const valueObject = declarations.find((node) => /ValueObject$/.test(node.name ?? ''));
  const mutator = findAstNodes(file, (node) => node.kind === 'MethodDeclaration' && /^(set|update|mutate)/.test(node.name ?? ''))[0];
  if (valueObject && mutator) {
    findings.push(finding(file, 'Value Objects', 'DDD', 'MEDIUM', 'Value Object deve preservar imutabilidade sem mutadores.', mutator.line));
  }

  if (/src\/domain\/.*service/i.test(path) && externalCalls.some((node) => /(vscode|fetch|axios)/.test(node.value ?? ''))) {
    findings.push(finding(file, 'Serviços de domínio', 'DDD', 'HIGH', 'Servico de dominio nao deve coordenar infraestrutura ou I/O externo.', externalCalls[0].line));
  }

  return findings;
}

function detectCircularDependencies(files: SourceAst[]): ArchitectureRuleFinding[] {
  const byPath = new Map(files.map((file) => [normalizePath(file.path), file]));
  const findings: ArchitectureRuleFinding[] = [];

  files.forEach((file) => {
    const filePath = normalizePath(file.path);
    const imports = getImportSources(file).map((item) => resolveImportPath(filePath, item));

    imports.forEach((importPath) => {
      const imported = byPath.get(importPath);
      if (!imported) return;

      const reverseImports = getImportSources(imported).map((item) => resolveImportPath(importPath, item));
      if (reverseImports.includes(filePath) && filePath < importPath) {
        findings.push(finding(file, 'Dependência circular', 'Clean Architecture', 'HIGH', `Dependencia circular entre ${filePath} e ${importPath}.`, firstImportLine(file)));
      }
    });
  });

  return findings;
}

function finding(
  file: SourceAst,
  rule: string,
  category: ArchitectureRuleCategory,
  severity: ArchitectureRuleFinding['severity'],
  description: string,
  line: number
): ArchitectureRuleFinding {
  return { rule, category, severity, description, file: file.path, line };
}

function firstImportLine(file: SourceAst): number {
  return findAstNodes(file, (node) => node.kind === 'ImportDeclaration')[0]?.line ?? 1;
}

function resolveImportPath(fromPath: string, importPath: string): string {
  if (!importPath.startsWith('.')) return importPath;

  const parts = fromPath.split('/');
  parts.pop();

  importPath.split('/').forEach((part) => {
    if (part === '..') parts.pop();
    else if (part !== '.') parts.push(part);
  });

  const resolved = parts.join('/');
  return /\.(ts|tsx|js|jsx)$/.test(resolved) ? resolved : `${resolved}.ts`;
}

function normalizePath(path: string): string {
  return path.replaceAll('\\', '/');
}
