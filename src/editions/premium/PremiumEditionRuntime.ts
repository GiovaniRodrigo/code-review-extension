import { EditionRuntime, PremiumPlanTier } from '../../contracts';
import { PremiumAIProvider } from '../../ai/providers/PremiumAIProvider';
import { LocalGraphProvider } from '../../graph/LocalGraphProvider';
import { ArchitectureAnalyzer } from '../../analyzer/ArchitectureAnalyzer';

export function createPremiumEditionRuntime(plan: PremiumPlanTier = 'starter'): EditionRuntime {
  return {
    id: 'premium',
    label: `Premium ${plan}`,
    plan,
    capabilities: {
      remoteSync: true,
      cloudAI: true,
      localAI: true,
      sharedGraph: plan !== 'starter',
      organizationAnalytics: plan !== 'starter',
      automations: true
    },
    aiProvider: new PremiumAIProvider(),
    graphProvider: new LocalGraphProvider(),
    analyzers: [new ArchitectureAnalyzer()]
  };
}
