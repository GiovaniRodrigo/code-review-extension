import assert from "assert";
import * as vscode from "vscode";

describe("OpenAI Key Flow E2E", () => {
    it("should register OpenAI key command", async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes("code-review.setOpenAIApiKey"));
    });
});