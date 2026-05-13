import * as https from 'https';
import * as vscode from 'vscode';

import { IEmbeddingProvider }
    from '../../../contracts/IEmbeddingProvider';

export class OpenAIEmbeddingProvider
    implements IEmbeddingProvider {

    constructor(
        private readonly secrets:
            vscode.SecretStorage
    ) { }

    async generateEmbedding(
        text: string
    ): Promise<number[]> {

        const apiKey =
            await this.secrets.get(
                'codeReview.openai.apiKey'
            );

        if (!apiKey) {
            throw new Error(
                'OpenAI API key não configurada.'
            );
        }

        return new Promise(
            (resolve, reject) => {

                const body =
                    JSON.stringify({
                        model:
                            'text-embedding-3-small',

                        input:
                            text
                    });

                const request =
                    https.request(
                        {
                            hostname:
                                'api.openai.com',

                            path:
                                '/v1/embeddings',

                            method:
                                'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                'Content-Length':
                                    Buffer.byteLength(body),

                                Authorization:
                                    `Bearer ${apiKey}`
                            }
                        },

                        response => {

                            let data = '';

                            response.on(
                                'data',
                                chunk => {
                                    data += chunk;
                                }
                            );

                            response.on(
                                'end',
                                () => {

                                    try {

                                        const json =
                                            JSON.parse(data);

                                        if (
                                            json.error
                                        ) {

                                            reject(
                                                new Error(
                                                    json.error.message
                                                )
                                            );

                                            return;
                                        }

                                        resolve(
                                            json.data[0]
                                                .embedding
                                        );

                                    } catch (error) {

                                        reject(error);
                                    }
                                }
                            );
                        }
                    );

                request.on(
                    'error',
                    error => {
                        reject(error);
                    }
                );

                request.write(body);

                request.end();
            }
        );
    }
}