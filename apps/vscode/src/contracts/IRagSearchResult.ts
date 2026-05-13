export interface IRagSearchResult {

    file: string;

    content: string;

    score: number;

    startLine: number;

    endLine: number;
}