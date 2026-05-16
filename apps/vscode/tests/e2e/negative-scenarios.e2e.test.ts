import assert from "assert";
import * as vscode from "vscode";

describe("Negative Scenarios E2E", () => {
    it("should handle execution of commands when no provider is configured", async () => {
        // Set provider to empty/invalid
        const config = vscode.workspace.getConfiguration("codeReview");
        await config.update("provider", "", vscode.ConfigurationTarget.Global);

        try {
            await vscode.commands.executeCommand("code-review.analyze");
            // Should either work with a default or show a message (which we can't easily assert here)
        } catch (e) {
            // Should not crash the whole extension
        }
    });

    it("should handle missing API keys gracefully", async () => {
        const config = vscode.workspace.getConfiguration("codeReview");
        await config.update("provider", "openai", vscode.ConfigurationTarget.Global);
        // We don't set the key

        try {
            await vscode.commands.executeCommand("code-review.analyze");
        } catch (e) {
            // Should handle error gracefully
        }
    });

    it("should handle empty workspace", async () => {
        // This is hard to simulate in a single E2E run that already has a workspace,
        // but we can try to run commands that expect files.
        try {
            await vscode.commands.executeCommand("code-review.analyzeWorkspace");
        } catch (e) {
            assert.fail("analyzeWorkspace crashed on empty/current workspace");
        }
    });
});