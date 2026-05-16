# Usage

Guia rápido para instalar, configurar e usar a extensão AI Code Review.

## Requisitos

- Node.js instalado.
- VS Code instalado.
- Um workspace Git aberto no VS Code.
- Opcional: Ollama local rodando para usar provider `ollama`.
- Opcional: chave OpenAI/Gemini/Claude para usar providers Cloud.

## Preparar o Projeto

```bash
npm install
npm run build
```

## Gerar o Pacote VS Code

```bash
npm run package:vscode
```

O pacote será gerado em:

```text
apps/vscode/git-code-review-2.1.0.vsix
```

## Instalar no VS Code

1. Abra o VS Code.
2. Abra a paleta de comandos (`Ctrl+Shift+P`).
3. Execute `Extensions: Install from VSIX...`.
4. Selecione o arquivo `.vsix` gerado.
5. Recarregue o VS Code se solicitado.

## Fluxo de Uso

1. **Configurar Provider**: Execute `Code Review: Set AI Provider`.
2. **Indexar RAG**: Execute `Code Review: Setup RAG` para dar contexto do projeto à IA.
3. **Analisar**: 
   - Arquivo atual: `Code Review: Analyze Code with IA` (`Ctrl+Alt+R`).
   - Workspace: `Code Review: Analyze Entire Workspace`.
4. **Revisar Findings**: Abra a view `AI Review` no sidebar.
5. **Ações**:
   - `Approve`: Aceita a sugestão e cria um diagnostic inline.
   - `Reject`: Rejeita e ensina a IA sobre suas preferências.
   - `Apply Fix`: Aplica automaticamente a correção sugerida (Smart Fix).

## Funcionalidades Avançadas

- **Project AI Chat**: Converse com a IA sobre o código usando contexto total (RAG + AST).
- **PR Summary**: Gere descrições técnicas de Pull Requests automaticamente.
- **Relatório de Qualidade**: Gere diagnósticos de SOLID, Complexidade e Testabilidade.
- **Data Masking**: Seus dados sensíveis são ofuscados localmente antes do envio para a nuvem.
- **Cloud Sync (VPS)**: Sincronize sessões de review entre diferentes ambientes via VPS.

## Providers de IA

A extensão suporta múltiplos provedores, configuráveis via `Code Review: Set AI Provider`:
- **Ollama**: 100% local e privado.
- **OpenAI / Gemini / Claude**: Alta performance via API Cloud.
- **Mock**: Para testes e demonstração offline.

## Troubleshooting

- **Hardware Overload**: A execução do Stryker (testes de mutação) está limitada a 2 workers para evitar sobrecarga.
- **Sessão Antiga**: Use `Code Review: Clear Current Review Session` se a extensão parecer "presa".
- **RAG sem Contexto**: Certifique-se de ter rodado `Code Review: Setup RAG` em um repositório Git.
