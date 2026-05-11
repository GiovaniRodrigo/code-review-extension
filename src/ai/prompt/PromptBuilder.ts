
export interface PromptContext {
  fileName: string;
  code: string;
}

export class PromptBuilder {
  buildTechnicalReview(input: PromptContext): string {
    return `
Você é um revisor técnico de software.

Analise o código abaixo.

Regras:
- Responda curto
- Seja técnico
- Identifique problemas arquiteturais
- Cite SOLID quando aplicável
- Máximo 3 comentários
- Retorne JSON válido

Formato:
[
  {
    "severity": "warning",
    "title": "Violação de SRP",
    "message": "A classe possui múltiplas responsabilidades"
  }
]

Arquivo:
${input.fileName}

Código:
${input.code}
`;
  }
}
