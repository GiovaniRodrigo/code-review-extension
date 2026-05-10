import { GitContext } from '../domain';

export function buildReviewSessionKey(git: Partial<GitContext>): string {
  const pr = git.pullRequestId?.trim();
  if (pr) return `pr:${pr}:${git.baseBranch ?? ''}`.toLowerCase();
  return `branch:${git.currentBranch ?? ''}:${git.baseBranch ?? ''}`.toLowerCase();
}
