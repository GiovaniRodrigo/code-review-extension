export class RagPromptBuilder {

    build(
        diff: string,
        context: string
    ): string {

        return `
Você é um especialista em code review.

CONTEXTO:
${context}

DIFF:
${diff}

Analise:
- bugs
- arquitetura
- SOLID
- segurança
- performance
- legibilidade
`;
    }
}