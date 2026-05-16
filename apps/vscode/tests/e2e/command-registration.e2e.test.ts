import assert from "assert";
import * as vscode from "vscode";

describe("Command Registration E2E", () => {
    it("should register analyze command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("code-review.analyze")
        );
    });

    it("should register clear session command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("code-review.clearSession")
        );
    });

    it("should register set api key command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("code-review.setOpenAIApiKey")
        );
    });

    it("should register guided setup command", async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(
            commands.includes("code-review.setup")
        );
    });
});