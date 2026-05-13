import { Finding } from '@code-review/domain';

export interface CodeReviewDTO {
  id: string;
  branch: string;
  findings: Finding[];
  createdAt: Date;
  updatedAt: Date;
}
