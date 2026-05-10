import React, { useState } from 'react';
import { ListChecks, Info } from 'lucide-react';
import { Tooltip } from '../atoms/Tooltip';
import { FindingItem } from '../molecules/FindingItem';
import { loadCrudList, saveCrudList } from '../../utils/storage';

export function ValidationFindingsPanel({ session, git, currentUser, t, onCreateFinding, onUpdateFindingStatus, onRegisterCorrection, onRevalidate }) {
  const [categories, setCategories] = useState(() => loadCrudList('codeReviewFindingCategories', ['DIP', 'SRP', 'Clean Architecture', 'DDD', 'Performance']));
  const [rule, setRule] = useState(categories[0] ?? 'DIP');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('Dependência concreta detectada na camada de aplicação.');
  const [line, setLine] = useState(1);
  const file = session?.changedFiles?.[0] ?? git?.changedFiles?.[0] ?? 'src/extension.ts';
  const commit = session?.commits?.[0] ?? git?.commits?.[0] ?? 'HEAD';

  const persistCategories = (items) => {
    const normalized = Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
    setCategories(normalized);
    saveCrudList('codeReviewFindingCategories', normalized);
    if (!normalized.includes(rule)) setRule(normalized[0] ?? '');
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    persistCategories([...categories, newCategory]);
    setRule(newCategory.trim());
    setNewCategory('');
  };

  const updateCategory = () => {
    if (!editingCategory.trim() || !rule) return;
    persistCategories(categories.map((item) => item === rule ? editingCategory : item));
    setRule(editingCategory.trim());
    setEditingCategory('');
  };

  const removeCategory = () => {
    if (!rule) return;
    persistCategories(categories.filter((item) => item !== rule));
  };

  return (
    <section className="sessions-panel" data-tour="validation-panel">
      <div className="section-title">
        <div>
          <h2>Validações</h2>
          <p className="muted">Findings com severidade, status, correções e revalidação.</p>
        </div>
      </div>
      <div className="finding-form">
        <select value={rule} onChange={(event) => setRule(event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
          <option>CRITICAL</option>
        </select>
        <input type="number" min="1" value={line} onChange={(event) => setLine(event.target.value)} />
        <input value={description} onChange={(event) => setDescription(event.target.value)} />
        <Tooltip label="Criar finding de validação">
          <button disabled={!session || !description.trim()} onClick={() => onCreateFinding?.({ rule, severity, description, file, line, commit })}><ListChecks size={16} /> {t('common.create')}</button>
        </Tooltip>
      </div>
      <div className="category-crud-panel" data-tour="category-crud">
        <div>
          <strong>Categorias CRUD</strong>
          <p className="muted">Crie, renomeie ou remova categorias usadas nos findings. Elas ficam salvas no navegador da extensão.</p>
        </div>
        <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nova categoria usada pela equipe" />
        <button onClick={addCategory} disabled={!newCategory.trim()}>Criar</button>
        <input value={editingCategory} onChange={(event) => setEditingCategory(event.target.value)} placeholder={`Renomear ${rule || 'categoria'}`} />
        <button onClick={updateCategory} disabled={!editingCategory.trim() || !rule}>Salvar nome</button>
        <button onClick={removeCategory} disabled={!rule}>Remover</button>
      </div>
      <div className="technical-comments-help">
        <Info size={16} />
        <span><strong>Comentários técnicos</strong> servem para discussão livre e pública. <strong>Findings/validações</strong> são itens formais com severidade, responsável, correção do desenvolvedor e revalidação.</span>
      </div>
      <div className="findings-list">
        {session?.findings?.length ? session.findings.map((finding) => (
          <FindingItem
            key={finding.id}
            session={session}
            finding={finding}
            currentUser={currentUser}
            t={t}
            onUpdateStatus={onUpdateFindingStatus}
            onRegisterCorrection={onRegisterCorrection}
            onRevalidate={onRevalidate}
          />
        )) : <p className="empty-state">Nenhuma validação registrada nesta sessão.</p>}
      </div>
    </section>
  );
}
