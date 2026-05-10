import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Onboarding.css';

export const defaultTourSteps = [
  {
    target: 'tour-help',
    title: 'Tutorial guiado',
    body: 'Este botão reabre o onboarding sempre que um novo usuário precisar aprender o fluxo principal.',
    placement: 'right'
  },
  {
    target: 'nav-dashboard',
    title: 'Navegação principal',
    body: 'Use o menu lateral para alternar entre dashboard, diagnósticos, comentários, telemetria, histórico e configurações.',
    placement: 'right'
  },
  {
    target: 'start-review',
    title: 'Iniciar revisão (Reviewer)',
    body: 'O Reviewer inicia a sessão escolhendo explicitamente o PR ou branch. O Desenvolvedor é inferido pelo dono da branch ou solicitante do PR.',
    placement: 'bottom'
  },
  {
    target: 'nav-git-review',
    title: 'Análise Git (Reviewer)',
    body: 'Nesta tela, o Reviewer navega pelos commits e arquivos alterados, visualizando o diff real lado a lado.',
    placement: 'right',
    beforeShow: 'git-review'
  },
  {
    target: 'git-file-viewer',
    title: 'Visão Lado a Lado',
    body: 'Compare o código original (Base) com o novo código (Atual) para identificar mudanças e riscos arquiteturais.',
    placement: 'top'
  },
  {
    target: 'git-comment-panel',
    title: 'Comentário Inline',
    body: 'O Reviewer registra comentários vinculados à linha do código, definindo severidade e o ajuste necessário.',
    placement: 'left'
  },
  {
    target: 'nav-analysis',
    title: 'Diagnósticos (Dev)',
    body: 'O Desenvolvedor acessa esta tela para ver a lista técnica de problemas, findings e Problems do VS Code.',
    placement: 'right',
    beforeShow: 'analysis'
  },
  {
    target: 'validation-panel',
    title: 'Validações e Correções',
    body: 'Aqui o Reviewer cria findings formais. Logo abaixo, o Desenvolvedor mostra a correção com commit/branch, descrição e evidência para revalidação.',
    placement: 'top'
  },
  {
    target: 'category-crud',
    title: 'Categorias customizáveis',
    body: 'As categorias de findings não são fixas: a equipe pode criar, renomear e remover categorias usadas na avaliação.',
    placement: 'top',
    beforeShow: 'analysis'
  },
  {
    target: 'nav-collaboration',
    title: 'Colaboração (Time)',
    body: 'Reviewer e Developer conversam via threads, mencionam @pessoas e acompanham bloqueios de merge.',
    placement: 'right',
    beforeShow: 'collaboration'
  },
  {
    target: 'quality-summary',
    title: 'Status e Score',
    body: 'O Dashboard consolida o score final. A sessão é aprovada quando todos os itens críticos e altos forem resolvidos.',
    placement: 'bottom',
    beforeShow: 'dashboard'
  },
  {
    target: 'persistence-actions',
    title: 'Persistência e backup',
    body: 'Em Configurações, exporte o banco local, crie backup e sincronize com destino remoto.',
    placement: 'bottom',
    beforeShow: 'settings'
  }
];

export function GuidedTour({ active, steps, currentIndex, onNext, onBack, onSkip, onFinish, onJumpView }) {
  const [rect, setRect] = useState(null);
  const step = steps[currentIndex];

  useEffect(() => {
    if (!active || !step) return undefined;
    if (step.beforeShow) onJumpView(step.beforeShow);

    let cancelled = false;
    let rafId = 0;
    let timerId = 0;

    const measureTarget = () => {
      const selector = `[data-tour="${window.CSS?.escape ? CSS.escape(step.target) : step.target}"]`;
      const element = document.querySelector(selector);

      if (!element) {
        if (!cancelled) setRect(null);
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

      timerId = window.setTimeout(() => {
        rafId = window.requestAnimationFrame(() => {
          if (cancelled) return;
          const box = element.getBoundingClientRect();
          setRect({
            top: Math.round(box.top),
            left: Math.round(box.left),
            width: Math.round(box.width),
            height: Math.round(box.height)
          });
        });
      }, 180);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onSkip();
      if (event.key === 'Enter' && event.shiftKey) onBack();
      else if (event.key === 'Enter') currentIndex === steps.length - 1 ? onFinish() : onNext();
    };

    measureTarget();
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, step, currentIndex, steps.length, onJumpView, onNext, onBack, onSkip, onFinish]);

  if (!active || !step) return null;

  const highlight = rect ?? { top: 120, left: 260, width: 320, height: 80 };
  const popoverStyle = getTourPopoverStyle(highlight, step.placement);

  return createPortal(
    <div className="tour-layer" role="dialog" aria-modal="true" aria-label="Tutorial guiado">
      <div className="tour-backdrop" onClick={onSkip} aria-hidden="true" />
      <div
        className="tour-highlight"
        style={{
          top: highlight.top - 8,
          left: highlight.left - 8,
          width: highlight.width + 16,
          height: highlight.height + 16
        }}
      />
      <article className={`tour-popover ${step.placement ?? 'bottom'}`} style={popoverStyle}>
        <span className="tour-step-count">Passo {currentIndex + 1} de {steps.length}</span>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <div className="tour-progress" aria-hidden="true">
          {steps.map((item, index) => <i key={item.target} className={index <= currentIndex ? 'active' : ''} />)}
        </div>
        <footer>
          <button className="ghost" onClick={onSkip}>Pular</button>
          <div>
            <button className="ghost" onClick={onBack} disabled={currentIndex === 0}>Voltar</button>
            {currentIndex === steps.length - 1
              ? <button className="primary" onClick={onFinish}>Concluir</button>
              : <button className="primary" onClick={onNext}>Próximo</button>}
          </div>
        </footer>
      </article>
    </div>,
    document.body
  );
}

function getTourPopoverStyle(rect, placement = 'bottom') {
  const width = Math.min(380, Math.max(280, window.innerWidth - 32));
  const height = Math.min(260, Math.max(210, window.innerHeight - 32));
  const gap = 18;
  const margin = 16;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const centerLeft = clamp(rect.left + rect.width / 2 - width / 2, margin, window.innerWidth - width - margin);

  if (placement === 'right') {
    const availableRight = window.innerWidth - (rect.left + rect.width) - margin;
    const left = availableRight >= width + gap
      ? rect.left + rect.width + gap
      : clamp(rect.left - width - gap, margin, window.innerWidth - width - margin);

    return {
      top: clamp(rect.top + rect.height / 2 - height / 2, margin, window.innerHeight - height - margin),
      left,
      width
    };
  }

  if (placement === 'top') {
    const canPlaceTop = rect.top >= height + gap + margin;
    return {
      top: canPlaceTop
        ? rect.top - height - gap
        : clamp(rect.top + rect.height + gap, margin, window.innerHeight - height - margin),
      left: centerLeft,
      width
    };
  }

  const canPlaceBottom = window.innerHeight - (rect.top + rect.height) >= height + gap + margin;
  return {
    top: canPlaceBottom
      ? rect.top + rect.height + gap
      : clamp(rect.top - height - gap, margin, window.innerHeight - height - margin),
    left: centerLeft,
    width
  };
}
