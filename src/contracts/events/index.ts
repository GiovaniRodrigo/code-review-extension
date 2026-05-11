export interface DomainEvent<TPayload = unknown> {
  type: string;
  occurredAt: string;
  payload: TPayload;
}

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
