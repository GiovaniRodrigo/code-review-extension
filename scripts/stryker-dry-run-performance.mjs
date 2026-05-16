#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const configFile = process.argv[2] ?? 'config/stryker/core-use-cases-review-pr.json';
const sampleIntervalMs = Number(process.env.STRYKER_PERF_SAMPLE_INTERVAL_MS ?? 1000);
const timeoutMs = Number(process.env.STRYKER_PERF_TIMEOUT_MS ?? 120000);
const maxRssMb = Number(process.env.STRYKER_PERF_MAX_RSS_MB ?? 1400);
const maxCpuPercent = Number(process.env.STRYKER_PERF_MAX_CPU_PERCENT ?? 500);
const budgetConsecutiveSamples = Number(process.env.STRYKER_PERF_BUDGET_CONSECUTIVE_SAMPLES ?? 3);
const reportDir = resolve(rootDir, 'reports/stryker-performance');
const startedAt = new Date();
const reportFile = resolve(
  reportDir,
  `${basename(configFile, '.json')}-${startedAt.toISOString().replace(/[:.]/g, '-')}.json`
);

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = [
  'stryker',
  'run',
  configFile,
  '--dryRunOnly',
  '--concurrency',
  '1',
  '--testRunnerNodeArgs',
  '--max-old-space-size=1024',
  '--dryRunTimeoutMinutes',
  String(Math.max(1, Math.ceil(timeoutMs / 60000))),
  '--reporters',
  'clear-text',
  '--logLevel',
  'info',
  '--cleanTempDir',
  'always'
];

const samples = [];
let timedOut = false;
let stoppedForBudget = false;
let consecutiveCpuBudgetHits = 0;

const child = spawn(command, args, {
  cwd: rootDir,
  detached: process.platform !== 'win32',
  env: {
    ...process.env,
    CI: 'true',
    VITEST_POOL_ID: 'stryker-dry-run-performance'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

child.stdout.on('data', data => {
  stdout += data.toString();
  process.stdout.write(data);
});

child.stderr.on('data', data => {
  stderr += data.toString();
  process.stderr.write(data);
});

const collectProcessTree = pid => {
  if (process.platform === 'win32') {
    return [];
  }

  const ps = spawnSync('ps', ['-eo', 'pid=,ppid=,pcpu=,rss=,comm='], {
    encoding: 'utf8'
  });

  if (ps.status !== 0 || !ps.stdout) {
    return [];
  }

  const rows = ps.stdout
    .trim()
    .split('\n')
    .map(line => {
      const [pidValue, ppidValue, cpuValue, rssValue, ...commandParts] = line.trim().split(/\s+/);

      return {
        pid: Number(pidValue),
        ppid: Number(ppidValue),
        cpuPercent: Number(cpuValue),
        rssKb: Number(rssValue),
        command: commandParts.join(' ')
      };
    })
    .filter(row => Number.isFinite(row.pid) && Number.isFinite(row.ppid));

  const childrenByParent = new Map();

  for (const row of rows) {
    const children = childrenByParent.get(row.ppid) ?? [];
    children.push(row);
    childrenByParent.set(row.ppid, children);
  }

  const processTree = [];
  const pending = [pid];
  const seen = new Set();

  while (pending.length > 0) {
    const currentPid = pending.pop();

    if (!currentPid || seen.has(currentPid)) {
      continue;
    }

    seen.add(currentPid);

    const row = rows.find(item => item.pid === currentPid);
    if (row) {
      processTree.push(row);
    }

    for (const childProcess of childrenByParent.get(currentPid) ?? []) {
      pending.push(childProcess.pid);
    }
  }

  return processTree;
};

const sample = () => {
  const processes = collectProcessTree(child.pid);
  const totalRssKb = processes.reduce((sum, item) => sum + item.rssKb, 0);
  const totalCpuPercent = processes.reduce((sum, item) => sum + item.cpuPercent, 0);
  const totalRssMb = Number((totalRssKb / 1024).toFixed(2));

  samples.push({
    atMs: Date.now() - startedAt.getTime(),
    totalCpuPercent,
    totalRssMb,
    processes: processes.map(item => ({
      ...item,
      rssMb: Number((item.rssKb / 1024).toFixed(2))
    }))
  });

  if (Number.isFinite(maxCpuPercent) && totalCpuPercent > maxCpuPercent) {
    consecutiveCpuBudgetHits += 1;
  } else {
    consecutiveCpuBudgetHits = 0;
  }

  const exceededMemoryBudget = Number.isFinite(maxRssMb) && totalRssMb > maxRssMb;
  const exceededSustainedCpuBudget =
    Number.isFinite(maxCpuPercent) &&
    consecutiveCpuBudgetHits >= budgetConsecutiveSamples;

  if (!stoppedForBudget && (exceededMemoryBudget || exceededSustainedCpuBudget)) {
    stoppedForBudget = true;
    stop('SIGTERM');

    setTimeout(() => stop('SIGKILL'), 5000).unref();
  }
};

const stop = (signal = 'SIGTERM') => {
  if (child.killed) {
    return;
  }

  if (process.platform === 'win32') {
    child.kill(signal);
    return;
  }

  try {
    process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
};

const interval = setInterval(sample, sampleIntervalMs);
const timeout = setTimeout(() => {
  timedOut = true;
  stop('SIGTERM');

  setTimeout(() => stop('SIGKILL'), 5000).unref();
}, timeoutMs);

child.on('exit', (code, signal) => {
  clearInterval(interval);
  clearTimeout(timeout);
  sample();

  const peakTotalRssMb = samples.reduce((peak, item) => Math.max(peak, item.totalRssMb), 0);
  const peakTotalCpuPercent = samples.reduce((peak, item) => Math.max(peak, item.totalCpuPercent), 0);
  const budgetViolations = [];
  const peakProcesses = new Map();

  for (const sampleItem of samples) {
    for (const processItem of sampleItem.processes) {
      const previous = peakProcesses.get(processItem.pid) ?? {
        pid: processItem.pid,
        command: processItem.command,
        peakCpuPercent: 0,
        peakRssMb: 0
      };

      previous.peakCpuPercent = Math.max(previous.peakCpuPercent, processItem.cpuPercent);
      previous.peakRssMb = Math.max(previous.peakRssMb, processItem.rssMb);
      peakProcesses.set(processItem.pid, previous);
    }
  }

  const report = {
    command,
    args,
    configFile,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    timedOut,
    stoppedForBudget,
    exitCode: code,
    signal,
    sampleIntervalMs,
    timeoutMs,
    summary: {
      peakTotalCpuPercent: Number(peakTotalCpuPercent.toFixed(2)),
      peakTotalRssMb,
      sampleCount: samples.length,
      processCount: peakProcesses.size,
      peakProcesses: [...peakProcesses.values()].sort((a, b) => b.peakRssMb - a.peakRssMb)
    },
    budget: {
      maxRssMb,
      maxCpuPercent,
      consecutiveSamples: budgetConsecutiveSamples,
      violations: budgetViolations
    },
    samples,
    output: {
      stdoutTail: stdout.slice(-12000),
      stderrTail: stderr.slice(-12000)
    }
  };

  if (Number.isFinite(maxRssMb) && peakTotalRssMb > maxRssMb) {
    budgetViolations.push({
      metric: 'peakTotalRssMb',
      actual: peakTotalRssMb,
      limit: maxRssMb
    });
  }

  if (Number.isFinite(maxCpuPercent) && peakTotalCpuPercent > maxCpuPercent) {
    budgetViolations.push({
      metric: 'peakTotalCpuPercent',
      actual: Number(peakTotalCpuPercent.toFixed(2)),
      limit: maxCpuPercent
    });
  }

  mkdirSync(reportDir, { recursive: true });
  writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`\n[stryker-performance] report: ${reportFile}`);
  console.log(`[stryker-performance] peak RSS: ${peakTotalRssMb} MB`);
  console.log(`[stryker-performance] peak CPU: ${report.summary.peakTotalCpuPercent}%`);
  console.log(`[stryker-performance] budget RSS: ${maxRssMb} MB`);
  console.log(`[stryker-performance] budget CPU: ${maxCpuPercent}%`);

  if (budgetViolations.length > 0) {
    console.error('[stryker-performance] budget exceeded:');

    for (const violation of budgetViolations) {
      console.error(
        `[stryker-performance] ${violation.metric}: ${violation.actual} > ${violation.limit}`
      );
    }
  }

  process.exit(timedOut ? 124 : budgetViolations.length > 0 ? 2 : code ?? 1);
});
