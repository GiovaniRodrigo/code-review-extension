# 7. Testes de Inteligência Artificial

Os testes de IA validam qualidade, confiabilidade, segurança e comportamento de modelos de Machine Learning e Deep Learning.

Diferente de software tradicional:

* sistemas de IA não possuem comportamento totalmente determinístico,
* aprendem padrões probabilísticos,
* dependem fortemente dos dados,
* sofrem degradação ao longo do tempo.

---

# Objetivos Principais

Garantir:

* precisão,
* generalização,
* estabilidade,
* robustez,
* ausência de viés crítico,
* interpretabilidade,
* qualidade do dataset,
* confiabilidade operacional.

---

# Desafio dos Sistemas de IA

Software tradicional:

```text id="2yo3r8"
entrada fixa → saída previsível
```

IA:

```text id="hjlwm0"
entrada semelhante → saída probabilística
```

---

# Consequência

Testar IA exige validar:

* estatística,
* distribuição,
* comportamento,
* métricas,
* confiabilidade matemática.

---

# 7.1 Teste de Modelo

Valida qualidade estrutural e funcional do modelo treinado.

## Objetivo

Garantir que o modelo aprendeu corretamente.

---

# O que validar

* convergência,
* overfitting,
* underfitting,
* estabilidade,
* generalização,
* arquitetura.

---

# Exemplos

## Computer Vision

* segmentação,
* detecção,
* classificação.

## NLP

* geração,
* embeddings,
* tradução.

---

# Avaliações comuns

| Item      | Objetivo         |
| --------- | ---------------- |
| Loss      | convergência     |
| Accuracy  | acerto geral     |
| IoU       | segmentação      |
| Recall    | detecção         |
| Precision | falsos positivos |

---

# Problemas comuns

* colapso para classe majoritária,
* explosão de gradiente,
* overfitting,
* memorization.

---

# Exemplo do seu projeto

Dataset:

```text id="jlwm1a"
95% fundo
5% formigueiro
```

Risco:

```text id="jlwm1b"
modelo aprende apenas fundo
```

---

# 7.2 Teste de Inferência

Valida execução do modelo em produção.

## Objetivo

Garantir previsões corretas operacionalmente.

---

# O que validar

* tempo de resposta,
* consumo de memória,
* batch inference,
* estabilidade,
* compatibilidade.

---

# Cenários

| Tipo   | Exemplo               |
| ------ | --------------------- |
| Online | API IA                |
| Batch  | processamento em lote |
| Edge   | dispositivo local     |

---

# Exemplo

```text id="jlwm1c"
Imagem → pré-processamento → modelo → máscara
```

---

# Avaliações importantes

* latência,
* throughput,
* GPU usage,
* memory leak.

---

# Problemas comuns

* inferência lenta,
* OOM,
* incompatibilidade CUDA,
* diferença treino vs produção.

---

# 7.3 Teste de Drift

Valida degradação do modelo ao longo do tempo.

---

# Conceito

Distribuição de produção muda.

---

# Objetivo

Detectar quando:

```text id="jlwm1d"
dados atuais ≠ dados de treinamento
```

---

# Tipos de Drift

## Data Drift

Mudança nos dados de entrada.

---

## Concept Drift

Mudança no comportamento real do problema.

---

# Exemplo

Modelo treinado:

```text id="jlwm1e"
solo seco
```

Produção:

```text id="jlwm1f"
solo úmido
```

Resultado:

```text id="jlwm1g"
queda de precisão
```

---

# Métricas comuns

* distribuição,
* KL divergence,
* PSI,
* mudança estatística.

---

# Ferramentas

* Evidently AI
* WhyLabs

---

# 7.4 Teste de Viés

Valida imparcialidade do modelo.

## Objetivo

Detectar discriminação ou favorecimento indevido.

---

# Tipos de viés

| Tipo            | Exemplo             |
| --------------- | ------------------- |
| Dataset Bias    | dados enviesados    |
| Sampling Bias   | amostragem desigual |
| Label Bias      | anotação incorreta  |
| Historical Bias | padrão histórico    |

---

# Exemplo

Dataset:

```text id="jlwm1h"
90% classe A
10% classe B
```

Modelo:

```text id="jlwm1i"
favorece classe A
```

---

# Em visão computacional

Problemas comuns:

* iluminação,
* resolução,
* cor,
* ambiente,
* qualidade de câmera.

---

# Avaliações

* fairness,
* equal opportunity,
* disparate impact.

---

# Importância

Fundamental em:

* crédito,
* saúde,
* RH,
* segurança,
* reconhecimento facial.

---

# 7.5 Teste de Dataset

Valida qualidade dos dados usados no treinamento.

## Objetivo

Garantir dataset saudável.

---

# O que validar

* balanceamento,
* labels,
* ruído,
* duplicidade,
* representatividade,
* leakage.

---

# Problemas comuns

## Dataset Leakage

Informação do teste:

```text id="jlwm1j"
vaza para treino
```

Resultado:

```text id="jlwm1k"
métrica artificialmente alta
```

---

# Exemplo importante

Seu projeto:

* máscaras ignoradas (255),
* classes desbalanceadas,
* solo semelhante ao alvo.

Tudo isso impacta:

* IoU,
* Recall,
* generalização.

---

# Técnicas comuns

* augmentation,
* patch training,
* stratified split,
* oversampling.

---

# Ferramentas

* FiftyOne
* Label Studio

---

# 7.6 Teste de Robustez

Valida resistência do modelo a perturbações.

## Objetivo

Garantir estabilidade sob condições adversas.

---

# Exemplo

Imagem original:

```text id="jlwm1l"
detecta corretamente
```

Imagem com ruído:

```text id="jlwm1m"
modelo falha
```

---

# Avalia

* ruído,
* blur,
* compressão,
* iluminação,
* oclusão,
* rotação.

---

# Adversarial Testing

Entradas manipuladas para enganar IA.

---

# Exemplo

Pequena alteração:

```text id="jlwm1n"
imperceptível ao humano
```

faz modelo:

```text id="jlwm1o"
errar completamente
```

---

# Muito importante em

* carros autônomos,
* medicina,
* segurança,
* drones.

---

# 7.7 Teste de Precisão/Recall/F1

Valida qualidade estatística do modelo.

---

# Matriz de Confusão

|               | Pred Positivo | Pred Negativo |
| ------------- | ------------- | ------------- |
| Real Positivo | TP            | FN            |
| Real Negativo | FP            | TN            |

---

# Precision

Mede:

```text id="jlwm1p"
quantos positivos previstos estavam corretos
```

Precision = \frac{TP}{TP + FP}

---

# Recall

Mede:

```text id="jlwm1q"
quantos positivos reais foram encontrados
```

Recall = \frac{TP}{TP + FN}

---

# F1 Score

Balanceia Precision e Recall.

F1 = 2 \times \frac{Precision \times Recall}{Precision + Recall}

---

# Accuracy

Accuracy = \frac{TP + TN}{TP + TN + FP + FN}

---

# Problema clássico

Dataset desbalanceado:

```text id="jlwm1r"
95% fundo
```

Modelo prevê:

```text id="jlwm1s"
sempre fundo
```

Accuracy:

```text id="jlwm1t"
95%
```

Mas modelo:

```text id="jlwm1u"
inútil
```

---

# No seu projeto

Métrica mais importante:

```text id="jlwm1v"
IoU da classe formigueiro
```

e:

```text id="jlwm1w"
Recall
```

---

# IoU

Muito usada em segmentação.

IoU = \frac{Interseção}{União}

---

# Dice Score

Dice = \frac{2 \times Interseção}{Predição + GroundTruth}

---

# 7.8 Teste de Explainability

Valida interpretabilidade da IA.

---

# Objetivo

Entender:

```text id="jlwm1x"
por que o modelo tomou uma decisão
```

---

# Problema moderno

Modelos profundos:

```text id="jlwm1y"
caixa-preta
```

---

# Explainability busca

* transparência,
* confiança,
* auditoria,
* rastreabilidade.

---

# Técnicas comuns

| Técnica        | Objetivo            |
| -------------- | ------------------- |
| Grad-CAM       | regiões importantes |
| SHAP           | impacto de features |
| LIME           | interpretação local |
| Attention Maps | foco do modelo      |

---

# Exemplo Computer Vision

Modelo detecta:

```text id="jlwm1z"
formigueiro
```

Grad-CAM mostra:

```text id="jlwm20"
área da imagem usada
```

---

# Problema importante

Modelo pode aprender:

```text id="jlwm21"
atalhos errados
```

Exemplo:

* sombra,
* marca do drone,
* cor do solo.

Não:

```text id="jlwm22"
o formigueiro real
```

---

# Ferramentas

* SHAP
* LIME

---

# Relação Entre os Testes de IA

| Tipo           | Objetivo                   |
| -------------- | -------------------------- |
| Modelo         | validar aprendizado        |
| Inferência     | validar execução           |
| Drift          | detectar degradação        |
| Viés           | validar imparcialidade     |
| Dataset        | validar dados              |
| Robustez       | validar resistência        |
| Métricas       | validar qualidade          |
| Explainability | validar interpretabilidade |

---

# Pipeline Moderno de Qualidade em IA

```text id="jlwm23"
Dataset Validation
        ↓
Training Validation
        ↓
Metrics Validation
        ↓
Robustness Testing
        ↓
Bias Testing
        ↓
Explainability
        ↓
Inference Validation
        ↓
Monitoring & Drift
```

---

# Métricas Operacionais de IA

| Métrica     | Objetivo     |
| ----------- | ------------ |
| Accuracy    | acerto geral |
| Precision   | evitar FP    |
| Recall      | evitar FN    |
| F1          | equilíbrio   |
| IoU         | segmentação  |
| Dice        | overlap      |
| Latência    | inferência   |
| Drift Score | degradação   |

---

# Problemas Críticos em Produção

## Overfitting

Modelo memoriza treino.

---

## Underfitting

Modelo não aprende.

---

## Hallucination

Muito comum em LLMs.

---

## Data Leakage

Informação vazando entre conjuntos.

---

## Drift

Produção muda com tempo.

---

# Conceitos Modernos Relacionados

| Conceito           | Objetivo             |
| ------------------ | -------------------- |
| MLOps              | DevOps para IA       |
| Responsible AI     | IA ética             |
| AI Governance      | governança           |
| AI Observability   | monitoramento        |
| Human-in-the-loop  | validação humana     |
| Continual Learning | aprendizado contínuo |
