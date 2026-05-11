import React from 'react';
import { colors } from '../../theme';

export function Ring({ score }) {
  const hasScore = Number.isFinite(score);
  const clamped = hasScore ? Math.max(0, Math.min(100, Math.round(score))) : 0;
  return (
    <div className={`ring ${hasScore ? '' : 'ring--empty'}`} style={{ background: `conic-gradient(${colors.green} 0 ${clamped}%, #253044 ${clamped}% 100%)` }}>
      <div>{hasScore ? <><b>{clamped}</b><small>/100</small></> : <><b>—</b><small>sem análise</small></>}</div>
    </div>
  );
}
