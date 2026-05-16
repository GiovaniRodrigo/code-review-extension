import { AstNodeSummary, AstMetrics } from './AstBuilder';

export interface AstParser {
    supports(language: string): boolean;
    parse(filePath: string, code: string): Promise<{ root: AstNodeSummary, metrics: AstMetrics }>;
}
