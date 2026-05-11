import React from 'react';
import { Cloud, GitPullRequest, Network, ShieldCheck, Users, BrainCircuit, Workflow, Blocks } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';

export function EnterpriseCenter({ state }) {
  const enterprise = state?.enterprise ?? {};
  const workflow = enterprise.workflow ?? {};
  const analytics = enterprise.analytics ?? {};
  const ast = enterprise.astAnalyzer ?? {};
  const cloud = enterprise.cloudSync ?? {};
  const prs = enterprise.pullRequests?.pullRequests ?? [];
  const hotspots = analytics.hotspots ?? [];
  const recommendations = enterprise.organizationalIntelligence?.recommendations ?? [];

  return (
    <main className="center-panel simple">
      <header className="center-header">
        <div>
          <span className="eyebrow">Enterprise Implementation</span>
          <h1>Funcionalidades avançadas implementadas</h1>
          <p>Centraliza PRs, workflow gates, threads, colaboração, AST, cloud sync, analytics e inteligência organizacional em modo local/offline-first.</p>
        </div>
      </header>

      <section className="summary-grid">
        <SummaryCard title="Gate de review" value={workflow.activeGate ?? 'warning'} label={(workflow.blockers ?? []).length ? `${workflow.blockers.length} bloqueio(s)` : 'sem blockers'} color={(workflow.blockers ?? []).length ? 'red' : 'green'} />
        <SummaryCard title="Risco previsto" value={analytics.predictedRisk ?? 'medium'} label={`dívida ${analytics.architecturalDebtScore ?? 0}%`} color={analytics.predictedRisk === 'critical' ? 'red' : 'yellow'} />
        <SummaryCard title="AST Engine" value={`${ast.rules?.length ?? 0}`} label="regras ativas" color="blue" />
        <SummaryCard title="Cloud Sync" value={cloud.offlineFirst ? 'offline-first' : 'cloud'} label={cloud.conflictPolicy ?? 'manual-merge'} color="green" />
      </section>

      <section className="dashboard-grid">
        <EnterprisePanel icon={GitPullRequest} title="Pull Requests / Branches">
          <div className="table-like">
            {prs.map((pr) => (
              <div className="table-row" key={pr.id}>
                <b>{pr.title}</b>
                <span>{pr.sourceBranch} → {pr.targetBranch}</span>
                <em>{pr.status} · {pr.changedFiles} arquivos · risco {pr.risk}</em>
              </div>
            ))}
          </div>
        </EnterprisePanel>

        <EnterprisePanel icon={Workflow} title="Workflow de aprovação">
          <div className="pill-row">{(workflow.statusFlow ?? []).map((item) => <span className="status-pill" key={item}>{item}</span>)}</div>
          {(workflow.blockers ?? []).length ? <ul>{workflow.blockers.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">Gate liberado para aprovação/merge.</p>}
          <h4>Próximas ações</h4>
          <ul>{(workflow.nextActions ?? []).map((item) => <li key={item}>{item}</li>)}</ul>
        </EnterprisePanel>

        <EnterprisePanel icon={Users} title="Colaboração enterprise">
          {(enterprise.collaboration?.presence ?? []).length ? enterprise.collaboration.presence.map((user) => (
            <div className="table-row" key={user.user}><b>{user.user}</b><span>{user.role} · {user.status}</span><em>{user.file ?? 'workspace'}</em></div>
          )) : <p className="empty-state">Nenhum participante ativo.</p>}
          <div className="pill-row">{(enterprise.collaboration?.permissions ?? []).map((role) => <span className="status-pill" key={role.role}>{role.role}</span>)}</div>
        </EnterprisePanel>

        <EnterprisePanel icon={Network} title="AST Analyzer + Graph Engine">
          <p className="muted">Linguagens: {(ast.supportedLanguages ?? []).join(', ')}</p>
          <p><b>{ast.graph?.nodes ?? 0}</b> nós · <b>{ast.graph?.edges ?? 0}</b> arestas · módulos: {(ast.graph?.modules ?? []).join(', ') || 'workspace'}</p>
          <div className="table-like">{(ast.rules ?? []).map((rule) => <div className="table-row" key={rule.id}><b>{rule.title}</b><span>{rule.id}</span><em>{rule.severity}</em></div>)}</div>
        </EnterprisePanel>

        <EnterprisePanel icon={ShieldCheck} title="Hotspots e predição">
          {hotspots.length ? hotspots.map((item) => <div className="table-row" key={item.file}><b>{item.file}</b><span>risco {item.risk}%</span><em>{item.reasons.join(', ')}</em></div>) : <p className="empty-state">Sem hotspots identificados.</p>}
        </EnterprisePanel>

        <EnterprisePanel icon={Cloud} title="Cloud / Sync / Organização">
          <p><b>Modo:</b> {cloud.offlineFirst ? 'offline-first com merge manual' : 'remoto'}</p>
          <p><b>Último sync:</b> {cloud.lastSyncAt ?? 'não sincronizado'}</p>
          <p><b>Workspaces:</b> {(cloud.workspaces ?? []).join(', ') || 'local'}</p>
        </EnterprisePanel>

        <EnterprisePanel icon={BrainCircuit} title="Inteligência organizacional">
          <p><b>{enterprise.organizationalIntelligence?.knowledgeItems ?? 0}</b> itens indexados.</p>
          <p className="muted">Fontes: {(enterprise.organizationalIntelligence?.indexedSources ?? []).join(', ')}</p>
          {recommendations.map((item) => <div className="table-row" key={item.title}><b>{item.title}</b><span>{item.description}</span><em>{item.priority}</em></div>)}
        </EnterprisePanel>

        <EnterprisePanel icon={Blocks} title="Marketplace / Plugin SDK / CI gates">
          <p className="muted">Camada preparada para regras customizadas, plugin SDK, GitHub Actions, Jenkins, Azure Pipelines e review gates por score.</p>
          <div className="pill-row"><span className="status-pill">rules</span><span className="status-pill">plugins</span><span className="status-pill">ci-gates</span><span className="status-pill">multi-tenant-ready</span></div>
        </EnterprisePanel>
      </section>
    </main>
  );
}

function EnterprisePanel({ icon: Icon, title, children }) {
  return <section className="sessions-panel"><div className="section-title"><div><h2><Icon size={18} /> {title}</h2></div></div>{children}</section>;
}
