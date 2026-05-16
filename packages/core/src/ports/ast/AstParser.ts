import { AstNodeSummary, AstMetrics } from '../../shared/astTypes';


export interface AstParser {
    supports(language: string): boolean;
    parse(filePath: string, code: string): Promise<{ root: AstNodeSummary, metrics: AstMetrics }>;
}
