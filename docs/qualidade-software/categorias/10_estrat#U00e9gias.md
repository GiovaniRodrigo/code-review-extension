# 10. Estratégias e Pirâmide de Testes

A pirâmide de testes é um modelo estratégico que define:

* distribuição ideal dos testes,
* custo de manutenção,
* velocidade de execução,
* confiabilidade da suíte de qualidade.

Ela ajuda equipes a evitarem:

* excesso de testes lentos,
* baixa cobertura,
* pipelines instáveis,
* alto custo de manutenção.

---

# Objetivo Principal

Construir uma suíte:

* rápida,
* confiável,
* escalável,
* sustentável,
* barata de manter.

---

# Pirâmide Clássica de Testes

Estrutura proposta inicialmente por:
Mike Cohn.

---

# Estrutura

```text id="jlwm33"
           ┌─────────────┐
           │     E2E     │
           └─────────────┘
        ┌───────────────────┐
        │    Integração     │
        └───────────────────┘
   ┌────────────────────────────┐
   │         Unitários          │
   └────────────────────────────┘
```

---

# Ideia Central

Quanto mais baixo na pirâmide:

* mais rápido,
* mais barato,
* mais estável,
* mais numerosos os testes.

Quanto mais alto:

* mais lentos,
* mais caros,
* mais frágeis,
* menos numerosos.

---

# 10.1 Base da Pirâmide — Testes Unitários

Maior quantidade de testes.

## Objetivo

Validar lógica isolada.

---

# Características

| Característica | Valor      |
| -------------- | ---------- |
| Velocidade     | muito alta |
| Custo          | baixo      |
| Estabilidade   | alta       |
| Escopo         | pequeno    |

---

# O que validar

* funções,
* serviços,
* regras,
* cálculos,
* validações.

---

# Exemplo

```ts id="jlwm34"
function soma(a, b) {
  return a + b;
}
```

---

# Benefícios

* feedback rápido,
* fácil debugging,
* refatoração segura,
* alta cobertura.

---

# Problemas comuns

* mock excessivo,
* testes frágeis,
* testar implementação ao invés de comportamento.

---

# Estratégia ideal

A maior parte da suíte deve estar aqui.

---

# Percentual recomendado

| Tipo     | Percentual |
| -------- | ---------- |
| Unitário | 70–80%     |

---

# 10.2 Meio da Pirâmide — Testes de Integração

Validam comunicação entre componentes.

---

# Objetivo

Garantir integração correta.

---

# Características

| Característica | Valor             |
| -------------- | ----------------- |
| Velocidade     | média             |
| Custo          | médio             |
| Estabilidade   | moderada          |
| Escopo         | múltiplos módulos |

---

# O que validar

* API + banco,
* service + repository,
* filas,
* cache,
* integrações.

---

# Exemplo

```text id="jlwm35"
Controller → Service → Repository → Database
```

---

# Benefícios

* detecta problemas reais,
* reduz risco de integração,
* valida infraestrutura parcial.

---

# Problemas comuns

* ambientes instáveis,
* banco compartilhado,
* dados inconsistentes.

---

# Estratégia ideal

Usar apenas integrações importantes.

---

# Percentual recomendado

| Tipo       | Percentual |
| ---------- | ---------- |
| Integração | 15–25%     |

---

# 10.3 Topo da Pirâmide — Testes E2E

Simulam usuário real.

---

# Objetivo

Validar jornadas completas.

---

# Características

| Característica | Valor            |
| -------------- | ---------------- |
| Velocidade     | baixa            |
| Custo          | alto             |
| Fragilidade    | alta             |
| Escopo         | sistema completo |

---

# O que validar

* login,
* compra,
* checkout,
* workflow completo.

---

# Exemplo

```text id="jlwm36"
Usuário
 ↓
Frontend
 ↓
API
 ↓
Banco
 ↓
Pagamento
```

---

# Benefícios

* máxima confiança,
* valida experiência real,
* detecta problemas sistêmicos.

---

# Problemas comuns

* lentidão,
* flakiness,
* manutenção cara,
* dependência de ambiente.

---

# Estratégia ideal

Poucos testes:

```text id="jlwm37"
apenas fluxos críticos
```

---

# Percentual recomendado

| Tipo | Percentual |
| ---- | ---------- |
| E2E  | 5–10%      |

---

# Comparação Geral

| Tipo       | Velocidade | Custo | Estabilidade | Escopo   |
| ---------- | ---------- | ----- | ------------ | -------- |
| Unitário   | Muito alta | Baixo | Alta         | Pequeno  |
| Integração | Média      | Médio | Média        | Médio    |
| E2E        | Baixa      | Alto  | Baixa        | Completo |

---

# Estratégia Correta

## Muitos testes baratos

Poucos testes caros.

---

# Exemplo ideal

```text id="jlwm38"
1000 unitários
150 integração
20 E2E
```

---

# Estratégia Errada

```text id="jlwm39"
20 unitários
400 E2E
```

Resultado:

* pipeline lento,
* manutenção cara,
* testes instáveis.

---

# Problema Clássico — Ice Cream Cone

Anti-pattern conhecido.

---

# Estrutura errada

```text id="jlwm3a"
      ┌──────────────┐
      │     E2E      │
      │     E2E      │
      │     E2E      │
 ┌────────────────────────┐
 │     Poucos Unitários   │
 └────────────────────────┘
```

---

# Consequências

* CI lento,
* testes frágeis,
* debugging difícil,
* alto custo operacional.

---

# Estratégias Modernas Relacionadas

---

# Test Trophy

Modelo moderno criado por:
Kent C. Dodds.

---

# Estrutura

```text id="jlwm3b"
          E2E
        Integração
       Testes úteis
      Static Analysis
```

---

# Ideia

Dar mais importância:

* integração,
* comportamento,
* testes úteis,
* static analysis.

---

# Shift Left Testing

Mover testes:

```text id="jlwm3c"
para mais cedo no desenvolvimento
```

---

# Objetivo

Detectar falhas rapidamente.

---

# Exemplo

```text id="jlwm3d"
commit → lint → testes → review
```

---

# Shift Right Testing

Testar em produção controladamente.

---

# Exemplos

* observabilidade,
* chaos engineering,
* feature flags,
* canary releases.

---

# Continuous Testing

Testes contínuos no pipeline.

---

# Pipeline moderno

```text id="jlwm3e"
Commit
  ↓
Lint
  ↓
Static Analysis
  ↓
Unit Tests
  ↓
Integration
  ↓
Security
  ↓
E2E
  ↓
Deploy
```

---

# Estratégias por Contexto

---

# Sistemas Corporativos

Foco:

* integração,
* regras de negócio,
* rastreabilidade.

---

# Sistemas Críticos

Foco:

* cobertura alta,
* redundância,
* validação formal.

---

# Microsserviços

Foco:

* contrato,
* integração,
* observabilidade.

---

# IA / Machine Learning

Foco:

* dataset,
* drift,
* métricas,
* robustez.

---

# Frontend Moderno

Foco:

* component testing,
* integração,
* E2E crítico.

---

# Estratégia Recomendada para Projetos Modernos

## Camada Base

* lint,
* static analysis,
* testes unitários.

---

# Camada Média

* integração,
* contrato,
* arquitetura.

---

# Camada Alta

* E2E,
* smoke,
* fluxos críticos.

---

# Produção

* observabilidade,
* métricas,
* chaos engineering,
* monitoring.

---

# Métricas da Pirâmide

## Cobertura

Coverage = \frac{Linhas\ Executadas}{Linhas\ Totais} \times 100

---

# Mutation Score

Mutation\ Score = \frac{Mutantes\ Mortos}{Mutantes\ Totais} \times 100

---

# Failure Rate

Failure\ Rate = \frac{Testes\ Falhos}{Testes\ Totais} \times 100

---

# Sinais de Estratégia Saudável

## Equipe madura

* pipelines rápidos,
* poucos testes frágeis,
* alta automação,
* feedback rápido,
* cobertura útil.

---

# Sinais de Problema

## Anti-patterns

* excesso de E2E,
* baixa cobertura unitária,
* testes lentos,
* testes instáveis,
* mocks excessivos,
* ausência de integração.

---

# Relação Entre Estratégia e Custo

## Quanto mais tarde detectar:

```text id="jlwm3f"
mais caro corrigir
```

---

# Curva clássica de custo

| Fase            | Custo     |
| --------------- | --------- |
| Desenvolvimento | baixo     |
| QA              | médio     |
| Produção        | altíssimo |

---

# Objetivo Final da Pirâmide

Maximizar:

* confiança,
* velocidade,
* qualidade,
* sustentabilidade.

Enquanto minimiza:

* custo,
* fragilidade,
* tempo de feedback,
* manutenção.
