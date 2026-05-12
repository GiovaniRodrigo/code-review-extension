# Princípios Arquiteturais

## 1. Objetivo

Definir uma arquitetura de software voltada para manutenção, evolução e novas implementações do sistema de Code Review assistido por IA em diferentes IDEs.

A solução deve permitir suporte a múltiplas IDEs sem acoplar regras de negócio à API específica de cada ambiente.

---

## 2. Princípios Base

### 2.1 Open/Closed Principle
O sistema deve ser aberto para extensão e fechado para modificação. Novas IDEs, providers de IA e telas devem ser adicionados sem alterar o núcleo.

### 2.2 Baixo Acoplamento
A extensão de cada IDE deve depender apenas de contratos.
- **Errado:** Core → VS Code API
- **Correto:** VS Code Adapter → Core

### 2.3 Alta Coesão
Cada módulo deve ter uma responsabilidade clara e única.

### 2.4 Inversão de Dependência
O sistema deve depender de abstrações, não de implementações concretas.
