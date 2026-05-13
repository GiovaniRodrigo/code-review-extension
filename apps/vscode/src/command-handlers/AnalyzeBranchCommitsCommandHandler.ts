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

        let processed = 0;

        for (const commit of commits) {

            processed++;

            reviewViewProvider.setProgress(
                `AI analyzing commit ${processed}/${commits.length}`,
                Math.round(
                    (processed / commits.length) * 100
                ),
                [
                    `Commit: ${commit.hash.slice(0, 7)}`,
                    commit.message
                ]
            );

            const diff =
                await vscodeAdapter.getCommitDiff(
                    commit.hash
                );

            reviewViewProvider.appendProgressStep(
                'Diff generated.'
            );

            const provider =
                await createAIProvider(
                    this.dependencies.context
                );

            reviewViewProvider.appendProgressStep(
                'Sending diff to AI...'
            );

            const result =
                await provider.analyzeCode({
                    code: diff,
                    filePath: `commit:${commit.hash}`,
                    language: 'diff'
                });

            reviewViewProvider.appendProgressStep(
                `${result.findings.length} findings returned by AI.`
            );

            const mappedFindings =
                result.findings.map(
                    finding => ({
                        ...finding,

                        id:
                            `${commit.hash}:${finding.id}`,

                        file:
                            finding.file ||
                            `commit:${commit.hash}`,

                        commitHash:
                            commit.hash,

                        commitMessage:
                            commit.message,

                        status:
                            'pending'
                    })
                );

            findings.push(
                ...mappedFindings
            );

            reviewViewProvider.updateFindings(
                `branch-${baseBranch}`,
                findings
            );
        }
    }
}