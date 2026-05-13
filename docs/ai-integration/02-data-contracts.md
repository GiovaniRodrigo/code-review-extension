# Contratos de Dados da IA

> Para os contratos operacionais de resposta da IA, incluindo findings, validação de finding, sugestão de correção e fallback, consulte [06-execution-guidelines.md](./06-execution-guidelines.md).

## 1. Entrada da IA (AIAnalysisInput)
Contém o contexto necessário para a análise:
- SessionId, Branch, PR.
- Prompt de validação.
- Arquivos (caminho, conteúdo, diff).
- Contexto técnico (linguagem, framework).

## 2. Saída da IA (AIAnalysisResult)
Retorno estruturado da análise:
- Confidence score.
- Lista de diagnósticos (arquivo, linha, severidade, mensagem, sugestão).
- Status inicial sempre como `pending`.
