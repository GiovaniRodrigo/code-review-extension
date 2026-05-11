
export interface AIComment {
  severity: string;
  title: string;
  message: string;
}

export class AICommentParser {
  parse(response: string): AIComment[] {
    try {
      return JSON.parse(response);
    } catch {
      return [];
    }
  }
}
