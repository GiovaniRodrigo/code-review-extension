import React from 'react';
import { Cloud, HardDrive, Lock, ShieldCheck, Sparkles, Users } from 'lucide-react';

export function EditionStatus({ state, compact = false }) {
  const edition = state?.editionPresentation;
  const plan = state?.premium?.plan;
  const features = state?.premium?.features ?? {};
  const isPremium = plan?.edition === 'premium';
  const badge = edition?.badge ?? (isPremium ? 'Premium' : 'Community');
  const headline = edition?.headline ?? (isPremium ? 'Premium conectado' : 'Rodando localmente');
  const aiStatus = edition?.aiStatus ?? (isPremium ? 'IA integrada' : 'IA local / VS Code');
  const syncStatus = edition?.syncStatus ?? (isPremium ? 'Sync remoto ativo' : 'Sync remoto indisponível');
  const privacy = edition?.privacyMessage ?? (isPremium ? 'Graph e analytics na nuvem conforme plano.' : 'Código permanece na máquina do usuário.');

  const Icon = isPremium ? Cloud : HardDrive;

  return (
    <section className={`edition-status ${isPremium ? 'premium' : 'community'} ${compact ? 'compact' : ''}`} data-tour="edition-status">
      <div className="edition-status__head">
        <span className="edition-status__icon"><Icon size={16} /></span>
        <div>
          <strong>{badge}</strong>
          <small>{headline}</small>
        </div>
      </div>
      {!compact && (
        <div className="edition-status__grid">
          <span><Sparkles size={14} />{aiStatus}</span>
          <span><ShieldCheck size={14} />{syncStatus}</span>
          <span><Lock size={14} />{privacy}</span>
          <span><Users size={14} />{isPremium ? 'Colaboração remota disponível' : 'Colaboração remota é Premium'}</span>
        </div>
      )}
      <div className="edition-status__features" aria-label="Recursos da edição">
        <b className={features?.remoteDatabase ? 'enabled' : ''}>Banco remoto</b>
        <b className={features?.realtimeCollaboration ? 'enabled' : ''}>Realtime</b>
        <b className={features?.cloudAi ? 'enabled' : (!isPremium ? 'local' : '')}>{isPremium ? 'IA Cloud' : 'IA local'}</b>
        <b className={features?.organizationAnalytics ? 'enabled' : ''}>Analytics</b>
      </div>
    </section>
  );
}
