import { useState, Fragment } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ─────────────────────────────────────────────────────────── */
interface Setor {
  id: string; sigla: string; nome: string; tipo: string;
  usuarios: number; parentId: string | null;
}

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK: Setor[] = [
  { id: 'copirn', sigla: 'COPIRN', nome: 'COPIRN',                             tipo: 'Setor', usuarios: 8,  parentId: null     },
  { id: 'aj',     sigla: 'AJ',     nome: 'ASSESSORIA JURIDICA',                tipo: 'Setor', usuarios: 8,  parentId: 'copirn' },
  { id: 'cof',    sigla: 'COF',    nome: 'COORD. DE ORÇAMENTO E FINANÇAS',     tipo: 'Setor', usuarios: 88, parentId: 'copirn' },
  { id: 'cpgi',   sigla: 'CPGI',   nome: 'COORD. PLANEJ. GESTÃO E INOVAÇÃO',  tipo: 'Setor', usuarios: 25, parentId: 'copirn' },
  { id: 'cpl',    sigla: 'CPL',    nome: 'CPL',                                tipo: 'Setor', usuarios: 39, parentId: 'copirn' },
  { id: 'de',     sigla: 'DE',     nome: 'DIRETORIA EXECUTIVA',                tipo: 'Setor', usuarios: 42, parentId: 'copirn' },
  { id: 'p',      sigla: 'P',      nome: 'PRESIDENTE',                         tipo: 'Setor', usuarios: 26, parentId: 'copirn' },
  { id: 'sadm',   sigla: 'SADM',   nome: 'SECRETARIA DE ADMINISTRAÇÃO',        tipo: 'Setor', usuarios: 31, parentId: null     },
  { id: 'al',     sigla: 'AL',     nome: 'ALMOXARIFADO',                       tipo: 'Setor', usuarios: 9,  parentId: 'sadm'   },
  { id: 'ssa',    sigla: 'SSA',    nome: 'SUBSETOR DO ALMOXARIFADO',           tipo: 'Setor', usuarios: 54, parentId: 'al'     },
  { id: 'sfin',   sigla: 'SFIN',   nome: 'SECRETARIA DE FINANÇAS',            tipo: 'Setor', usuarios: 31, parentId: null     },
  { id: 'pad',    sigla: 'PAD',    nome: 'PROCESSO ADMINISTRATIVO DISCIPLINAR',tipo: 'Setor', usuarios: 31, parentId: null     },
];

/* ── estilos compartilhados dos modais ──────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 780,
  maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden', zIndex: 901,
};
const MODAL_HEADER: React.CSSProperties = {
  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  padding: '18px 22px 14px', borderBottom: '1px solid #ebebeb', flexShrink: 0, gap: 12,
};
const MODAL_TITLE: React.CSSProperties = {
  margin: '0 0 3px', fontSize: 16, fontWeight: 700,
  color: '#222', fontFamily: 'Open Sans, sans-serif',
};
const MODAL_FOOTER: React.CSSProperties = {
  flexShrink: 0, borderTop: '1px solid #ebebeb',
  padding: '16px 22px', display: 'flex', justifyContent: 'flex-end', gap: 12,
};
const BTN_CANCEL: React.CSSProperties = {
  height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6,
  background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', minWidth: 120,
};
const BTN_SAVE = (enabled: boolean): React.CSSProperties => ({
  height: 38, padding: '0 24px', border: 'none', borderRadius: 6,
  background: enabled ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14,
  fontWeight: 600, cursor: enabled ? 'pointer' : 'not-allowed',
  fontFamily: 'Open Sans, sans-serif', minWidth: 120,
});
const INP: React.CSSProperties = {
  width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6,
  padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
  color: '#333', outline: 'none', boxSizing: 'border-box', background: 'white',
};
const LBL: React.CSSProperties = {
  display: 'block', fontSize: 13, color: '#333', marginBottom: 5,
  fontFamily: 'Open Sans, sans-serif', fontWeight: 600,
};

/* ── SetorModal ─────────────────────────────────────────────────────── */
const TIPOS = ['Setor', 'Grupo', 'Comissão', 'Departamento', 'Divisão', 'Coordenadoria', 'Diretoria'];
interface FormData { nome: string; sigla: string; tipo: string; parentId: string; descricao: string; contatos: boolean; docs: boolean }

function SetorModal({ mode, initial, setores, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: Setor; setores: Setor[];
  onSave: (d: FormData) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    nome: initial?.nome ?? '', sigla: initial?.sigla ?? '',
    tipo: initial?.tipo ?? 'Setor', parentId: initial?.parentId ?? '',
    descricao: '', contatos: false, docs: false,
  });
  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const setorOptions = ['— raiz —', ...setores.map(s => `${s.sigla} - ${s.nome}`)];
  const setorValue = form.parentId
    ? (setores.find(s => s.id === form.parentId)
        ? `${setores.find(s => s.id === form.parentId)!.sigla} - ${setores.find(s => s.id === form.parentId)!.nome}`
        : '— raiz —')
    : '— raiz —';

  const canSave = !!form.nome.trim() && !!form.sigla.trim();

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        {/* Header */}
        <div style={MODAL_HEADER}>
          <div>
            <p style={MODAL_TITLE}>{mode === 'novo' ? 'Novo Setor' : 'Editar Setor'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', padding: 4, lineHeight: 1 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: '1 1 340px' }}>
              <label style={LBL}>Nome do setor<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={set('nome')} />
            </div>
            <div style={{ flex: '0 0 160px' }}>
              <label style={LBL}>Sigla do setor<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.sigla} onChange={set('sigla')} />
            </div>
            <div style={{ flex: '0 0 240px' }}>
              <label style={LBL}>Tipo de setor<span style={{ color: '#b2132e' }}>*</span></label>
              <SimpleSelect value={form.tipo} onChange={v => setForm(p => ({ ...p, tipo: v }))} options={TIPOS} />
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <label style={LBL}>Setor Pai{mode === 'edit' && <span style={{ color: '#b2132e' }}>*</span>}</label>
              <SimpleSelect
                value={setorValue}
                onChange={v => {
                  if (v === '— raiz —') { setForm(p => ({ ...p, parentId: '' })); return; }
                  const found = setores.find(s => `${s.sigla} - ${s.nome}` === v);
                  setForm(p => ({ ...p, parentId: found?.id ?? '' }));
                }}
                options={setorOptions}
              />
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ ...LBL, fontWeight: 400, color: '#565656' }}>Descrição</label>
              <textarea
                style={{ ...INP, height: 80, padding: 10, resize: 'vertical' }}
                value={form.descricao}
                onChange={set('descricao')}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.contatos} onChange={e => setForm(p => ({ ...p, contatos: e.target.checked }))} />
              Pode listar e editar contatos
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.docs} onChange={e => setForm(p => ({ ...p, docs: e.target.checked }))} />
              Pode listar todos os documentos no perfil dos contatos
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={MODAL_FOOTER}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => onSave(form)} disabled={!canSave} style={BTN_SAVE(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── PessoasModal ───────────────────────────────────────────────────── */
const MOCK_USUARIOS = ['Cris Lima', 'Moacir Silva', 'Marcele Licht', 'Inácio Steffon', 'Carlos Augusto', 'Samuel Rosa', 'Marcos Almeida', 'Roberval Amarantes', 'Cleiton da Silva', 'Márcio Vitor', 'Ana Beatriz', 'Paulo Sergio', 'Fernanda Lima'];
const TIPO_OPCOES = ['Setor', 'Grupo', 'Comissão'];

function PessoasModal({ setor, onClose }: { setor: Setor; onClose: () => void }) {
  const [tipo, setTipo] = useState('Setor');
  const [chips, setChips] = useState<string[]>(['Cris Lima', 'Moacir Silva', 'Marcele Licht', 'Inácio Steffon', 'Carlos Augusto', 'Samuel Rosa', 'Marcos Almeida', 'Roberval Amarantes', 'Cleiton da Silva', 'Márcio Vitor']);

  const disponiveis = MOCK_USUARIOS.filter(u => !chips.includes(u));

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...MODAL_BOX, maxWidth: 540 }}>
        {/* Header */}
        <div style={MODAL_HEADER}>
          <div>
            <p style={MODAL_TITLE}>Adicionar pessoas ao setor</p>
            <p style={{ margin: 0, fontSize: 12, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif' }}>
              {setor.sigla} — {setor.nome}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', padding: 4, lineHeight: 1 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px' }}>
          <label style={LBL}>Selecione os usuários<span style={{ color: '#b2132e' }}>*</span></label>
          <SimpleSelect
            value={tipo}
            onChange={v => { setTipo(v); if (disponiveis.length > 0) setChips(p => [...p, disponiveis[0]]); }}
            options={TIPO_OPCOES}
            placeholder="Selecione o perfil..."
          />

          {/* chips */}
          <div style={{ marginTop: 12, border: '1px solid #c5c5c5', borderRadius: 6, padding: '8px 10px', minHeight: 80, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {chips.map(u => (
              <span key={u} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 20, padding: '3px 10px', fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
                {u}
                <button onClick={() => setChips(p => p.filter(x => x !== u))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                  <i className="fa-regular fa-xmark" />
                </button>
              </span>
            ))}
            {chips.length === 0 && (
              <span style={{ fontSize: 13, color: '#a3a3a3', fontFamily: 'Open Sans, sans-serif' }}>Nenhum usuário selecionado</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={MODAL_FOOTER}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onClose} style={BTN_SAVE(true)}>Salvar edição</button>
        </div>
      </div>
    </div>
  );
}

/* ── OrgBox ─────────────────────────────────────────────────────────── */
function OrgBox({ setor, setores, depth = 0 }: { setor: Setor; setores: Setor[]; depth?: number }) {
  const children = setores.filter(s => s.parentId === setor.id);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        background: depth === 0 ? '#0058db' : '#f0f5ff',
        color: depth === 0 ? 'white' : '#0058db',
        border: depth === 0 ? 'none' : '1.5px solid #dce6f5',
        borderRadius: 6, padding: '10px 16px', minWidth: 140, textAlign: 'center',
        fontFamily: 'Open Sans, sans-serif',
        boxShadow: depth === 0 ? '0 2px 8px rgba(0,88,219,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{setor.sigla}</div>
        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
          {setor.nome.length > 22 ? setor.nome.slice(0, 22) + '…' : setor.nome}
        </div>
      </div>
      {children.length > 0 && (
        <>
          <div style={{ width: 1, height: 16, background: '#c8d8f0' }} />
          <div style={{ position: 'relative', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            {children.length > 1 && (
              <div style={{
                position: 'absolute', top: 0,
                left: `calc(50% - ${(children.length - 1) * 76}px)`,
                width: `${(children.length - 1) * 152}px`,
                height: 1, background: '#c8d8f0',
              }} />
            )}
            {children.map(ch => (
              <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 1, height: 16, background: '#c8d8f0' }} />
                <OrgBox setor={ch} setores={setores} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── SetoresTab ─────────────────────────────────────────────────────── */
export default function SetoresTab() {
  const [setores, setSetores] = useState<Setor[]>(MOCK);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['copirn', 'sadm', 'al']));
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; setor?: Setor }>(null);
  const [pessoasSetor, setPessoasSetor] = useState<Setor | null>(null);
  const [view, setView] = useState<'lista' | 'organograma'>('lista');

  const hasChildren = (id: string) => setores.some(s => s.parentId === id);
  const toggleExpand = (id: string) => setExpanded(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const isVisible = (s: Setor): boolean => {
    if (!s.parentId) return true;
    const parent = setores.find(p => p.id === s.parentId);
    if (!parent) return true;
    return expanded.has(s.parentId) && isVisible(parent);
  };

  const getDepth = (s: Setor): number => {
    if (!s.parentId) return 0;
    const parent = setores.find(p => p.id === s.parentId);
    return parent ? 1 + getDepth(parent) : 0;
  };

  const getAncestors = (s: Setor): Setor[] => {
    const result: Setor[] = [];
    let cur = s;
    while (cur.parentId) {
      const p = setores.find(x => x.id === cur.parentId);
      if (!p) break;
      result.unshift(p);
      cur = p;
    }
    return result;
  };

  const visibleList = setores.filter(isVisible);

  const isLastVisibleChild = (s: Setor): boolean => {
    if (!s.parentId) return false;
    const siblings = visibleList.filter(v => v.parentId === s.parentId);
    return siblings[siblings.length - 1]?.id === s.id;
  };

  const roots = setores.filter(s => !s.parentId);

  /* botão de ação — retangular pequeno */
  const actionBtn: React.CSSProperties = {
    height: 28, padding: '0 8px', border: '1px solid #dce6f5', borderRadius: 4,
    background: 'white', cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#0058db', gap: 4,
  };

  const viewBtn = (active: boolean): React.CSSProperties => ({
    height: 32, padding: '0 12px', border: `1px solid ${active ? '#0058db' : '#d5d5d5'}`,
    borderRadius: 6, background: active ? '#0058db' : 'white',
    color: active ? 'white' : '#555', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
    display: 'flex', alignItems: 'center', gap: 6,
  });

  /* tamanho de cada nível de indentação */
  const STEP = 24;

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#353535', fontFamily: 'Open Sans, sans-serif' }}>
          Setores
        </p>
        <button
          onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Novo Setor
        </button>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
        Organize e mantenha atualizada a estrutura interna da sua instituição.
      </p>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={viewBtn(view === 'lista')} onClick={() => setView('lista')}>
          <i className="fa-regular fa-list" /> Lista
        </button>
        <button style={viewBtn(view === 'organograma')} onClick={() => setView('organograma')}>
          <i className="fa-regular fa-sitemap" /> Organograma
        </button>
      </div>

      {/* ── Lista ── */}
      {view === 'lista' && (
        <div>
          {/* Cabeçalho escuro */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 90px 120px',
            background: '#1e2a3b', padding: '0 16px', height: 44,
            alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0',
          }}>
            {['Nome', 'Tipo', 'Usuários', 'Ações'].map(h => (
              <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
            ))}
          </div>

          {/* Linhas */}
          {visibleList.map((s, i) => {
            const depth    = getDepth(s);
            const hasCh    = hasChildren(s.id);
            const isExp    = expanded.has(s.id);
            const ancestors = getAncestors(s);

            return (
              <div
                key={s.id}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 90px 120px',
                  padding: '0 16px', height: 44, alignItems: 'center', gap: 8,
                  borderBottom: '1px solid #f0f0f0',
                  background: i % 2 === 0 ? 'white' : '#fafafa',
                  position: 'relative',
                }}
              >
                {/* Linhas de árvore (absolutas, atrás do conteúdo) */}
                {depth > 0 && ancestors.map((ancestor, lvl) => {
                  /* qual nó "desce" a partir deste nível */
                  const child = lvl < depth - 1 ? ancestors[lvl + 1] : s;
                  const isLast = isLastVisibleChild(child);
                  const isConnector = lvl === depth - 1;
                  /* centro x do fio neste nível (relativo ao padding-left=16) */
                  const cx = 16 + lvl * STEP + STEP / 2;

                  return (
                    <Fragment key={lvl}>
                      {/* fio vertical */}
                      <div style={{
                        position: 'absolute',
                        left: cx,
                        top: 0,
                        /* desce até o meio se é L, desce até o fundo se é | ou T */
                        bottom: isConnector && isLast ? '50%' : 0,
                        width: 1,
                        background: '#c0c8d8',
                        pointerEvents: 'none',
                      }} />
                      {/* fio horizontal só no nível conector */}
                      {isConnector && (
                        <div style={{
                          position: 'absolute',
                          left: cx,
                          top: '50%',
                          width: STEP / 2,
                          height: 1,
                          background: '#c0c8d8',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }} />
                      )}
                    </Fragment>
                  );
                })}

                {/* Nome */}
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: depth * STEP + (depth > 0 ? STEP / 2 : 0) }}>
                  {hasCh ? (
                    <button
                      onClick={() => toggleExpand(s.id)}
                      style={{
                        width: 18, height: 18, border: 'none', background: 'none',
                        cursor: 'pointer', color: '#333', fontSize: 13, fontWeight: 700,
                        marginRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontFamily: 'monospace', padding: 0,
                      }}
                    >
                      {isExp ? '—' : '+'}
                    </button>
                  ) : (
                    <span style={{ width: 18, marginRight: 8, flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 13, fontFamily: 'Open Sans, sans-serif', color: '#222', fontWeight: depth === 0 ? 600 : 400 }}>
                    {s.sigla} - {s.nome}
                  </span>
                </div>

                {/* Tipo */}
                <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{s.tipo}</span>

                {/* Usuários */}
                <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>
                  {String(s.usuarios).padStart(2, '0')}
                </span>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={actionBtn} title="Editar" onClick={() => setModal({ mode: 'edit', setor: s })}>
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                  <button style={actionBtn} title="Adicionar pessoas" onClick={() => setPessoasSetor(s)}>
                    <i className="fa-regular fa-user-plus" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Organograma ── */}
      {view === 'organograma' && (
        <div style={{ overflowX: 'auto', paddingBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48, alignItems: 'flex-start', minWidth: 'max-content', padding: '8px 16px' }}>
            {roots.map(root => <OrgBox key={root.id} setor={root} setores={setores} />)}
          </div>
        </div>
      )}

      {/* Modal pessoas */}
      {pessoasSetor && <PessoasModal setor={pessoasSetor} onClose={() => setPessoasSetor(null)} />}

      {/* Modal setor */}
      {modal && (
        <SetorModal
          mode={modal.mode}
          initial={modal.setor}
          setores={setores}
          onSave={data => {
            if (modal.mode === 'novo') {
              setSetores(p => [...p, {
                id: Date.now().toString(), sigla: data.sigla.toUpperCase(),
                nome: data.nome.toUpperCase(), tipo: data.tipo,
                usuarios: 0, parentId: data.parentId || null,
              }]);
            } else if (modal.setor) {
              setSetores(p => p.map(s => s.id === modal.setor!.id
                ? { ...s, sigla: data.sigla.toUpperCase(), nome: data.nome.toUpperCase(), tipo: data.tipo, parentId: data.parentId || null }
                : s));
            }
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
