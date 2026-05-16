import assert from "assert";
import * as vscode from "vscode";

describe("VPS Sync Flow E2E", () => {
    async function executeWithTimeout(command: string, timeoutMs: number = 3000) {
        const execution = vscode.commands.executeCommand(command);
        const timeout = new Promise(resolve => setTimeout(() => resolve('timeout'), timeoutMs));
        return Promise.race([execution, timeout]);
    }

    it("should execute syncWithVps command", async () => {
        await executeWithTimeout("code-review.syncWithVps");
    });
});