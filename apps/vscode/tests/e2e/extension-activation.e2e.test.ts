import assert from "assert";
import * as vscode from "vscode";

describe("Extension Activation E2E", () => {
  it("should activate extension", async () => {
    console.log("All extensions:", vscode.extensions.all.map(e => e.id));
    const extension = vscode.extensions.getExtension(
      "code-review.vscode-code-review"
    );

    assert.ok(extension);

    await extension?.activate();

    assert.strictEqual(extension?.isActive, true);
  });
});