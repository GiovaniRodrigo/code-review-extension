import React from 'react';
import { Loader2 } from 'lucide-react';

export function SkeletonPanel() {
  return (
    <section className="skeleton-panel" aria-label="Carregando dados">
      <Loader2 size={18} />
      <span />
      <span />
      <span />
    </section>
  );
}
