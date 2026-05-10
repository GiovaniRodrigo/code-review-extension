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
  const watcher = new GitSessionWatcher(options);

  context.subscriptions.push(
    watcher,
    vscode.window.onDidChangeWindowState((state) => {
      if (state.focused) void watcher.checkNow();
    }),
    vscode.workspace.onDidChangeWorkspaceFolders(() => void watcher.checkNow())
  );

  // Git extension event when available.
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (gitExtension) {
    void gitExtension.activate().then((api) => {
      const gitApi = api?.getAPI?.(1);
      const repositories = gitApi?.repositories ?? [];

      for (const repository of repositories) {
        const disposable = repository.state.onDidChange(() => void watcher.checkNow());
        context.subscriptions.push(disposable);
      }

      const repoDisposable = gitApi?.onDidOpenRepository?.((repository: any) => {
        const disposable = repository.state.onDidChange(() => void watcher.checkNow());
        context.subscriptions.push(disposable);
        void watcher.checkNow();
      });

      if (repoDisposable) context.subscriptions.push(repoDisposable);
      void watcher.checkNow();
    });
  }

  void watcher.checkNow();
}

class GitSessionWatcher implements vscode.Disposable {
  private lastKey = '';
  private readonly timer: NodeJS.Timeout;

  constructor(private readonly options: GitSessionWatcherOptions) {
    this.timer = setInterval(() => void this.checkNow(), options.intervalMs ?? 2000);
  }

  async checkNow(): Promise<void> {
    const git = await this.options.gitService.getContext();
    const nextKey = buildContextKey(git);

    if (nextKey === this.lastKey) return;

    this.lastKey = nextKey;
    await this.options.onContextChanged(git);
  }

  dispose(): void {
    clearInterval(this.timer);
  }
}

function buildContextKey(git: GitContext): string {
  const pr = git.pullRequestId?.trim();
  if (pr) return `pr:${pr}:${git.baseBranch ?? ''}`.toLowerCase();
  return `branch:${git.currentBranch ?? ''}:${git.baseBranch ?? ''}`.toLowerCase();
}
