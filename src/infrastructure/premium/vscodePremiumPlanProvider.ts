import * as vscode from 'vscode';
import { PremiumPlan } from '../../domain';
import { PremiumPlanProvider } from '../../application';

export class VscodePremiumPlanProvider implements PremiumPlanProvider {
  getPlan(): PremiumPlan {
    const config = vscode.workspace.getConfiguration('giovaniCodeReview');
    const edition = config.get<string>('edition') === 'premium' ? 'premium' : 'community';

    return {
      edition,
      organizationId: config.get<string>('organizationId') || undefined,
      workspaceId: config.get<string>('workspaceId') || vscode.workspace.workspaceFolders?.[0]?.name,
      tier: (['starter', 'team', 'enterprise'].includes(config.get<string>('premiumTier') || '') ? config.get<string>('premiumTier') : 'starter') as PremiumPlan['tier'],
      remoteApiUrl: config.get<string>('premiumApiUrl') || undefined,
      accessToken: config.get<string>('premiumToken') || undefined
    };
  }
}
