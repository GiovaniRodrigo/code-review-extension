# 3. Testes Estruturais

Os testes estruturais validam a qualidade da implementação interna do software.

Diferente dos testes funcionais, aqui o foco não é apenas:

> “o sistema funciona?”

Mas também:

* o código foi realmente exercitado?
* todos os caminhos foram testados?
* existem trechos mortos?
* os testes conseguem detectar falhas reais?
* há lógica não validada?

Esses testes são fortemente ligados a:

* engenharia de software,
* cobertura,
* qualidade arquitetural,
* robustez do código.

---

# 3.1 Caixa Branca (White Box Testing)

Testes baseados no conhecimento interno da implementação.

## Objetivo

Validar lógica interna, fluxos e estruturas do código.

## O testador conhece:

* código-fonte,
* algoritmos,
* condicionais,
* estruturas internas,
* fluxo de execução.

## Avalia

* branches,
* loops,
* condições,
* caminhos,
* exceções,
* regras internas.

---

## Exemplo

```ts id="sdf5v4"
function calcularDesconto(valor: number, vip: boolean) {
  if (vip) {
    return valor * 0.8;
  }

  return valor;
}
```

O teste estrutural precisa validar:

* fluxo VIP verdadeiro,
* fluxo VIP falso.

---

## Vantagens

* maior precisão,
* identifica código morto,
* melhora qualidade técnica,
* aumenta confiabilidade.

## Desvantagens

* maior complexidade,
* forte acoplamento ao código,
* manutenção maior.

---

# 3.2 Cobertura de Linha (Line Coverage)

Valida quais linhas foram executadas durante os testes.

## Objetivo

Garantir execução do maior número possível de linhas.

---

## Exemplo

```ts id="34slpr"
function soma(a, b) {
  return a + b;
}
```

Se o teste executar:

```ts id="rfop58"
soma(1, 2);
```

A cobertura de linha será:

```text id="vv0t9n"
100%
```

---

## Problema Importante

Alta cobertura NÃO significa testes bons.

Exemplo:

```ts id="mz6o7d"
if (idade >= 18) {
  aprovar();
}
```

Executar apenas:

```ts id="26s0mr"
idade = 20
```

gera:

* linha coberta,
* mas branch incompleta.

---

## Métricas comuns

| Percentual | Interpretação    |
| ---------- | ---------------- |
| < 50%      | Baixa cobertura  |
| 70%        | Aceitável        |
| 80–90%     | Boa              |
| 100%       | Nem sempre ideal |

---

## Ferramentas

* Istanbul
* JaCoCo
* Coverage.py

---

# 3.3 Cobertura de Branch (Branch Coverage)

Valida todos os desvios condicionais do código.

## Objetivo

Garantir execução de:

* if,
* else,
* switch,
* ternários,
* exceções.

---

## Exemplo

```ts id="9v4gmd"
if (saldo > 0) {
  sacar();
} else {
  bloquear();
}
```

Necessário testar:

```text id="bgk9tm"
saldo > 0
saldo <= 0
```

---

## Diferença para Cobertura de Linha

| Tipo   | O que valida        |
| ------ | ------------------- |
| Linha  | linhas executadas   |
| Branch | decisões executadas |

---

## Importância

Branch coverage detecta:

* lógica não exercitada,
* caminhos esquecidos,
* cenários extremos.

---

# 3.4 Cobertura de Condição (Condition Coverage)

Valida expressões booleanas individuais.

## Objetivo

Garantir que cada condição lógica seja:

* verdadeira,
* falsa.

---

## Exemplo

```ts id="n03n24"
if (idade >= 18 && possuiDocumento) {
  aprovar();
}
```

Precisamos validar:

| idade >= 18 | possuiDocumento |
| ----------- | --------------- |
| true        | true            |
| true        | false           |
| false       | true            |
| false       | false           |

---

## Problema que resolve

Mesmo com branch coberta:

* condições internas podem nunca ter sido avaliadas.

---

# 3.5 Cobertura de Caminho (Path Coverage)

Valida todos os caminhos possíveis do fluxo.

## Objetivo

Executar todas as combinações de execução possíveis.

---

## Exemplo

```ts id="r99hnm"
if (a) {
  if (b) {
    x();
  } else {
    y();
  }
}
```

Caminhos:

```text id="9pyzqj"
1. a=false
2. a=true, b=true
3. a=true, b=false
```

---

## Complexidade

Número de caminhos cresce exponencialmente.

## Problema clássico

Explosão combinatória.

---

## Muito usado em

* sistemas críticos,
* aviação,
* financeiro,
* saúde,
* embarcados.

---

# 3.6 Mutation Testing

Um dos testes estruturais mais avançados.

## Objetivo

Avaliar qualidade REAL dos testes.

---

# Conceito

O sistema altera automaticamente o código:

* troca operadores,
* remove condições,
* altera retornos.

Depois executa os testes.

---

## Exemplo

Código original:

```ts id="bxo75z"
if (idade >= 18)
```

Mutação:

```ts id="xk4v0w"
if (idade > 18)
```

Se os testes NÃO falharem:

```text id="t2q68m"
os testes são fracos
```

---

# Mutantes

Cada alteração artificial é chamada:

```text id="h4xh5r"
mutante
```

---

# Resultado Esperado

## Mutante morto

Os testes detectaram a alteração.

```text id="ofg9u8"
Excelente
```

## Mutante sobrevivente

Os testes não perceberam a alteração.

```text id="8ln7it"
Problema nos testes
```

---

# Mutation Score

Fórmula:

Mutation\ Score = \frac{Mutantes\ Mortos}{Mutantes\ Totais} \times 100

---

## Interpretação

| Score  | Qualidade |
| ------ | --------- |
| < 50%  | Fraca     |
| 60–75% | Média     |
| 80–90% | Boa       |
| > 90%  | Excelente |

---

## Ferramentas

* Stryker
* PITest

---

# Relação Entre Coberturas

| Tipo     | Foco                      |
| -------- | ------------------------- |
| Linha    | linhas executadas         |
| Branch   | decisões executadas       |
| Condição | expressões booleanas      |
| Caminho  | fluxos completos          |
| Mutation | qualidade real dos testes |

---

# Comparação Prática

## Código

```ts id="5fph3j"
function acesso(idade, ativo) {
  if (idade >= 18 && ativo) {
    return true;
  }

  return false;
}
```

---

## Cobertura de Linha

Executar:

```ts id="czpgnm"
acesso(20, true)
```

Resultado:

```text id="jlwm6z"
100% das linhas
```

---

## Cobertura de Branch

Necessário:

```ts id="2d2gvc"
acesso(20, true)
acesso(10, true)
```

---

## Cobertura de Condição

Necessário:

```ts id="z24l6k"
acesso(20, true)
acesso(20, false)
acesso(10, true)
acesso(10, false)
```

---

## Mutation Testing

Se mudar:

```ts id="qfpp5y"
idade >= 18
```

para:

```ts id="9vl2zs"
idade > 18
```

Os testes devem falhar.

---

# Métricas Estruturais Avançadas

Além das coberturas tradicionais:

| Métrica                  | Objetivo                 |
| ------------------------ | ------------------------ |
| Complexidade Ciclomática | medir complexidade       |
| Código Morto             | detectar trechos inúteis |
| Acoplamento              | dependências excessivas  |
| Coesão                   | qualidade modular        |
| Debt Ratio               | dívida técnica           |
| Maintainability Index    | facilidade de manutenção |

---

# Relação com Qualidade de Engenharia

Os testes estruturais ajudam a:

* reduzir bugs,
* aumentar robustez,
* melhorar arquitetura,
* aumentar confiabilidade,
* facilitar refatorações,
* elevar maturidade técnica.

---

# Estratégia Recomendada

## Pirâmide estrutural ideal

| Camada                | Prioridade |
| --------------------- | ---------- |
| Cobertura de Branch   | Muito alta |
| Cobertura de Condição | Alta       |
| Mutation Testing      | Muito alta |
| Cobertura de Caminho  | Moderada   |
| Linha                 | Básica     |

---

# Problema Clássico

## “100% coverage illusion”

Cobertura:

```text id="fh66kc"
100%
```

Mas testes:

```text id="3hm0js"
não validam comportamento real
```

Por isso Mutation Testing é tão importante.
