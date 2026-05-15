import { CodeReviewRepositoryPort } from './ports/review/CodeReviewRepositoryPort';
import { FindingSeverity } from '@code-review/domain';

export interface FileHeat {
  file: string;
  score: number;
  findingCount: number;
  severityDistribution: Record<FindingSeverity, number>;
}

export class HeatmapService {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async calculateHeatmap(): Promise<FileHeat[]> {
    const sessions = await this.repository.getAllSessions();
    const fileMap = new Map<string, FileHeat>();

    for (const session of sessions) {
      for (const finding of session.findings) {
        // We only count approved or pending findings as "heat"
        if (finding.status === 'rejected') continue;

        let heat = fileMap.get(finding.file);
        if (!heat) {
          heat = {
            file: finding.file,
            score: 0,
            findingCount: 0,
            severityDistribution: { info: 0, warning: 0, error: 0 }
          };
          fileMap.set(finding.file, heat);
        }

        heat.findingCount++;
        heat.severityDistribution[finding.severity]++;
        heat.score += this._scoreForSeverity(finding.severity);
      }
    }

    return [...fileMap.values()].sort((a, b) => b.score - a.score);
  }

  private _scoreForSeverity(severity: FindingSeverity): number {
    switch (severity) {
      case 'error': return 20;
      case 'warning': return 8;
      case 'info': return 2;
      default: return 0;
    }
  }
}
