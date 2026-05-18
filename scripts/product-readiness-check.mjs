import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
};
const ok = (message) => console.log(`✅ ${message}`);

const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const vscodePkg = JSON.parse(readFileSync(join(root, 'apps/vscode/package.json'), 'utf8'));

const requiredDocs = [
  'docs/PRICING_AND_PACKAGING.md',
  'docs/product/PRODUCT_POSITIONING.md',
  'docs/product/PRODUCT_REQUIREMENTS.md',
  'docs/product/MARKETPLACE_LISTING.md',
  'docs/product/ONBOARDING_FLOW.md',
  'PRODUCT_READY_REPORT_2_3_0.md',
  'MARKETPLACE_RELEASE_REPORT_2_3_1.md',
  'docs/product/PRO_FOUNDATION.md',
  'PRODUCT_READY_REPORT_2_5_0.md',
  'docs/product/PRO_UX_POLISH.md',
  'docs/product/RAG_PROJECT_CHAT.md',
  'docs/product/DEPENDENCY_GRAPH.md',
  'docs/product/REPORTS_AND_INTELLIGENCE.md',
  'docs/product/PRO_COMMERCIAL.md',
  'docs/team/TEAM_FOUNDATION.md',
  'docs/enterprise/ENTERPRISE_FOUNDATION.md',
  'PRODUCT_READY_REPORT_4_0_0.md',
  'PRODUCT_READY_REPORT_4_0_4.md'
];

for (const doc of requiredDocs) {
  existsSync(join(root, doc)) ? ok(`${doc} exists`) : fail(`${doc} is missing`);
}

if (rootPkg.version !== vscodePkg.version) fail(`root and VS Code package versions must match. root=${rootPkg.version}, vscode=${vscodePkg.version}`); else ok(`package versions aligned at ${vscodePkg.version}`);
if (!/^\d+\.\d+\.\d+$/.test(vscodePkg.version)) fail(`VS Code version must use semver, found ${vscodePkg.version}`); else ok('VS Code version uses semver');
if (vscodePkg.displayName !== 'Git Code Review') fail('displayName must be Git Code Review'); else ok('displayName is product-ready');
if (!vscodePkg.description?.toLowerCase().includes('code review governance workspace')) fail('description must communicate product category'); else ok('description communicates category');
if (!vscodePkg.icon || !existsSync(join(root, 'apps/vscode', vscodePkg.icon))) fail('marketplace icon is missing'); else ok('marketplace icon exists');
if (!Array.isArray(vscodePkg.keywords) || !vscodePkg.keywords.includes('code review') || !vscodePkg.keywords.includes('reviewer')) fail('keywords must include code review and reviewer'); else ok('keywords aligned');

const commands = new Set(vscodePkg.contributes?.commands?.map((command) => command.command));
for (const command of ['code-review.startReview', 'code-review.runDiagnostics', 'code-review.analyzeWorkspace', 'code-review.indexRepositoryRag', 'code-review.configureCloudProvider', 'code-review.exportPdf', 'code-review.selectReviewTemplate', 'code-review.openRagManager', 'code-review.openDependencyGraph', 'code-review.viewPlans', 'code-review.openTeamDashboard', 'code-review.openEnterpriseGovernance']) {
  commands.has(command) ? ok(`${command} contributed`) : fail(`${command} not contributed`);
}

const activationEvents = new Set(vscodePkg.activationEvents || []);
for (const event of ['onCommand:code-review.startReview', 'onView:code-review.dashboard']) {
  activationEvents.has(event) ? ok(`${event} activation configured`) : fail(`${event} activation missing`);
}

const readme = readFileSync(join(root, 'apps/vscode/README.md'), 'utf8');
for (const text of ['code reviewers', 'Community', 'Pro', 'Team', 'Enterprise', 'Start Review', 'Human-in-the-Loop', 'Pro Foundation', 'Export Review as PDF', 'Enterprise Ready 4.0', 'Team Dashboard', 'Audit Logs']) {
  readme.includes(text) ? ok(`README includes ${text}`) : fail(`README missing ${text}`);
}

const packageJsonRaw = readFileSync(join(root, 'apps/vscode/package.json'), 'utf8');
for (const text of ['codeReview.product.plan', 'codeReview.product.targetAudience', 'codeReview.review.template', 'codeReview.export.pdf.enabled', 'codeReview.enterprise.sso.provider', 'codeReview.enterprise.rbac.role']) {
  packageJsonRaw.includes(text) ? ok(`configuration includes ${text}`) : fail(`configuration missing ${text}`);
}

if (process.exitCode) {
  console.error('\nProduct readiness check failed.');
  process.exit(process.exitCode);
}
console.log('\nProduct readiness check passed.');
