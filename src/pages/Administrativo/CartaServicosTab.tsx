import { useState } from 'react';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface CartaServico { id: number; nome: string; parentId: number | null; online: boolean; termoDestaque: boolean; descricao: string; assuntos: string[] }

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK: CartaServico[] = [
  { id: 1,  nome: 'Tributário e Fiscal',        parentId: null, online: false, termoDestaque: false, descricao: '', assuntos: ['Tributário', 'Fiscal'] },
  { id: 2,  nome: 'Isenção de IPTU',            parentId: 1,    online: true,  termoDestaque: true,  descricao: 'Solicitação de isenção do Imposto Predial e Territorial Urbano para aposentados, pensionistas e pessoas com deficiência.', assuntos: ['Tributário'] },
  { id: 3,  nome: 'Certidão de Débitos',        parentId: 1,    online: true,  termoDestaque: false, descricao: 'Emissão de certidão negativa ou positiva de débitos municipais para pessoas físicas e jurídicas.', assuntos: ['Tributário', 'Fiscal'] },
  { id: 4,  nome: 'Parcelamento de Débitos',    parentId: 1,    online: false, termoDestaque: false, descricao: 'Solicitação de parcelamento de dívidas tributárias junto à Secretaria de Fazenda.', assuntos: ['Fiscal'] },
  { id: 5,  nome: 'Licenciamento e Obras',      parentId: null, online: false, termoDestaque: false, descricao: '', assuntos: ['Urbanismo'] },
  { id: 6,  nome: 'Alvará de Funcionamento',    parentId: 5,    online: true,  termoDestaque: true,  descricao: 'Autorização para funcionamento de estabelecimentos comerciais, industriais e de prestação de serviços.', assuntos: ['Urbanismo'] },
  { id: 7,  nome: 'Alvará de Construção',       parentId: 5,    online: false, termoDestaque: false, descricao: 'Licença para execução de obras de construção, reforma ou ampliação de edificações.', assuntos: ['Urbanismo'] },
  { id: 8,  nome: 'Habite-se',                  parentId: 5,    online: false, termoDestaque: false, descricao: 'Documento que atesta que a construção foi concluída em conformidade com o projeto aprovado.', assuntos: ['Urbanismo'] },
  { id: 9,  nome: 'Saúde e Vigilância',         parentId: null, online: false, termoDestaque: false, descricao: '', assuntos: ['Saúde'] },
  { id: 10, nome: 'Vigilância Sanitária',       parentId: 9,    online: true,  termoDestaque: false, descricao: 'Inspeção e licenciamento sanitário de estabelecimentos que manipulam alimentos, medicamentos e serviços de saúde.', assuntos: ['Saúde'] },
  { id: 11, nome: 'Vacinação',                  parentId: 9,    online: false, termoDestaque: false, descricao: 'Agendamento e informações sobre campanhas de vacinação no município.', assuntos: ['Saúde'] },
];
const ASSUNTOS_MOCK = ['Tributário', 'Fiscal', 'Ambiental', 'Urbanismo', 'Saúde', 'Educação', 'Social'];

/* ── estilos ────────────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, padding: 24 };
const MODAL_BOX: React.CSSProperties = { background: 'white', borderRadius: 8, width: '100%', maxWidth: 620, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' };
const MODAL_HEADER: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px', borderBottom: '1px solid #ebebeb', flexShrink: 0 };
const MODAL_FOOTER: React.CSSProperties = { flexShrink: 0, borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'flex-end', gap: 12 };
const BTN_CANCEL: React.CSSProperties = { height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6, background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' };
const BTN_PRIMARY = (ok = true): React.CSSProperties => ({ height: 38, padding: '0 24px', border: 'none', borderRadius: 6, background: ok ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'Open Sans, sans-serif' });
const INP: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6, padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333', outline: 'none', boxSizing: 'border-box' };
const LBL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5, fontFamily: 'Open Sans, sans-serif' };

const TOOLBAR_BTNS = ['fa-bold','fa-italic','fa-underline','fa-list-ul','fa-list-ol','fa-align-left','fa-align-center','fa-link','fa-image'];

/* ── CartaModal ──────────────────────────────────────────────────────── */
interface FormCarta { nome: string; parentId: string; icone: string; assuntos: string[]; online: boolean; termoDestaque: boolean; descricao: string }

function CartaModal({ mode, initial, cartas, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: CartaServico; cartas: CartaServico[];
  onSave: (d: FormCarta) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormCarta>({
    nome: initial?.nome ?? '', parentId: initial?.parentId?.toString() ?? '',
    icone: '', assuntos: initial?.assuntos ?? [],
    online: initial?.online ?? false, termoDestaque: initial?.termoDestaque ?? false,
    descricao: initial?.descricao ?? '',
  });
  const [assuntoBusca, setAssuntoBusca] = useState('');
  const [showAssunto, setShowAssunto] = useState(false);
  const [paiSearch, setPaiSearch] = useState('');
  const [showPai, setShowPai] = useState(false);

  const canSave = !!form.nome.trim();
  const parentOpts = cartas.filter(c => c.id !== initial?.id);
  const filteredPai = parentOpts.filter(c => paiSearch === '' || c.nome.toLowerCase().includes(paiSearch.toLowerCase()));
  const selectedPai = parentOpts.find(c => c.id.toString() === form.parentId);
  const filteredAssuntos = ASSUNTOS_MOCK.filter(a => !form.assuntos.includes(a) && (assuntoBusca === '' || a.toLowerCase().includes(assuntoBusca.toLowerCase())));

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Nova carta de serviço' : 'Editar carta de serviço'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Nome + Carta Pai + Ícone */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 180px' }}>
              <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div style={{ flex: '2 1 180px', position: 'relative' }}>
              <label style={LBL}>Carta de Serviço pai</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={INP}
                  placeholder="Busque carta de serviço pai"
                  value={selectedPai ? selectedPai.nome : paiSearch}
                  onChange={e => { setPaiSearch(e.target.value); setForm(p => ({ ...p, parentId: '' })); setShowPai(true); }}
                  onFocus={() => setShowPai(true)}
                  onBlur={() => setTimeout(() => setShowPai(false), 150)}
                />
                {form.parentId && (
                  <button onClick={() => { setForm(p => ({ ...p, parentId: '' })); setPaiSearch(''); }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                    <i className="fa-regular fa-xmark" />
                  </button>
                )}
              </div>
              {showPai && filteredPai.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #c5c5c5', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10, maxHeight: 140, overflowY: 'auto' }}>
                  {filteredPai.map(c => (
                    <button key={c.id} onMouseDown={() => { setForm(p => ({ ...p, parentId: c.id.toString() })); setShowPai(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                      {c.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ flex: '1 1 100px' }}>
              <label style={LBL}>Ícone</label>
              <input style={INP} placeholder="fa-..." value={form.icone} onChange={e => setForm(p => ({ ...p, icone: e.target.value }))} />
            </div>
          </div>

          {/* Assuntos */}
          <div>
            <label style={LBL}>Assuntos</label>
            <div style={{ position: 'relative' }}>
              <input style={INP} placeholder="Busque assuntos relacionados"
                value={assuntoBusca}
                onChange={e => { setAssuntoBusca(e.target.value); setShowAssunto(true); }}
                onFocus={() => setShowAssunto(true)}
                onBlur={() => setTimeout(() => setShowAssunto(false), 150)}
              />
              {showAssunto && filteredAssuntos.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #c5c5c5', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10, maxHeight: 140, overflowY: 'auto' }}>
                  {filteredAssuntos.map(a => (
                    <button key={a} onMouseDown={() => { setForm(p => ({ ...p, assuntos: [...p.assuntos, a] })); setAssuntoBusca(''); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.assuntos.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {form.assuntos.map(a => (
                  <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 4, padding: '3px 8px', fontSize: 12, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
                    {a}
                    <button onClick={() => setForm(p => ({ ...p, assuntos: p.assuntos.filter(x => x !== a) }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 11, padding: 0, display: 'flex', alignItems: 'center' }}>
                      <i className="fa-regular fa-xmark" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div style={{ display: 'flex', gap: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.online} onChange={e => setForm(p => ({ ...p, online: e.target.checked }))} />
              Online
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.termoDestaque} onChange={e => setForm(p => ({ ...p, termoDestaque: e.target.checked }))} />
              Termo Destaque
            </label>
          </div>

          {/* Descrição */}
          <div>
            <label style={LBL}>Descrição</label>
            <div style={{ border: '1px solid #c5c5c5', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 2, padding: '6px 8px', borderBottom: '1px solid #ebebeb', background: '#fafafa' }}>
                {TOOLBAR_BTNS.map(b => (
                  <button key={b} type="button"
                    style={{ width: 28, height: 26, border: '1px solid transparent', borderRadius: 4, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    <i className={`fa-regular ${b}`} style={{ fontSize: 12 }} />
                  </button>
                ))}
              </div>
              <textarea value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                placeholder="Descreva este serviço..."
                style={{ width: '100%', minHeight: 120, border: 'none', outline: 'none', padding: '10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
        <div style={MODAL_FOOTER}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => canSave && onSave(form)} disabled={!canSave} style={BTN_PRIMARY(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── ConfirmDeleteModal ─────────────────────────────────────────────── */
function ConfirmDeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'white', borderRadius: 8, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 18px 0' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #b2132e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Excluir</p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir esta carta de serviço?</p>
        </div>
        <div style={{ borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_PRIMARY(), background: '#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── CartaServicosTab ────────────────────────────────────────────────── */
export default function CartaServicosTab() {
  const [cartas, setCartas] = useState<CartaServico[]>(MOCK);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: CartaServico }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSave = (data: FormCarta) => {
    if (modal?.mode === 'novo') {
      setCartas(p => [...p, { id: Date.now(), nome: data.nome, parentId: data.parentId ? parseInt(data.parentId) : null, online: data.online, termoDestaque: data.termoDestaque, descricao: data.descricao, assuntos: data.assuntos }]);
    } else if (modal?.item) {
      setCartas(p => p.map(c => c.id === modal.item!.id ? { ...c, nome: data.nome, parentId: data.parentId ? parseInt(data.parentId) : null, online: data.online, termoDestaque: data.termoDestaque, descricao: data.descricao, assuntos: data.assuntos } : c));
    }
    setModal(null);
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5,
    background: `${color}10`, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });

  // Renderização em árvore
  const renderRows = (items: CartaServico[], parentId: number | null, depth: number): React.ReactNode[] => {
    return items.filter(c => c.parentId === parentId).flatMap((c, i) => {
      const isEven = i % 2 === 0;
      return [
        <div key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 44, borderBottom: '1px solid #f0f0f0', background: isEven ? 'white' : '#fafafa', gap: 8 }}>
          <span style={{ paddingLeft: depth * 20, flex: 1, fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: depth === 0 ? 600 : 400, display: 'flex', alignItems: 'center', gap: 6 }}>
            {depth > 0 && <i className="fa-regular fa-turn-down-right" style={{ fontSize: 11, color: '#a3a3a3' }} />}
            {c.nome}
            {c.online && <span style={{ background: '#e6f9f0', color: '#0f6b3e', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>Online</span>}
          </span>
          <div style={{ display: 'flex', gap: 5 }}>
            <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: c })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 12 }} /></button>
            <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(c.id)}><i className="fa-regular fa-trash" style={{ fontSize: 12 }} /></button>
          </div>
        </div>,
        ...renderRows(items, c.id, depth + 1),
      ];
    });
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Carta de serviços</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Configure os serviços disponíveis no portal de atendimento ao cidadão.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />Nova carta de serviço
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 44, background: '#1e2a3b', borderRadius: '6px 6px 0 0', gap: 8 }}>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>Nome</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif', width: 80, textAlign: 'right' }}>Ações</span>
        </div>
        {cartas.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-envelope-open-text" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhuma carta de serviço cadastrada.</p>
          </div>
        ) : renderRows(cartas, null, 0)}
      </div>

      {modal && <CartaModal mode={modal.mode} initial={modal.item} cartas={cartas} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteId !== null && <ConfirmDeleteModal onConfirm={() => { setCartas(p => p.filter(c => c.id !== deleteId)); setDeleteId(null); }} onClose={() => setDeleteId(null)} />}
    </>
  );
}
