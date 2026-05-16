import assert from "assert";
import * as vscode from "vscode";

describe("Gemini AI E2E", () => {
    it("should use Gemini mock response", async () => {
        // Set provider to gemini-pro (which we mapped to GeminiMockProvider in buildContainer)
        const config = vscode.workspace.getConfiguration('codeReview');
        await config.update('ai.activeProviderId', 'gemini-pro', vscode.ConfigurationTarget.Global);
        
        const result: any = await vscode.commands.executeCommand(
            "code-review.analyze",
            {
                diff: "Explain how AI works",
                filePath: "chat-session"
            }
        );

        assert.ok(result);
        assert.ok(result.findings.length > 0);
        assert.strictEqual(
            result.findings[0].message, 
            "AI learns from **vast amounts of data** to identify **patterns** and make **predictions**."
        );
    });
});
