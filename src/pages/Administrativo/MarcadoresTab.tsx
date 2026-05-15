import { useState } from 'react';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Marcador {
  id: number;
  nome: string;
  exibicao: string;
  corFundo: string;
  corFonte: string;
  parentId: number | null;
}

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK_MARCADORES: Marcador[] = [
  { id: 32417, nome: 'Urgente',               exibicao: 'Urgente',               corFundo: '#b2132e', corFonte: '#ffffff', parentId: null },
  { id: 32418, nome: 'Alta Prioridade',        exibicao: 'Alta Prioridade',        corFundo: '#c2570c', corFonte: '#ffffff', parentId: null },
  { id: 32419, nome: 'Em Análise',             exibicao: 'Em Análise',             corFundo: '#0058db', corFonte: '#ffffff', parentId: null },
  { id: 32420, nome: 'Aguardando Documentos',  exibicao: 'Ag. Documentos',         corFundo: '#7c3aed', corFonte: '#ffffff', parentId: null },
  { id: 32421, nome: 'Aprovado',               exibicao: 'Aprovado',               corFundo: '#0f6b3e', corFonte: '#ffffff', parentId: null },
  { id: 32422, nome: 'Reprovado',              exibicao: 'Reprovado',              corFundo: '#b2132e', corFonte: '#ffffff', parentId: null },
  { id: 32423, nome: 'Confidencial',           exibicao: 'Confidencial',           corFundo: '#1e2a3b', corFonte: '#ffffff', parentId: null },
  { id: 32424, nome: 'Arquivado',              exibicao: 'Arquivado',              corFundo: '#565656', corFonte: '#ffffff', parentId: null },
  { id: 32425, nome: 'Aguardando Assinatura',  exibicao: 'Ag. Assinatura',         corFundo: '#0891b2', corFonte: '#ffffff', parentId: 32419 },
  { id: 32426, nome: 'Em Revisão',             exibicao: 'Em Revisão',             corFundo: '#0058db', corFonte: '#ffffff', parentId: 32419 },
];
const PER_PAGE = 10;

/* ── estilos compartilhados ─────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 540,
  display: 'flex', flexDirection: 'column',
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
const BTN_PRIMARY = (enabled = true): React.CSSProperties => ({
  height: 38, padding: '0 24px', border: 'none', borderRadius: 6,
  background: enabled ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14,
  fontWeight: 600, cursor: enabled ? 'pointer' : 'not-allowed',
  fontFamily: 'Open Sans, sans-serif',
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

/* ── MarcadorModal ──────────────────────────────────────────────────── */
interface FormMarcador {
  nome: string; exibicao: string; corFundo: string; corFonte: string; parentId: string;
}

function MarcadorModal({ mode, initial, marcadores, onSave, onClose }: {
  mode: 'novo' | 'edit';
  initial?: Marcador;
  marcadores: Marcador[];
  onSave: (d: FormMarcador) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormMarcador>({
    nome: initial?.nome ?? '',
    exibicao: initial?.exibicao ?? '',
    corFundo: initial?.corFundo ?? '#0058db',
    corFonte: initial?.corFonte ?? '#ffffff',
    parentId: initial?.parentId?.toString() ?? '',
  });

  const canSave = !!form.nome.trim();

  const parentOptions = [{ value: '', label: '— nenhum —' }, ...marcadores.map(m => ({ value: m.id.toString(), label: m.nome }))];

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Adicionar Marcador' : 'Editar Marcador'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Nome */}
          <div>
            <label style={LBL}>Nome do marcador<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
          </div>

          {/* Texto de exibição */}
          <div>
            <label style={LBL}>Texto de exibição</label>
            <input
              style={INP}
              placeholder="Usa o nome se vazio"
              value={form.exibicao}
              onChange={e => setForm(p => ({ ...p, exibicao: e.target.value }))}
            />
          </div>

          {/* Marcador Pai */}
          <div>
            <label style={LBL}>Marcador Pai</label>
            <div style={{ position: 'relative' }}>
              <select
                value={form.parentId}
                onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}
                style={{ ...INP, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
              >
                {parentOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <i className="fa-regular fa-angle-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Cores */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={LBL}>Cor de fundo<span style={{ color: '#b2132e' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  style={{ ...INP }}
                  value={form.corFundo}
                  onChange={e => setForm(p => ({ ...p, corFundo: e.target.value }))}
                />
                <div
                  style={{ width: 36, height: 40, borderRadius: 6, background: form.corFundo, border: '1px solid #c5c5c5', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  <input
                    type="color"
                    value={form.corFundo}
                    onChange={e => setForm(p => ({ ...p, corFundo: e.target.value }))}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={LBL}>Cor da fonte<span style={{ color: '#b2132e' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  style={{ ...INP }}
                  value={form.corFonte}
                  onChange={e => setForm(p => ({ ...p, corFonte: e.target.value }))}
                />
                <div
                  style={{ width: 36, height: 40, borderRadius: 6, background: form.corFonte, border: '1px solid #c5c5c5', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  <input
                    type="color"
                    value={form.corFonte}
                    onChange={e => setForm(p => ({ ...p, corFonte: e.target.value }))}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {form.exibicao || form.nome ? (
            <div>
              <label style={{ ...LBL, fontWeight: 400, color: '#7d7d7d' }}>Prévia</label>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: form.corFundo, color: form.corFonte,
                borderRadius: 100, padding: '4px 12px', fontSize: 13, fontWeight: 600,
                fontFamily: 'Open Sans, sans-serif',
              }}>
                <i className="fa-regular fa-tag" style={{ fontSize: 11 }} />
                {form.exibicao || form.nome}
              </span>
            </div>
          ) : null}
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
      <div style={{ ...MODAL_BOX, maxWidth: 360 }}>
        <div style={{ ...MODAL_HEADER, borderBottom: 'none', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #b2132e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Excluir</p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir este marcador?</p>
        </div>
        <div style={{ ...MODAL_FOOTER, justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_PRIMARY(), background: '#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── Paginação ──────────────────────────────────────────────────────── */
function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const navBtn = (disabled: boolean): React.CSSProperties => ({
    height: 36, padding: '0 14px', border: '1px solid #dce6f5', borderRadius: 6,
    background: disabled ? '#f4f4f4' : 'white', color: disabled ? '#aaa' : '#0058db',
    fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Open Sans, sans-serif',
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)} style={navBtn(page === 1)}>
        <i className="fa-regular fa-angle-left" style={{ marginRight: 4 }} />Anterior
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, border: '1px solid #0058db', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0058db', fontFamily: 'Open Sans, sans-serif' }}>{page}</div>
        <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>de {totalPages}</span>
      </div>
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)} style={navBtn(page === totalPages)}>
        Próxima<i className="fa-regular fa-angle-right" style={{ marginLeft: 4 }} />
      </button>
    </div>
  );
}

/* ── MarcadoresTab ──────────────────────────────────────────────────── */
export default function MarcadoresTab() {
  const [marcadores, setMarcadores] = useState<Marcador[]>(MOCK_MARCADORES);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: Marcador }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const paginated = marcadores.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (data: FormMarcador) => {
    if (modal?.mode === 'novo') {
      setMarcadores(p => [...p, {
        id: Date.now(),
        nome: data.nome,
        exibicao: data.exibicao || data.nome,
        corFundo: data.corFundo,
        corFonte: data.corFonte,
        parentId: data.parentId ? parseInt(data.parentId) : null,
      }]);
    } else if (modal?.item) {
      setMarcadores(p => p.map(m => m.id === modal.item!.id
        ? { ...m, nome: data.nome, exibicao: data.exibicao || data.nome, corFundo: data.corFundo, corFonte: data.corFonte, parentId: data.parentId ? parseInt(data.parentId) : null }
        : m));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setMarcadores(p => p.filter(m => m.id !== deleteId));
    setDeleteId(null);
  };

  const handleClone = (item: Marcador) => {
    setMarcadores(p => [...p, { ...item, id: Date.now(), nome: item.nome + ' (cópia)' }]);
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 32, height: 32, border: `1.5px solid ${color}30`, borderRadius: 6,
    background: `${color}10`, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Marcadores
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Aplique marcadores para facilitar agrupamentos e sinalizações específicas.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Novo marcador
        </button>
      </div>

      {/* Tabela */}
      <div style={{ marginTop: 16 }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '80px 1fr 1fr 110px',
          background: '#1e2a3b', padding: '0 16px', height: 44,
          alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0',
        }}>
          {['ID', 'Nome', 'Exibição', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-tag" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>Nenhum marcador cadastrado</p>
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Clique em "Novo marcador" para adicionar o primeiro.</p>
          </div>
        ) : paginated.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: 'grid', gridTemplateColumns: '80px 1fr 1fr 110px',
              padding: '0 16px', height: 52, alignItems: 'center', gap: 8,
              borderBottom: '1px solid #f0f0f0',
              background: i % 2 === 0 ? 'white' : '#fafafa',
            }}
          >
            <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{m.id}</span>
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 500 }}>{m.nome}</span>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: m.corFundo, color: m.corFonte,
                borderRadius: 100, padding: '3px 12px', fontSize: 12, fontWeight: 600,
                fontFamily: 'Open Sans, sans-serif', maxWidth: '100%',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                <i className="fa-regular fa-tag" style={{ fontSize: 10, flexShrink: 0 }} />
                {m.exibicao}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: m })}>
                <i className="fa-regular fa-pen-to-square" style={{ fontSize: 13 }} />
              </button>
              <button style={actionBtn()} title="Clonar" onClick={() => handleClone(m)}>
                <i className="fa-regular fa-clone" style={{ fontSize: 13 }} />
              </button>
              <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(m.id)}>
                <i className="fa-regular fa-trash" style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} total={marcadores.length} perPage={PER_PAGE} onChange={p => { setPage(p); }} />

      {modal && (
        <MarcadorModal
          mode={modal.mode}
          initial={modal.item}
          marcadores={marcadores}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleteId !== null && (
        <ConfirmDeleteModal onConfirm={handleDelete} onClose={() => setDeleteId(null)} />
      )}
    </>
  );
}
