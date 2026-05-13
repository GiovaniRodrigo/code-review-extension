# Design Patterns do Sistema

Este documento define os padrões arquiteturais, princípios de design, regras estruturais e diretrizes obrigatórias para implementação da extensão multi-IDE de code review com IA.

Todo novo módulo, feature, provider, adapter, tela, analyzer ou integração deve seguir este documento.

---

# 1. Objetivos Arquiteturais

O design do sistema deve priorizar:

- Baixo acoplamento
- Alta coesão
- Escalabilidade
- Extensibilidade
- Testabilidade
- Reutilização
- Modularidade
- Manutenibilidade
- Clareza estrutural
- Separação de responsabilidades
- Baixo custo de inferência de IA
- Respostas previsíveis da IA
- Funcionamento offline sempre que possível

---

# 2. Princípio Central

A IA deve atuar como componente auxiliar de análise, não como centro absoluto da decisão técnica.

```text
Menos contexto.
Menos etapas.
Menos explicação.
Mais objetividade.
Mais estrutura.
Mais previsibilidade.
```

O core deve continuar funcional sem provider concreto de IA. Analyzers locais, AST, regras determinísticas e validações de schema devem reduzir o trabalho da IA antes de qualquer chamada externa.

---

# 3. Padrões de Estrutura e Comportamento

O sistema utiliza padrões consagrados para garantir flexibilidade, desacoplamento e extensibilidade.

## 3.1 Adapter Pattern

Desacopla o núcleo das APIs específicas das IDEs, como VS Code, JetBrains, Vim, Neovim, Sublime, Zed e Eclipse.

### Objetivos

- Isolar detalhes da IDE.
- Permitir suporte multi-IDE.
- Evitar dependência direta do core com APIs externas.
- Permitir que uma IDE seja substituída sem alterar casos de uso.

### Aplicações

- `VSCodeIdeAdapter`
- `VSCodeWorkspaceAdapter`
- `VSCodeNotificationAdapter`
- `JetBrainsIdeAdapter`
- `NeovimIdeAdapter`

### Regra

Código de domínio e aplicação não pode importar APIs específicas de IDE.

---

## 3.2 Strategy Pattern

Permite trocar estratégias de execução em tempo de execução.

### Objetivos

- Permitir múltiplas implementações de IA.
- Reduzir condicionais.
- Facilitar extensão de providers.
- Suportar execução local, remota ou integrada à IDE.

### Aplicações

```text
AIProviderPort
├── IDEIntegratedAIProvider
├── LocalLLMProvider
├── OllamaProvider
├── OpenAIProvider
├── CloudAIProvider
└── CustomAPIProvider
```

### Regra

O core deve depender apenas de `AIProviderPort`, nunca de `OpenAIProvider`, `OllamaProvider` ou qualquer implementação concreta.

---

## 3.3 Repository Pattern

Abstrai persistência de dados.

### Objetivos

- Desacoplar regras de negócio da persistência.
- Facilitar troca de banco.
- Melhorar testabilidade.
- Permitir persistência local desacoplada.

### Aplicações

- Sessões de review
- Findings
- Diagnósticos
- Cache
- Embeddings
- Logs
- Configurações locais

### Regra

Casos de uso não devem conhecer SQLite, storage da IDE, arquivos locais ou APIs externas.

---

## 3.4 Command Pattern

Representa ações do usuário como objetos ou handlers.

### Objetivos

- Padronizar execução de comandos.
- Facilitar automação.
- Permitir histórico, replay e rollback quando aplicável.
- Isolar orquestração de ações da UI.

### Aplicações

- `AnalyzePrCommandHandler`
- `SyncRemotePRCommandHandler`
- `SyncGitLabMRCommand`
- Comandos de análise local
- Comandos de aplicação de correção

### Regra

Command handlers devem orquestrar dependências, não conter lógica profunda de domínio.

---

## 3.5 Observer Pattern

Permite comunicação reativa entre core, providers, analyzers e UI através de eventos.

### Objetivos

- Atualização automática da interface.
- Redução de acoplamento.
- Comunicação assíncrona.
- Processamento incremental de findings.

### Aplicações

- Atualização de painel de review
- Progresso de análise
- Novos findings
- Mudança de status de provider
- Eventos de sincronização de PR/MR

---

## 3.6 Facade Pattern

Simplifica acesso a subsistemas complexos através de interfaces unificadas.

### Objetivos

- Reduzir complexidade.
- Melhorar legibilidade.
- Facilitar integração.
- Esconder detalhes de RAG, AST, providers e analyzers.

### Aplicações

- `ReviewAnalysisFacade`
- `RagFacade`
- `AstFacade`
- `ProviderFacade`

### Regra

Facades podem coordenar subsistemas, mas não devem virar objetos centrais com todas as regras do sistema.

---

## 3.7 Registry Pattern

Permite registrar dinamicamente componentes plugáveis.

### Componentes registráveis

- Providers
- Comandos
- Adapters
- Validadores
- Analyzers
- Ferramentas
- Estratégias de RAG
- Builders de AST

### Objetivos

- Extensão dinâmica.
- Arquitetura plugável.
- Redução de condicionais fixas.
- Open/Closed Principle.

---

## 3.8 Dependency Injection

Remove acoplamento direto entre implementações concretas.

### Objetivos

- Permitir troca dinâmica de dependências.
- Melhorar testes.
- Facilitar mocks.
- Controlar ciclo de vida de serviços.

### Regra

Instanciação direta de adapters, providers, repositories e analyzers deve ficar restrita à composição da aplicação.

---

## 3.9 Plugin Architecture

Permite expansão modular do sistema através de plugins desacoplados do core.

### Objetivos

- Crescimento modular.
- Extensibilidade segura.
- Isolamento de funcionalidades.
- Inclusão de novos analyzers sem alteração do core.

### Regra

Plugins devem interagir com o sistema por portas públicas e contratos estáveis.

---

## 3.10 Pipeline Pattern

Organiza fluxos complexos em etapas independentes.

### Objetivos

- Reutilização.
- Processamento desacoplado.
- Composição dinâmica.
- Execução parcial e testável.

### Pipeline recomendado

```text
Código
  ↓
AST Builder
  ↓
Analyzers locais
  ↓
Filtro de evidências
  ↓
IA em modo fast ou standard
  ↓
Normalizador de JSON
  ↓
Quality Gate
  ↓
UI da IDE
```

### Regra

A IA deve ser chamada depois dos analyzers locais, nunca como primeira etapa padrão.

---

# 4. Princípios SOLID

Os princípios SOLID são obrigatórios em toda implementação do sistema.

## 4.1 Single Responsibility Principle

Cada arquivo, classe ou módulo deve possuir apenas uma responsabilidade.

### Regras

- Um arquivo deve ter uma responsabilidade principal clara.
- UI não pode conter regra de negócio.
- Providers não podem conter lógica de domínio.
- Persistência deve ser isolada.
- Prompt building não deve ficar misturado com chamada HTTP.

### Exemplo correto

```text
FindingValidator.ts
→ valida findings

FindingRepository.ts
→ persiste findings

AnalyzeCodeUseCase.ts
→ orquestra análise de código
```

---

## 4.2 Open/Closed Principle

O sistema deve ser aberto para extensão e fechado para modificação.

### Regras

- Novo provider não deve exigir alteração no caso de uso principal.
- Novo analyzer deve ser adicionado por registro ou DI.
- Nova IDE deve implementar adapters existentes.
- Nova estratégia de RAG deve respeitar portas já definidas.

---

## 4.3 Liskov Substitution Principle

Implementações concretas devem poder substituir suas abstrações sem quebrar o sistema.

### Regras

- Todo `AIProviderPort` deve respeitar o mesmo contrato de entrada e saída.
- Todo analyzer deve retornar findings padronizados.
- Todo repository deve manter semântica equivalente de persistência.

---

## 4.4 Interface Segregation Principle

Interfaces devem ser pequenas e específicas.

### Regras

- Não criar portas gigantes.
- Separar leitura e escrita quando necessário.
- Separar provider de IA, embedding provider e reranker.
- Separar adapter de workspace, editor, notification e webview.

---

## 4.5 Dependency Inversion Principle

Módulos de alto nível não devem depender de módulos de baixo nível.

### Regras

- Core depende de portas.
- Infra implementa portas.
- UI chama casos de uso.
- Providers concretos ficam fora do domínio.

---

# 5. Diretrizes de Execução de IA

Esta seção define regras para uso de Inteligência Artificial na extensão, com foco em:

- Respostas rápidas
- Baixo consumo de tokens
- Baixo custo computacional
- Menor tempo de inferência
- Menor necessidade de raciocínio profundo
- Saídas previsíveis
- Integração simples com analyzers, RAG, AST e UI

## 5.1 Regras gerais para reduzir thinking

| Regra | Descrição |
|---|---|
| R1 | Não explicar o raciocínio interno |
| R2 | Não reescrever o problema |
| R3 | Não fazer introduções longas |
| R4 | Não gerar múltiplas alternativas se uma solução for suficiente |
| R5 | Não analisar arquivos não relacionados |
| R6 | Não usar RAG quando a análise direta for suficiente |
| R7 | Não solicitar contexto adicional se o contexto mínimo já permite resposta útil |
| R8 | Não retornar Markdown quando o contrato pedir JSON |
| R9 | Não inventar regras, arquivos, classes ou dependências |
| R10 | Preferir respostas determinísticas e curtas |

## 5.2 Modos de execução

| Modo | Uso | Thinking esperado |
|---|---|---|
| `fast` | Análise rápida de trecho pequeno | Baixo |
| `standard` | Análise comum de arquivo ou finding | Médio-baixo |
| `deep` | Refatoração, arquitetura, RAG amplo | Médio |
| `audit` | Auditoria técnica completa | Alto, somente quando solicitado |

O modo padrão deve ser:

```text
fast
```

## 5.3 Quando usar `fast`

Usar quando houver:

- Código pequeno
- Validação de finding
- Sugestão de correção simples
- Classificação de severidade
- Resumo curto
- Mensagem para UI

## 5.4 Quando usar `standard`

Usar quando:

- Um arquivo inteiro precisa ser analisado
- Existe AST disponível
- Existe contexto mínimo de regra
- A análise precisa gerar findings

## 5.5 Quando usar `deep`

Usar somente quando:

- O usuário pedir explicitamente análise profunda
- A análise envolver arquitetura
- A análise exigir vários arquivos
- A análise depender de RAG
- A decisão impactar refatoração grande

## 5.6 Quando usar `audit`

Usar somente quando:

- For uma revisão formal
- Houver requisito de compliance
- Houver quality gate crítico
- O usuário solicitar auditoria completa

---

# 6. Política de Contexto Mínimo

A IA deve receber apenas o contexto necessário para a tarefa.

| Tipo de análise | Contexto máximo recomendado |
|---|---|
| Finding simples | Trecho + 20 linhas ao redor |
| Arquitetura | Imports + path + regra violada |
| SOLID | Classe ou função alvo |
| Segurança | Trecho suspeito + dependências relevantes |
| RAG | Top 3 a 5 chunks |
| AST | Nós relevantes, não AST completo |
| Testes | Teste + função testada |

## 6.1 Regras

- Não enviar projeto inteiro para IA.
- Não enviar todos os documentos do RAG.
- Não enviar AST completo quando um resumo estrutural basta.
- Não pedir explicações longas para tarefas classificatórias.
- Não usar contexto externo quando o trecho já prova a violação.

---

# 7. Uso de RAG

O RAG deve ser opcional e usado apenas quando agrega valor.

## 7.1 Usar RAG quando

- A análise depende de documentação do projeto.
- A regra está em ADR, README, ARCHITECTURE ou REQUIREMENTS.
- O usuário solicitar análise com contexto.
- O analyzer detectar violação de regra documentada.

## 7.2 Não usar RAG quando

- O problema é sintático.
- O erro é evidente pelo trecho.
- O analyzer já encontrou a violação.
- A resposta é apenas uma classificação simples.

## 7.3 Limites recomendados

- `maxContextChunks`: 5
- Chunks preferenciais: 3 a 5
- Prioridade: documentos diretamente relacionados à regra violada
- Fallback: baixa confiança quando chunks forem insuficientes

---

# 8. Uso de AST

O AST deve ser usado antes da IA sempre que possível.

A IA deve receber um resumo estrutural, não o código inteiro.

## 8.1 Exemplo de contexto ideal

```json
{
  "file": "src/application/AnalyzeCodeUseCase.ts",
  "imports": ["vscode", "../domain/Finding"],
  "classes": ["AnalyzeCodeUseCase"],
  "rule": "Application não pode importar APIs de IDE",
  "suspectedViolation": "import vscode"
}
```

## 8.2 Responsabilidade do AST Builder

O AST Builder deve identificar:

- Classes
- Interfaces
- Métodos
- Funções
- Imports
- Exports
- Dependências
- Heranças
- Implementações
- Chamadas entre módulos

---

# 9. Contratos de Resposta da IA

A IA deve retornar apenas JSON válido quando o contrato exigir JSON.

## 9.1 Contrato para findings

```json
{
  "findings": [
    {
      "file": "string",
      "line": 0,
      "column": 0,
      "severity": "info | warning | critical",
      "category": "architecture | solid | security | code_smell | test | dependency | rag",
      "message": "string",
      "suggestedFix": "string",
      "confidence": 0.0
    }
  ]
}
```

### Regras

- Não usar Markdown.
- Não usar comentários.
- Não usar texto fora do JSON.
- Não usar trailing comma.
- Não inventar linha se ela não foi fornecida.
- Usar `confidence` entre `0.0` e `1.0`.

## 9.2 Contrato para validação de finding

```json
{
  "isValid": true,
  "confidence": 0.0,
  "reason": "string",
  "suggestedAction": "approve | reject | needs_review"
}
```

### Regras

- `reason` deve ter no máximo 240 caracteres.
- `suggestedAction` deve refletir a evidência disponível.
- Baixa evidência deve resultar em `needs_review` ou baixa confiança.

## 9.3 Contrato para sugestão de correção

```json
{
  "canAutoFix": true,
  "risk": "low | medium | high",
  "summary": "string",
  "patch": "string"
}
```

### Regras

- `patch` deve ser pequeno.
- Não alterar código fora do escopo.
- Se houver risco alto, `canAutoFix` deve ser `false`.
- Auto-fix deve ser permitido somente quando o impacto for local e previsível.

---

# 10. Prompts Base

## 10.1 Prompt base recomendado

```text
Você é um analisador técnico de código para uma extensão de IDE.
Responda somente no formato solicitado.
Não explique seu raciocínio.
Não use Markdown.
Não invente informações.
Use o menor número possível de palavras.
Quando não houver evidência suficiente, retorne baixa confiança.
```

## 10.2 Prompt para análise rápida

```text
Analise o trecho abaixo e retorne apenas JSON válido.
Objetivo: identificar findings objetivos.
Não explique.
Não sugira melhorias genéricas.
Considere apenas o contexto fornecido.
```

## 10.3 Prompt para arquitetura

```text
Valide se o arquivo viola a regra arquitetural informada.
Use apenas imports, path e regra.
Retorne JSON válido.
Não explique raciocínio.
```

## 10.4 Prompt para RAG

```text
Use somente os chunks fornecidos como contexto.
Não use conhecimento externo.
Se os chunks forem insuficientes, retorne confidence baixo.
Responda somente JSON válido.
```

## 10.5 Prompt para AST

```text
Use a estrutura AST resumida para validar a regra.
Não peça o código completo.
Não explique.
Retorne JSON válido.
```

---

# 11. Responsabilidade dos Analyzers Locais

Sempre que possível, analyzers locais devem reduzir o trabalho da IA.

| Analyzer | Redução de thinking |
|---|---|
| ASTAnalyzer | Envia apenas estrutura relevante |
| DependencyAnalyzer | Envia apenas dependência suspeita |
| ArchitectureAnalyzer | Envia regra + violação provável |
| SolidAnalyzer | Envia classe/função alvo |
| SecurityAnalyzer | Envia trecho suspeito |
| RagConsistencyAnalyzer | Envia apenas chunks relevantes |

## 11.1 Contrato de analyzer

Todo analyzer deve:

- Receber contexto mínimo.
- Retornar findings padronizados.
- Indicar evidências usadas.
- Evitar dependência direta de provider de IA.
- Funcionar offline quando possível.

---

# 12. Quality Gate para Respostas da IA

Toda resposta da IA deve passar por validação antes de chegar à UI.

Validar:

- JSON válido
- Schema correto
- Severidade permitida
- Categoria permitida
- Confidence numérico
- Linha existente
- Arquivo existente
- Mensagem curta
- Sugestão segura
- Ausência de texto fora do contrato

## 12.1 Fallback

Se a IA falhar, o sistema não deve quebrar.

```json
{
  "findings": [],
  "error": {
    "type": "AI_RESPONSE_INVALID",
    "message": "Resposta da IA inválida ou incompleta"
  }
}
```

---

# 13. Configuração Recomendada

```json
{
  "ai": {
    "defaultMode": "fast",
    "maxContextChunks": 5,
    "maxCodeLines": 120,
    "temperature": 0.1,
    "requireJson": true,
    "allowMarkdown": false,
    "useRagByDefault": false,
    "useAstSummary": true,
    "fallbackOnInvalidJson": true
  }
}
```

---

# 14. Regras para UI

A UI deve mostrar respostas da IA de forma resumida.

Cada finding deve exibir:

- Severidade
- Categoria
- Arquivo
- Linha
- Mensagem curta
- Botão para detalhes
- Botão para aplicar correção, se seguro

## 14.1 Regras de apresentação

- Explicação longa deve ficar oculta por padrão.
- A UI não deve depender de respostas narrativas da IA.
- Findings inválidos não devem ser exibidos.
- Auto-fix de alto risco não deve ser apresentado como ação direta.

---

# 15. Anti-padrões Proibidos

Evitar:

- Enviar projeto inteiro para IA.
- Enviar todos os documentos do RAG.
- Pedir explicações longas.
- Usar prompts abertos demais.
- Deixar IA decidir arquitetura sozinha.
- Aceitar JSON sem validação.
- Permitir auto-fix de alto risco.
- Chamar IA para problemas detectáveis localmente.
- Acoplar core a provider concreto.
- Misturar regra de negócio com adapter de IDE.
- Criar interface genérica demais para múltiplas responsabilidades.

---

# 16. Estratégia de Performance

Prioridade de execução:

1. Análise local
2. AST
3. Regras determinísticas
4. RAG mínimo
5. IA curta
6. Resposta JSON
7. Validação local

## 16.1 Objetivo

Reduzir:

- Tokens enviados
- Tokens gerados
- Latência
- Custo computacional
- Necessidade de raciocínio profundo
- Instabilidade na resposta

---

# 17. Critérios de Aceite

A implementação deve ser aceita somente se:

- A IA responder em JSON válido.
- O modo padrão for `fast`.
- O RAG não for usado por padrão.
- O contexto enviado for reduzido.
- A UI não depender de explicações longas.
- Os analyzers locais funcionarem sem IA.
- A extensão continuar funcional offline.
- O core não depender de provider concreto de IA.
- Auto-fix de alto risco for bloqueado.
- Respostas inválidas da IA forem tratadas por fallback.

---

# 18. Relação com a Arquitetura do Projeto

Este documento complementa a arquitetura definida para a extensão multi-IDE.

A IA deve respeitar:

- Clean Architecture
- Ports and Adapters
- Dependency Inversion
- Open/Closed Principle
- Providers polimórficos
- Analyzers plugáveis
- RAG opcional
- AST como pré-processamento
- Persistência local desacoplada

---

# 19. Conclusão

A IA deve ser tratada como uma camada de apoio, controlada por contratos rígidos, contexto mínimo e validação local.

O objetivo é reduzir custo, latência e raciocínio excessivo, mantendo qualidade, previsibilidade e integração segura com a extensão de IDE.
