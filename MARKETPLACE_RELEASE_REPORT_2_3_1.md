# Marketplace Release Report — Git Code Review 2.3.1

## Release intent

Prepare Git Code Review for Visual Studio Code Marketplace publication.

## Product definition

| Item | Value |
|---|---|
| Product | Git Code Review |
| Audience | Code reviewers |
| Category | Code review governance workspace for VS Code |
| Version | 2.3.1 |
| Marketplace package | git-code-review-2.3.1.vsix |

## Marketplace polish

- Removed remaining Beta/old AI Code Review branding from VS Code-facing package metadata and runtime strings.
- Renamed Activity Bar container to `Code Review`.
- Renamed configuration section to `Git Code Review`.
- Kept Marketplace screenshots and icon in the packaged VSIX.
- Added safe base-branch auto-detection for branch review and PR summary flows.
- Changed default `codeReview.git.baseBranch` to empty so first-run behavior can auto-detect common branches.
- Added user-friendly fallback when no base branch can be detected.
- Aligned dashboard readiness status with quality score.
- Replaced raw `Approved: x/y` label with a clearer findings summary.

## Validation

The marketplace package must pass:

```bash
npm run typecheck --workspace git-code-review
npm run test:production --workspace git-code-review
npm run build --workspace git-code-review
npm run package:vscode
npm run validate:vsix --workspace git-code-review
npm run product:ready
npm run audit:critical
```

## Publishing note

The VSIX is ready to upload/publish, but publishing itself requires the owner publisher account and a valid marketplace token.
