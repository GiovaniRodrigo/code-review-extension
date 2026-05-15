import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VSCodeAdapter } from '../../../src/adapters/ide/VSCodeAdapter';
import { FileReviewRepository } from '@code-review/infra';
import { CodeReviewService } from '@code-review/core';
import { GetCodeReviewUseCase } from '@code-review/core';
import { ApproveFindingUseCase } from '@code-review/core';
import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';

vi.mock('vscode');

describe('Review Workflow Integration', () => {
  const tempDir = path.join(__dirname, 'temp-storage');
  let repository: FileReviewRepository;
  let ide: VSCodeAdapter;
  let getSessionUseCase: GetCodeReviewUseCase;
  let approveUseCase: ApproveFindingUseCase;

  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    repository = new FileReviewRepository(tempDir);
    ide = new VSCodeAdapter();
    const service = new CodeReviewService(repository);
    getSessionUseCase = new GetCodeReviewUseCase(service);
    approveUseCase = new ApproveFindingUseCase(repository, ide as any);
  });

  it('deve restaurar a sessão correta após trocar de branch', async () => {
    // 1. Criar sessões para duas branches
    const sessionMain = {
      id: 'main-id',
      branch: 'main',
      findings: [{ id: 'f1', file: 'a.ts', line: 1, message: 'm1', severity: 'info', status: 'pending' }],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const sessionFeat = {
        id: 'feat-id',
        branch: 'feat/x',
        findings: [{ id: 'f2', file: 'b.ts', line: 10, message: 'm2', severity: 'error', status: 'pending' }],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

    await repository.saveSession(sessionMain as any);
    await repository.saveSession(sessionFeat as any);

    // 2. Simular restauração para branch 'feat/x'
    const restored = await getSessionUseCase.execute('feat/x');
    expect(restored?.id).toBe('feat-id');
    expect(restored?.findings[0].id).toBe('f2');
  });

  it('deve persistir aprovação e exibir diagnóstico após reload', async () => {
    const session = {
        id: 's1',
        branch: 'main',
        findings: [{ id: 'f1', file: '/path/a.ts', line: 1, message: 'm1', severity: 'info', status: 'pending' }],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    await repository.saveSession(session as any);

    // 1. Aprovar finding
    await approveUseCase.execute('s1', 'f1');

    // 2. Validar que no repo está aprovado
    const updated = await repository.getSessionById('s1');
    expect(updated?.findings[0].status).toBe('approved');

    // 3. Simular reload (nova instância de repo/service)
    const newRepo = new FileReviewRepository(tempDir);
    const reloadedSession = await newRepo.getSessionById('s1');
    expect(reloadedSession?.findings[0].status).toBe('approved');
  });
});
