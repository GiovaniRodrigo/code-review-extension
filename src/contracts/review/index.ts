import { ReviewSession, ReviewComment, ValidationFinding } from '../../domain';

export type ReviewEdition = 'community' | 'premium';
export type PremiumPlanTier = 'starter' | 'team' | 'enterprise';

export interface ReviewContext {
  session: ReviewSession;
  diff?: string;
  changedFiles: string[];
  language?: string;
}

export interface SuggestedReviewComment {
  id: string;
  body: string;
  file: string;
  line: number;
  severity: ReviewComment['severity'];
  source: 'human' | 'ai' | 'automation';
  rationale: string;
  requiresHumanApproval: true;
}

export interface ReviewAnalysisResult {
  diagnostics: ValidationFinding[];
  suggestedComments: SuggestedReviewComment[];
  score: number;
  risks: string[];
}
