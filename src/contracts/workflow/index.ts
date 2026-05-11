export type WorkflowEventType = 'review.started' | 'comment.created' | 'analysis.finished' | 'score.changed' | 'branch.changed' | 'pr.synchronized';

export interface WorkflowContext {
  event: WorkflowEventType;
  payload: Record<string, unknown>;
}

export interface WorkflowAction {
  readonly id: string;
  execute(context: WorkflowContext): Promise<void>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  on: WorkflowEventType[];
  actions: string[];
}
