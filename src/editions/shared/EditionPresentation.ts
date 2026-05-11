import { EditionRuntime } from '../../contracts';

export interface EditionPresentationState {
  badge: string;
  headline: string;
  syncStatus: string;
  aiStatus: string;
  privacyMessage: string;
  upgradeVisible: boolean;
}

export function buildEditionPresentationState(runtime: EditionRuntime): EditionPresentationState {
  if (runtime.id === 'community') {
    return {
      badge: 'Community',
      headline: 'Rodando localmente',
      syncStatus: 'Sync remoto indisponível na Community',
      aiStatus: `IA: ${runtime.aiProvider.label}`,
      privacyMessage: 'Código permanece na máquina do usuário.',
      upgradeVisible: true
    };
  }

  return {
    badge: runtime.label,
    headline: 'Premium conectado',
    syncStatus: runtime.capabilities.remoteSync ? 'Sincronização remota ativa' : 'Sync remoto indisponível',
    aiStatus: `IA: ${runtime.aiProvider.label}`,
    privacyMessage: 'Graph, analytics e colaboração disponíveis conforme o plano.',
    upgradeVisible: runtime.plan !== 'enterprise'
  };
}
