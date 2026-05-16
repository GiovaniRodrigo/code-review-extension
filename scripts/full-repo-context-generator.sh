#!/usr/bin/env bash

# =========================================================
# PROJECT CONTEXT EXPORTER
# Gera contexto consolidado do repositório para LLMs
# Compatível com:
# - VS Code
# - Codex
# - Claude
# - Gemini
# - Ollama
# - Cursor
# =========================================================

set -e

ROOT_DIR="${1:-.}"
OUTPUT_DIR="${ROOT_DIR}/context"
OUTPUT_FILE="${OUTPUT_DIR}/PROJECT_CONTEXT.md"

mkdir -p "$OUTPUT_DIR"

echo "========================================="
echo "PROJECT CONTEXT EXPORTER"
echo "========================================="

echo ""
echo "Root: $ROOT_DIR"
echo "Output: $OUTPUT_FILE"
echo ""

rm -f "$OUTPUT_FILE"

touch "$OUTPUT_FILE"

# =========================================================
# HEADER
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"
# PROJECT CONTEXT

Gerado automaticamente em:

$(date)

---

# REPOSITORY STRUCTURE

\`\`\`txt
EOF

# =========================================================
# TREE
# =========================================================

if command -v tree >/dev/null 2>&1; then
  tree \
    -I 'node_modules|dist|build|coverage|.git|vendor|tmp|storage|.next|.turbo|out|target|bin|obj' \
    "$ROOT_DIR" >> "$OUTPUT_FILE"
else
  find "$ROOT_DIR" \
    -type d \
    \( \
      -name node_modules -o \
      -name dist -o \
      -name build -o \
      -name coverage -o \
      -name .git -o \
      -name vendor -o \
      -name .next -o \
      -name .turbo \
    \) -prune -o -print >> "$OUTPUT_FILE"
fi

cat <<EOF >> "$OUTPUT_FILE"
\`\`\`

---

# PACKAGE.JSON FILES

EOF

# =========================================================
# PACKAGE.JSON
# =========================================================

find "$ROOT_DIR" -name package.json \
  -not -path "*/node_modules/*" \
  | while read -r file; do

  echo "" >> "$OUTPUT_FILE"
  echo "## $file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "\`\`\`json" >> "$OUTPUT_FILE"

  cat "$file" >> "$OUTPUT_FILE"

  echo "\`\`\`" >> "$OUTPUT_FILE"
done

# =========================================================
# TS CONFIGS
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# TYPESCRIPT CONFIGS

EOF

find "$ROOT_DIR" \
  \( -name "tsconfig*.json" -o -name "jsconfig.json" \) \
  -not -path "*/node_modules/*" \
  | while read -r file; do

  echo "" >> "$OUTPUT_FILE"
  echo "## $file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "\`\`\`json" >> "$OUTPUT_FILE"

  cat "$file" >> "$OUTPUT_FILE"

  echo "\`\`\`" >> "$OUTPUT_FILE"
done

# =========================================================
# DOCS
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# DOCUMENTATION

EOF

find "$ROOT_DIR/docs" \
  -type f \
  \( \
    -name "*.md" -o \
    -name "*.txt" \
  \) 2>/dev/null \
  | sort \
  | while read -r file; do

  echo "" >> "$OUTPUT_FILE"
  echo "## $file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  cat "$file" >> "$OUTPUT_FILE"

  echo "" >> "$OUTPUT_FILE"
done

# =========================================================
# SOURCE FILES
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# SOURCE FILES

EOF

find "$ROOT_DIR" \
  -type f \
  \( \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.js" -o \
    -name "*.jsx" -o \
    -name "*.json" -o \
    -name "*.md" -o \
    -name "*.yml" -o \
    -name "*.yaml" \
  \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/coverage/*" \
  -not -path "*/.git/*" \
  -not -path "*/vendor/*" \
  -not -path "*/.next/*" \
  -not -path "*/.turbo/*" \
  | while read -r file; do

  echo "" >> "$OUTPUT_FILE"
  echo "=========================================" >> "$OUTPUT_FILE"
  echo "FILE: $file" >> "$OUTPUT_FILE"
  echo "=========================================" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  EXT="${file##*.}"

  echo "\`\`\`${EXT}" >> "$OUTPUT_FILE"

  cat "$file" >> "$OUTPUT_FILE"

  echo "" >> "$OUTPUT_FILE"
  echo "\`\`\`" >> "$OUTPUT_FILE"
done

# =========================================================
# TEST FILES
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# TEST FILES

EOF

find "$ROOT_DIR" \
  -type f \
  \( \
    -name "*.test.ts" -o \
    -name "*.spec.ts" -o \
    -name "*.test.tsx" -o \
    -name "*.spec.tsx" \
  \) \
  -not -path "*/node_modules/*" \
  | while read -r file; do

  echo "" >> "$OUTPUT_FILE"
  echo "## $file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"

  EXT="${file##*.}"

  echo "\`\`\`${EXT}" >> "$OUTPUT_FILE"

  cat "$file" >> "$OUTPUT_FILE"

  echo "" >> "$OUTPUT_FILE"
  echo "\`\`\`" >> "$OUTPUT_FILE"
done

# =========================================================
# GIT INFO
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# GIT INFORMATION

EOF

echo "" >> "$OUTPUT_FILE"
echo "## CURRENT BRANCH" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "\`\`\`txt" >> "$OUTPUT_FILE"

git -C "$ROOT_DIR" branch --show-current >> "$OUTPUT_FILE" 2>/dev/null || true

echo "\`\`\`" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "## LAST COMMITS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "\`\`\`txt" >> "$OUTPUT_FILE"

git -C "$ROOT_DIR" log --oneline -n 20 >> "$OUTPUT_FILE" 2>/dev/null || true

echo "\`\`\`" >> "$OUTPUT_FILE"

# =========================================================
# FINAL
# =========================================================

cat <<EOF >> "$OUTPUT_FILE"

---

# FINAL NOTES

Este arquivo foi gerado automaticamente para fornecer:

- contexto completo do projeto;
- arquitetura;
- frontend;
- backend;
- testes;
- documentação;
- scripts;
- pipelines;
- estrutura multi-IDE;
- quality gates;
- design system;
- integrações.

EOF

echo ""
echo "========================================="
echo "CONTEXT GENERATED SUCCESSFULLY"
echo "========================================="
echo ""
echo "File:"
echo "$OUTPUT_FILE"
echo ""