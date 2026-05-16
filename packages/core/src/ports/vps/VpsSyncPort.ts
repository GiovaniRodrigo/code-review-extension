import { ReviewSession } from '@code-review/domain';

export interface VpsSyncPort {
  authenticate(credentials: any): Promise<void>;
  pushSession(session: ReviewSession): Promise<void>;
  pullSession(branch: string): Promise<ReviewSession | null>;
  checkHealth(): Promise<boolean>;
}
