import assert from "assert";
import * as vscode from "vscode";

describe("OpenAI Key Flow E2E", () => {
    it("should configure OpenAI key", async () => {
        const result = await vscode.commands.executeCommand(
            "code-review.setOpenAIApiKey",
            "fake-api-key"
        );

        assert.ok(result === true);
    });
});