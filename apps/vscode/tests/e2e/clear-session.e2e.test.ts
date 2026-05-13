import assert from "assert";
import * as vscode from "vscode";

describe("Clear Session E2E", () => {
    it("should clear current review session", async () => {
        const result = await vscode.commands.executeCommand(
            "code-review.clearSession"
        );

        assert.ok(result === true);
    });
});