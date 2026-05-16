import assert from "assert";
import * as vscode from "vscode";

describe("Command Registration E2E", () => {
    const expectedCommands = [
        "code-review.analyze",
        "code-review.analyzeWorkspace",
        "code-review.generatePRSummary",
        "code-review.generateQualityReport",
        "code-review.analyzeBranchCommits",
        "code-review.analyzePr",
        "code-review.clearRepositoryRag",
        "code-review.clearSession",
        "code-review.focus",
        "code-review.indexRepositoryRag",
        "code-review.publishPrReview",
        "code-review.restoreSession",
        "code-review.searchRepositoryContext",
        "code-review.setGitLabCredentials",
        "code-review.setGitLabToken",
        "code-review.setGitLabUrl",
        "code-review.setOpenAIApiKey",
        "code-review.setGeminiApiKey",
        "code-review.setProvider",
        "code-review.syncRemotePR",
        "code-review.setupRag",
        "code-review.setup",
        "code-review.approveFinding",
        "code-review.syncWithVps"
    ];

    it("should register all extension commands", async () => {
        const commands = await vscode.commands.getCommands(true);
        
        for (const command of expectedCommands) {
            assert.ok(
                commands.includes(command),
                `Command ${command} should be registered`
            );
        }
    });
});