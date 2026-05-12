# Integração com IDEs

Este projeto centraliza comandos em `scripts/`.

As IDEs **não implementam regras próprias**.
Elas apenas executam os scripts oficiais do projeto.

---

## Estrutura Padrão

```txt
projeto/
├── scripts/
│   ├── setup.sh
│   ├── test.sh
│   ├── lint.sh
│   ├── build.sh
│   └── run.sh
│
├── .vscode/
│   ├── tasks.json
│   ├── launch.json
│   └── settings.json
│
├── .idea/
│   ├── runConfigurations/
│   │   ├── Test.xml
│   │   ├── Lint.xml
│   │   └── Run.xml
│   └── codeStyles/
│
├── .eclipse/
│   └── launch/
│       ├── Test.launch
│       └── Run.launch
│
├── .zed/
│   ├── settings.json
│   └── tasks.json
│
├── .devcontainer/
│   └── devcontainer.json
│
└── README.md
```

---

# Princípios Arquiteturais

## 1. Fonte Única de Execução

Toda lógica operacional deve existir em:

```txt
scripts/
```

As IDEs apenas delegam execução.

Exemplo:

```bash
./scripts/test.sh
```

---

## 2. Independência de IDE

O projeto deve funcionar igualmente em:

* Visual Studio Code
* IntelliJ IDEA
* WebStorm
* PhpStorm
* Eclipse IDE
* Zed

Sem alterar regras de negócio.

---

## 3. Open/Closed Principle (SOLID)

A IDE nunca modifica comportamento do sistema.

Ela apenas executa:

```txt
scripts oficiais
```

Novas IDEs podem ser adicionadas sem alterar a arquitetura central.

---

# Scripts Oficiais

## setup.sh

Responsável por:

* instalação de dependências
* preparação do ambiente
* configuração inicial

```bash
./scripts/setup.sh
```

---

## test.sh

Responsável por:

* testes unitários
* integração
* cobertura
* qualidade

```bash
./scripts/test.sh
```

---

## lint.sh

Responsável por:

* lint
* static analysis
* validações arquiteturais
* style guide

```bash
./scripts/lint.sh
```

---

## build.sh

Responsável por:

* build
* transpile
* empacotamento
* release

```bash
./scripts/build.sh
```

---

## run.sh

Responsável por:

* execução local
* debug
* inicialização da aplicação

```bash
./scripts/run.sh
```

---

# VS Code

Estrutura:

```txt
.vscode/
├── tasks.json
├── launch.json
└── settings.json
```

## tasks.json

Centraliza comandos da IDE.

Exemplo:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "./scripts/test.sh"
    },
    {
      "label": "Run Lint",
      "type": "shell",
      "command": "./scripts/lint.sh"
    }
  ]
}
```

## launch.json

Centraliza debug.

---

# JetBrains

Estrutura:

```txt
.idea/
├── runConfigurations/
└── codeStyles/
```

## runConfigurations/

Arquivos XML executam scripts oficiais.

Exemplo:

```txt
Test.xml
Lint.xml
Run.xml
```

Cada configuração chama:

```bash
./scripts/*.sh
```

---

# Eclipse

Estrutura:

```txt
.eclipse/
└── launch/
```

Exemplo:

```txt
Test.launch
Run.launch
```

Cada launcher executa scripts do projeto.

---

# Zed

Estrutura:

```txt
.zed/
├── settings.json
└── tasks.json
```

Mesmo padrão do VS Code:

```json
{
  "tasks": {
    "test": "./scripts/test.sh",
    "lint": "./scripts/lint.sh"
  }
}
```

---

# Dev Container

Estrutura:

```txt
.devcontainer/
└── devcontainer.json
```

Responsável por:

* ambiente reproduzível
* containers padronizados
* onboarding rápido
* isolamento de dependências

Exemplo:

```json
{
  "name": "project-dev",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace"
}
```

---

# Benefícios da Arquitetura

## Padronização

Todas IDEs executam exatamente os mesmos comandos.

---

## Baixo Acoplamento

IDE desacoplada da lógica do projeto.

---

## Escalabilidade

Novas IDEs podem ser adicionadas facilmente.

---

## Reprodutibilidade

Mesmo comportamento em:

* Linux
* Windows
* CI/CD
* Containers
* IDEs diferentes

---

## Facilidade de Automação

CI/CD reutiliza:

```txt
scripts/
```

Sem duplicação de pipeline.

---

# Fluxo Recomendado

```txt
IDE
 ↓
tasks.json / launch / runConfigurations
 ↓
scripts/*.sh
 ↓
Aplicação
```

---

# Regra Fundamental

```txt
A IDE é apenas uma interface.

A lógica pertence ao projeto.
```
