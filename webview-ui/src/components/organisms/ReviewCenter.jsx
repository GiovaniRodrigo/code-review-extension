import React from 'react';
import { DashboardCenter } from './DashboardCenter';
import { DiagnosticsCenter } from './DiagnosticsCenter';
import { TelemetryCenter } from './TelemetryCenter';
import { HistoryCenter } from './HistoryCenter';
import { IntelligenceCenter } from './IntelligenceCenter';
import { CollaborationCenter } from './CollaborationCenter';
import { CommentsCenter } from './CommentsCenter';
import { GitReviewCenter } from './GitReviewCenter';
import { SettingsCenter } from './SettingsCenter';
import { ConformitiesCenter } from './ConformitiesCenter';

export function ReviewCenter({ view, state, onStartReview, t, qualityLabel, vscodeApi, ...props }) {
  const commonProps = { state, t, qualityLabel, vscodeApi, ...props };

  switch (view) {
    case 'dashboard': return <DashboardCenter {...commonProps} onStartReview={onStartReview} />;
    case 'analysis': return <DiagnosticsCenter {...commonProps} onStartReview={onStartReview} />;
    case 'telemetry': return <TelemetryCenter {...commonProps} />;
    case 'history': return <HistoryCenter {...commonProps} />;
    case 'intelligence': return <IntelligenceCenter {...commonProps} />;
    case 'collaboration': return <CollaborationCenter {...commonProps} />;
    case 'comments': return <CommentsCenter {...commonProps} />;
    case 'git-review': return <GitReviewCenter {...commonProps} currentUser={state?.currentUser} />;
    case 'settings': return <SettingsCenter {...commonProps} />;
    case 'conformities': return <ConformitiesCenter {...commonProps} />;
    default: return <DashboardCenter {...commonProps} onStartReview={onStartReview} />;
  }
}
