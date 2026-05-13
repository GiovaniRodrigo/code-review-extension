import assert from "assert";
import * as vscode from "vscode";

describe("Review Flow E2E", () => {
    it("should execute analyze command", async () => {
        const result = await vscode.commands.executeCommand(
            "codeReview.analyze"
        );

        assert.ok(result !== undefined);
    });
});