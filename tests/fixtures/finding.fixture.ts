export const pendingFinding = {
  id: 'finding-1',
  file: '/tmp/example.ts',
  line: 3,
  column: 1,
  message: 'Extract this responsibility to a service.',
  severity: 'warning' as const,
  status: 'pending' as const,
  suggestedFix: 'const value = service.execute();'
};
