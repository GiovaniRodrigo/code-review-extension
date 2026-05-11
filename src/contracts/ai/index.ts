import { ReviewContext, SuggestedReviewComment } from '../review';

export interface AIModelInfo {
  provider: string;
  model: string;
  local: boolean;
}

export interface AIProvider {
  readonly id: string;
  readonly label: string;
  getModelInfo(): Promise<AIModelInfo>;
  generateReviewComments(context: ReviewContext): Promise<SuggestedReviewComment[]>;
  summarizeReview(context: ReviewContext): Promise<string>;
}
