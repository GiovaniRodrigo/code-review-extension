# Extensão Multi-IDE para Code Review com IA

## 1. Visão Geral

Este projeto consiste em uma extensão multi-IDE para auxiliar desenvolvedores no processo de code review utilizando Inteligência Artificial.

A extensão deve funcionar em diferentes IDEs, como VS Code, JetBrains, Vim, Neovim, Sublime, Zed, Eclipse e outras, mantendo o núcleo da aplicação desacoplado das APIs específicas de cada IDE.

O sistema deve permitir análise direta com IA ou análise enriquecida com RAG, utilizando arquivos do próprio projeto como contexto, incluindo documentação Markdown, regras de arquitetura, padrões de código, requisitos, ADRs e outros documentos técnicos.

---

## 2. Funcionalidades Principais

### 2.1 Code Review com IA

A extensão deve permitir executar análise de código com IA para identificar:

- Alertas
- Erros
- Code smells
- Violações de padrão
- Problemas arquiteturais
- Problemas de segurança
- Inconsistências com requisitos
- Violações de design pattern
- Sugestões de refatoração

---

### 2.2 Marcação visual no editor

A IDE deve exibir linhas tracejadas ou marcações visuais diretamente no trecho onde a não conformidade foi encontrada.

Exemplo:

```text
arquivo.ts
  linha 42  ┄┄┄ alerta: possível violação de responsabilidade única
````

Cada não conformidade deve conter:

* Arquivo
* Linha
* Coluna
* Severidade
* Categoria
* Mensagem
* Sugestão de correção
* Contexto usado pela IA

---

### 2.3 Lista de não conformidades

A extensão deve exibir uma lista navegável de findings.

Ao clicar em um item da lista, a IDE deve abrir automaticamente:

```text
arquivo correto → linha correta → coluna correta
```

---

## 3. Integrações com IA

O sistema deve suportar múltiplos tipos de IA via polimorfismo:

```text
AIProviderPort
├── IDEIntegratedAIProvider
├── LocalLLMProvider
├── OllamaProvider
├── OpenAIProvider
├── CloudAIProvider
└── CustomAPIProvider
```

A IA poderá ser executada por:

* IA integrada à IDE
* IA instalada localmente no sistema operacional
* API externa
* IA nativa/cloud do próprio sistema

---

## 4. RAG

A análise poderá ser feita de duas formas:

```text
Análise direta com IA
Análise com IA + RAG
```

Caso o usuário solicite uma análise com RAG e ainda não exista RAG cadastrado, o sistema deve perguntar:

```text
Nenhum RAG foi configurado para este projeto.
Deseja cadastrar um RAG agora?
```

O RAG deve poder usar arquivos como contexto, por exemplo:

* `README.md`
* `ARCHITECTURE.md`
* `DESIGN_PATTERNS.md`
* `REQUIREMENTS.md`
* `ROADMAP.md`
* `ADR-*.md`
* Documentação de API
* Regras de negócio
* Guias de contribuição
* Padrões de código
* Workflows
* Documentos de arquitetura
* Arquivos de configuração

---

## 5. Principais padrões de RAG

Os principais padrões recomendados para o projeto são:

| Padrão              | Uso                                                                          |
| ------------------- | ---------------------------------------------------------------------------- |
| Naive RAG           | Busca simples em documentos indexados                                        |
| Advanced RAG        | Chunking melhorado, filtros, reranking e query transformation                |
| Modular RAG         | Separação entre loader, chunker, embeddings, retriever, reranker e generator |
| GraphRAG            | Criação de grafo de conhecimento a partir dos documentos                     |
| Hybrid RAG          | Combina busca semântica com busca por palavra-chave                          |
| Query Rewriting RAG | Reescreve a consulta antes da busca                                          |
| Multi-Query RAG     | Gera múltiplas consultas para melhorar recuperação                           |
| HyDE                | Gera uma resposta hipotética para melhorar embeddings                        |
| Reranking RAG       | Reordena os documentos recuperados por relevância                            |
| Agentic RAG         | Usa agentes para decidir estratégias de busca                                |
| Corrective RAG      | Reavalia se o contexto recuperado é suficiente                               |
| Self-RAG            | A própria IA avalia necessidade e qualidade da recuperação                   |

Google destaca chunking, reranking e query transformation como técnicas importantes para RAG em produção. A documentação do GraphRAG da Microsoft descreve o uso de grafo de conhecimento, summaries e estruturas de comunidade para melhorar a recuperação de contexto. ([Google Codelabs][1])

---

## 6. RAG Graph

O sistema deve possuir um **RAG Graph**, permitindo visualizar relações entre:

* Arquivos
* Chunks
* Classes
* Funções
* Módulos
* Requisitos
* ADRs
* Findings
* Padrões violados
* Dependências entre componentes

Exemplo conceitual:

```text
ARCHITECTURE.md
   ↓
Regra: Core não depende de IDE
   ↓
Arquivo: AnalyzeCodeCommandHandler.ts
   ↓
Finding: import indevido de API do VS Code no core
```

---

## 7. Analyzers

O sistema deve possuir analyzers plugáveis:

```text
AnalyzerPort
├── SOLIDAnalyzer
├── ArchitectureAnalyzer
├── SecurityAnalyzer
├── CodeSmellAnalyzer
├── DependencyAnalyzer
├── TestCoverageAnalyzer
├── RagConsistencyAnalyzer
├── DesignPatternAnalyzer
└── ASTAnalyzer
```

Cada analyzer deve gerar findings padronizados.

---

## 8. AST Builder

O projeto deve possuir um AST Builder para interpretar a estrutura real do código.

Ele deve identificar:

* Classes
* Interfaces
* Métodos
* Funções
* Imports
* Exports
* Dependências
* Heranças
* Implementações
* Acoplamentos
* Chamadas entre módulos

O AST deve apoiar:

* Análise arquitetural
* Detecção de dependência indevida
* Refatorações sugeridas
* Code review automatizado
* Geração de grafo técnico

---

## 9. Persistência local

O sistema deve permitir armazenamento local ou armazenamento disponível pela própria IDE.

Opções:

```text
LocalDatabasePort
├── SQLiteLocalDatabase
├── IndexedDBLocalDatabase
├── FileSystemJsonDatabase
├── IDEStorageDatabase
└── InMemoryDatabase
```

O banco local deve armazenar:

* Sessões de review
* Findings
* Configuração de IA
* Configuração de RAG
* Índices vetoriais
* Histórico de análises
* Cache de embeddings
* Preferências do usuário

---

## 10. Separação de responsabilidade

```text
apps/*
= somente integração específica com cada IDE

packages/core
= casos de uso, portas e orquestração

packages/domain
= entidades, políticas e regras puras

packages/infra
= implementações concretas de IA, RAG, DB, AST, Git, VPS e sync

packages/ui
= componentes visuais reutilizáveis
```

Regra principal:

```text
O core nunca deve importar APIs de IDE.
As IDEs conhecem o core.
O core conhece apenas interfaces.
As implementações concretas ficam em infra ou apps.
```

---

## 11. Objetivo arquitetural

O projeto deve seguir:

* Clean Architecture
* Ports and Adapters
* Dependency Inversion
* Strategy Pattern
* Factory Pattern
* Adapter Pattern
* Interface Segregation
* Open/Closed Principle
* Polimorfismo para providers
* Baixo acoplamento entre core e IDEs

---

## 12. Fluxo principal

```text
Usuário executa análise na IDE
        ↓
Command Handler da IDE
        ↓
AnalyzeCodeWithAIUseCase
        ↓
Verifica se usará RAG
        ↓
Se não existir RAG, solicita cadastro
        ↓
Carrega contexto do projeto
        ↓
Executa analyzers
        ↓
Executa AST Builder
        ↓
Monta contexto para IA
        ↓
Chama AIProvider
        ↓
Gera findings
        ↓
Persiste no DB local
        ↓
Mostra lista de não conformidades
        ↓
Marca linhas no editor
        ↓
Permite clicar e navegar até o problema
