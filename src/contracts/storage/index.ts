import { ReviewSession } from '../../domain';

export interface ReviewStorage {
  list(): Promise<ReviewSession[]>;
  save(session: ReviewSession): Promise<void>;
  getById(id: string): Promise<ReviewSession | undefined>;
}
