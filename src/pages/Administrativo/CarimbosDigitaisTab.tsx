import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Carimbo { id: number; nome: string; setor: string; imagemUrl: string | null }

/* ── mock ───────────────────────────────────────────────────────────── */
const SETORES = ['SADM - Secretaria de Administração', 'SPLJ - Secretaria de planejamento', 'DE - Diretoria executiva', 'CPL - CPL'];
const MOCK_CARIMBOS: Carimbo[] = [];

/* ── estilos ────────────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, padding: 24 };
const MODAL_BOX: React.CSSProperties = { background: 'white', borderRadius: 8, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' };
const MODAL_HEADER: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px', borderBottom: '1px solid #ebebeb', flexShrink: 0 };
const MODAL_FOOTER: React.CSSProperties = { flexShrink: 0, borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'flex-end', gap: 12 };
const BTN_CANCEL: React.CSSProperties = { height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6, background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' };
const BTN_PRIMARY = (ok = true): React.CSSProperties => ({ height: 38, padding: '0 24px', border: 'none', borderRadius: 6, background: ok ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'Open Sans, sans-serif' });
const INP: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6, padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333', outline: 'none', boxSizing: 'border-box' };
const LBL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5, fontFamily: 'Open Sans, sans-serif' };

/* ── CarimboModal ────────────────────────────────────────────────────── */
interface FormCarimbo { nome: string; setor: string; imagemUrl: string | null; imagemNome: string }

function CarimboModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: Carimbo;
  onSave: (d: FormCarimbo) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormCarimbo>({
    nome: initial?.nome ?? '',
    setor: initial?.setor ?? SETORES[0],
    imagemUrl: initial?.imagemUrl ?? null,
    imagemNome: '',
  });

  const canSave = !!form.nome.trim();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(p => ({ ...p, imagemUrl: url, imagemNome: file.name }));
  };

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo carimbo' : 'Editar carimbo'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={LBL}>Setor(es)</label>
              <SimpleSelect value={form.setor} onChange={v => setForm(p => ({ ...p, setor: v }))} options={SETORES} />
            </div>
          </div>
          <div>
            <label style={LBL}>Imagem<span style={{ color: '#b2132e' }}>*</span></label>
            {form.imagemUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #dce6f5', borderRadius: 6, background: '#f0f4fb' }}>
                <img src={form.imagemUrl} alt="carimbo" style={{ height: 48, objectFit: 'contain', maxWidth: 120, borderRadius: 4, border: '1px solid #dce6f5' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 600 }}>{form.imagemNome}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif' }}>Imagem carregada</p>
                </div>
                <button onClick={() => setForm(p => ({ ...p, imagemUrl: null, imagemNome: '' }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b2132e', fontSize: 14 }}>
                  <i className="fa-regular fa-trash" />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '28px 20px', border: '2px dashed #c5c5c5', borderRadius: 6, cursor: 'pointer', background: '#fafafa' }}>
                <i className="fa-regular fa-image" style={{ fontSize: 28, color: '#c5c5c5' }} />
                <span style={{ fontSize: 13, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif' }}>Clique para selecionar uma imagem</span>
                <span style={{ fontSize: 11, color: '#a3a3a3', fontFamily: 'Open Sans, sans-serif' }}>PNG, JPG ou SVG</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
              </label>
            )}
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
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir este carimbo?</p>
        </div>
        <div style={{ borderTop: '1px solid #ebebeb', padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_PRIMARY(), background: '#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── CarimbosDigitaisTab ─────────────────────────────────────────────── */
export default function CarimbosDigitaisTab() {
  const [carimbos, setCarimbos] = useState<Carimbo[]>(MOCK_CARIMBOS);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: Carimbo }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSave = (data: FormCarimbo) => {
    if (modal?.mode === 'novo') {
      setCarimbos(p => [...p, { id: Date.now(), nome: data.nome, setor: data.setor, imagemUrl: data.imagemUrl }]);
    } else if (modal?.item) {
      setCarimbos(p => p.map(c => c.id === modal.item!.id ? { ...c, nome: data.nome, setor: data.setor, imagemUrl: data.imagemUrl } : c));
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Carimbos digitais</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Cadastre carimbos digitais para uso em documentos e processos.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />Novo carimbo
        </button>
      </div>

      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 80px', background: '#1e2a3b', padding: '0 16px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['', 'Carimbo', 'Setor', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>
        {carimbos.length === 0 ? (
          <div style={{ padding: '56px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-stamp" style={{ fontSize: 40, color: '#c8c8c8', display: 'block', marginBottom: 12 }} />
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>Nenhum carimbo cadastrado</p>
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Clique em "Novo carimbo" para adicionar o primeiro.</p>
          </div>
        ) : carimbos.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 80px', padding: '8px 16px', alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            {c.imagemUrl ? (
              <img src={c.imagemUrl} alt={c.nome} style={{ height: 40, objectFit: 'contain', maxWidth: 64, borderRadius: 4, border: '1px solid #dce6f5' }} />
            ) : (
              <div style={{ width: 48, height: 40, background: '#f0f4fb', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dce6f5' }}>
                <i className="fa-regular fa-stamp" style={{ color: '#0058db', fontSize: 18 }} />
              </div>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{c.nome}</span>
            <span style={{ fontSize: 12, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{c.setor.split(' - ')[0]}</span>
            <div style={{ display: 'flex', gap: 5 }}>
              <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: c })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 12 }} /></button>
              <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(c.id)}><i className="fa-regular fa-trash" style={{ fontSize: 12 }} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && <CarimboModal mode={modal.mode} initial={modal.item} onSave={handleSave} onClose={() => setModal(null)} />}
      {deleteId !== null && <ConfirmDeleteModal onConfirm={() => { setCarimbos(p => p.filter(c => c.id !== deleteId)); setDeleteId(null); }} onClose={() => setDeleteId(null)} />}
    </>
  );
}
