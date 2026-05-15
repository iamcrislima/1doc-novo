import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface TipoDocumento {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  requerAssinatura: boolean;
  ativo: boolean;
}

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK_TIPOS: TipoDocumento[] = [
  { id: 1,  nome: 'Memorando',            descricao: 'Comunicação interna entre setores',                icone: 'fa-regular fa-memo',           cor: '#0058db', requerAssinatura: true,  ativo: true  },
  { id: 2,  nome: 'Ofício',               descricao: 'Comunicação externa oficial',                      icone: 'fa-regular fa-envelope-open-text', cor: '#0f6b3e', requerAssinatura: true,  ativo: true  },
  { id: 3,  nome: 'Ata',                  descricao: 'Registro de reuniões e deliberações',              icone: 'fa-regular fa-file-lines',     cor: '#7c3aed', requerAssinatura: true,  ativo: true  },
  { id: 4,  nome: 'Circular',             descricao: 'Comunicado de abrangência geral',                  icone: 'fa-regular fa-bullhorn',       cor: '#c2570c', requerAssinatura: false, ativo: true  },
  { id: 5,  nome: 'Alvará',               descricao: 'Autorização ou licença expedida',                  icone: 'fa-regular fa-file-certificate',cor: '#0891b2', requerAssinatura: true,  ativo: true  },
  { id: 6,  nome: 'Contrato',             descricao: 'Instrumento contratual entre partes',              icone: 'fa-regular fa-file-contract',  cor: '#b2132e', requerAssinatura: true,  ativo: true  },
  { id: 7,  nome: 'Relatório',            descricao: 'Documento de análise e resultados',                icone: 'fa-regular fa-chart-bar',      cor: '#565656', requerAssinatura: false, ativo: true  },
  { id: 8,  nome: 'Requerimento',         descricao: 'Solicitação formal a autoridade',                  icone: 'fa-regular fa-file-signature', cor: '#0058db', requerAssinatura: false, ativo: true  },
  { id: 9,  nome: 'Despacho',             descricao: 'Decisão ou encaminhamento em processo',            icone: 'fa-regular fa-forward',        cor: '#7c3aed', requerAssinatura: true,  ativo: false },
  { id: 10, nome: 'Nota Fiscal',          descricao: 'Documento fiscal de operação',                     icone: 'fa-regular fa-receipt',        cor: '#0f6b3e', requerAssinatura: false, ativo: false },
];
const PER_PAGE = 10;

const COR_OPTIONS = [
  { label: 'Azul',     value: '#0058db' },
  { label: 'Verde',    value: '#0f6b3e' },
  { label: 'Roxo',     value: '#7c3aed' },
  { label: 'Laranja',  value: '#c2570c' },
  { label: 'Ciano',    value: '#0891b2' },
  { label: 'Vermelho', value: '#b2132e' },
  { label: 'Cinza',    value: '#565656' },
];

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
const INP: React.CSSProperties = {
  width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6,
  padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
  color: '#333', outline: 'none', boxSizing: 'border-box',
};
const LBL: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#333',
  marginBottom: 5, fontFamily: 'Open Sans, sans-serif',
};

/* ── TipoDocModal ───────────────────────────────────────────────────── */
interface FormTipo { nome: string; descricao: string; cor: string; requerAssinatura: boolean; ativo: boolean }

function TipoDocModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit';
  initial?: TipoDocumento;
  onSave: (d: FormTipo) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormTipo>({
    nome: initial?.nome ?? '',
    descricao: initial?.descricao ?? '',
    cor: initial?.cor ?? '#0058db',
    requerAssinatura: initial?.requerAssinatura ?? false,
    ativo: initial?.ativo ?? true,
  });

  const canSave = !!form.nome.trim();
  const corLabel = COR_OPTIONS.find(c => c.value === form.cor)?.label ?? 'Azul';

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo Tipo de Documento' : 'Editar Tipo de Documento'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
          </div>
          <div>
            <label style={{ ...LBL, fontWeight: 400, color: '#565656' }}>Descrição</label>
            <textarea
              style={{ ...INP, height: 80, padding: '8px 10px', resize: 'vertical' }}
              value={form.descricao}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
            />
          </div>
          <div>
            <label style={LBL}>Cor de identificação</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <SimpleSelect
                  value={corLabel}
                  onChange={v => {
                    const found = COR_OPTIONS.find(c => c.label === v);
                    if (found) setForm(p => ({ ...p, cor: found.value }));
                  }}
                  options={COR_OPTIONS.map(c => c.label)}
                />
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: form.cor, border: '1px solid #dde3ee', flexShrink: 0 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.requerAssinatura} onChange={e => setForm(p => ({ ...p, requerAssinatura: e.target.checked }))} />
              Requer assinatura digital
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.ativo} onChange={e => setForm(p => ({ ...p, ativo: e.target.checked }))} />
              Tipo ativo
            </label>
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #b2132e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Excluir</p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir este tipo de documento?</p>
        </div>
        <div style={{ borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 16 }}>
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

/* ── Toggle ativo ───────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
        background: value ? '#0058db' : '#c5c5c5',
        position: 'relative', transition: 'background 0.2s', padding: 0,
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: 'white',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </button>
  );
}

/* ── TiposDocumentosTab ─────────────────────────────────────────────── */
export default function TiposDocumentosTab() {
  const [tipos, setTipos] = useState<TipoDocumento[]>(MOCK_TIPOS);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: TipoDocumento }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const paginated = tipos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (data: FormTipo) => {
    if (modal?.mode === 'novo') {
      setTipos(p => [...p, {
        id: Date.now(), nome: data.nome, descricao: data.descricao,
        icone: 'fa-regular fa-file', cor: data.cor,
        requerAssinatura: data.requerAssinatura, ativo: data.ativo,
      }]);
    } else if (modal?.item) {
      setTipos(p => p.map(t => t.id === modal.item!.id
        ? { ...t, nome: data.nome, descricao: data.descricao, cor: data.cor, requerAssinatura: data.requerAssinatura, ativo: data.ativo }
        : t));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setTipos(p => p.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  const toggleAtivo = (id: number) => {
    setTipos(p => p.map(t => t.id === id ? { ...t, ativo: !t.ativo } : t));
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 32, height: 32, border: `1.5px solid ${color}`, borderRadius: 6,
    background: 'white', cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Tipos de documentos
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Configure os tipos de documentos disponíveis na plataforma.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Novo tipo
        </button>
      </div>

      {/* Tabela */}
      <div style={{ marginTop: 16 }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '44px 1fr 1fr 80px 80px',
          background: '#1e2a3b', padding: '0 16px', height: 44,
          alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0',
        }}>
          {['', 'Nome', 'Descrição', 'Ativo', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-file" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>Nenhum tipo de documento cadastrado</p>
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Clique em "Novo tipo" para adicionar o primeiro.</p>
          </div>
        ) : paginated.map((t, i) => (
          <div
            key={t.id}
            style={{
              display: 'grid', gridTemplateColumns: '44px 1fr 1fr 80px 80px',
              padding: '0 16px', height: 52, alignItems: 'center', gap: 8,
              borderBottom: '1px solid #f0f0f0',
              background: i % 2 === 0 ? 'white' : '#fafafa',
            }}
          >
            {/* Ícone */}
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={t.icone} style={{ fontSize: 15, color: t.cor }} />
            </div>

            {/* Nome */}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{t.nome}</span>

            {/* Descrição */}
            <span style={{ fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
              {t.descricao.length > 50 ? t.descricao.slice(0, 50) + '…' : t.descricao}
            </span>

            {/* Toggle ativo */}
            <Toggle value={t.ativo} onChange={() => toggleAtivo(t.id)} />

            {/* Ações */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: t })}>
                <i className="fa-regular fa-pen-to-square" style={{ fontSize: 13 }} />
              </button>
              <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(t.id)}>
                <i className="fa-regular fa-trash" style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} total={tipos.length} perPage={PER_PAGE} onChange={setPage} />

      {modal && (
        <TipoDocModal
          mode={modal.mode}
          initial={modal.item}
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
