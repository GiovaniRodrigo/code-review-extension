#!/usr/bin/env bash

set -e

OUTPUT_FILE="contexto-projeto-atualizado.md"

echo "# CONTEXTO ATUALIZADO DO PROJETO" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Gerado em: $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 1. Branch atual" >> "$OUTPUT_FILE"
echo '```bash' >> "$OUTPUT_FILE"
git branch --show-current >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 2. Últimos commits" >> "$OUTPUT_FILE"
echo '```bash' >> "$OUTPUT_FILE"
git log --oneline -15 >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 3. Status do repositório" >> "$OUTPUT_FILE"
echo '```bash' >> "$OUTPUT_FILE"
git status --short >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 4. Arquivos modificados" >> "$OUTPUT_FILE"
echo '```bash' >> "$OUTPUT_FILE"
git diff --name-only >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 5. Resumo das alterações não commitadas" >> "$OUTPUT_FILE"
echo '```diff' >> "$OUTPUT_FILE"
git diff --stat >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 6. Diferenças principais" >> "$OUTPUT_FILE"
echo '```diff' >> "$OUTPUT_FILE"
git diff -- . \
  ':!node_modules' \
  ':!vendor' \
  ':!dist' \
  ':!build' \
  ':!coverage' \
  ':!storage' \
  ':!.env' \
  ':!*.lock' \
  >> "$OUTPUT_FILE" 2>/dev/null || true
echo '```' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 7. Documentação relevante" >> "$OUTPUT_FILE"

for file in README.md CHANGELOG.md ROADMAP.md docs/**/*.md docs/*.md; do
  if [ -f "$file" ]; then
    echo "" >> "$OUTPUT_FILE"
    echo "### $file" >> "$OUTPUT_FILE"
    echo '```markdown' >> "$OUTPUT_FILE"
    sed -n '1,220p' "$file" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
  fi
done

echo "" >> "$OUTPUT_FILE"
echo "Contexto gerado em: $OUTPUT_FILE"