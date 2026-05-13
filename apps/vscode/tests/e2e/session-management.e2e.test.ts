import assert from "assert";
import * as vscode from "vscode";

describe("Session Management E2E", () => {
    it("should restore current branch session", async () => {
        const result = await vscode.commands.executeCommand(
            "code-review.restoreSession"
        );

        assert.ok(result !== undefined);
    });
});