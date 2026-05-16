export interface SetupState {
  step: 'provider' | 'keys' | 'rag' | 'complete';
  providers: Array<{ id: string; label: string; type: string }>;
  activeProviderId?: string;
}
