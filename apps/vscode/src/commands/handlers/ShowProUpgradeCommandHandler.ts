import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class ShowProUpgradeCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const markdown = `# Git Code Review Pro

Git Code Review Pro is designed for professional code reviewers who need cloud AI, advanced PR summaries, technical quality reports and exportable review artifacts.

## Pro value

| Capability | Value for code reviewers |
|---|---|
| Cloud AI provider | Better productivity without running local models |
| Advanced PR Summary | Faster PR descriptions with risks and checklist |
| Technical Quality Report | Professional review artifact for approval decisions |
| Export PDF | Shareable report for review evidence |
| Review templates | Focus the review on architecture, security, Laravel, React, API, performance or testability |
| Advanced local history | Continue and compare review sessions by branch |

## Included in this Pro Foundation build

- Configure Cloud Provider
- Test AI Provider Connection
- Generate AI PR Summary
- Generate Technical Quality Report
- Export Review as PDF
- Select Review Template
- Open Review History

## Product rule

AI suggestions are advisory. The final approval decision always belongs to the code reviewer.
`;

    const doc = await vscode.workspace.openTextDocument({ content: markdown, language: 'markdown' });
    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
  }
}
