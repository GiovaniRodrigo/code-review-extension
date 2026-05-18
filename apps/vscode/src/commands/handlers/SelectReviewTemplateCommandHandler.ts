import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

const TEMPLATES = [
  { id: 'general', label: 'General Review', detail: 'Balanced quality, maintainability and correctness checks.' },
  { id: 'security', label: 'Security Review', detail: 'Input validation, secrets, auth, authorization and unsafe data flow.' },
  { id: 'architecture', label: 'Architecture Review', detail: 'SOLID, Clean Architecture, dependency direction and modular boundaries.' },
  { id: 'laravel', label: 'Laravel Review', detail: 'Controllers, services, requests, policies, queues, migrations and Eloquent usage.' },
  { id: 'react', label: 'React Review', detail: 'Components, hooks, state, accessibility and rendering performance.' },
  { id: 'api', label: 'API Review', detail: 'Contracts, validation, error handling, pagination and backward compatibility.' },
  { id: 'performance', label: 'Performance Review', detail: 'Query cost, loops, allocations, IO, caching and hot paths.' },
  { id: 'testability', label: 'Testability Review', detail: 'Coupling, seams, deterministic behavior and test coverage risk.' }
];

export class SelectReviewTemplateCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const picked = await vscode.window.showQuickPick(
      TEMPLATES.map(template => ({ label: template.label, description: template.id, detail: template.detail, template })),
      {
        title: 'Git Code Review — Select Review Template',
        placeHolder: 'Choose how the next review should be focused'
      }
    );

    if (!picked) return;

    const config = vscode.workspace.getConfiguration('codeReview');
    await config.update('review.template', picked.template.id, vscode.ConfigurationTarget.Workspace);
    await this.container.context.workspaceState.update('reviewTemplate', picked.template.id);
    await this.container.notifications.info(`Review template selected: ${picked.template.label}.`);
  }
}
