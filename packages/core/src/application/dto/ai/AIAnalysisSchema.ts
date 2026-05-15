import { z } from 'zod';

export const AIAnalysisFindingSchema = z.object({
  file: z.string(),
  line: z.number().int().min(0),
  column: z.number().int().min(0).optional(),
  severity: z.enum(['info', 'warning', 'error', 'critical']),
  category: z.enum([
    'architecture',
    'solid',
    'security',
    'code_smell',
    'test',
    'dependency',
    'rag'
  ]),
  message: z.string().min(1).max(1000),
  suggestedFix: z.string().optional(),
  confidence: z.number().min(0).max(1)
});

export const AIAnalysisResponseSchema = z.object({
  findings: z.array(AIAnalysisFindingSchema),
  confidenceScore: z.number().min(0).max(1).optional().default(0)
});
