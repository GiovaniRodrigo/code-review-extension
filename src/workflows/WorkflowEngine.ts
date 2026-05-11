import { WorkflowAction, WorkflowContext, WorkflowDefinition } from '../contracts';

export class WorkflowEngine {
  private readonly actions = new Map<string, WorkflowAction>();

  registerAction(action: WorkflowAction): void {
    this.actions.set(action.id, action);
  }

  async run(definition: WorkflowDefinition, context: WorkflowContext): Promise<string[]> {
    if (!definition.on.includes(context.event)) {
      return [];
    }

    const executed: string[] = [];
    for (const actionId of definition.actions) {
      const action = this.actions.get(actionId);
      if (!action) continue;
      await action.execute(context);
      executed.push(actionId);
    }

    return executed;
  }
}
