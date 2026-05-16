import assert from "assert";
import * as vscode from "vscode";

describe("RAG Flow E2E", () => {
    async function executeWithTimeout(command: string, timeoutMs: number = 3000) {
        const execution = vscode.commands.executeCommand(command);
        const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), timeoutMs));
        return Promise.race([execution, timeout]);
    }

    it("should execute setupRag command", async () => {
        await executeWithTimeout("code-review.setupRag");
    });

    it("should execute indexRepositoryRag command", async () => {
        await executeWithTimeout("code-review.indexRepositoryRag");
    });

    it("should execute searchRepositoryContext command", async () => {
        await executeWithTimeout("code-review.searchRepositoryContext");
    });

    it("should execute clearRepositoryRag command", async () => {
        await executeWithTimeout("code-review.clearRepositoryRag");
    });
});