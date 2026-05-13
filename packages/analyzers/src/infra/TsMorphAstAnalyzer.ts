import { Project } from 'ts-morph';
import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';

export class TsMorphAstAnalyzer implements AnalyzerPort {
  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    const project = new Project({ skipAddingFilesFromTsConfig: true });
    project.addSourceFilesAtPaths(paths);

    return project.getSourceFiles().flatMap(sourceFile =>
      sourceFile.getClasses().map(classDeclaration => ({
        file: sourceFile.getFilePath(),
        rule: 'ast.class-detected',
        message: `Class detected: ${classDeclaration.getName() ?? 'anonymous'}`,
        severity: 'info' as const
      }))
    );
  }
}
