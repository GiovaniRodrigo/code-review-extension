import assert from 'node:assert/strict';
import test from 'node:test';
import { createProgressBar, formatDuration, hasFailures, parseTapLine, summarizeResults, TEST_STATUS } from '../scripts/test-tui-core.mjs';

test('given TAP subtest line when parsing then returns readable test name', () => {
  assert.deepEqual(parseTapLine('# Subtest: validates AST builder behavior'), {
    type: 'subtest',
    name: 'validates AST builder behavior'
  });
});

test('given TAP result lines when parsing then identifies pass fail skip and todo states', () => {
  assert.deepEqual(parseTapLine('ok 1 - parses imports'), {
    type: 'result',
    status: TEST_STATUS.PASSED,
    name: 'parses imports'
  });
  assert.deepEqual(parseTapLine('not ok 2 - rejects invalid coupling'), {
    type: 'result',
    status: TEST_STATUS.FAILED,
    name: 'rejects invalid coupling'
  });
  assert.deepEqual(parseTapLine('ok 3 - external integration # SKIP unavailable'), {
    type: 'result',
    status: TEST_STATUS.SKIPPED,
    name: 'external integration'
  });
  assert.deepEqual(parseTapLine('not ok 4 - future contract # TODO add implementation'), {
    type: 'result',
    status: TEST_STATUS.TODO,
    name: 'future contract'
  });
});

test('given test counters when rendering progress then creates stable terminal bar', () => {
  assert.equal(createProgressBar(2, 4, 10), '[#####-----]');
  assert.equal(createProgressBar(5, 4, 10), '[##########]');
});

test('given result list when summarizing then reports UX friendly totals', () => {
  const summary = summarizeResults([
    { status: 'passed' },
    { status: 'passed' },
    { status: 'failed' },
    { status: 'skipped' }
  ]);

  assert.equal(summary.total, 4);
  assert.equal(summary.passed, 2);
  assert.equal(summary.failed, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(hasFailures(summary), true);
});

test('given duration in milliseconds when formatting then keeps compact readable value', () => {
  assert.equal(formatDuration(125), '125ms');
  assert.equal(formatDuration(1250), '1.25s');
});
