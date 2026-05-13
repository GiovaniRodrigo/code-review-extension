import assert from "assert";
import * as vscode from "vscode";

describe("Command Registration E2E", () => {
    it("should register analyze command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("codeReview.analyze")
        );
    });

    it("should register clear session command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("codeReview.clearSession")
        );
    });

    it("should register set api key command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("codeReview.setOpenAIKey")
        );
    });
});