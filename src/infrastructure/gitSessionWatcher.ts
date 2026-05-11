import * as vscode from 'vscode';
import { GitContext } from '../domain';
import { GitService } from '../application';

export interface GitSessionWatcherOptions {
  gitService: GitService;
  onContextChanged: (git: GitContext) => Promise<void>;
  intervalMs?: number;
}

export function registerGitSessionWatcher(
  context: vscode.ExtensionContext,
  options: GitSessionWatcherOptions
): void {
  const lifecycle = new WatcherLifecycleScope();
  const watcher = new GitSessionWatcher(options, lifecycle);

  lifecycle.add(watcher);
  lifecycle.add(vscode.window.onDidChangeWindowState((state) => {
    if (state.focused) void watcher.checkNow();
  }));
  lifecycle.add(vscode.workspace.onDidChangeWorkspaceFolders(() => void watcher.checkNow()));

  context.subscriptions.push(lifecycle);

  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (gitExtension) {
    void gitExtension.activate().then((api) => {
      if (lifecycle.disposed) return;

      const gitApi = api?.getAPI?.(1);
      const repositories = gitApi?.repositories ?? [];

      for (const repository of repositories) {
        if (lifecycle.disposed) return;
        lifecycle.add(repository.state.onDidChange(() => void watcher.checkNow()));
      }

      const repoDisposable = gitApi?.onDidOpenRepository?.((repository: any) => {
        if (lifecycle.disposed) return;
        lifecycle.add(repository.state.onDidChange(() => void watcher.checkNow()));
        void watcher.checkNow();
      });

      if (repoDisposable) lifecycle.add(repoDisposable);
      void watcher.checkNow();
    }).catch(() => {
      // Git integration is optional; the interval fallback keeps the session context updated.
    });
  }

  void watcher.checkNow();
}

class WatcherLifecycleScope implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];
  private isDisposed = false;

  get disposed(): boolean {
    return this.isDisposed;
  }

  add(disposable: vscode.Disposable): void {
    if (this.isDisposed) {
      disposable.dispose();
      return;
    }

    this.disposables.push(disposable);
  }

  dispose(): void {
    if (this.isDisposed) return;
    this.isDisposed = true;

    while (this.disposables.length > 0) {
      this.disposables.pop()?.dispose();
    }
  }
}

class GitSessionWatcher implements vscode.Disposable {
  private lastKey = '';
  private isChecking = false;
  private hasPendingCheck = false;
  private readonly timer: NodeJS.Timeout;
  private pendingTimer: NodeJS.Timeout | undefined;

  constructor(
    private readonly options: GitSessionWatcherOptions,
    private readonly lifecycle: WatcherLifecycleScope
  ) {
    this.timer = setInterval(() => void this.checkNow(), options.intervalMs ?? 12000);
  }

  async checkNow(): Promise<void> {
    if (this.lifecycle.disposed) return;

    if (this.isChecking) {
      this.hasPendingCheck = true;
      return;
    }

    this.isChecking = true;
    try {
      const git = await this.options.gitService.getContext();
      if (this.lifecycle.disposed) return;

      const nextKey = buildContextKey(git);

      if (nextKey !== this.lastKey) {
        this.lastKey = nextKey;
        await this.options.onContextChanged(git);
      }
    } finally {
      this.isChecking = false;
      if (this.hasPendingCheck && !this.lifecycle.disposed) {
        this.hasPendingCheck = false;
        this.pendingTimer = setTimeout(() => void this.checkNow(), 250);
      }
    }
  }

  dispose(): void {
    clearInterval(this.timer);
    if (this.pendingTimer) clearTimeout(this.pendingTimer);
  }
}

function buildContextKey(git: GitContext): string {
  const pr = git.pullRequestId?.trim();
  if (pr) return `pr:${pr}:${git.baseBranch ?? ''}`.toLowerCase();
  return `branch:${git.currentBranch ?? ''}:${git.baseBranch ?? ''}`.toLowerCase();
}
