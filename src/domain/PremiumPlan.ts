export type ReviewEdition = 'community' | 'premium';

export type PremiumPlanTier = 'starter' | 'team' | 'enterprise';

export interface PremiumPlan {
  edition: ReviewEdition;
  tier?: PremiumPlanTier;
  organizationId?: string;
  workspaceId?: string;
  remoteApiUrl?: string;
  accessToken?: string;
}

export interface PremiumFeatureFlags {
  localReviews: boolean;
  remoteDatabase: boolean;
  realtimeCollaboration: boolean;
  organizationAnalytics: boolean;
  auditTimeline: boolean;
}

export function getPremiumFeatureFlags(plan: PremiumPlan): PremiumFeatureFlags {
  const premium = plan.edition === 'premium';

  return {
    localReviews: true,
    remoteDatabase: premium,
    realtimeCollaboration: premium,
    organizationAnalytics: premium,
    auditTimeline: premium
  };
}

export function assertPremiumFeature(plan: PremiumPlan, feature: keyof PremiumFeatureFlags): void {
  const flags = getPremiumFeatureFlags(plan);
  if (!flags[feature]) {
    throw new Error(`Recurso premium necessario: ${feature}. Configure giovaniCodeReview.edition como premium para usar banco remoto e colaboracao.`);
  }
}

export function hasRemoteDatabaseConfiguration(plan: PremiumPlan): boolean {
  return Boolean(plan.remoteApiUrl && plan.accessToken);
}
