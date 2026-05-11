import { DashboardState } from './interfaces';
import { GitContext, ReviewSession, ValidationFinding } from '../domain';

export interface PullRequestProviderState {
  provider: 'local-git' | 'github' | 'gitlab' | 'azure-devops';
  configured: boolean;
  pullRequests: Array<{
    id: string;
    title: string;
    sourceBranch: string;
    targetBranch: string;
    status: 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'rejected' | 'merged';
    changedFiles: number;
    comments: number;
    risk: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface ReviewWorkflowState {
  statusFlow: string[];
  activeGate: 'passed' | 'warning' | 'blocked';
  blockers: string[];
  nextActions: string[];
  finished: boolean;
}

export interface ThreadState {
  threads: Array<{ id: string; file: string; line: number; messages: number; status: string; owner: string }>;
  unresolvedCount: number;
}

export interface AdvancedAnalyticsState {
  architecturalDebtScore: number;
  predictedRisk: 'low' | 'medium' | 'high' | 'critical';
  hotspots: Array<{ file: string; risk: number; reasons: string[] }>;
  trend: Array<{ label: string; score: number }>;
}

export interface AstAnalyzerState {
  supportedLanguages: string[];
  rules: Array<{ id: string; title: string; enabled: boolean; severity: string }>;
  graph: { nodes: number; edges: number; modules: string[] };
}

export interface CloudSyncState {
  offlineFirst: boolean;
  conflictPolicy: 'local-wins' | 'remote-wins' | 'manual-merge';
  lastSyncAt?: string;
  organizationReady: boolean;
  workspaces: string[];
}

export interface EnterpriseFeatureState {
  pullRequests: PullRequestProviderState;
  workflow: ReviewWorkflowState;
  threads: ThreadState;
  analytics: AdvancedAnalyticsState;
  astAnalyzer: AstAnalyzerState;
  cloudSync: CloudSyncState;
  collaboration: {
    presence: Array<{ user: string; role: string; file?: string; status: 'online' | 'reviewing' | 'idle' }>;
    permissions: Array<{ role: string; canComment: boolean; canApprove: boolean; canAdmin: boolean }>;
    mentions: Array<{ mention: string; target: string; open: boolean }>;
  };
  organizationalIntelligence: {
    knowledgeItems: number;
    recommendations: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }>;
    indexedSources: string[];
  };
}

export function buildEnterpriseFeatureState(input: {
  git: GitContext;
  sessions: ReviewSession[];
  currentSession?: ReviewSession;
  qualityScore: number;
}): EnterpriseFeatureState {
  const session = input.currentSession;
  const findings = session?.findings ?? [];
  const comments = session?.comments ?? [];
  const changedFiles = session?.changedFiles ?? input.git.changedFiles ?? [];
  const unresolvedComments = comments.filter((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? 'OPEN'));
  const unresolvedFindings = findings.filter((finding) => finding.status !== 'APPROVED');
  const blockers = buildBlockers(unresolvedFindings, unresolvedComments, input.qualityScore);
  const hotspots = buildHotspots(changedFiles, findings);

  return {
    pullRequests: {
      provider: 'local-git',
      configured: true,
      pullRequests: buildPullRequestList(input.git, input.sessions, session)
    },
    workflow: {
      statusFlow: ['draft', 'in_review', 'changes_requested', 'approved', 'rejected', 'merged'],
      activeGate: blockers.length ? 'blocked' : input.qualityScore >= 85 ? 'passed' : 'warning',
      blockers,
      nextActions: buildNextActions(session, blockers),
      finished: session ? ['APPROVED', 'REJECTED', 'MERGED'].includes(session.status) : false
    },
    threads: {
      threads: comments.map((comment) => ({
        id: comment.threadId || comment.id,
        file: comment.file,
        line: comment.line,
        messages: comments.filter((item) => (item.threadId || item.id) === (comment.threadId || comment.id)).length,
        status: comment.status,
        owner: comment.author
      })),
      unresolvedCount: unresolvedComments.length
    },
    analytics: {
      architecturalDebtScore: Math.max(0, 100 - input.qualityScore),
      predictedRisk: riskFromScore(input.qualityScore, unresolvedFindings),
      hotspots,
      trend: buildTrend(input.sessions)
    },
    astAnalyzer: {
      supportedLanguages: ['TypeScript', 'JavaScript', 'PHP', 'Python', 'Java', 'C#'],
      rules: [
        { id: 'service-too-large', title: 'Service com muitas responsabilidades', enabled: true, severity: 'HIGH' },
        { id: 'controller-god-object', title: 'Controller inchado', enabled: true, severity: 'HIGH' },
        { id: 'forbidden-layer-dependency', title: 'Dependência proibida entre camadas', enabled: true, severity: 'CRITICAL' },
        { id: 'dead-code', title: 'Código morto ou não referenciado', enabled: true, severity: 'MEDIUM' },
        { id: 'circular-dependency', title: 'Dependência circular', enabled: true, severity: 'CRITICAL' }
      ],
      graph: {
        nodes: Math.max(1, changedFiles.length),
        edges: Math.max(0, changedFiles.length - 1),
        modules: Array.from(new Set(changedFiles.map((file) => file.split('/')[0] || 'workspace'))).slice(0, 8)
      }
    },
    cloudSync: {
      offlineFirst: true,
      conflictPolicy: 'manual-merge',
      lastSyncAt: input.sessions[0]?.updatedAt,
      organizationReady: true,
      workspaces: Array.from(new Set(input.sessions.map((item) => item.targetBranch || 'main'))).slice(0, 6)
    },
    collaboration: {
      presence: buildPresence(session),
      permissions: [
        { role: 'Reviewer', canComment: true, canApprove: false, canAdmin: false },
        { role: 'Lead', canComment: true, canApprove: true, canAdmin: false },
        { role: 'Admin', canComment: true, canApprove: true, canAdmin: true }
      ],
      mentions: (session?.collaborationMessages ?? [])
        .flatMap((message) => Array.from(message.body.matchAll(/@([\w.-]+)/g)).map((match) => ({ mention: `@${match[1]}`, target: message.author, open: true })))
    },
    organizationalIntelligence: {
      knowledgeItems: (session?.history?.length ?? 0) + findings.length + comments.length,
      recommendations: buildRecommendations(session, input.qualityScore),
      indexedSources: ['ADRs', 'Comentários técnicos', 'Diagnósticos', 'Histórico de reviews', 'Regras arquiteturais']
    }
  };
}

function buildPullRequestList(git: GitContext, sessions: ReviewSession[], current?: ReviewSession): PullRequestProviderState['pullRequests'] {
  const fromSessions = sessions.slice(0, 8).map((session) => ({
    id: session.pullRequestId || session.id,
    title: session.title,
    sourceBranch: session.sourceBranch,
    targetBranch: session.targetBranch,
    status: mapSessionStatus(session.status),
    changedFiles: session.changedFiles.length,
    comments: session.comments.length,
    risk: riskFromScore(100 - session.findings.length * 8, session.findings)
  }));

  if (fromSessions.length) return fromSessions;

  return [{
    id: git.pullRequestId || 'local-workspace',
    title: current?.title || `Review local de ${git.currentBranch}`,
    sourceBranch: git.currentBranch,
    targetBranch: git.baseBranch,
    status: 'in_review',
    changedFiles: git.changedFiles.length,
    comments: 0,
    risk: 'medium'
  }];
}

function mapSessionStatus(status: ReviewSession['status']): PullRequestProviderState['pullRequests'][number]['status'] {
  if (status === 'APPROVED') return 'approved';
  if (status === 'NEEDS_CHANGES') return 'changes_requested';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'MERGED') return 'merged';
  if (status === 'OPEN') return 'draft';
  return 'in_review';
}

function buildBlockers(findings: ValidationFinding[], comments: ReviewSession['comments'], score: number): string[] {
  const blockers: string[] = [];
  if (findings.some((finding) => finding.severity === 'CRITICAL' && finding.status !== 'APPROVED')) blockers.push('Existe finding crítico aberto.');
  if (comments.some((comment) => comment.severity === 'CRITICAL' && !['RESOLVED', 'APPROVED'].includes(comment.status))) blockers.push('Existe comentário crítico não resolvido.');
  if (score < 70) blockers.push('Score técnico abaixo do limite mínimo de merge.');
  return blockers;
}

function buildNextActions(session: ReviewSession | undefined, blockers: string[]): string[] {
  if (!session) return ['Criar uma sessão de review vinculada à branch ou PR atual.'];
  if (blockers.length) return ['Resolver blockers críticos.', 'Revalidar findings corrigidos.', 'Atualizar status para fixed ou approved.'];
  if (session.status === 'APPROVED') return ['Executar merge ou exportar relatório final.'];
  return ['Executar validação arquitetural.', 'Gerar comentários IA.', 'Encerrar revisão com decisão formal.'];
}

function buildHotspots(files: string[], findings: ValidationFinding[]): AdvancedAnalyticsState['hotspots'] {
  const counts = new Map<string, ValidationFinding[]>();
  findings.forEach((finding) => counts.set(finding.file, [...(counts.get(finding.file) ?? []), finding]));
  return files.map((file) => {
    const fileFindings = counts.get(file) ?? [];
    const critical = fileFindings.filter((finding) => finding.severity === 'CRITICAL').length;
    const high = fileFindings.filter((finding) => finding.severity === 'HIGH').length;
    return {
      file,
      risk: Math.min(100, 20 + fileFindings.length * 12 + critical * 20 + high * 10),
      reasons: fileFindings.length ? fileFindings.slice(0, 3).map((finding) => finding.rule) : ['Arquivo alterado no contexto da revisão']
    };
  }).sort((a, b) => b.risk - a.risk).slice(0, 12);
}

function buildTrend(sessions: ReviewSession[]): AdvancedAnalyticsState['trend'] {
  return sessions.slice(0, 8).reverse().map((session, index) => ({
    label: session.sourceBranch || `S${index + 1}`,
    score: Math.max(0, 100 - session.findings.filter((finding) => finding.status !== 'APPROVED').length * 8 - session.comments.filter((comment) => comment.status === 'OPEN').length * 4)
  }));
}

function buildPresence(session?: ReviewSession): EnterpriseFeatureState['collaboration']['presence'] {
  if (!session) return [];
  return Array.from(new Set([session.author, session.reviewer, ...session.collaborationMessages.map((message) => message.author)]))
    .filter(Boolean)
    .map((user, index) => ({
      user,
      role: user === session.reviewer ? 'Lead' : 'Reviewer',
      file: session.changedFiles[index % Math.max(1, session.changedFiles.length)],
      status: index === 0 ? 'reviewing' : 'online'
    }));
}

function buildRecommendations(session: ReviewSession | undefined, score: number): EnterpriseFeatureState['organizationalIntelligence']['recommendations'] {
  const recommendations: EnterpriseFeatureState['organizationalIntelligence']['recommendations'] = [];
  if (!session) return [{ title: 'Criar review', description: 'Inicie uma sessão para ativar diagnóstico, IA e telemetria.', priority: 'high' }];
  if (score < 70) recommendations.push({ title: 'Bloquear merge', description: 'Score abaixo do limite. Priorize críticos e arquitetura.', priority: 'high' });
  if ((session.findings ?? []).some((finding) => finding.rule.toLowerCase().includes('solid'))) recommendations.push({ title: 'Revisar SOLID', description: 'Há reincidência de violações de responsabilidade e dependência.', priority: 'medium' });
  if (!(session.comments ?? []).length) recommendations.push({ title: 'Adicionar evidências', description: 'Inclua comentários técnicos para rastreabilidade da decisão.', priority: 'medium' });
  return recommendations.length ? recommendations : [{ title: 'Preparar encerramento', description: 'Sem blockers fortes. Gere relatório e finalize a decisão.', priority: 'low' }];
}

function riskFromScore(score: number, findings: ValidationFinding[]): AdvancedAnalyticsState['predictedRisk'] {
  if (findings.some((finding) => finding.severity === 'CRITICAL' && finding.status !== 'APPROVED') || score < 40) return 'critical';
  if (score < 65) return 'high';
  if (score < 85) return 'medium';
  return 'low';
}
