import React, { useEffect, useMemo, useState } from 'react';
import { GuidedTour, defaultTourSteps } from './components/Onboarding';
import { ReviewLeftbar } from './components/organisms/ReviewLeftbar';
import { Rightbar } from './components/organisms/Rightbar';
import { ReviewCenter } from './components/organisms/ReviewCenter';
import { StartReviewModal } from './components/organisms/StartReviewModal';
import { ResizeHandle } from './components/molecules/ResizeHandle';
import { CollapsedSidebarToggle } from './components/molecules/CollapsedSidebarToggle';
import { UserFeedback } from './components/molecules/UserFeedback';

const vscodeApi = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

export function App() {
  const initialView = document.body?.dataset?.initialView || 'dashboard';
  const [view, setView] = useState(initialView);
  const [state, setState] = useState();
  const [feedback, setFeedback] = useState({ tone: 'loading', title: 'Carregando', message: 'Carregando contexto da revisão...', progress: 25 });
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
        setFeedback({ tone: 'success', title: 'Contexto atualizado', message: 'Dados da revisão atualizados.', progress: 100 });
      }

      if (event.data?.type === 'reviewSessionStarted') {
        setState((current) => ({
          ...current,
          currentSession: event.data.payload,
          sessions: [event.data.payload, ...(current?.sessions ?? []).filter((session) => session.id !== event.data.payload.id)]
        }));
        setFeedback({ tone: 'success', title: 'Sessão criada', message: 'Review session iniciada com sucesso.', progress: 100 });
      }

      if (event.data?.type === 'architectureValidationCompleted') {
        setFeedback({ tone: 'success', title: 'Validação concluída', message: `${event.data.payload.count} validações arquiteturais encontradas.`, progress: 100 });
      }

      if (event.data?.type === 'aiReviewCommentsGenerated') {
        setFeedback({ tone: 'success', title: 'Comentários IA gerados', message: `${event.data.payload.count} comentário(s) curto(s) e estruturado(s) criados por ${event.data.payload.provider}.`, progress: 100 });
      }

      if (event.data?.type === 'operationStarted') {
        setFeedback({ tone: 'loading', title: event.data.payload?.title || 'Processando', message: event.data.payload?.message || 'Executando operação...', progress: event.data.payload?.progress ?? 40 });
      }

      if (event.data?.type === 'operationCompleted') {
        setFeedback({ tone: 'success', title: 'Operação concluída', message: event.data.payload.message, progress: 100 });
      }

      if (event.data?.type === 'operationFailed') {
        setFeedback({ tone: 'error', title: 'Operação falhou', message: event.data.payload.message });
      }
    };

    window.addEventListener('message', listener);
    vscodeApi?.postMessage({ type: 'requestState' });
    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    if (!feedback?.message || feedback.tone === 'loading' || feedback.tone === 'error') return undefined;
    const timeout = window.setTimeout(() => setFeedback(undefined), 4200);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const startReview = useMemo(() => () => setStartModalOpen(true), []);
  const startTour = () => {
    setView('dashboard');
    setTourStep(0);
    setTourActive(true);
  };
  const finishTour = () => {
    window.localStorage.setItem('codeReviewOnboardingSeen', 'true');
    setTourActive(false);
    setFeedback({ tone: 'success', title: 'Tutorial concluído', message: 'Você pode reabrir pelo menu lateral.', progress: 100 });
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
    feedback,
    qualityLabel,
    onOpenFile: (p) => postWithFeedback(vscodeApi, setFeedback, 'openWorkspaceFile', p, 'Abrindo arquivo...'),
    onOpenDiff: (p) => postWithFeedback(vscodeApi, setFeedback, 'openDiff', p, 'Abrindo diff...'),
    onRunVSCodeTests: () => postWithFeedback(vscodeApi, setFeedback, 'runVSCodeTests', undefined, 'Solicitando execução de testes...'),
    onCreateFinding: (p) => postWithFeedback(vscodeApi, setFeedback, 'createValidationFinding', p, 'Registrando validação...'),
    onUpdateFindingStatus: (p) => postWithFeedback(vscodeApi, setFeedback, 'updateValidationFindingStatus', p, 'Atualizando status da validação...'),
    onRegisterCorrection: (p) => postWithFeedback(vscodeApi, setFeedback, 'registerCorrectionAttempt', p, 'Registrando tentativa de correção...'),
    onRevalidate: (p) => postWithFeedback(vscodeApi, setFeedback, 'revalidateFinding', p, 'Revalidando finding...'),
    onAddComment: (p) => postWithFeedback(vscodeApi, setFeedback, 'addReviewComment', p, 'Publicando comentário...'),
    onEditComment: (p) => postWithFeedback(vscodeApi, setFeedback, 'editReviewComment', p, 'Atualizando comentário...'),
    onUpdateCommentStatus: (p) => postWithFeedback(vscodeApi, setFeedback, 'updateReviewCommentStatus', p, 'Atualizando status do comentário...'),
    onSendMessage: (p) => postWithFeedback(vscodeApi, setFeedback, 'addCollaborationMessage', p, 'Enviando mensagem colaborativa...'),
    onApprovePartial: (p) => postWithFeedback(vscodeApi, setFeedback, 'approvePartial', p, 'Registrando aprovação parcial...'),
    onRefreshMergeDecision: (p) => postWithFeedback(vscodeApi, setFeedback, 'refreshMergeDecision', p, 'Atualizando decisão de merge...'),
    onOpenReview: (p) => postWithFeedback(vscodeApi, setFeedback, 'openReview', p, 'Abrindo sessão de review...'),
    onUpdateStatus: (p) => postWithFeedback(vscodeApi, setFeedback, 'updateReviewStatus', p, 'Atualizando status da sessão...'),
    onRunReview: (p) => postWithFeedback(vscodeApi, setFeedback, 'generateAIReviewComments', p, 'Gerando comentários técnicos com IA local... contexto reduzido, timeout ativo e resposta estruturada.')
  };

  return (
    <div
      className={`app-shell ${state?.premium?.plan?.edition === 'premium' ? 'edition-premium' : 'edition-community'}`}
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
      {startModalOpen && <StartReviewModal state={state} onClose={() => setStartModalOpen(false)} onStartReview={(p) => postWithFeedback(vscodeApi, setFeedback, 'startReview', p, 'Criando sessão de revisão...')} />}
      <UserFeedback feedback={feedback} onDismiss={() => setFeedback(undefined)} />
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

function postWithFeedback(vscodeApi, setFeedback, type, payload, message) {
  setFeedback({ tone: 'loading', title: 'Processando', message, progress: 45 });
  vscodeApi?.postMessage({ type, payload });
}
