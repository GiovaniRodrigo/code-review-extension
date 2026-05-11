import { PremiumPlan } from '../domain';
import { AIProvider, EditionRuntime, PremiumPlanTier } from '../contracts';
import { createCommunityEditionRuntime } from './community/CommunityEditionRuntime';
import { createPremiumEditionRuntime } from './premium/PremiumEditionRuntime';

function toPremiumPlanTier(plan: PremiumPlan): PremiumPlanTier {
  if (plan.tier === 'team' || plan.tier === 'enterprise') return plan.tier;
  return 'starter';
}

export function resolveEditionRuntime(plan: PremiumPlan, communityAIProvider?: AIProvider): EditionRuntime {
  return plan.edition === 'premium'
    ? createPremiumEditionRuntime(toPremiumPlanTier(plan))
    : createCommunityEditionRuntime(communityAIProvider);
}
