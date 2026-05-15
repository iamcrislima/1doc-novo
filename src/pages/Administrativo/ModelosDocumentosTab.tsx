import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Modelo { id: number; titulo: string; visibilidade: string; setor: string | null; conteudo: string }

/* ── mock ───────────────────────────────────────────────────────────── */
const MOCK_SETOR: Modelo[] = [
  { id: 1, titulo: 'Dotação Contabilidade',        visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
  { id: 2, titulo: 'Modelo Resposta',              visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
  { id: 3, titulo: 'Para Providências',            visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
  { id: 4, titulo: 'PARECER - Autorização Prefeito', visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
  { id: 5, titulo: 'Tabela Fornecedores',          visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
  { id: 6, titulo: 'Teste Despacho',               visibilidade: 'Somente meu setor', setor: 'SADM', conteudo: '' },
];
const MOCK_ORG: Modelo[] = [
  { id: 10, titulo: 'Cancelamento de Contrato',    visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 11, titulo: 'Decreto',                     visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 12, titulo: 'Dispensa de Licitação',       visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 13, titulo: 'Modelo Educação',             visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 14, titulo: 'Parecer Jurídico',            visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 15, titulo: 'Resposta ao Cidadão',         visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 16, titulo: 'Solicitação de Suplementação',visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
  { id: 17, titulo: 'Termo de empréstimo',         visibilidade: 'Compartilhar com todos', setor: null, conteudo: '' },
];

const VISIBILIDADES = [
  'Compartilhar com todos os setores',
  'Somente meu setor',
  'Somente eu',
];

/* ── estilos ────────────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 700,
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

/* ── Rich Text Toolbar (visual mock) ────────────────────────────────── */
const TOOLBAR_BTNS = [
  { icon: 'fa-bold', title: 'Negrito' },
  { icon: 'fa-italic', title: 'Itálico' },
  { icon: 'fa-underline', title: 'Sublinhado' },
  { icon: 'fa-list-ul', title: 'Lista' },
  { icon: 'fa-list-ol', title: 'Lista numerada' },
  { icon: 'fa-align-left', title: 'Alinhar esquerda' },
  { icon: 'fa-align-center', title: 'Centralizar' },
  { icon: 'fa-align-right', title: 'Alinhar direita' },
  { icon: 'fa-link', title: 'Link' },
  { icon: 'fa-image', title: 'Imagem' },
  { icon: 'fa-table', title: 'Tabela' },
];

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ border: '1px solid #c5c5c5', borderRadius: 6, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: '6px 8px', borderBottom: '1px solid #ebebeb', background: '#fafafa' }}>
        {TOOLBAR_BTNS.map(b => (
          <button
            key={b.icon}
            title={b.title}
            type="button"
            style={{ width: 30, height: 28, border: '1px solid transparent', borderRadius: 4, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ebebeb')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <i className={`fa-regular ${b.icon}`} style={{ fontSize: 13 }} />
          </button>
        ))}
      </div>
      {/* Body */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Digite o conteúdo do modelo..."
        style={{
          width: '100%', minHeight: 200, border: 'none', outline: 'none',
          padding: '12px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
          color: '#333', resize: 'vertical', boxSizing: 'border-box', background: 'white',
        }}
      />
    </div>
  );
}

/* ── ModeloModal ─────────────────────────────────────────────────────── */
interface FormModelo { titulo: string; visibilidade: string; conteudo: string }

function ModeloModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: Modelo;
  onSave: (d: FormModelo) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormModelo>({
    titulo: initial?.titulo ?? '',
    visibilidade: initial?.visibilidade ?? VISIBILIDADES[0],
    conteudo: initial?.conteudo ?? '',
  });
  const canSave = !!form.titulo.trim();

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo modelo' : 'Editar modelo'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={LBL}>Título<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} placeholder="Título do modelo" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
          </div>
          <div>
            <label style={LBL}>Visibilidade<span style={{ color: '#b2132e' }}>*</span></label>
            <SimpleSelect value={form.visibilidade} onChange={v => setForm(p => ({ ...p, visibilidade: v }))} options={VISIBILIDADES} />
          </div>
          <div>
            <label style={LBL}>Conteúdo</label>
            <RichTextEditor value={form.conteudo} onChange={v => setForm(p => ({ ...p, conteudo: v }))} />
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
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid #b2132e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize: 24, color: '#b2132e' }} />
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Excluir</p>
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir este modelo?</p>
        </div>
        <div style={{ borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_PRIMARY(), background: '#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── Row de modelo ─────────────────────────────────────────────────── */
function ModeloRow({ modelo, onEdit, onDelete }: {
  modelo: Modelo; onEdit: () => void; onDelete: () => void;
}) {
  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 30, height: 30, border: `1px solid ${color}30`, borderRadius: 5,
    background: `${color}10`, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f0f0f0', gap: 12 }}>
      <span style={{ flex: 1, fontSize: 13, color: '#0058db', fontFamily: 'Open Sans, sans-serif', cursor: 'pointer', fontWeight: 500 }}
        onClick={onEdit}>{modelo.titulo}</span>
      {modelo.setor && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#333', fontFamily: 'Open Sans, sans-serif', flexShrink: 0 }}>
          <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
          {modelo.visibilidade.includes('setor') ? 'Secretaria de Administração' : modelo.visibilidade}
        </span>
      )}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <button style={actionBtn()} title="Editar" onClick={onEdit}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 12 }} /></button>
        <button style={actionBtn('#b2132e')} title="Excluir" onClick={onDelete}><i className="fa-regular fa-trash" style={{ fontSize: 12 }} /></button>
      </div>
    </div>
  );
}

/* ── ModelosDocumentosTab ─────────────────────────────────────────── */
export default function ModelosDocumentosTab() {
  const [setorModelos, setSetorModelos] = useState<Modelo[]>(MOCK_SETOR);
  const [orgModelos, setOrgModelos]     = useState<Modelo[]>(MOCK_ORG);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: Modelo; scope: 'setor' | 'org' }>(null);
  const [deleteTarget, setDeleteTarget] = useState<null | { id: number; scope: 'setor' | 'org' }>(null);

  const handleSave = (data: FormModelo) => {
    const scope = modal!.scope;
    const setter = scope === 'setor' ? setSetorModelos : setOrgModelos;
    if (modal!.mode === 'novo') {
      setter(p => [...p, { id: Date.now(), setor: scope === 'setor' ? 'SADM' : null, ...data }]);
    } else if (modal!.item) {
      setter(p => p.map(m => m.id === modal!.item!.id ? { ...m, ...data } : m));
    }
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const setter = deleteTarget.scope === 'setor' ? setSetorModelos : setOrgModelos;
    setter(p => p.filter(m => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#353535', fontFamily: 'Open Sans, sans-serif' }}>
            Modelos de documentos
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Crie e gerencie modelos de texto para agilizar a criação de documentos.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'novo', scope: 'setor' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Novo modelo
        </button>
      </div>

      {/* Grupo: Setor */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#353535', fontFamily: 'Open Sans, sans-serif' }}>
            Modelos do Setor: SADM
          </p>
          <button
            onClick={() => setModal({ mode: 'novo', scope: 'setor' })}
            style={{ height: 30, padding: '0 12px', border: '1px solid #0058db', borderRadius: 5, background: 'white', color: '#0058db', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}
          >
            + Adicionar
          </button>
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 8px', borderBottom: '2px solid #1e2a3b', gap: 12 }}>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#1e2a3b', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e2a3b', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', width: 80, textAlign: 'right' }}>Ações</span>
        </div>
        {setorModelos.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontFamily: 'Open Sans, sans-serif', fontSize: 13 }}>Nenhum modelo neste setor.</div>
        ) : setorModelos.map(m => (
          <ModeloRow
            key={m.id} modelo={m}
            onEdit={() => setModal({ mode: 'edit', item: m, scope: 'setor' })}
            onDelete={() => setDeleteTarget({ id: m.id, scope: 'setor' })}
          />
        ))}
      </div>

      {/* Grupo: Organização */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#353535', fontFamily: 'Open Sans, sans-serif' }}>
            Modelos da Organização
          </p>
          <button
            onClick={() => setModal({ mode: 'novo', scope: 'org' })}
            style={{ height: 30, padding: '0 12px', border: '1px solid #0058db', borderRadius: 5, background: 'white', color: '#0058db', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}
          >
            + Adicionar
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 8px', borderBottom: '2px solid #1e2a3b', gap: 12 }}>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#1e2a3b', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Título</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e2a3b', fontFamily: 'Open Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', width: 80, textAlign: 'right' }}>Ações</span>
        </div>
        {orgModelos.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontFamily: 'Open Sans, sans-serif', fontSize: 13 }}>Nenhum modelo da organização.</div>
        ) : orgModelos.map(m => (
          <ModeloRow
            key={m.id} modelo={m}
            onEdit={() => setModal({ mode: 'edit', item: m, scope: 'org' })}
            onDelete={() => setDeleteTarget({ id: m.id, scope: 'org' })}
          />
        ))}
      </div>

      {modal && <ModeloModal mode={modal.mode} initial={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteTarget && <ConfirmDeleteModal onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
    </>
  );
}
