import { createHash } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { AIModelInfo, AIProvider, ReviewContext, SuggestedReviewComment } from '../../contracts';

interface OllamaTagsResponse {
  models?: Array<{ name?: string; model?: string }>;
}

interface OllamaGenerateResponse {
  response?: string;
}

export interface OllamaAIProviderOptions {
  baseUrl: string;
  model: string;
}

interface OllamaPromptContext {
  files: string[];
  reducedContext: string;
  diagnostics: string;
}

const COMMENT_CACHE = new Map<string, SuggestedReviewComment[]>();
const MAX_FILES = 3;
const MAX_CONTEXT_CHARS = 5200;
const MAX_COMMENT_CHARS = 180;

/**
 * Real Community AI provider backed by a user-owned Ollama runtime.
 *
 * The provider now optimizes prompts for local models: reduced context,
 * strict JSON output, short comments, cache and bounded generation timeout.
 */
export class OllamaAIProvider implements AIProvider {
  readonly id = 'community.ollama';
  readonly label: string;

  private readonly baseUrl: string;
  private readonly model: string;

  constructor(options: OllamaAIProviderOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.model = options.model;
    this.label = `Ollama · ${this.model}`;
  }

  async getModelInfo(): Promise<AIModelInfo> {
    const tags = await this.listModels();
    const available = tags.some((name) => name === this.model);

    return {
      provider: available ? 'ollama' : 'ollama-unavailable',
      model: available ? this.model : `${this.model} não encontrado em ${this.baseUrl}`,
      local: true
    };
  }

  async generateReviewComments(context: ReviewContext): Promise<SuggestedReviewComment[]> {
    const promptContext = buildPromptContext(context);
    const cacheKey = buildCacheKey(this.model, promptContext.reducedContext);
    const cached = COMMENT_CACHE.get(cacheKey);
    if (cached) return cached.map((comment) => ({ ...comment, id: `${comment.id}-cached-${Date.now()}` }));

    const prompt = buildTechnicalReviewPrompt(promptContext);
    const response = await this.generate(prompt);
    const parsed = parseOllamaComments(response, context, this.model);
    const normalized = normalizeComments(parsed, context, this.model);

    COMMENT_CACHE.set(cacheKey, normalized);
    return normalized;
  }

  async summarizeReview(context: ReviewContext): Promise<string> {
    const files = context.changedFiles?.slice(0, MAX_FILES).join(', ') || 'nenhum arquivo alterado';
    return this.generate([
      'Resuma tecnicamente este review em português.',
      'Máximo 2 frases. Sem introdução.',
      `Arquivos alterados: ${files}`
    ].join('\n'));
  }

  private async listModels(): Promise<string[]> {
    const data = await requestJson<OllamaTagsResponse>(`${this.baseUrl}/api/tags`, { timeoutMs: 2500 });
    return (data.models ?? [])
      .map((model) => model.name ?? model.model ?? '')
      .filter(Boolean);
  }

  private async generate(prompt: string): Promise<string> {
    const data = await requestJson<OllamaGenerateResponse>(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 320,
          top_p: 0.8
        }
      }),
      timeoutMs: 20000
    });
    return data.response ?? '';
  }
}

function buildPromptContext(context: ReviewContext): OllamaPromptContext {
  const files = (context.changedFiles ?? []).filter(Boolean).slice(0, MAX_FILES);
  const rawContext = context.diff ?? 'sem contexto detalhado disponível';
  const diagnostics = extractDiagnostics(rawContext);
  const reducedContext = reduceContext(rawContext, files);

  return {
    files,
    diagnostics,
    reducedContext
  };
}

function reduceContext(value: string, files: string[]): string {
  const sections = value.split(/\n###\s+/g);
  const selected = sections
    .filter((section, index) => index === 0 || files.some((file) => section.startsWith(file) || section.includes(file)))
    .slice(0, MAX_FILES + 1)
    .join('\n### ');

  const compact = selected
    .split('\n')
    .filter((line) => !line.trim().startsWith('import ') || line.length < 120)
    .slice(0, 180)
    .join('\n');

  return compact.length > MAX_CONTEXT_CHARS ? `${compact.slice(0, MAX_CONTEXT_CHARS)}\n// contexto reduzido` : compact;
}

function extractDiagnostics(value: string): string {
  const start = value.indexOf('Findings existentes:');
  if (start < 0) return 'sem diagnostics determinísticos';
  const end = value.indexOf('Arquivos e trechos relevantes:', start);
  return value.slice(start, end > start ? end : start + 900).slice(0, 900);
}

function buildTechnicalReviewPrompt(context: OllamaPromptContext): string {
  const files = context.files.length ? context.files.map((file) => `- ${file}`).join('\n') : '- review-context';

  return [
    'Você é um revisor técnico sênior de software.',
    'Gere comentários automáticos para code review. O humano irá aprovar, editar ou descartar.',
    '',
    'REGRAS OBRIGATÓRIAS:',
    '- Retorne somente JSON válido. Sem markdown. Sem texto fora do JSON.',
    '- Gere no máximo 3 comentários.',
    `- Cada body deve ter no máximo ${MAX_COMMENT_CHARS} caracteres.`,
    '- Cada rationale deve ter no máximo 140 caracteres.',
    '- Use uma frase curta por comentário.',
    '- Não escreva introdução, conclusão ou explicação longa.',
    '- Priorize SRP, baixo acoplamento, arquitetura em camadas, tratamento de erro e testes.',
    '- Se não houver problema real, retorne {"comments":[]}.',
    '',
    'FORMATO EXATO:',
    '{"comments":[{"file":"src/exemplo.ts","line":1,"severity":"MEDIUM","body":"Classe mistura persistência e geração de relatório.","rationale":"Possível violação de SRP."}]}',
    '',
    `Arquivos alterados:\n${files}`,
    '',
    `Diagnostics determinísticos:\n${context.diagnostics}`,
    '',
    `Contexto reduzido:\n${context.reducedContext}`
  ].join('\n');
}

function parseOllamaComments(response: string, context: ReviewContext, model: string): SuggestedReviewComment[] {
  const raw = response.trim();
  if (!raw) return [];

  const json = extractJson(raw);
  if (json) {
    try {
      const parsed = JSON.parse(json) as { comments?: Array<Partial<SuggestedReviewComment>> } | Array<Partial<SuggestedReviewComment>>;
      const comments = Array.isArray(parsed) ? parsed : Array.isArray(parsed.comments) ? parsed.comments : [];
      return comments
        .filter((comment) => typeof comment.body === 'string' && comment.body.trim())
        .slice(0, 3)
        .map((comment, index) => ({
          id: `ollama-ai-comment-${Date.now()}-${index + 1}`,
          file: typeof comment.file === 'string' && comment.file.trim() ? comment.file : context.changedFiles?.[0] ?? 'review-context',
          line: typeof comment.line === 'number' && comment.line > 0 ? Math.floor(comment.line) : 1,
          severity: normalizeSeverity(comment.severity),
          body: limitSentence(comment.body!, MAX_COMMENT_CHARS),
          source: 'ai',
          rationale: typeof comment.rationale === 'string' && comment.rationale.trim()
            ? limitSentence(comment.rationale, 140)
            : `Gerado pelo Ollama com ${model}.`,
          requiresHumanApproval: true
        }));
    } catch {
      // Fallback below for local models that return prose around JSON.
    }
  }

  return [{
    id: `ollama-ai-comment-${Date.now()}-1`,
    file: context.changedFiles?.[0] ?? 'review-context',
    line: 1,
    severity: 'MEDIUM',
    body: limitSentence(raw, MAX_COMMENT_CHARS),
    source: 'ai',
    rationale: `Resposta não estruturada do Ollama com ${model}; exige validação humana.`,
    requiresHumanApproval: true
  }];
}

function normalizeComments(comments: SuggestedReviewComment[], context: ReviewContext, model: string): SuggestedReviewComment[] {
  return comments.slice(0, 3).map((comment, index) => ({
    ...comment,
    id: comment.id || `ollama-ai-comment-${Date.now()}-${index + 1}`,
    file: comment.file || context.changedFiles?.[0] || 'review-context',
    line: Math.max(1, Number(comment.line) || 1),
    severity: normalizeSeverity(comment.severity),
    body: limitSentence(comment.body, MAX_COMMENT_CHARS),
    rationale: limitSentence(comment.rationale || `Gerado pelo Ollama com ${model}.`, 140),
    requiresHumanApproval: true,
    source: 'ai'
  }));
}

function limitSentence(value: string, maxLength: number): string {
  const clean = value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[-*•\d.)\s]+/, '')
    .trim();
  const firstSentence = clean.match(/^(.+?[.!?])\s/)?.[1] ?? clean;
  return firstSentence.length <= maxLength ? firstSentence : `${firstSentence.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function buildCacheKey(model: string, context: string): string {
  return createHash('sha1').update(`${model}\n${context}`).digest('hex');
}

function extractJson(value: string): string | undefined {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  if (fenced?.startsWith('{') || fenced?.startsWith('[')) return fenced;
  const objectStart = value.indexOf('{');
  const objectEnd = value.lastIndexOf('}');
  if (objectStart >= 0 && objectEnd > objectStart) return value.slice(objectStart, objectEnd + 1);
  const arrayStart = value.indexOf('[');
  const arrayEnd = value.lastIndexOf(']');
  if (arrayStart >= 0 && arrayEnd > arrayStart) return value.slice(arrayStart, arrayEnd + 1);
  return undefined;
}

function normalizeSeverity(value: unknown): SuggestedReviewComment['severity'] {
  return value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' || value === 'CRITICAL' ? value : 'MEDIUM';
}

function requestJson<T>(url: string, options: { method?: string; body?: string; timeoutMs?: number } = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const request = parsed.protocol === 'https:' ? httpsRequest : httpRequest;
    const req = request({
      method: options.method ?? 'GET',
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: `${parsed.pathname}${parsed.search}`,
      headers: options.body ? {
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(options.body)
      } : undefined,
      timeout: options.timeoutMs ?? 2500
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`Ollama respondeu HTTP ${res.statusCode ?? 'desconhecido'}: ${body}`));
          return;
        }
        try {
          resolve(JSON.parse(body) as T);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`Timeout ao conectar em ${url}`));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}
