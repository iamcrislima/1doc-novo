import { useState, Fragment } from 'react';

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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));
  const inp: React.CSSProperties = {
    width: '100%', height: 44, border: '1px solid #a3a3a3', borderRadius: 8,
    padding: '0 8px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333',
    outline: 'none', boxSizing: 'border-box', background: 'white',
  };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 14, color: '#333', marginBottom: 6, fontFamily: 'Open Sans, sans-serif' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 8, width: '100%', maxWidth: 780, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0px 10px 70px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#353535', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo Setor' : 'Editar Setor'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', padding: 4 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: '0 0 430px' }}>
              <label style={lbl}>Nome do setor<span style={{ color: '#b2132e', marginLeft: 1 }}>*</span></label>
              <input style={inp} value={form.nome} onChange={set('nome')} />
            </div>
            <div style={{ flex: '1 0 160px' }}>
              <label style={lbl}>Sigla do setor<span style={{ color: '#b2132e', marginLeft: 1 }}>*</span></label>
              <input style={inp} value={form.sigla} onChange={set('sigla')} />
            </div>
            <div style={{ flex: '0 0 271px' }}>
              <label style={lbl}>Tipo de setor<span style={{ color: '#b2132e', marginLeft: 1 }}>*</span></label>
              <select style={{ ...inp, appearance: 'auto' }} value={form.tipo} onChange={set('tipo')}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 0 430px' }}>
              <label style={lbl}>Setor Pai</label>
              <select style={{ ...inp, appearance: 'auto' }} value={form.parentId} onChange={set('parentId')}>
                <option value="">— raiz —</option>
                {setores.map(s => <option key={s.id} value={s.id}>{s.sigla} - {s.nome}</option>)}
              </select>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ ...lbl, color: '#565656' }}>Descrição</label>
              <textarea style={{ ...inp, height: 80, padding: 12, resize: 'vertical' }} value={form.descricao} onChange={set('descricao')} />
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
        <div style={{ flexShrink: 0, borderTop: '1px solid #ebebeb', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6, background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', minWidth: 152 }}>
            Cancelar
          </button>
          <button onClick={() => onSave(form)} disabled={!form.nome || !form.sigla}
            style={{ height: 38, padding: '0 24px', border: 'none', borderRadius: 6, background: form.nome && form.sigla ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14, fontWeight: 600, cursor: form.nome && form.sigla ? 'pointer' : 'not-allowed', fontFamily: 'Open Sans, sans-serif', minWidth: 152 }}>
            Salvar
          </button>
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
                    <i className="fa-regular fa-pen-to-square" /> Editar
                  </button>
                  <button style={actionBtn} title="Adicionar pessoas">
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

      {/* Modal */}
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
