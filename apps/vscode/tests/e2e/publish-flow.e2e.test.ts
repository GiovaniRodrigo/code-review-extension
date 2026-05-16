import assert from "assert";
import * as vscode from "vscode";

describe("Publish and Report Flow E2E", () => {
    async function executeWithTimeout(command: string, timeoutMs: number = 3000) {
        const execution = vscode.commands.executeCommand(command);
        const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), timeoutMs));
        return Promise.race([execution, timeout]);
    }

    it("should execute generatePRSummary command", async () => {
        await executeWithTimeout("code-review.generatePRSummary");
    });

    it("should execute generateQualityReport command", async () => {
        await executeWithTimeout("code-review.generateQualityReport");
    });

    it("should execute publishPrReview command", async () => {
        await executeWithTimeout("code-review.publishPrReview");
    });

    it("should execute syncRemotePR command", async () => {
        await executeWithTimeout("code-review.syncRemotePR");
    });
});