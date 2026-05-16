import assert from "assert";
import * as vscode from "vscode";

describe("AI Analysis E2E", () => {
    it("should return AI analysis result", async () => {
        const result = await vscode.commands.executeCommand(
            "code-review.analyze",
            {
                diff: "const a = 1;"
            }
        );

        assert.ok(result);

        assert.ok(typeof result === "object");
        assert.ok(Array.isArray((result as any).findings));
    });
});