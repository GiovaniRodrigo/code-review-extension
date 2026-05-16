#!/usr/bin/env bash
set -euo pipefail

APP_NAME="code-review-extension"
DIST_DIR="dist"
PACKAGE_DIR="packages-generated"

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

latest_file() {
  local pattern="$1"
  find "$DIST_DIR" "$PACKAGE_DIR" -type f -name "$pattern" 2>/dev/null \
    | sort -r \
    | head -n 1
}

build_vscode() {
  header
  echo "Gerando pacote para VS Code..."
  echo

  if ! command -v npx >/dev/null 2>&1; then
    echo "ERRO: npx não encontrado."
    exit 1
  fi

  npx vsce package --out "$DIST_DIR"

  echo
  echo "Pacote VS Code gerado com sucesso."
  pause
}

install_vscode() {
  header
  echo "Instalação guiada - VS Code"
  echo

  local file
  file="$(latest_file "*.vsix")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum arquivo .vsix encontrado."
    echo "Gere o pacote antes de instalar."
    pause
    return
  fi

  echo "Arquivo mais recente encontrado:"
  echo "$file"
  echo

  read -rp "Deseja desinstalar a versão antiga antes? (s/N): " remove_old

  if [[ "$remove_old" =~ ^[sS]$ ]]; then
    echo
    echo "Desinstalando extensão antiga..."
    code --uninstall-extension "$APP_NAME" || true
  fi

  echo
  echo "Instalando pacote mais recente..."
  code --install-extension "$file" --force

  echo
  echo "Instalação concluída."
  pause
}

build_jetbrains() {
  header
  echo "Gerando pacote para JetBrains..."
  echo
  echo "TODO: configure aqui o comando real de build do plugin JetBrains."
  echo "Exemplo futuro:"
  echo "./gradlew buildPlugin"
  pause
}

install_jetbrains() {
  header
  echo "Instalação guiada - JetBrains"
  echo

  local file
  file="$(latest_file "*.zip")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote .zip encontrado para JetBrains."
    pause
    return
  fi

  echo "Arquivo mais recente encontrado:"
  echo "$file"
  echo
  echo "Instalação JetBrains normalmente é feita por:"
  echo "Settings > Plugins > Install Plugin from Disk..."
  echo
  echo "Selecione este arquivo:"
  echo "$file"

  pause
}

build_vim() {
  header
  echo "Gerando pacote para Vim/Neovim..."
  echo

  local target="$PACKAGE_DIR/${APP_NAME}-vim-$(date +%Y%m%d-%H%M%S).tar.gz"

  tar \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    -czf "$target" .

  echo "Pacote gerado:"
  echo "$target"
  pause
}

install_vim() {
  header
  echo "Instalação guiada - Vim/Neovim"
  echo

  local file
  file="$(latest_file "*vim*.tar.gz")"

  if [[ -z "${file:-}" ]]; then
    echo "Nenhum pacote Vim/Neovim encontrado."
    pause
    return
  fi

  echo "Arquivo mais recente encontrado:"
  echo "$file"
  echo
  echo "Descompacte no diretório de plugins do seu gerenciador:"
  echo "$file"

  pause
}

build_sublime() {
  header
  echo "Gerando pacote para Sublime Text..."
  echo

  local target="$PACKAGE_DIR/${APP_NAME}-sublime-$(date +%Y%m%d-%H%M%S).zip"

  zip -r "$target" . \
    -x "node_modules/*" ".git/*" "dist/*"

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

  echo "Arquivo mais recente encontrado:"
  echo "$file"
  echo
  echo "Copie o pacote para a pasta Packages/User do Sublime Text."
  echo

  pause
}

menu() {
  while true; do
    header
    echo "Escolha uma opção:"
    echo
    echo "1) Gerar pacote VS Code"
    echo "2) Instalar pacote VS Code mais recente"
    echo
    echo "3) Gerar pacote JetBrains"
    echo "4) Instalar pacote JetBrains mais recente"
    echo
    echo "5) Gerar pacote Vim/Neovim"
    echo "6) Instalar pacote Vim/Neovim mais recente"
    echo
    echo "7) Gerar pacote Sublime Text"
    echo "8) Instalar pacote Sublime Text mais recente"
    echo
    echo "9) Gerar todos os pacotes"
    echo "0) Sair"
    echo

    read -rp "Opção: " option

    case "$option" in
      1) build_vscode ;;
      2) install_vscode ;;
      3) build_jetbrains ;;
      4) install_jetbrains ;;
      5) build_vim ;;
      6) install_vim ;;
      7) build_sublime ;;
      8) install_sublime ;;
      9)
        build_vscode
        build_jetbrains
        build_vim
        build_sublime
        ;;
      0) exit 0 ;;
      *) echo "Opção inválida."; pause ;;
    esac
  done
}

menu