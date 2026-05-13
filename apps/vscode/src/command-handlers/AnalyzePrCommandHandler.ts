import * as vscode from 'vscode';

import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { AIReviewService } from '../services/AIReviewService';
import { GitHubCliHelper } from '../helpers/GitHubCliHelper';
import { PullRequestProviderFactory } from '../providers/PullRequestProviderFactory';

import {
  PullRequestInfo,
  PullRequestProvider,
  PullRequestProviderType
} from '../providers/PullRequestProviderType';

type ProviderOption = {
  label: string;
  value: PullRequestProviderType;
};

export class AnalyzePrCommandHandler implements ICommandHandler {
  private readonly aiReviewService = new AIReviewService();

  constructor(
    private readonly dependencies: IExtensionDependencies
  ) { }

  async execute(): Promise<void> {
    const { reviewViewProvider } = this.dependencies;

    try {
      const providerType = await this.selectProviderType();

      if (!providerType) {
        return;
      }

      await this.validateProvider(providerType);

      reviewViewProvider.setLoading('Loading Pull Requests...');

      const provider =
        PullRequestProviderFactory.create(
          providerType,
          this.dependencies
        );

      if (provider.configure) {
        await provider.configure();
      }

      if (provider.validate) {
        await provider.validate();
      }

      const pr = await this.selectPullRequest(provider);

      if (!pr) {
        return;
      }

      await this.analyzePullRequest(provider, pr);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private async selectProviderType(): Promise<PullRequestProviderType | undefined> {
    const selected = await vscode.window.showQuickPick(
      this.getProviderOptions(),
      {
        placeHolder: 'Escolha como buscar o Pull Request/Merge Request'
      }
    );

    return selected?.value;
  }

  private getProviderOptions(): ProviderOption[] {
    return [
      {
        label: 'URL do PR/MR',
        value: 'url'
      },
      {
        label: 'GitHub CLI (gh)',
        value: 'github-cli'
      },
      {
        label: 'GitHub API',
        value: 'github-api'
      },
      {
        label: 'GitLab API',
        value: 'gitlab-api'
      }
    ];
  }

  private async validateProvider(
    providerType: PullRequestProviderType
  ): Promise<void> {
    if (providerType !== 'github-cli') {
      return;
    }

    if (!(await GitHubCliHelper.isInstalled())) {
      throw new Error('GitHub CLI (gh) not installed.');
    }

    if (!(await GitHubCliHelper.isAuthenticated())) {
      throw new Error('GitHub CLI not authenticated. Run: gh auth login');
    }
  }

  private createProvider(
    providerType: PullRequestProviderType
  ): PullRequestProvider {
    return PullRequestProviderFactory.create(
      providerType,
      this.dependencies
    );
  }

  private async selectPullRequest(
    provider: PullRequestProvider
  ): Promise<PullRequestInfo | undefined> {
    const prs = await provider.listPullRequests();

    if (!prs.length) {
      this.dependencies.reviewViewProvider.clear(
        'No Pull Requests found.'
      );

      return undefined;
    }

    const selected = await vscode.window.showQuickPick(
      prs.map(pr => ({
        label: `#${pr.number} ${pr.title}`,
        description: `${pr.sourceBranch} → ${pr.targetBranch}`,
        detail: pr.url,
        pr
      })),
      {
        placeHolder: 'Select a Pull Request to analyze'
      }
    );

    return selected?.pr;
  }

  private async analyzePullRequest(
    provider: PullRequestProvider,
    pr: PullRequestInfo
  ): Promise<void> {
    const { reviewViewProvider } = this.dependencies;

    reviewViewProvider.setProgress(
      `Downloading PR #${pr.number} diff...`,
      10,
      [pr.title]
    );

    const diff =
      await provider.getPullRequestDiff(pr);

    reviewViewProvider.appendProgressStep(
      'PR diff downloaded.'
    );

    const allowedExtensions = [
      '.ts',
      '.tsx',
      '.js',
      '.jsx'
    ];

    const filteredDiff =
      diff
        .split('diff --git')
        .filter(chunk =>

          allowedExtensions.some(
            ext =>
              chunk.includes(ext)
          )
        )
        .join('\n\ndiff --git');

    reviewViewProvider.appendProgressStep(
      'Filtered reviewable files.'
    );

    reviewViewProvider.appendProgressStep(
      'Sending diff to AI...'
    );

    const result =
      await this.aiReviewService.analyze({
        context: this.dependencies.context,
        code: filteredDiff,
        filePath: `pr:${pr.number}`,
        language: 'diff'
      });

    reviewViewProvider.appendProgressStep(
      `${result.findings.length} findings returned by AI.`
    );

    const findings = result.findings.map(finding => ({
      ...finding,
      id: `pr-${pr.number}:${finding.id}`,
      file: finding.file || `pr:${pr.number}`,
      prNumber: pr.number,
      prTitle: pr.title,
      prUrl: pr.url,
      sourceBranch: pr.sourceBranch,
      targetBranch: pr.targetBranch,
      provider: pr.provider,
      status: 'pending'
    }));



    reviewViewProvider.updateFindings(
      `pr-${pr.number}`,
      findings
    );

    vscode.window.showInformationMessage(
      `PR #${pr.number} analyzed successfully.`
    );
  }

  private handleError(error: any): void {
    const message =
      error?.message ||
      'Failed to analyze Pull Request.';

    this.dependencies.reviewViewProvider.setError(message);

    vscode.window.showErrorMessage(
      `PR analysis failed: ${message}`
    );
  }
}