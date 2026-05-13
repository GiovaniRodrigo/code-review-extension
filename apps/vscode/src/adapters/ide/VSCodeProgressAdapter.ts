import * as vscode from 'vscode';
import { IdeProgressPort } from '@code-review/core';

export class VSCodeProgressAdapter implements IdeProgressPort {
  run<T>(title: string, task: () => Promise<T>): Promise<T> {
    return Promise.resolve(vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title },
      task
    ));
  }
}
