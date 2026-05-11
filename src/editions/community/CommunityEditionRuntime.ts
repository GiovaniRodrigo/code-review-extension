import { AIProvider, EditionRuntime } from '../../contracts';
import { LocalDeterministicAIProvider } from '../../ai/providers/LocalDeterministicAIProvider';
import { LocalGraphProvider } from '../../graph/LocalGraphProvider';
import { ArchitectureAnalyzer } from '../../analyzer/ArchitectureAnalyzer';

export function createCommunityEditionRuntime(aiProvider: AIProvider = new LocalDeterministicAIProvider()): EditionRuntime {
  return {
    id: 'community',
    label: 'Community',
    capabilities: {
      remoteSync: false,
      cloudAI: false,
      localAI: true,
      sharedGraph: false,
      organizationAnalytics: false,
      automations: true
    },
    aiProvider,
    graphProvider: new LocalGraphProvider(),
    analyzers: [new ArchitectureAnalyzer()]
  };
}
