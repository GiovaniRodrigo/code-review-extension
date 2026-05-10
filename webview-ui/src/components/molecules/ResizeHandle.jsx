import React from 'react';
import { GripVertical } from 'lucide-react';

export function ResizeHandle({ side, onResizeStart }) {
  return (
    <button
      className={`resize-handle ${side}`}
      title="Redimensionar painel lateral"
      aria-label="Redimensionar painel lateral"
      onMouseDown={(event) => onResizeStart(event, side)}
    >
      <GripVertical size={14} />
    </button>
  );
}
