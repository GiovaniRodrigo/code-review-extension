import React from 'react';
import { colors } from '../../theme';

export function Ring({ score = 100 }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div className="ring" style={{ background: `conic-gradient(${colors.green} 0 ${clamped}%, #253044 ${clamped}% 100%)` }}>
      <div><b>{clamped}</b><small>/100</small></div>
    </div>
  );
}
