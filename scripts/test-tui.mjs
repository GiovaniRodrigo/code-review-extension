#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { createProgressBar, formatDuration, hasFailures, parseTapLine, summarizeResults } from './test-tui-core.mjs';

const useColor = process.env.NO_COLOR !== '1' && process.env.TERM !== 'dumb';
const color = (code, value) => useColor ? `\u001b[${code}m${value}\u001b[0m` : value;
const green = (value) => color('32', value);
const red = (value) => color('31', value);
const yellow = (value) => color('33', value);
const cyan = (value) => color('36', value);
const bold = (value) => color('1', value);

const testArgs = ['--test', '--test-reporter=tap', ...process.argv.slice(2)];
if (testArgs.length === 2) testArgs.push('test/*.test.mjs');

const startedAt = Date.now();
const results = [];
const warnings = [];
let currentSubtest = null;
let currentDurationMs = 0;
let plannedTotal = estimateTotalTests();
let pendingResult = null;

printHeader();

const child = spawn(process.execPath, testArgs, {
  cwd: process.cwd(),
  shell: process.platform === 'win32',
  stdio: ['ignore', 'pipe', 'pipe']
});

const out = createInterface({ input: child.stdout });
out.on('line', handleLine);

const err = createInterface({ input: child.stderr });
err.on('line', (line) => warnings.push(line));

child.on('close', (code) => {
  flushPendingResult();
  const summary = summarizeResults(results);
  const duration = Date.now() - startedAt;
  printSummary(summary, duration, code);
  process.exitCode = code ?? (hasFailures(summary) ? 1 : 0);
});

function handleLine(line) {
  const event = parseTapLine(line);

  if (event.type === 'plan') {
    flushPendingResult();
    plannedTotal = event.total;
    return;
  }

  if (event.type === 'subtest') {
    flushPendingResult();
    currentSubtest = event.name;
    currentDurationMs = 0;
    return;
  }

  if (event.type === 'duration') {
    currentDurationMs = event.durationMs;
    if (pendingResult) pendingResult.durationMs = event.durationMs;
    return;
  }

  if (event.type === 'result') {
    const result = {
      name: event.name || currentSubtest || 'teste sem nome',
      status: event.status,
      durationMs: currentDurationMs
    };
    pendingResult = result;
    currentSubtest = null;
    currentDurationMs = 0;
    return;
  }

  if (line.includes('[WARNING]') || line.includes('warning')) warnings.push(line.replace(/^#\s*/, ''));
}

function flushPendingResult() {
  if (!pendingResult) return;
  results.push(pendingResult);
  printResult(pendingResult, results.length, plannedTotal);
  pendingResult = null;
}

function estimateTotalTests() {
  try {
    return readdirSync('test')
      .filter((file) => file.endsWith('.test.mjs'))
      .map((file) => readFileSync(`test/${file}`, 'utf8'))
      .reduce((total, content) => total + (content.match(/\btest\s*\(/g) ?? []).length, 0);
  } catch {
    return 0;
  }
}

function printHeader() {
  console.log(bold('Code Review Extension - Test TUI'));
  console.log(cyan('Executando testes em modo legivel para desenvolvimento e CI local.'));
  console.log('');
}

function printResult(result, completed, total) {
  const fallbackTotal = Math.max(total, completed);
  const progress = createProgressBar(completed, fallbackTotal);
  const label = result.status === 'passed'
    ? green('PASS')
    : result.status === 'failed'
      ? red('FAIL')
      : yellow(result.status.toUpperCase());
  console.log(`${progress} ${String(completed).padStart(2, '0')}/${String(fallbackTotal).padStart(2, '0')} ${label} ${result.name} ${cyan(formatDuration(result.durationMs))}`);
}

function printSummary(summary, duration, code) {
  console.log('');
  console.log(bold('Resumo'));
  console.log(`Total: ${summary.total} | Aprovados: ${green(String(summary.passed))} | Falhas: ${summary.failed ? red(String(summary.failed)) : '0'} | Ignorados: ${summary.skipped} | TODO: ${summary.todo}`);
  console.log(`Tempo: ${formatDuration(duration)}`);

  if (warnings.length > 0) {
    console.log('');
    console.log(yellow('Avisos capturados:'));
    warnings.slice(0, 8).forEach((warning) => console.log(`- ${warning}`));
    if (warnings.length > 8) console.log(`- ... mais ${warnings.length - 8} aviso(s)`);
  }

  if (code === 0 && !hasFailures(summary)) {
    console.log('');
    console.log(green('Resultado final: suite aprovada.'));
    return;
  }

  console.log('');
  console.log(red('Resultado final: suite com falhas.'));
  console.log('Acoes sugeridas: rode npm run test:plain para TAP completo ou filtre um arquivo, por exemplo npm run test:tui -- test/astBuilder.test.mjs');
}
