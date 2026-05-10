export const TEST_STATUS = Object.freeze({
  PASSED: 'passed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
  TODO: 'todo'
});

export function parseTapLine(line) {
  const trimmed = line.trim();

  const subtest = trimmed.match(/^# Subtest:\s*(.+)$/);
  if (subtest) {
    return { type: 'subtest', name: subtest[1] };
  }

  const result = trimmed.match(/^(ok|not ok)\s+\d+\s+-\s+(.+)$/);
  if (result) {
    const [, state, nameWithDirective] = result;
    const [namePart, directivePart = ''] = nameWithDirective.split(/\s+#\s+/, 2);
    const directive = directivePart.toLowerCase();
    let status = state === 'ok' ? TEST_STATUS.PASSED : TEST_STATUS.FAILED;
    if (directive.includes('skip')) status = TEST_STATUS.SKIPPED;
    if (directive.includes('todo')) status = TEST_STATUS.TODO;

    return { type: 'result', status, name: namePart.trim() };
  }

  const duration = trimmed.match(/^duration_ms:\s*([0-9.]+)/);
  if (duration) {
    return { type: 'duration', durationMs: Number(duration[1]) };
  }

  const plan = trimmed.match(/^1\.\.([0-9]+)$/);
  if (plan) {
    return { type: 'plan', total: Number(plan[1]) };
  }

  return { type: 'other', raw: line };
}

export function createProgressBar(completed, total, width = 24) {
  const safeTotal = Math.max(total, 1);
  const ratio = Math.min(Math.max(completed / safeTotal, 0), 1);
  const filled = Math.round(ratio * width);
  return `[${'#'.repeat(filled)}${'-'.repeat(width - filled)}]`;
}

export function formatDuration(ms) {
  if (!Number.isFinite(ms)) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function summarizeResults(results) {
  return results.reduce((summary, result) => {
    summary.total += 1;
    summary[result.status] = (summary[result.status] ?? 0) + 1;
    return summary;
  }, { total: 0, passed: 0, failed: 0, skipped: 0, todo: 0 });
}

export function hasFailures(summary) {
  return (summary.failed ?? 0) > 0;
}
