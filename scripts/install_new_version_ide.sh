#!/usr/bin/env bash
set -euo pipefail

APP_NAME="code-review-extension"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

APPS_DIR="$ROOT_DIR/apps"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_DIR="$ROOT_DIR/packages-generated"

VSCODE_DIR="$APPS_DIR/vscode"
JETBRAINS_DIR="$APPS_DIR/jetbrains"
VIM_DIR="$APPS_DIR/vim"
NEOVIM_DIR="$APPS_DIR/neovim"
SUBLIME_DIR="$APPS_DIR/sublime"

mkdir -p "$DIST_DIR" "$PACKAGE_DIR"

header() {
  clear
  echo "========================================"
  echo "  Instalador Guiado - $APP_NAME"
  echo "========================================"
  echo
}

pause() {
  echo
  read -rp "Pressione ENTER para continuar..."
}

check_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERRO: comando não encontrado: $1"
    return 1
  fi
}

latest_file() {
  local pattern="$1"

  find "$DIST_DIR" "$PACKAGE_DIR" "$APPS_DIR" \
    -type f \
    -name "$pattern" \
    2>/dev/null \
    | sort -r \
    | head -n 1
}

run_root_tests() {
  header
  echo "Executando testes antes de gerar nova versão..."
  echo

  cd "$ROOT_DIR"

  npm run build
  npm run test

  if npm run | grep -q "test:unit"; then
    npm run test:unit
  fi

  if npm run | grep -q "test:integration"; then
    npm run test:integration
  fi

  echo
  echo "Testes básicos concluídos."
  pause
}

build_vscode() {
  header
  echo "Gerando pacote para VS Code..."
  echo

  check_command npm || exit 1
  check_command npx || exit 1

  if [[ ! -f "$VSCODE_DIR/package.json" ]]; then
    echo "ERRO: package.json não encontrado em:"
    echo "$VSCODE_DIR/package.json"
    pause
    return
  fi

  mkdir -p "$DIST_DIR"

  cd "$VSCODE_DIR"

  npm run build

  # Evita erro do vsce com workspace:* no monorepo
  npm pkg delete dependencies.@code-review/ui >/dev/null 2>&1 || true

  npx vsce package --allow-missing-repository --out "$DIST_DIR"

  cd "$ROOT_DIR"

  echo
  echo "Pacote VS Code gerado em:"
  latest_file "*.vsix"
  pause
}

install_vscode() {
  header
  echo "Instalação guiada - VS Code"
  echo

  check_command code || {
    echo "ERRO: comando 'code' não encontrado."
    pause
    return
  }

  local file
  file="$(latest_file "*.vsix")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum arquivo .vsix encontrado."
    pause
    return
  fi

  echo "Arquivo encontrado:"
  echo "$file"
  echo

  read -rp "Desinstalar versão antiga antes? (s/N): " remove_old

  if [[ "$remove_old" =~ ^[sS]$ ]]; then
    code --uninstall-extension "CodeReviewExtension.git-code-review" || true
  fi

  code --install-extension "$file" --force

  echo
  echo "VS Code instalado com sucesso."
  pause
}

build_jetbrains() {
  header
  echo "Gerando pacote para JetBrains..."
  echo

  if [[ ! -d "$JETBRAINS_DIR" ]]; then
    echo "Diretório JetBrains não encontrado:"
    echo "$JETBRAINS_DIR"
    pause
    return
  fi

  cd "$JETBRAINS_DIR"

  if [[ -f "gradlew" ]]; then
    chmod +x ./gradlew
    ./gradlew buildPlugin
  elif [[ -f "$ROOT_DIR/gradlew" ]]; then
    cd "$ROOT_DIR"
    chmod +x ./gradlew
    ./gradlew :apps:jetbrains:buildPlugin
  elif [[ -f "package.json" ]]; then
    npm run package
  else
    echo "Nenhum build JetBrains configurado."
    echo "Esperado: gradlew, build.gradle.kts ou script package."
    pause
    return
  fi

  cd "$ROOT_DIR"

  echo
  echo "Pacote JetBrains gerado."
  pause
}

install_jetbrains() {
  header
  echo "Instalação guiada - JetBrains"
  echo

  local file
  file="$(latest_file "*.zip")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote .zip encontrado."
    pause
    return
  fi

  echo "Arquivo encontrado:"
  echo "$file"
  echo
  echo "Instale manualmente em:"
  echo "Settings > Plugins > Install Plugin from Disk..."
  echo
  echo "Selecione:"
  echo "$file"

  pause
}

build_vim() {
  header
  echo "Gerando pacote para Vim..."
  echo

  local target="$PACKAGE_DIR/${APP_NAME}-vim-$(date +%Y%m%d-%H%M%S).tar.gz"

  tar \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=coverage \
    -czf "$target" \
    -C "$ROOT_DIR" \
    apps/vim packages docs README.md package.json

  echo "Pacote gerado:"
  echo "$target"
  pause
}

install_vim() {
  header
  echo "Instalação guiada - Vim"
  echo

  local file
  file="$(latest_file "*vim*.tar.gz")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote Vim encontrado."
    pause
    return
  fi

  echo "Arquivo encontrado:"
  echo "$file"
  echo
  echo "Instalação sugerida:"
  echo "Extraia o pacote no diretório de plugins do Vim."
  echo

  pause
}

build_neovim() {
  header
  echo "Gerando pacote para Neovim..."
  echo

  local target="$PACKAGE_DIR/${APP_NAME}-neovim-$(date +%Y%m%d-%H%M%S).tar.gz"

  tar \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=coverage \
    -czf "$target" \
    -C "$ROOT_DIR" \
    apps/neovim packages docs README.md package.json

  echo "Pacote gerado:"
  echo "$target"
  pause
}

install_neovim() {
  header
  echo "Instalação guiada - Neovim"
  echo

  local file
  file="$(latest_file "*neovim*.tar.gz")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote Neovim encontrado."
    pause
    return
  fi

  echo "Arquivo encontrado:"
  echo "$file"
  echo
  echo "Instalação sugerida:"
  echo "Extraia no diretório do seu plugin manager:"
  echo "$file"

  pause
}

build_sublime() {
  header
  echo "Gerando pacote para Sublime Text..."
  echo

  check_command zip || {
    echo "ERRO: zip não encontrado."
    pause
    return
  }

  local target="$PACKAGE_DIR/${APP_NAME}-sublime-$(date +%Y%m%d-%H%M%S).zip"

  cd "$ROOT_DIR"

  zip -r "$target" \
    apps/sublime packages docs README.md package.json \
    -x "*/node_modules/*" "*/.git/*" "*/dist/*" "*/coverage/*"

  echo
  echo "Pacote gerado:"
  echo "$target"
  pause
}

install_sublime() {
  header
  echo "Instalação guiada - Sublime Text"
  echo

  local file
  file="$(latest_file "*sublime*.zip")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote Sublime encontrado."
    pause
    return
  fi

  echo "Arquivo encontrado:"
  echo "$file"
  echo
  echo "Copie para:"
  echo "~/.config/sublime-text/Packages/User/"
  echo
  echo "Arquivo:"
  echo "$file"

  pause
}

build_all() {
  build_vscode
  build_jetbrains
  build_vim
  build_neovim
  build_sublime
}

menu() {
  while true; do
    header
    echo "Root: $ROOT_DIR"
    echo
    echo "1) Rodar testes antes da versão"
    echo
    echo "2) Gerar pacote VS Code"
    echo "3) Instalar VS Code mais recente"
    echo
    echo "4) Gerar pacote JetBrains"
    echo "5) Instalar JetBrains mais recente"
    echo
    echo "6) Gerar pacote Vim"
    echo "7) Instalar Vim mais recente"
    echo
    echo "8) Gerar pacote Neovim"
    echo "9) Instalar Neovim mais recente"
    echo
    echo "10) Gerar pacote Sublime Text"
    echo "11) Instalar Sublime Text mais recente"
    echo
    echo "12) Gerar todos os pacotes"
    echo "13) Gerar todos após testes"
    echo
    echo "0) Sair"
    echo

    read -rp "Opção: " option

    case "$option" in
      1) run_root_tests ;;
      2) build_vscode ;;
      3) install_vscode ;;
      4) build_jetbrains ;;
      5) install_jetbrains ;;
      6) build_vim ;;
      7) install_vim ;;
      8) build_neovim ;;
      9) install_neovim ;;
      10) build_sublime ;;
      11) install_sublime ;;
      12) build_all ;;
      13)
        run_root_tests
        build_all
        ;;
      0) exit 0 ;;
      *) echo "Opção inválida."; pause ;;
    esac
  done
}

menu