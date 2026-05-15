# Beta Release Checklist

Execute these steps before distributing a new `.vsix`.

## 🧪 1. Automated Testing
- [ ] `npm test` passed in root.
- [ ] `packages/core` unit tests passed.
- [ ] `packages/infra` unit tests passed.
- [ ] `apps/vscode` integration tests passed.

## 🏗️ 2. Build & Package
- [ ] `npm run build` is clean.
- [ ] `npm run package:vscode` generated `.vsix` in `apps/vscode`.
- [ ] Bundle size checked (should be within limits).

## 🕵️ 3. Manual Validation
- [ ] Fresh installation from `.vsix`.
- [ ] Extension activates without error.
- [ ] Sidebar view opens correctly.
- [ ] `mock` provider works (smoke test).
- [ ] `ollama` provider connection verified.
- [ ] Branch switching restores state.
- [ ] Approving finding generates diagnostic.
- [ ] "Revalidate" button updates view.
- [ ] OpenAI Key stored in SecretStorage.

## 📝 4. Documentation
- [ ] `package.json` version incremented.
- [ ] `CHANGELOG.md` updated with new version.
- [ ] `README.md` reflects current features.
- [ ] Screenshots in `media/` are up to date.

## 🚀 5. Release
- [ ] GitHub release created.
- [ ] `.vsix` uploaded as artifact.
- [ ] Tag pushed to repository.
