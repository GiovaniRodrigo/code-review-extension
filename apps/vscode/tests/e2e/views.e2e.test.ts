import assert from "assert";
import * as vscode from "vscode";

describe("Views E2E", () => {
    const views = [
        "code-review.dashboard",
        "code-review.findingsView",
        "code-review.chatView",
        "code-review.ragStatus",
        "code-review.dependencyGraph"
    ];

    it("should open activity bar container", async () => {
        await vscode.commands.executeCommand('workbench.view.extension.code-review');
        // If it doesn't throw, it's a good sign. 
        // We can't easily check if it's visible without more complex E2E tools.
    });

    for (const viewId of views) {
        it(`should have view ${viewId} defined`, async () => {
            // We focus the view to ensure it can be triggered
            await vscode.commands.executeCommand(`${viewId}.focus`);
        });
    }
});