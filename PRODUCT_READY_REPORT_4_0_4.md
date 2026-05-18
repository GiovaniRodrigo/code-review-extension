# Git Code Review 4.0.4 — Runtime Stability

## Goal

Stabilize Enterprise/Team runtime actions discovered in VS Code validation.

## Fixed

- Shared session export no longer defaults to `/git-code-review-session-*.json`.
- Audit log and self-hosted readiness exports use safe workspace/global storage defaults.
- Enterprise RBAC and SSO store local state without failing on workspace configuration registration.
- Markdown, PDF and Quality Report exports use workspace paths or OS temp fallback.

## Validation

- Typecheck
- Production tests
- Build
- VSIX packaging
- VSIX validation
- Product readiness gate
- Critical audit
