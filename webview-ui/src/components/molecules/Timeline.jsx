import React from 'react';

export function Timeline({ session, t }) {
  const steps = session?.history?.length ? session.history.map((entry) => [
    entry.type === 'SESSION_CREATED' ? t('common.status.open') : entry.type === 'STATUS_CHANGED' ? t('dashboard.summary.status') : 'Git',
    entry.message
  ]) : [
    ['PR created', 'feature/auth-refactor'],
    ['Review executed', '25 violations found'],
    ['Comments generated', '3 critical, 7 warnings'],
    [t('collaboration.workflowState.waitingDev'), `Responsible: ${t('common.developer')}`],
    ['Revalidation pending', 'After new commits']
  ];

  return <div className="timeline">{steps.map(([title, text], index) => <div key={`${title}-${index}`}><b>{title}</b><p>{text}</p></div>)}</div>;
}
