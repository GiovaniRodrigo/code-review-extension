import { IRagSearchResult } from './IRagSearchResult';

export interface IRagProvider {

    indexRepository(): Promise<void>;

    search(
        query: string,
        limit?: number
    ): Promise<IRagSearchResult[]>;
}