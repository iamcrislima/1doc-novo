import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface ListaAssinantes {
  id: number; titulo: string; fluxo: string; visibilidade: string;
  internos: string[]; externos: string[];
}

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK_LISTAS: ListaAssinantes[] = [
  { id: 1, titulo: 'Contratos da Saúde',      fluxo: 'Contratos', visibilidade: 'Compartilhar com todos os setores', internos: ['Cris Lima', 'Moacir Silva'],        externos: [] },
  { id: 2, titulo: 'Licitações de Obras',     fluxo: 'Compras',   visibilidade: 'Compartilhar com todos os setores', internos: ['Inácio Steffen', 'Roberval Amarantes'], externos: ['juridico@parceiro.com'] },
  { id: 3, titulo: 'Documentos Jurídicos',    fluxo: 'Processos', visibilidade: 'Somente meu setor',                internos: ['Marcelle Licht'],                      externos: [] },
  { id: 4, titulo: 'Ouvidoria — Respostas',   fluxo: 'Ouvidoria', visibilidade: 'Compartilhar com todos os setores', internos: ['Samantha Silva', 'Cris Lima'],         externos: [] },
  { id: 5, titulo: 'Contratos de TI',         fluxo: 'Contratos', visibilidade: 'Somente meu setor',                internos: ['Cris Lima'],                            externos: ['contato@empresa.com'] },
];

const FLUXOS = ['Todos', 'Compras', 'Contratos', 'Processos', 'Ouvidoria'];
const VISIBILIDADES = ['Compartilhar com todos os setores', 'Somente meu setor', 'Somente eu'];
const USUARIOS_MOCK = ['Cris Lima', 'Moacir Silva', 'Marcelle Licht', 'Inácio Steffen', 'Samantha Silva', 'Roberval Amarantes'];

/* ── estilos ────────────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 560,
  maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden',
};
const MODAL_HEADER: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '18px 22px 14px', borderBottom: '1px solid #ebebeb', flexShrink: 0,
};
const MODAL_FOOTER: React.CSSProperties = {
  flexShrink: 0, borderTop: '1px solid #ebebeb',
  padding: '16px 22px', display: 'flex', justifyContent: 'flex-end', gap: 12,
};
const BTN_CANCEL: React.CSSProperties = {
  height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6,
  background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
};
const BTN_PRIMARY = (ok = true): React.CSSProperties => ({
  height: 38, padding: '0 24px', border: 'none', borderRadius: 6,
  background: ok ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14,
  fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'Open Sans, sans-serif',
});
const INP: React.CSSProperties = {
  width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6,
  padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
  color: '#333', outline: 'none', boxSizing: 'border-box',
};
const LBL: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#333',
  marginBottom: 5, fontFamily: 'Open Sans, sans-serif',
};

/* ── UserSearchInput ─────────────────────────────────────────────────── */
function UserSearchInput({ label, placeholder, chips, onAdd, onRemove, suggestions }: {
  label: string; placeholder: string; chips: string[];
  onAdd: (s: string) => void; onRemove: (s: string) => void; suggestions: string[];
}) {
  const [q, setQ] = useState('');
  const [show, setShow] = useState(false);
  const filtered = suggestions.filter(s => !chips.includes(s) && (q === '' || s.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <label style={LBL}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 13 }} />
          <input
            style={{ ...INP, paddingLeft: 32 }}
            placeholder={placeholder}
            value={q}
            onChange={e => { setQ(e.target.value); setShow(true); }}
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 150)}
          />
        </div>
        {show && filtered.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #c5c5c5', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10, maxHeight: 160, overflowY: 'auto' }}>
            {filtered.map(s => (
              <button key={s} onMouseDown={() => { onAdd(s); setQ(''); setShow(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                <i className="fa-regular fa-user" style={{ marginRight: 8, color: '#888' }} />{s}
              </button>
            ))}
          </div>
        )}
      </div>
      {chips.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chips.map(c => (
            <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
              {c}
              <button onClick={() => onRemove(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: 0, display: 'flex', alignItems: 'center' }}>
                <i className="fa-regular fa-xmark" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── ListaModal ──────────────────────────────────────────────────────── */
interface FormLista { titulo: string; fluxo: string; visibilidade: string; internos: string[]; externos: string[] }

function ListaModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: ListaAssinantes;
  onSave: (d: FormLista) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormLista>({
    titulo: initial?.titulo ?? '',
    fluxo: initial?.fluxo ?? FLUXOS[0],
    visibilidade: initial?.visibilidade ?? VISIBILIDADES[0],
    internos: initial?.internos ?? [],
    externos: initial?.externos ?? [],
  });
  const canSave = !!form.titulo.trim();

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Nova lista de assinantes' : 'Editar lista'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LBL}>Fluxo</label>
            <SimpleSelect value={form.fluxo} onChange={v => setForm(p => ({ ...p, fluxo: v }))} options={FLUXOS} />
          </div>
          <div>
            <label style={LBL}>Título<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} placeholder="Título da lista" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
          </div>
          <div>
            <label style={LBL}>Visibilidade</label>
            <SimpleSelect value={form.visibilidade} onChange={v => setForm(p => ({ ...p, visibilidade: v }))} options={VISIBILIDADES} />
          </div>
          <UserSearchInput
            label="Usuário(s) interno(s)"
            placeholder="Busque contatos internos para solicitar assinatura"
            chips={form.internos}
            suggestions={USUARIOS_MOCK}
            onAdd={s => setForm(p => ({ ...p, internos: [...p.internos, s] }))}
            onRemove={s => setForm(p => ({ ...p, internos: p.internos.filter(x => x !== s) }))}
          />
          <UserSearchInput
            label="Contato(s) externo(s)"
            placeholder="Busque contatos externos para solicitar assinatura"
            chips={form.externos}
            suggestions={['contato@empresa.com', 'juridico@parceiro.com', 'externo@email.com']}
            onAdd={s => setForm(p => ({ ...p, externos: [...p.externos, s] }))}
            onRemove={s => setForm(p => ({ ...p, externos: p.externos.filter(x => x !== s) }))}
          />
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #b2132e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Excluir</p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir esta lista?</p>
        </div>
        <div style={{ borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_PRIMARY(), background: '#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── ListasAssinantesTab ─────────────────────────────────────────────── */
export default function ListasAssinantesTab() {
  const [listas, setListas] = useState<ListaAssinantes[]>(MOCK_LISTAS);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: ListaAssinantes }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSave = (data: FormLista) => {
    if (modal?.mode === 'novo') {
      setListas(p => [...p, { id: Date.now(), ...data }]);
    } else if (modal?.item) {
      setListas(p => p.map(l => l.id === modal.item!.id ? { ...l, ...data } : l));
    }
    setModal(null);
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5,
    background: `${color}10`, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Listas de assinantes</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Gerencie listas de usuários para solicitação de assinatura em documentos.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />Nova lista
        </button>
      </div>

      {/* Tabela */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 90px', background: '#1e2a3b', padding: '0 16px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['Título', 'Fluxo', 'Visibilidade', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>
        {listas.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-list-check" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhuma lista cadastrada.</p>
          </div>
        ) : listas.map((l, i) => (
          <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 90px', padding: '0 16px', height: 48, alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{l.titulo}</span>
            <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{l.fluxo}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 4, padding: '3px 8px', fontSize: 12, color: '#333', fontFamily: 'Open Sans, sans-serif', width: 'fit-content' }}>
              <i className="fa-regular fa-building" style={{ fontSize: 10 }} />{l.visibilidade}
            </span>
            <div style={{ display: 'flex', gap: 5 }}>
              <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: l })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 12 }} /></button>
              <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(l.id)}><i className="fa-regular fa-trash" style={{ fontSize: 12 }} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && <ListaModal mode={modal.mode} initial={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteId !== null && <ConfirmDeleteModal onConfirm={() => { setListas(p => p.filter(l => l.id !== deleteId)); setDeleteId(null); }} onClose={() => setDeleteId(null)} />}
    </>
  );
}
