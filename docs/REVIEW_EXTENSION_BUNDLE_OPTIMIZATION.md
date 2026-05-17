# VSCode Extension Bundle Optimization

# Objetivo

Reduzir o tamanho do bundle da extensão VSCode e melhorar:

- performance;
- estabilidade;
- debug;
- source maps;
- consumo de memória;
- startup do Extension Host.

---

# Problema original

A extensão estava empacotando:

```txt
typescript
ts-morph
@ts-morph/common
axios
