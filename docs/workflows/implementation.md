# Workflow de Implementação

Este documento define o processo padrão para implementar novas funcionalidades ou correções no sistema.

## 1. Fase de Pesquisa e Design
1. Identificar o impacto nas camadas (Core, Infra, Adapter).
2. Definir se há necessidade de novos contratos.
3. Validar se a mudança respeita os **Princípios Arquiteturais**.

## 2. Implementação com TDD (Core)
1. Criar arquivo de teste para o novo Use Case ou Serviço.
2. Definir os Mocks necessários para as dependências (Git, Storage, AI).
3. Seguir o ciclo **Red-Green-Refactor**.

## 3. Integração e UI
1. Implementar as mudanças necessárias na `Presentation Layer`.
2. Conectar a UI ao novo Use Case através de Hooks ou Services.
3. Validar o fluxo de feedback visual (Loading, Success, Error).

## 4. Validação (HITL)
1. Se a funcionalidade envolve IA, garantir que o fluxo **Human-in-the-Loop** está preservado.
2. Verificar se o estado de "Pendente" é o padrão para sugestões de IA.

## 5. Checklist de Entrega
- [ ] Testes unitários passando.
- [ ] Nenhuma dependência de IDE no Core.
- [ ] Documentação de API atualizada (se necessário).
- [ ] UI seguindo o Design System.
