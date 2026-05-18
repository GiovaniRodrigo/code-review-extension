import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ResolveGitBaseBranchOptions {
  explicitBaseBranch?: unknown;
  configuredBaseBranch?: string;
  workspacePath?: string;
  currentBranch?: string;
  askWhenMissing?: boolean;
}

const DEFAULT_BASE_BRANCH_CANDIDATES = [
  'origin/main',
  'main',
  'origin/master',
  'master',
  'origin/develop',
  'develop',
  'origin/dev',
  'dev',
  'origin/staging',
  'staging'
];

export async function resolveGitBaseBranch(options: ResolveGitBaseBranchOptions): Promise<string | undefined> {
  const workspacePath = options.workspacePath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  const explicit = normalizeBaseBranch(options.explicitBaseBranch);
  const configured = normalizeBaseBranch(options.configuredBaseBranch);

  if (!workspacePath) {
    return explicit || configured;
  }

  const candidates = buildCandidates(explicit, configured, options.currentBranch);

  for (const candidate of candidates) {
    if (await gitRefExists(workspacePath, candidate)) {
      return candidate;
    }
  }

  if (!options.askWhenMissing) {
    return undefined;
  }

  const manual = await vscode.window.showInputBox({
    title: 'Choose Git base branch',
    prompt: 'No base branch was detected automatically. Enter a base branch to compare against, or leave empty to cancel branch review.',
    placeHolder: 'origin/main, main, origin/develop, develop... ',
    ignoreFocusOut: true,
    value: configured || ''
  });

  const typed = normalizeBaseBranch(manual);
  return typed || undefined;
}

export function buildCandidates(explicit?: string, configured?: string, currentBranch?: string): string[] {
  const seed = [explicit, configured, ...DEFAULT_BASE_BRANCH_CANDIDATES]
    .filter((value): value is string => Boolean(value && value.trim()))
    .flatMap(expandBranchCandidate);

  const current = currentBranch?.trim();
  return Array.from(new Set(seed)).filter(candidate => candidate !== current && candidate !== `origin/${current}`);
}

function expandBranchCandidate(branch: string): string[] {
  const normalized = branch.trim();
  if (!normalized) return [];

  if (normalized.startsWith('origin/')) {
    return [normalized, normalized.replace(/^origin\//, '')];
  }

  return [normalized, `origin/${normalized}`];
}

function normalizeBaseBranch(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

async function gitRefExists(workspacePath: string, ref: string): Promise<boolean> {
  try {
    await execFileAsync('git', ['rev-parse', '--verify', ref], { cwd: workspacePath });
    return true;
  } catch {
    return false;
  }
}
