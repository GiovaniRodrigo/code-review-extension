/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-vscode-in-ui',
      comment: 'Código em packages/ui (ou src/ui) NUNCA deve importar vscode.',
      severity: 'error',
      from: { path: '^src/ui' },
      to: { path: 'vscode' }
    },
    {
      name: 'ui-no-infra',
      comment: 'UI não deve importar adaptadores diretamente (infra).',
      severity: 'error',
      from: { path: '^src/ui' },
      to: { path: '^src/adapters' }
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Dependências circulares são proibidas.',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Arquivos órfãos devem ser evitados.',
      from: { orphan: true },
      to: {}
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      mainFields: ['module', 'main', 'types', 'typings']
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      },
      archi: {
        collapsePattern: '^(packages|src|lib|app|bin|test(s)?|spec(s)?|obj|dist|out)/[^/]+'
      }
    }
  }
};
