# 2. Testes Não Funcionais

Os testes não funcionais validam atributos de qualidade do software além das funcionalidades principais.

Eles analisam:

* desempenho,
* segurança,
* estabilidade,
* experiência do usuário,
* compatibilidade,
* observabilidade,
* capacidade operacional.

---

# 2.1 Performance

Avaliam velocidade, estabilidade e capacidade do sistema sob diferentes condições.

---

# 2.1.1 Teste de Carga

Valida o comportamento do sistema sob carga esperada.

## Objetivo

Garantir funcionamento estável em uso normal.

## Avalia

* Tempo de resposta
* Throughput
* Uso de CPU
* Uso de memória
* Concorrência

## Exemplo

* 5.000 usuários simultâneos
* 200 requisições/segundo

## Métricas comuns

* P95
* P99
* RPS (requests per second)
* Latência média

## Ferramentas

* JMeter
* k6
* Locust

---

# 2.1.2 Teste de Stress

Submete o sistema além do limite operacional.

## Objetivo

Descobrir o ponto de quebra.

## Avalia

* Limite máximo
* Recuperação após falha
* Estabilidade extrema

## Exemplo

Sistema suporta:

* esperado: 10 mil usuários
* teste: 100 mil usuários

## Resultados esperados

* degradação controlada
* sem corrupção de dados
* recuperação possível

---

# 2.1.3 Teste de Spike

Avalia comportamento em picos abruptos.

## Objetivo

Validar explosões repentinas de tráfego.

## Exemplo

* Black Friday
* lançamento de ingressos
* live streaming

## Cenário típico

```text
100 usuários → 20.000 usuários em segundos
```

## Problemas comuns detectados

* filas travadas
* autoscaling lento
* timeout
* cache insuficiente

---

# 2.1.4 Teste de Volume

Valida processamento de grandes volumes de dados.

## Objetivo

Garantir estabilidade com datasets massivos.

## Avalia

* banco de dados
* indexação
* consultas
* memória

## Exemplo

* 1 bilhão de registros
* upload de arquivos gigantes
* processamento ETL

## Problemas encontrados

* lentidão SQL
* overflow
* gargalos de IO

---

# 2.1.5 Teste de Escalabilidade

Avalia capacidade de crescimento.

## Objetivo

Validar expansão horizontal e vertical.

## Escalabilidade Horizontal

Adicionar servidores.

## Escalabilidade Vertical

Aumentar recursos da máquina.

## Avalia

* autoscaling
* balanceamento
* elasticidade

## Exemplo

* Kubernetes adicionando pods automaticamente

---

# 2.1.6 Teste de Resistência (Soak)

Executa carga contínua por longo período.

## Objetivo

Detectar degradação gradual.

## Avalia

* memory leak
* conexões órfãs
* degradação lenta

## Exemplo

Sistema sob carga por:

* 24h
* 72h
* 7 dias

---

# 2.2 Segurança

Avaliam proteção contra ataques e vulnerabilidades.

---

# 2.2.1 Teste de Vulnerabilidade

Identifica falhas conhecidas de segurança.

## Objetivo

Detectar brechas automaticamente.

## Avalia

* CVEs
* dependências vulneráveis
* configurações inseguras

## Ferramentas

* OWASP Dependency-Check
* Snyk
* Trivy

---

# 2.2.2 Pentest

Simula ataques reais ao sistema.

## Objetivo

Explorar vulnerabilidades como um invasor.

## Tipos

* Black Box
* White Box
* Gray Box

## Técnicas comuns

* SQL Injection
* XSS
* CSRF
* RCE

## Ferramentas

* Burp Suite
* Metasploit

---

# 2.2.3 Teste de Autenticação

Valida identidade do usuário.

## Objetivo

Garantir login seguro.

## Avalia

* MFA
* JWT
* OAuth
* sessão
* expiração

## Exemplo

* senha inválida
* brute force
* token expirado

---

# 2.2.4 Teste de Autorização

Valida permissões de acesso.

## Objetivo

Garantir acesso correto por perfil.

## Exemplo

Usuário comum tentando:

* acessar admin
* editar outro usuário
* acessar APIs privadas

## Problemas comuns

* privilege escalation
* IDOR

---

# 2.2.5 Teste de Criptografia

Valida proteção de dados sensíveis.

## Objetivo

Garantir confidencialidade e integridade.

## Avalia

* TLS
* hashing
* armazenamento seguro
* chaves criptográficas

## Exemplo

* senhas usando bcrypt
* HTTPS obrigatório

---

# 2.2.6 Teste OWASP

Baseado nas vulnerabilidades da OWASP.

## Objetivo

Cobrir riscos críticos conhecidos.

## Exemplos OWASP Top 10

* Broken Access Control
* Cryptographic Failures
* Injection
* Security Misconfiguration

---

# 2.3 Confiabilidade

Avaliam capacidade do sistema sobreviver a falhas.

---

# 2.3.1 Teste de Recuperação

Valida recuperação após falhas.

## Objetivo

Garantir retomada operacional.

## Exemplo

* reinício após crash
* recuperação de banco

---

# 2.3.2 Teste de Failover

Valida troca automática para redundância.

## Objetivo

Garantir continuidade operacional.

## Exemplo

* servidor principal cai
* réplica assume automaticamente

## Muito usado em

* cloud
* clusters
* banco replicado

---

# 2.3.3 Teste de Backup/Restore

Valida restauração de dados.

## Objetivo

Garantir recuperação real.

## Avalia

* integridade do backup
* tempo de recuperação
* consistência

## Erro comum

Backup existe mas restauração falha.

---

# 2.3.4 Teste de Tolerância a Falhas

Avalia sobrevivência parcial do sistema.

## Objetivo

Garantir degradação controlada.

## Exemplo

* serviço externo indisponível
* sistema continua parcialmente funcional

## Técnicas comuns

* circuit breaker
* retry
* fallback

---

# 2.4 Compatibilidade

Validam funcionamento em diferentes ambientes.

---

# 2.4.1 Cross-browser

Valida navegadores diferentes.

## Exemplo

* Chrome
* Firefox
* Safari
* Edge

## Avalia

* layout
* JavaScript
* CSS

---

# 2.4.2 Cross-platform

Valida múltiplos sistemas operacionais.

## Exemplo

* Linux
* Windows
* macOS

---

# 2.4.3 Compatibilidade Mobile

Valida dispositivos móveis.

## Avalia

* responsividade
* touch
* performance mobile

## Exemplo

* Android
* iOS
* tablets

---

# 2.4.4 Compatibilidade de Banco

Valida múltiplos bancos.

## Exemplo

* PostgreSQL
* MySQL
* SQL Server

## Avalia

* queries
* migrations
* tipos

---

# 2.4.5 Compatibilidade de API

Valida versões e contratos.

## Exemplo

* v1
* v2
* backward compatibility

---

# 2.5 Usabilidade

Avaliam experiência do usuário.

---

# 2.5.1 Teste de UX

Valida experiência geral.

## Objetivo

Garantir facilidade de uso.

## Avalia

* navegação
* clareza
* produtividade
* satisfação

---

# 2.5.2 Teste de Acessibilidade

Valida inclusão digital.

## Objetivo

Garantir acessibilidade.

## Baseado em

* WCAG
* ARIA

## Avalia

* contraste
* teclado
* leitores de tela

## Ferramentas

* axe DevTools
* Lighthouse

---

# 2.5.3 Teste Heurístico

Baseado em princípios de UX.

## Muito usado com

Heurísticas de Jakob Nielsen.

## Avalia

* consistência
* feedback visual
* prevenção de erros

---

# 2.5.4 Teste com Usuário

Usuários reais utilizam o sistema.

## Objetivo

Observar comportamento humano real.

## Avalia

* dificuldade
* entendimento
* produtividade

---

# 2.6 Observabilidade

Validam capacidade de monitorar o sistema.

---

# 2.6.1 Teste de Logs

Valida geração correta de logs.

## Objetivo

Garantir rastreabilidade.

## Avalia

* erros
* auditoria
* contexto

## Problemas comuns

* logs insuficientes
* logs sensíveis

---

# 2.6.2 Teste de Monitoramento

Valida métricas operacionais.

## Objetivo

Garantir visibilidade operacional.

## Avalia

* alertas
* dashboards
* disponibilidade

## Ferramentas

* Prometheus
* Grafana

---

# 2.6.3 Teste de Métricas

Valida coleta de indicadores.

## Exemplo

* CPU
* memória
* throughput
* latência

## Importância

Base para SRE e engenharia de confiabilidade.

---

# 2.6.4 Teste de Rastreamento (Tracing)

Valida rastreamento distribuído.

## Objetivo

Entender fluxo completo entre serviços.

## Muito usado em

* microsserviços
* sistemas distribuídos

## Ferramentas

* Jaeger
* OpenTelemetry

## Exemplo

```text
Frontend
 → API Gateway
   → Auth Service
   → Payment Service
   → Database
```

---

# Relação Entre os Testes Não Funcionais

| Categoria       | Objetivo Principal            |
| --------------- | ----------------------------- |
| Performance     | Velocidade e escalabilidade   |
| Segurança       | Proteção contra ataques       |
| Confiabilidade  | Continuidade operacional      |
| Compatibilidade | Funcionar em vários ambientes |
| Usabilidade     | Melhor experiência humana     |
| Observabilidade | Monitorar e diagnosticar      |
