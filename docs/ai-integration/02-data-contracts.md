# Contratos de Dados da IA

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
