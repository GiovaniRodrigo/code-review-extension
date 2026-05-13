import assert from "assert";
import * as vscode from "vscode";

describe("Review View Provider E2E", () => {
    it("should open review panel", async () => {
        await vscode.commands.executeCommand(
            "codeReview.openDashboard"
        );

        const panels = vscode.window.tabGroups.all;

        assert.ok(panels.length > 0);
    });
});