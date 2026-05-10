import React from 'react';

export function Tooltip({ label, children, placement = 'top' }) {
  return <span className={`tooltip tooltip-${placement}`} data-tooltip={label}>{children}</span>;
}
