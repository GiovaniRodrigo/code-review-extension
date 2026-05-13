import * as vscode from 'vscode';

import { FileReviewRepository }
  from '@code-review/infra';

import { VSCodeAdapter }
  from '../adapters/VSCodeAdapter';

import { ReviewViewProvider }
  from '../views/ReviewViewProvider';

export async function restoreCurrentBranchSession(
  adapter: VSCodeAdapter,
  repository: FileReviewRepository,
  provider: ReviewViewProvider
): Promise<void> {

  try {

    const branch =
      await adapter.getActiveBranch();

    const session =
      await repository.getSessionByBranch(
        branch
      );

    if (session) {

      provider.updateFindings(
        session.id,
        session.findings
      );

      return;
    }

    provider.clear(
      `No review session found for branch ${branch}.`
    );

  } catch (error: any) {

    const message =
      `Could not restore review session: ${error.message}`;

    provider.setError(message);

    vscode.window.showWarningMessage(
      message
    );
  }
}