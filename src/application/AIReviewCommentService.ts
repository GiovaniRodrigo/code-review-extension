import { addReviewComment, ReviewSession, ValidationSeverity } from '../domain';
import { AIProvider, SuggestedReviewComment } from '../contracts';
import { AuditService, ReviewSessionRepository, SourceFileProvider } from './interfaces';

export interface AIReviewCommentsResult {
  session: ReviewSession;
  generatedCount: number;
  provider: string;
  comments: ReviewSession['comments'];
}

/**
 * Orchestrates the real AI review-comment pipeline.
 *
 * The UI never receives fabricated comments. This service only persists
 * comments returned by a configured AIProvider, normally Ollama in Community.
 */
export class AIReviewCommentService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly sourceFileProvider?: SourceFileProvider,
    private readonly auditService?: AuditService,
    private readonly aiProvider?: AIProvider
  ) {}

  async generate(id: string, user: string, language = 'pt-BR'): Promise<AIReviewCommentsResult> {
    const session = await this.getExistingSession(id);
    if (!this.aiProvider || this.aiProvider.id === 'community.local-ai-unconfigured') {
      throw new Error('IA local não configurada. Configure Ollama em giovaniCodeReview.ai.* para gerar comentários automáticos reais.');
    }

    const changedFiles = this.resolveChangedFiles(session);
    if (!changedFiles.length) {
      throw new Error('Nenhum arquivo alterado foi identificado para montar o contexto da IA.');
    }

    const sourceFiles = await this.sourceFileProvider?.readFiles(changedFiles) ?? [];
    const diff = buildAIContext(session, sourceFiles);
    const model = await this.aiProvider.getModelInfo();
    if (model.provider.includes('unavailable')) {
      throw new Error(`Provider de IA indisponível: ${model.model}`);
    }

    const suggestions = await this.aiProvider.generateReviewComments({
      session,
      changedFiles,
      diff,
      language
    });

    const usableSuggestions = suggestions
      .filter((suggestion) => suggestion.body?.trim())
      .slice(0, 3);

    if (!usableSuggestions.length) {
      throw new Error('A IA respondeu, mas não retornou comentários técnicos utilizáveis.');
    }

    const beforeCount = session.comments.length;
    const updated = usableSuggestions.reduce((current, suggestion, index) => {
      if (hasEquivalentAIComment(current, suggestion)) return current;
      return addReviewComment(current, {
        body: formatAIComment(suggestion, this.aiProvider!.label),
        author: `IA · ${this.aiProvider!.label}`,
        file: suggestion.file || changedFiles[0],
        line: Math.max(1, suggestion.line || 1),
        commit: current.commits[0]?.split(' ')[0] ?? 'HEAD',
        threadId: `ai-${current.id}-${Date.now()}-${index + 1}`,
        severity: normalizeSeverity(suggestion.severity),
        status: 'NEEDS_CHANGES'
      });
    }, session);

    await this.repository.saveCurrent(updated);
    await this.auditService?.registerSessionSnapshot(updated);

    const generated = updated.comments.slice(beforeCount);
    return {
      session: updated,
      generatedCount: generated.length,
      provider: `${model.provider} · ${model.model}`,
      comments: generated
    };
  }

  private async getExistingSession(id: string): Promise<ReviewSession> {
    const session = await this.repository.getById(id);
    if (!session) throw new Error(`Review session nao encontrada: ${id}`);
    return session;
  }

  private resolveChangedFiles(session: ReviewSession): string[] {
    const fromSession = session.changedFiles ?? [];
    const fromFindings = (session.findings ?? []).map((finding) => finding.file);
    const fromComments = (session.comments ?? []).map((comment) => comment.file);
    return Array.from(new Set([...fromSession, ...fromFindings, ...fromComments].filter(Boolean))).slice(0, 12);
  }
}

function buildAIContext(session: ReviewSession, sourceFiles: Array<{ path: string; content: string }>): string {
  const findings = (session.findings ?? [])
    .slice(0, 5)
    .map((finding) => `- ${finding.rule} ${finding.severity} em ${finding.file}:${finding.line}: ${finding.description}`)
    .join('\n');

  const snippets = sourceFiles
    .slice(0, 3)
    .map((file) => `### ${file.path}\n${extractRelevantSnippet(file.content)}`)
    .join('\n\n');

  return [
    `Sessão: ${session.title}`,
    `Branch: ${session.sourceBranch} -> ${session.targetBranch}`,
    findings ? `Findings existentes:\n${findings}` : 'Findings existentes: nenhum',
    snippets ? `Arquivos e trechos relevantes:\n${snippets}` : 'Arquivos e trechos relevantes: indisponíveis'
  ].join('\n\n');
}

function hasEquivalentAIComment(session: ReviewSession, suggestion: SuggestedReviewComment): boolean {
  const normalizedBody = normalizeText(suggestion.body);
  return session.comments.some((comment) =>
    comment.author.startsWith('IA ·')
    && comment.file === suggestion.file
    && normalizeText(comment.body).includes(normalizedBody.slice(0, 100))
  );
}

function formatAIComment(suggestion: SuggestedReviewComment, providerLabel: string): string {
  const rationale = suggestion.rationale?.trim();
  const summary = limitText(suggestion.body.trim(), 180);
  return [
    `[IA:${providerLabel}] Comentário técnico automático`,
    summary,
    rationale ? `Motivo: ${limitText(rationale, 140)}` : '',
    'Ação: validar, editar ou descartar.'
  ].filter(Boolean).join('\n');
}

function extractRelevantSnippet(content: string): string {
  return content
    .split('\n')
    .slice(0, 180)
    .join('\n')
    .slice(0, 5200);
}

function limitText(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trim()}…`;
}

function normalizeSeverity(severity: string | undefined): ValidationSeverity {
  if (severity === 'LOW' || severity === 'MEDIUM' || severity === 'HIGH' || severity === 'CRITICAL') return severity;
  return 'MEDIUM';
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
