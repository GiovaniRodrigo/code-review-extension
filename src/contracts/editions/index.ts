import { AIProvider } from '../ai';
import { Analyzer } from '../analyzer';
import { GraphProvider } from '../graph';

export interface EditionCapabilities {
  remoteSync: boolean;
  cloudAI: boolean;
  localAI: boolean;
  sharedGraph: boolean;
  organizationAnalytics: boolean;
  automations: boolean;
}

export interface EditionRuntime {
  id: 'community' | 'premium';
  label: string;
  plan?: 'starter' | 'team' | 'enterprise';
  capabilities: EditionCapabilities;
  aiProvider: AIProvider;
  graphProvider: GraphProvider;
  analyzers: Analyzer[];
}
