import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { createAIProvider } from '../providers/createAIProvider';

export class AnalyzeBranchCommitsCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const {
            vscodeAdapter,
            reviewViewProvider,
            analyzeCodeUseCase
        } = this.dependencies;

        const baseBranch = await vscode.window.showInputBox({
            prompt: 'Branch base para comparar',
            value: 'main'
        });

        if (!baseBranch) {
            return;
        }

        reviewViewProvider.setLoading(
            `Analyzing commits against ${baseBranch}...`
        );

        const commits =
            await vscodeAdapter.getBranchCommits(baseBranch);

        if (!commits.length) {
            reviewViewProvider.clear(
                `No commits found against ${baseBranch}.`
            );
            return;
        }

        const findings = [];

        for (const commit of commits) {
            const diff =
                await vscodeAdapter.getCommitDiff(commit.hash);

            const provider =
                await createAIProvider(this.dependencies.context);

            const result =
                await provider.analyzeCode({
                    code: diff,
                    filePath: `commit:${commit.hash}`,
                    language: 'diff'
                });

            findings.push(
                ...result.findings.map(finding => ({
                    ...finding,
                    id: `${commit.hash}:${finding.id}`,
                    file: finding.file || `commit:${commit.hash}`,
                    commitHash: commit.hash,
                    commitMessage: commit.message,
                    status: 'pending'
                }))
            );
        }

        reviewViewProvider.updateFindings(
            `branch-${baseBranch}`,
            findings
        );
    }
}