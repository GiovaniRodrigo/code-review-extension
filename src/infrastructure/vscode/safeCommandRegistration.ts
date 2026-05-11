import * as vscode from 'vscode';

const registeredCommands = new Set<string>();

export async function registerCommandOnce(
  context: vscode.ExtensionContext,
  commandId: string,
  callback: (...args: unknown[]) => unknown
): Promise<void> {
  if (registeredCommands.has(commandId)) {
    console.warn(`[Code Review] Command already registered in this extension host: ${commandId}`);
    return;
  }

  const existingCommands = await vscode.commands.getCommands(true);
  if (existingCommands.includes(commandId)) {
    registeredCommands.add(commandId);
    console.warn(`[Code Review] Skipping command registration because another extension already owns ${commandId}.`);
    return;
  }

  try {
    const disposable = vscode.commands.registerCommand(commandId, callback);
    registeredCommands.add(commandId);
    context.subscriptions.push({
      dispose: () => {
        registeredCommands.delete(commandId);
        disposable.dispose();
      }
    });
  } catch (error) {
    if (isDuplicateCommandRegistrationError(error, commandId)) {
      registeredCommands.add(commandId);
      console.warn(`[Code Review] Ignoring duplicated VS Code command registration for ${commandId}. Another installed extension already owns this command.`);
      return;
    }

    throw error;
  }
}

function isDuplicateCommandRegistrationError(error: unknown, commandId: string): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes(`command '${commandId}' already exists`)
    || message.includes(`command \"${commandId}\" already exists`)
    || message.includes(`Command ${commandId} already registered`)
    || message.includes(`Command \`${commandId}\` already registered`)
    || (message.includes(commandId) && message.toLowerCase().includes('already'));
}
