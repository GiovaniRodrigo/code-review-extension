export type VectorChunk = {

    id: string;

    embedding: number[];

    metadata: {

        file: string;

        language: string;

        startLine: number;

        endLine: number;
    };

    content: string;
};