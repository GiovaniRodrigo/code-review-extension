import React, { useEffect, useMemo, useState } from 'react';
import { GuidedTour, defaultTourSteps } from './components/Onboarding';
import { ReviewLeftbar } from './components/organisms/ReviewLeftbar';
import { Rightbar } from './components/organisms/Rightbar';
import { ReviewCenter } from './components/organisms/ReviewCenter';
import { StartReviewModal } from './components/organisms/StartReviewModal';
import { ResizeHandle } from './components/molecules/ResizeHandle';
import { CollapsedSidebarToggle } from './components/molecules/CollapsedSidebarToggle';

const vscodeApi = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

export function App() {
  const initialView = document.body?.dataset?.initialView || 'dashboard';
  const [view, setView] = useState(initialView);
  const [state, setState] = useState();
  const [snackbar, setSnackbar] = useState('Carregando contexto da revisão...');
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [leftSidebarHidden, setLeftSidebarHidden] = useState(false);
  const [rightSidebarHidden, setRightSidebarHidden] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(282);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(430);
  const [startModalOpen, setStartModalOpen] = useState(false);

  useEffect(() => {
    const seenTour = window.localStorage.getItem('codeReviewOnboardingSeen');
    if (!seenTour) {
      window.setTimeout(() => setTourActive(true), 450);
    }
  }, []);

  useEffect(() => {
    const listener = (event) => {
      if (event.data?.type === 'dashboardState') {
        setState(event.data.payload);
        setSnackbar('Contexto da revisão atualizado.');
      }

      if (event.data?.type === 'reviewSessionStarted') {
        setState((current) => ({
          ...current,
          currentSession: event.data.payload,
          sessions: [event.data.payload, ...(current?.sessions ?? []).filter((session) => session.id !== event.data.payload.id)]
        }));
        setSnackbar('Review session iniciada.');
      }

      if (event.data?.type === 'architectureValidationCompleted') {
        setSnackbar(`${event.data.payload.count} validações arquiteturais encontradas.`);
      }

      if (event.data?.type === 'operationCompleted') {
        setSnackbar(event.data.payload.message);
      }

      if (event.data?.type === 'operationFailed') {
        setSnackbar(`Erro: ${event.data.payload.message}`);
      }
    };

    window.addEventListener('message', listener);
    vscodeApi?.postMessage({ type: 'requestState' });
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    if (!snackbar) return undefined;
    const timeout = window.setTimeout(() => setSnackbar(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [snackbar]);

  const startReview = useMemo(() => () => setStartModalOpen(true), []);
  const startTour = () => {
    setView('dashboard');
    setTourStep(0);
    setTourActive(true);
  };
  const finishTour = () => {
    window.localStorage.setItem('codeReviewOnboardingSeen', 'true');
    setTourActive(false);
    setSnackbar('Tutorial concluído. Você pode reabrir pelo menu lateral.');
  };

  const startSidebarResize = (event, side) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = side === 'left' ? leftSidebarWidth : rightSidebarWidth;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      if (side === 'left') {
        setLeftSidebarWidth(Math.min(420, Math.max(220, startWidth + delta)));
      } else {
        setRightSidebarWidth(Math.min(560, Math.max(300, startWidth - delta)));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const t = getT(state);

  const sharedProps = {
    state,
    t,
    vscodeApi,
    qualityLabel,
    onOpenFile: (p) => vscodeApi?.postMessage({ type: 'openWorkspaceFile', payload: p }),
    onOpenDiff: (p) => vscodeApi?.postMessage({ type: 'openDiff', payload: p }),
    onRunVSCodeTests: () => vscodeApi?.postMessage({ type: 'runVSCodeTests' }),
    onCreateFinding: (p) => vscodeApi?.postMessage({ type: 'createValidationFinding', payload: p }),
    onUpdateFindingStatus: (p) => vscodeApi?.postMessage({ type: 'updateValidationFindingStatus', payload: p }),
    onRegisterCorrection: (p) => vscodeApi?.postMessage({ type: 'registerCorrectionAttempt', payload: p }),
    onRevalidate: (p) => vscodeApi?.postMessage({ type: 'revalidateFinding', payload: p }),
    onAddComment: (p) => vscodeApi?.postMessage({ type: 'addReviewComment', payload: p }),
    onEditComment: (p) => vscodeApi?.postMessage({ type: 'editReviewComment', payload: p }),
    onUpdateCommentStatus: (p) => vscodeApi?.postMessage({ type: 'updateReviewCommentStatus', payload: p }),
    onSendMessage: (p) => vscodeApi?.postMessage({ type: 'addCollaborationMessage', payload: p }),
    onApprovePartial: (p) => vscodeApi?.postMessage({ type: 'approvePartial', payload: p }),
    onRefreshMergeDecision: (p) => vscodeApi?.postMessage({ type: 'refreshMergeDecision', payload: p }),
    onOpenReview: (p) => vscodeApi?.postMessage({ type: 'openReview', payload: p }),
    onUpdateStatus: (p) => vscodeApi?.postMessage({ type: 'updateReviewStatus', payload: p })
  };

  return (
    <div
      className="app-shell"
      style={{
        '--left-sidebar-width': leftSidebarHidden ? '48px' : `${leftSidebarWidth}px`,
        '--right-sidebar-width': rightSidebarHidden ? '48px' : `${rightSidebarWidth}px`
      }}
    >
      <div className={`sidebar-region left ${leftSidebarHidden ? 'collapsed' : ''}`}>
        {leftSidebarHidden ? (
          <CollapsedSidebarToggle side="left" onToggle={() => setLeftSidebarHidden(false)} />
        ) : (
          <>
            <ReviewLeftbar view={view} setView={setView} state={state} onStartTour={startTour} onToggle={() => setLeftSidebarHidden(true)} t={t} />
            <ResizeHandle side="left" onResizeStart={startSidebarResize} />
          </>
        )}
      </div>
      <ReviewCenter view={view} state={state} onStartReview={startReview} {...sharedProps} />
      <div className={`sidebar-region right ${rightSidebarHidden ? 'collapsed' : ''}`}>
        {rightSidebarHidden ? (
          <CollapsedSidebarToggle side="right" onToggle={() => setRightSidebarHidden(false)} />
        ) : (
          <>
            <ResizeHandle side="right" onResizeStart={startSidebarResize} />
            <Rightbar metrics={state?.metrics} state={state} onSetView={setView} onStartReview={startReview} onToggle={() => setRightSidebarHidden(true)} t={t} qualityLabel={qualityLabel} vscodeApi={vscodeApi} />
          </>
        )}
      </div>
      <GuidedTour
        active={tourActive}
        steps={defaultTourSteps}
        currentIndex={tourStep}
        onNext={() => setTourStep((current) => Math.min(defaultTourSteps.length - 1, current + 1))}
        onBack={() => setTourStep((current) => Math.max(0, current - 1))}
        onSkip={finishTour}
        onFinish={finishTour}
        onJumpView={setView}
      />
      {startModalOpen && <StartReviewModal state={state} onClose={() => setStartModalOpen(false)} onStartReview={(p) => vscodeApi?.postMessage({ type: 'startReview', payload: p })} />}
      {snackbar && <div className="snackbar" role="status">{snackbar}</div>}
    </div>
  );
}

function getT(state) {
  return (path) => {
    const keys = path.split('.');
    let result = state?.translations;
    for (const key of keys) {
      result = result?.[key];
    }
    return result || path;
  };
}

function qualityLabel(score, t) {
  if (score >= 85) return t ? t('common.status.approved') : 'Muito bom';
  if (score >= 70) return 'Bom';
  if (score >= 50) return 'Atenção';
  return 'Crítico';
}
