# Base de Conhecimento para IA LLM

Este arquivo consolida a documentacao em `docs/` em um contexto operacional para modelos de linguagem trabalharem neste projeto. Use-o como fonte rapida para orientar implementacao, revisao, geracao de codigo, analise tecnica e tomada de decisao arquitetural.

## Identidade do Projeto

O projeto e uma extensao de code review assistida por IA, pensada para funcionar em multiplas IDEs. O objetivo central e ajudar o usuario a revisar codigo, gerar diagnosticos tecnicos, comentar trechos relevantes e acompanhar sessoes de review sem acoplar regras de negocio a uma IDE ou provedor de IA especifico.

O sistema deve ser modular, extensivel, testavel e seguro. Toda sugestao de IA passa por validacao humana antes de virar acao efetiva.

## Principios Invariantes

- O core nao deve depender de APIs de IDE.
- A UI nao deve chamar IA diretamente.
- Toda integracao com IA deve passar por contratos e providers.
- Toda sugestao gerada por IA deve ficar pendente ate aprovacao humana.
- Correcoes de codigo nao podem ser aplicadas automaticamente sem HITL.
- Regras de negocio devem ser testaveis sem abrir a IDE.
- Git, storage, IA e IDE devem ser abstraidos por contratos.
- Novas IDEs, providers, validacoes e telas devem ser adicionados por extensao, nao por alteracao do nucleo.

## Arquitetura Alvo

O sistema segue uma arquitetura em camadas:

```text
IDE Adapter Layer
  -> Presentation Layer
  -> Application Layer
  -> Domain Layer
  -> Infrastructure Layer
```

Responsabilidades:

- `IDE Adapter Layer`: integra comandos, menus, eventos e notificacoes da IDE. Nao contem regra de negocio.
- `Presentation Layer`: renderiza dashboard, diagnosticos, comentarios e estados visuais.
- `Application Layer`: orquestra casos de uso como iniciar review e executar validacao de IA.
- `Domain Layer`: contem entidades e regras centrais, como `ReviewSession`, `Diagnostic` e `Comment`.
- `Infrastructure Layer`: implementa Git, storage, APIs de IA, providers locais e servicos externos.

Organizacao esperada:

```text
apps/                  # adapters das IDEs
packages/core/         # application + domain
packages/infrastructure/
packages/ui/           # design system e componentes
packages/ide-contracts/
docs/
```

## Padroes Arquiteturais

- Adapter Pattern: usado para integrar IDEs diferentes ao mesmo core.
- Strategy Pattern: usado para trocar providers de IA e estrategias de validacao.
- Repository Pattern: usado para persistencia de sessoes, comentarios, diagnosticos e configuracoes.
- Command Pattern: usado para acoes disparadas pela IDE.
- Observer/Event Pattern: usado para eventos de dominio e atualizacao desacoplada.
- TDD: preferir ciclo red-green-refactor em regras centrais e use cases.

## Contratos Principais

### IDE Adapter

```ts
export interface IDEAdapter {
  getCurrentWorkspace(): Promise<WorkspaceContext>;
  openDiff(filePath: string): Promise<void>;
  showNotification(message: string, type: NotificationType): Promise<void>;
}
```

### AI Provider

```ts
export interface AIProvider {
  id: string;
  name: string;
  type: 'api' | 'ide' | 'local';
  isAvailable(): Promise<boolean>;
  analyze(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}
```

### Entrada de IA

`AIAnalysisInput` deve conter:

- sessionId, branch e dados de PR quando existirem;
- prompt de validacao;
- arquivos com caminho, conteudo e diff;
- contexto tecnico, incluindo linguagem, framework e informacoes do projeto.

### Saida de IA

`AIAnalysisResult` deve retornar dados estruturados:

- confidence score;
- lista de diagnosticos com arquivo, linha, severidade, mensagem e sugestao;
- status inicial `pending` para tudo que exigir acao humana.

## Fluxo de Execucao

1. O usuario executa um comando na IDE.
2. O adapter da IDE captura o comando e chama um use case.
3. O use case consulta contratos de infraestrutura, como Git, storage ou IA.
4. O dominio registra sessoes, diagnosticos, comentarios e eventos.
5. A camada de apresentacao atualiza a UI.
6. O usuario aprova, rejeita, edita, ignora ou marca diagnosticos como corrigidos.

Eventos de dominio importantes:

- `SESSION_CREATED`
- `DIAGNOSTIC_APPROVED`
- `BRANCH_CHANGED`

## Requisitos Funcionais Essenciais

- Gerenciar sessoes de review.
- Associar sessao automaticamente por branch.
- Executar validacoes tecnicas com IA.
- Exigir Human-in-the-Loop em analises de IA.
- Gerar diagnosticos estruturados.
- Gerenciar comentarios tecnicos.
- Suportar multiplas IDEs.
- Suportar IA local, IA via API e IA integrada a IDE.
- Permitir registro dinamico e fallback de providers.
- Exibir dashboard de revisao.
- Permitir diagnostico arquitetural.
- Persistir sessoes, comentarios, diagnosticos, historico e configuracoes.
- Registrar feedback humano para evolucao continua.
- Abrir diff diretamente pela IDE.
- Executar validacoes configuraveis em pipeline extensivel.
- Classificar diagnosticos por severidade.
- Registrar trilha de auditoria.
- Suportar streaming de resposta em providers cloud quando aplicavel.
- Permitir analise incremental baseada em diff.

## Requisitos Nao Funcionais Essenciais

- Baixo acoplamento por contratos e abstracoes.
- Alta extensibilidade para IDEs, providers e validacoes.
- Modularidade clara entre core, infraestrutura, UI e adapters.
- Core independente de IDE.
- Testabilidade sem ambiente grafico.
- Performance adequada e baixo consumo de recursos.
- Observabilidade com logs, metricas e monitoramento.
- Seguranca para dados, contexto e chaves de API.
- Persistencia confiavel e segura.
- Portabilidade entre Linux, Windows e macOS.
- UI responsiva, acessivel e consistente.
- Rastreabilidade de acoes humanas e de IA.
- Tolerancia a falhas e fallback entre providers.
- Compatibilidade offline quando houver provider local.
- Separacao rigorosa de responsabilidades.

## Roadmap Tecnico

### Fase 1: Fundamentos

- Arquitetura base por camadas e contratos.
- Descobertas estruturadas via IA.
- Comentarios inline na IDE.
- Motor de severidade.
- Gestao de sessao por branch.
- Dashboard basico.

### Fase 2: Inteligencia Estatica

- Parser de AST.
- Motor de regras customizaveis.
- Score de risco por arquivo ou metodo.
- Pipeline de validacao extensivel.

### Fase 3: Contexto e Memoria

- Heatmap de pontos criticos.
- Inteligencia organizacional baseada em feedback humano.
- Context Engine.
- Embeddings e recuperacao semantica.
- Cache e compressao contextual.

### Fase 4: Enterprise e Ecossistema

- IA multi-provedor local, cloud, API e integrada a IDE.
- Publicacao ou apoio a comentarios em PRs.
- Workflows corporativos.
- Auditoria e conformidade.
- Streaming e otimizacoes de performance.

## Qualidade de Software

A estrategia de qualidade cobre:

- testes funcionais: unitarios, integracao, sistema, E2E, aceitacao, regressao, smoke, sanity, API, UI, contrato, BDD e fluxo de negocio;
- testes nao funcionais: performance, carga, stress, spike, volume, escalabilidade, seguranca, autenticacao, autorizacao, criptografia, OWASP, confiabilidade, compatibilidade, usabilidade, acessibilidade e observabilidade;
- testes estruturais: cobertura de linha, branch, condicao, caminho e mutation testing;
- testes de dados: integridade, migracao, consistencia e pipelines;
- testes arquiteturais: limites de camadas, dependencias e conformidade com contratos;
- testes DevOps e infraestrutura: CI/CD, deploy, rollback, backup, restore e ambiente;
- testes de IA: qualidade de resposta, seguranca, vies, rastreabilidade, prompt, contexto e avaliacao humana;
- testes de qualidade de codigo: lint, complexidade, duplicacao, padroes, manutencao e revisao;
- testes organizacionais: processo, governanca, compliance e indicadores.

Ao implementar algo, escolha testes proporcionais ao risco. Mudancas no core, contratos, pipeline de validacao, storage, seguranca ou IA exigem cobertura mais forte.

## UX e HITL

A interface deve comunicar claramente:

- estado da sessao;
- branch ativa;
- progresso das validacoes;
- origem de conteudo gerado por IA;
- diagnosticos pendentes, aprovados, rejeitados ou corrigidos;
- severidade e confianca dos achados.

Toda sugestao de IA deve permitir:

- aprovar;
- rejeitar;
- editar;
- ignorar;
- marcar como corrigida.

Nenhuma alteracao deve ser aplicada sem confirmacao humana.

## Seguranca e Privacidade

- Nunca expor chaves de API em logs, UI ou arquivos versionados.
- Tratar contexto de codigo como dado sensivel.
- Isolar providers e impedir vazamento de contexto entre sessoes indevidas.
- Persistir dados com estrategia confiavel e segura.
- Registrar auditoria de acoes relevantes.
- Preferir analise incremental por diff para reduzir exposicao de conteudo.

## Orientacao para LLMs

Ao trabalhar neste projeto, a IA deve:

- ler a documentacao relevante antes de propor mudancas grandes;
- respeitar a arquitetura por camadas;
- manter regras de negocio no core ou dominio, nao no adapter de IDE;
- criar ou usar contratos antes de acoplar implementacoes concretas;
- preservar HITL como requisito obrigatorio;
- retornar diagnosticos estruturados, rastreaveis e acionaveis;
- priorizar alteracoes pequenas, testaveis e coerentes com o roadmap;
- explicar trade-offs quando houver decisao arquitetural;
- nao inventar provider, API, formato de storage ou fluxo sem alinhar com os contratos existentes;
- adicionar testes quando tocar regra de negocio, contrato ou fluxo de IA;
- manter documentacao atualizada quando alterar comportamento, contrato ou requisito;
- atualizar obrigatoriamente o `CHANGELOG.md` ao finalizar qualquer implementacao.

## Checklist de Implementacao

Antes de concluir uma tarefa, validar:

- A mudanca respeita separacao entre adapter, presentation, application, domain e infrastructure.
- O core continua independente de IDE.
- A IA continua desacoplada por provider.
- Sugestoes de IA continuam pendentes ate acao humana.
- Dependencias externas estao atras de contratos.
- Ha teste unitario ou de integracao adequado ao risco.
- Estados de UI comunicam carregamento, erro, sucesso e pendencia.
- Dados sensiveis nao aparecem em logs ou respostas.
- O comportamento novo esta ligado a RF/RNF quando aplicavel.
- O `CHANGELOG.md` foi atualizado com a implementacao concluida.

## Fontes

- `docs/architecture/01-principles.md`
- `docs/architecture/02-structure.md`
- `docs/architecture/03-contracts.md`
- `docs/architecture/04-logic.md`
- `docs/architecture/05-extensibility.md`
- `docs/architecture/06-compliance.md`
- `docs/ai-integration/01-overview.md`
- `docs/ai-integration/02-data-contracts.md`
- `docs/ai-integration/03-providers.md`
- `docs/ai-integration/04-orchestration.md`
- `docs/ai-integration/05-ux-security.md`
- `docs/design/01-principles.md`
- `docs/design/02-ui-components.md`
- `docs/design/03-screens-states.md`
- `docs/patterns/design-patterns.md`
- `docs/premium/01-native-architecture.md`
- `docs/premium/02-context-security.md`
- `docs/roadmap.md`
- `docs/implementation-control.md`
- `docs/workflows/implementation.md`
- `docs/requisitos-funcionais-nao-funcionais/001-requisitos-funcionais-nao-funcionais.md`
- `docs/qualidade-software/README.md`
- `docs/qualidade-software/ROADMAP.md`
- `docs/qualidade-software/FRD_QUALIDADE.md`
- `docs/qualidade-software/CHECKLISTS_SETORIAIS.md`
- `docs/qualidade-software/categorias/`
- `docs/qualidade-software/camadas_setores/`
- `docs/qualidade-software/ides/`
