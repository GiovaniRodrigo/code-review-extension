# Design Patterns do Sistema

## 1. Padrões de Estrutura e Comportamento

O sistema utiliza padrões consagrados para garantir flexibilidade e testabilidade.

### 1.1 Adapter Pattern
Desacopla o núcleo das APIs específicas das IDEs (VS Code, JetBrains).

### 1.2 Strategy Pattern
Permite trocar o provedor de IA (OpenAI, Ollama, Local) em tempo de execução.

### 1.3 Repository Pattern
Abstrai a persistência de dados (diagnósticos, sessões).

### 1.4 Command Pattern
Representa ações do usuário como objetos, permitindo histórico e automação.

### 1.5 Observer Pattern
Comunicação reativa entre o core e a UI através de eventos.

---

## 2. Test-Driven Development (TDD)

A metodologia TDD é **obrigatória** para o desenvolvimento do core e novos Use Cases.

### 2.1 Ciclo Red-Green-Refactor
1. **Red**: Escreva um teste que falha para a funcionalidade desejada.
2. **Green**: Implemente o código mínimo necessário para fazer o teste passar.
3. **Refactor**: Melhore o código mantendo os testes passando.

### 2.2 Benefícios no Projeto
- **Garante Contratos**: O teste valida que a implementação respeita a interface.
- **Documentação Viva**: Os testes explicam como a regra de negócio deve funcionar.
- **Segurança na Refatoração**: Mudanças no core podem ser feitas com confiança.

---

## 3. Padrões de Interface (UX/UI)

- **MVC/MVVM**: Separação clara entre visual e lógica.
- **Registry Pattern**: Registro dinâmico de novas funcionalidades e validações.
- **Facade Pattern**: Simplifica o acesso a subsistemas complexos.
