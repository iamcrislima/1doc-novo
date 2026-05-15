import { useState } from 'react';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Cargo { id: number; nome: string }

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK_CARGOS: Cargo[] = [
  { id: 1,  nome: 'Testemunha'          },
  { id: 2,  nome: 'Administrador'       },
  { id: 3,  nome: 'Aprovador'           },
  { id: 4,  nome: 'Atestar recebimento' },
  { id: 5,  nome: 'Avalista'            },
  { id: 6,  nome: 'Cedente'             },
  { id: 7,  nome: 'Cessionário'         },
  { id: 8,  nome: 'Comprador'           },
  { id: 9,  nome: 'Comprador (alt)'     },
  { id: 10, nome: 'Contador'            },
];
const PER_PAGE = 10;

/* ── estilos compartilhados ─────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 520,
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
const BTN_DANGER: React.CSSProperties = {
  height: 38, padding: '0 24px', border: 'none', borderRadius: 6,
  background: '#b2132e', color: 'white', fontSize: 14, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
};
const INP: React.CSSProperties = {
  width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6,
  padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
  color: '#333', outline: 'none', boxSizing: 'border-box',
};
const LBL: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#333',
  marginBottom: 5, fontFamily: 'Open Sans, sans-serif',
};

/* ── AdicionarFuncaoModal ───────────────────────────────────────────── */
function AdicionarFuncaoModal({ onSave, onClose }: {
  onSave: (nome: string) => void; onClose: () => void;
}) {
  const [nome, setNome] = useState('');
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Adicionar Função
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '20px 22px 24px' }}>
          <label style={LBL}>Função<span style={{ color: '#b2132e' }}>*</span></label>
          <input
            style={INP}
            placeholder="Nome da função"
            value={nome}
            onChange={e => setNome(e.target.value)}
            autoFocus
          />
        </div>
        <div style={MODAL_FOOTER}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button
            onClick={() => { if (nome.trim()) onSave(nome.trim()); }}
            disabled={!nome.trim()}
            style={BTN_PRIMARY(!!nome.trim())}
          >Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── ConfirmDeleteModal ─────────────────────────────────────────────── */
function ConfirmDeleteModal({ onConfirm, onClose }: {
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...MODAL_BOX, maxWidth: 360 }}>
        <div style={{ ...MODAL_HEADER, borderBottom: 'none', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: '3px solid #b2132e', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Excluir
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Tem certeza de que deseja excluir esta função?
          </p>
        </div>
        <div style={{ ...MODAL_FOOTER, justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={{ ...BTN_CANCEL, color: '#0058db' }}>Cancelar</button>
          <button onClick={onConfirm} style={BTN_DANGER}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── Paginação ──────────────────────────────────────────────────────── */
function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
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
        <div style={{
          width: 36, height: 36, border: '1px solid #0058db', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#0058db', fontFamily: 'Open Sans, sans-serif',
        }}>{page}</div>
        <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>de {totalPages}</span>
      </div>
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)} style={navBtn(page === totalPages)}>
        Próxima<i className="fa-regular fa-angle-right" style={{ marginLeft: 4 }} />
      </button>
    </div>
  );
}

/* ── CargosEFuncoesTab ──────────────────────────────────────────────── */
export default function CargosEFuncoesTab() {
  const [cargos, setCargos] = useState<Cargo[]>(MOCK_CARGOS);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const paginated = cargos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = (nome: string) => {
    setCargos(p => [...p, { id: Date.now(), nome }]);
    setShowAdd(false);
  };

  const handleDelete = () => {
    setCargos(p => p.filter(c => c.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Cargos e funções
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Defina cargos, responsabilidades e níveis hierárquicos de atuação.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Nova função
        </button>
      </div>

      {/* Tabela */}
      <div style={{ marginTop: 16 }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 80px',
          background: '#1e2a3b', padding: '0 16px', height: 44,
          alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0',
        }}>
          {['Função', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>

        {/* Linhas */}
        {paginated.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-inbox" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhuma função cadastrada.</p>
          </div>
        ) : paginated.map((c, i) => (
          <div
            key={c.id}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 80px',
              padding: '0 16px', height: 44, alignItems: 'center', gap: 8,
              borderBottom: '1px solid #f0f0f0',
              background: i % 2 === 0 ? 'white' : '#fafafa',
            }}
          >
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{c.nome}</span>
            <div>
              <button
                onClick={() => setDeleteId(c.id)}
                title="Excluir"
                style={{
                  width: 32, height: 32, border: '1.5px solid #b2132e', borderRadius: 6,
                  background: 'white', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', color: '#b2132e',
                }}
              >
                <i className="fa-regular fa-trash" style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} total={cargos.length} perPage={PER_PAGE} onChange={setPage} />

      {showAdd && <AdicionarFuncaoModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {deleteId !== null && (
        <ConfirmDeleteModal onConfirm={handleDelete} onClose={() => setDeleteId(null)} />
      )}
    </>
  );
}
