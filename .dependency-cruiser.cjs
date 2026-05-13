module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true }
    },
    {
      name: 'domain-not-to-infra',
      severity: 'error',
      from: { path: '^packages/domain' },
      to: { path: '^packages/infra' }
    },
    {
      name: 'domain-not-to-ui',
      severity: 'error',
      from: { path: '^packages/domain' },
      to: { path: '^packages/ui' }
    },
    {
      name: 'application-not-to-ui',
      severity: 'error',
      from: { path: '^packages/(application|core)' },
      to: { path: '^packages/ui' }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.base.json'
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
};
