import React from 'react';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';

export function CollapsedSidebarToggle({ side, onToggle }) {
  const Icon = side === 'left' ? PanelLeftOpen : PanelRightOpen;
  const label = side === 'left' ? 'Mostrar menu lateral esquerdo' : 'Mostrar painel lateral direito';
  return (
    <aside className={`collapsed-sidebar ${side}`}>
      <button title={label} aria-label={label} onClick={onToggle}>
        <Icon size={18} />
      </button>
    </aside>
  );
}
