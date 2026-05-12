# Requisitos Funcionais e Não Funcionais

# 1. Requisitos Funcionais

## RF-001 — Gerenciamento de Sessões

O sistema deve permitir criar, armazenar, recuperar e alternar sessões de review.

---

## RF-002 — Associação Automática por Branch

O sistema deve trocar automaticamente a sessão ativa ao detectar mudança de branch.

---

## RF-003 — Execução de Validações por IA

O sistema deve executar validações técnicas utilizando IA.

---

## RF-004 — Human-in-the-Loop (HITL)

Toda análise da IA deve passar por validação humana.

---

## RF-005 — Diagnósticos Técnicos

O sistema deve gerar diagnósticos estruturados.

---

## RF-006 — Comentários Técnicos

O sistema deve permitir gerenciamento de comentários técnicos.

---

## RF-007 — Sistema Multi-IDE

O sistema deve suportar múltiplas IDEs.

---

## RF-008 — Integração com IA Local

O sistema deve suportar IA instalada localmente.

---

## RF-009 — Integração com IA via API

O sistema deve suportar IA via APIs externas.

---

## RF-010 — IA Integrada à IDE

O sistema deve permitir integração com IA nativa da IDE.

---

## RF-011 — IA Premium Cloud

O sistema deve possuir provider cloud premium próprio.

---

## RF-012 — Sistema de Providers

O sistema deve permitir registro dinâmico de providers.

---

## RF-013 — Dashboard

O sistema deve possuir dashboard de revisão.

---

## RF-014 — Diagnóstico Arquitetural

O sistema deve permitir validações arquiteturais.

---

## RF-015 — Sistema de Configuração

O sistema deve permitir configuração de providers, validações e comportamento do sistema.

---

## RF-016 — Persistência

O sistema deve persistir sessões, comentários, diagnósticos, histórico e configurações.

---

## RF-017 — Feedback Contínuo

O sistema deve registrar feedback humano sobre análises da IA.

---

## RF-018 — Sistema de Eventos

O sistema deve permitir comunicação orientada a eventos.

---

## RF-019 — Abertura de Diff

O sistema deve permitir abrir diff diretamente da IDE.

---

## RF-020 — Validações Configuráveis

Novas validações devem poder ser adicionadas sem alterar o código principal.

---

## RF-021 — Sistema de Severidade

O sistema deve classificar diagnósticos por severidade.

---

## RF-022 — Rastreamento de Auditoria

O sistema deve registrar auditoria de ações humanas e IA.

---

## RF-023 — Streaming de Resposta

A IA premium cloud deve suportar streaming de resposta.

---

## RF-024 — Context Engine

O sistema cloud deve possuir motor de contexto persistente.

---

## RF-025 — Embeddings

O sistema cloud deve possuir embeddings para recuperação semântica.

---

## RF-026 — Pipeline de Validação

As validações devem ser executadas em pipeline extensível.

---

## RF-027 — Registro de Providers

O sistema deve permitir descoberta dinâmica de providers.

---

## RF-028 — Interface Humanizada

A interface deve deixar claro o que foi gerado por IA e o que depende de validação humana.

---

## RF-029 — Fallback de Providers

O sistema deve permitir fallback entre providers.

---

## RF-030 — Execução Incremental

O sistema deve permitir análise incremental baseada em diff.

---

# 2. Requisitos Não Funcionais

## RNF-001 — Baixo Acoplamento

O sistema deve utilizar contratos e abstrações.

---

## RNF-002 — Alta Extensibilidade

Novas IDEs, providers e validações devem poder ser adicionados sem alterar o core.

---

## RNF-003 — Modularidade

O sistema deve possuir arquitetura modular.

---

## RNF-004 — Multi-IDE

O núcleo do sistema não deve depender de IDE específica.

---

## RNF-005 — Testabilidade

Regras de negócio devem ser testáveis sem IDE.

---

## RNF-006 — Performance

A IA cloud deve priorizar baixa latência.

---

## RNF-007 — Streaming

Respostas cloud devem suportar streaming.

---

## RNF-008 — Escalabilidade

A arquitetura cloud deve suportar escalabilidade horizontal.

---

## RNF-009 — Observabilidade

O sistema deve possuir logs, métricas e monitoramento.

---

## RNF-010 — Segurança

O sistema deve proteger dados, contexto e chaves de API.

---

## RNF-011 — Persistência Segura

Dados devem possuir persistência confiável.

---

## RNF-012 — Portabilidade

O sistema deve funcionar em Linux, Windows e macOS.

---

## RNF-013 — Responsividade

A interface deve responder rapidamente às ações do usuário.

---

## RNF-014 — Acessibilidade

A interface deve suportar navegação acessível.

---

## RNF-015 — UI Consistente

A interface deve seguir shadcn/ui e Material Design 3.

---

## RNF-016 — HITL Obrigatório

Nenhuma decisão crítica pode ser automática.

---

## RNF-017 — Rastreabilidade

Toda ação deve ser auditável.

---

## RNF-018 — Manutenibilidade

O sistema deve priorizar manutenção de longo prazo.

---

## RNF-019 — Reutilização

Componentes devem ser reutilizáveis.

---

## RNF-020 — Inversão de Dependência

O sistema deve depender de abstrações.

---

## RNF-021 — Tolerância a Falhas

Falhas de IA devem ser tratadas sem quebrar a IDE.

---

## RNF-022 — Isolamento

Cada provider deve ser isolado do core.

---

## RNF-023 — Compatibilidade Offline

O sistema deve funcionar com IA local sem internet.

---

## RNF-024 — Evolução Contínua

A arquitetura deve permitir evolução incremental.

---

## RNF-025 — Baixo Consumo de Recursos

A extensão não deve degradar significativamente a IDE.

---

## RNF-026 — Persistência de Contexto

A IA cloud deve possuir contexto persistente.

---

## RNF-027 — Compressão Contextual

O sistema cloud deve minimizar envio desnecessário de contexto.

---

## RNF-028 — Cache Contextual

A IA cloud deve utilizar cache contextual.

---

## RNF-029 — Separação de Responsabilidades

UI, domínio e infraestrutura devem permanecer desacoplados.

---

## RNF-030 — Compatibilidade com Plugins

A arquitetura deve permitir plugins futuros.