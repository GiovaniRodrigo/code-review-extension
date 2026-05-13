import assert from "assert";
import * as vscode from "vscode";

describe("Extension Activation E2E", () => {
  it("should activate extension", async () => {
    const extension = vscode.extensions.getExtension(
      "code-review-extension"
    );

    assert.ok(extension);

    await extension?.activate();

    assert.strictEqual(extension?.isActive, true);
  });
});