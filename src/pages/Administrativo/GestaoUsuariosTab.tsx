import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  setorPrincipal: string;
  outrosSetores: string[];
  podeRelatorios: boolean;
}

/* ── mock ───────────────────────────────────────────────────────────── */
const SETORES_MOCK = [
  'SADM - Secretaria de Administração',
  'SPLJ - Secretaria de planejamento',
  'DE - Diretoria executiva',
  'CPL - CPL',
  'COPIRN - COPIRN',
  'AJ - Assessoria jurídica',
  'COF - Coord. de Orçamento e Finanças',
];

const NIVEIS = ['Administrador', 'Operador', 'Visualizador', 'Auditor'];

const MOCK_USUARIOS: Usuario[] = [
  { id: 1, nome: 'Cris Lima',            email: 'crislima@1doc.com.br',      nivel: 'Administrador', setorPrincipal: SETORES_MOCK[0], outrosSetores: [SETORES_MOCK[1], SETORES_MOCK[2], SETORES_MOCK[3]], podeRelatorios: true  },
  { id: 2, nome: 'Moacir Silva',         email: 'moacir@1doc.com.br',        nivel: 'Administrador', setorPrincipal: SETORES_MOCK[0], outrosSetores: [SETORES_MOCK[1], SETORES_MOCK[2], SETORES_MOCK[3]], podeRelatorios: false },
  { id: 3, nome: 'Marcelle Licht',       email: 'marcellea@1doc.com.br',     nivel: 'Administrador', setorPrincipal: SETORES_MOCK[0], outrosSetores: [SETORES_MOCK[1], SETORES_MOCK[2]], podeRelatorios: false },
  { id: 4, nome: 'Inácio Steffen',       email: 'inacio@1doc.com.br',        nivel: 'Administrador', setorPrincipal: SETORES_MOCK[1], outrosSetores: [SETORES_MOCK[0], SETORES_MOCK[2]], podeRelatorios: false },
  { id: 5, nome: 'Samantha Silva',       email: 'samantha@1doc.com.br',      nivel: 'Administrador', setorPrincipal: SETORES_MOCK[1], outrosSetores: [SETORES_MOCK[0], SETORES_MOCK[2]], podeRelatorios: false },
  { id: 6, nome: 'Roberval Amarantes',   email: 'robervala@1doc.com.br',     nivel: 'Administrador', setorPrincipal: SETORES_MOCK[2], outrosSetores: [SETORES_MOCK[0], SETORES_MOCK[3]], podeRelatorios: false },
];
const PER_PAGE = 10;

/* ── estilos compartilhados ─────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 900, padding: 24,
};
const MODAL_BOX: React.CSSProperties = {
  background: 'white', borderRadius: 8, width: '100%', maxWidth: 560,
  maxHeight: '92vh', display: 'flex', flexDirection: 'column',
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

/* ── getInitials ────────────────────────────────────────────────────── */
function getInitials(nome: string) {
  const parts = nome.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = ['#0058db', '#0f6b3e', '#b2132e', '#7c3aed', '#c2570c', '#0891b2'];
function avatarColor(id: number) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

/* ── UsuarioModal ───────────────────────────────────────────────────── */
interface FormUsuario {
  nome: string; email: string; senha: string; confirmaSenha: string;
  nivel: string; setorPrincipal: string; outrosSetores: string[]; podeRelatorios: boolean;
}

function UsuarioModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit';
  initial?: Usuario;
  onSave: (d: FormUsuario) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormUsuario>({
    nome: initial?.nome ?? '',
    email: initial?.email ?? '',
    senha: '',
    confirmaSenha: '',
    nivel: initial?.nivel ?? NIVEIS[0],
    setorPrincipal: initial?.setorPrincipal ?? SETORES_MOCK[0],
    outrosSetores: initial?.outrosSetores ?? [],
    podeRelatorios: initial?.podeRelatorios ?? false,
  });
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [setorBusca, setSetorBusca] = useState('');
  const [showSetorDrop, setShowSetorDrop] = useState(false);

  const senhaError = form.confirmaSenha && form.senha !== form.confirmaSenha;
  const canSave = !!form.nome.trim() && !!form.email.trim()
    && (mode === 'edit' || (!!form.senha && !senhaError));

  const setoresDisponiveis = SETORES_MOCK.filter(s =>
    s !== form.setorPrincipal &&
    !form.outrosSetores.includes(s) &&
    (setorBusca === '' || s.toLowerCase().includes(setorBusca.toLowerCase()))
  );

  const addSetor = (s: string) => {
    setForm(p => ({ ...p, outrosSetores: [...p.outrosSetores, s] }));
    setSetorBusca('');
    setShowSetorDrop(false);
  };
  const removeSetor = (s: string) => setForm(p => ({ ...p, outrosSetores: p.outrosSetores.filter(x => x !== s) }));

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_BOX}>
        <div style={MODAL_HEADER}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo Usuário' : 'Editar Usuário'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>

            {/* Nome */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>Nome do usuário<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>

            {/* E-mail */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>E-mail<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            {/* Senha */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>
                Senha{mode === 'novo' && <span style={{ color: '#b2132e' }}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...INP, paddingRight: 36 }}
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.senha}
                  onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                  placeholder={mode === 'edit' ? 'Deixe em branco para manter' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                >
                  <i className={`fa-regular ${showSenha ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {mode === 'novo' && <span style={{ fontSize: 11, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif' }}>Mínimo de 8 caracteres</span>}
            </div>

            {/* Confirmação de senha */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>
                Confirmação de senha{mode === 'novo' && <span style={{ color: '#b2132e' }}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...INP, paddingRight: 36, border: senhaError ? '1.5px solid #b2132e' : INP.border as string }}
                  type={showConfirma ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmaSenha}
                  onChange={e => setForm(p => ({ ...p, confirmaSenha: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirma(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: senhaError ? '#b2132e' : '#888' }}
                >
                  <i className={`fa-regular ${showConfirma ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {senhaError && (
                <span style={{ fontSize: 11, color: '#b2132e', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <i className="fa-regular fa-circle-exclamation" /> As senhas não coincidem
                </span>
              )}
            </div>

            {/* Nível de acesso */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>Nível de acesso<span style={{ color: '#b2132e' }}>*</span></label>
              <SimpleSelect value={form.nivel} onChange={v => setForm(p => ({ ...p, nivel: v }))} options={NIVEIS} />
            </div>

            {/* Setor Principal */}
            <div style={{ flex: '1 1 200px' }}>
              <label style={LBL}>Setor Principal<span style={{ color: '#b2132e' }}>*</span></label>
              <SimpleSelect value={form.setorPrincipal} onChange={v => setForm(p => ({ ...p, setorPrincipal: v }))} options={SETORES_MOCK} />
            </div>

            {/* Outros setores */}
            <div style={{ width: '100%' }}>
              <label style={LBL}>Outros setores</label>
              {/* Dropdown busca */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    style={INP}
                    placeholder="Buscar e adicionar setor..."
                    value={setorBusca}
                    onChange={e => { setSetorBusca(e.target.value); setShowSetorDrop(true); }}
                    onFocus={() => setShowSetorDrop(true)}
                    onBlur={() => setTimeout(() => setShowSetorDrop(false), 150)}
                  />
                  <i className="fa-regular fa-angle-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }} />
                </div>
                {showSetorDrop && setoresDisponiveis.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #c5c5c5', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 10, maxHeight: 180, overflowY: 'auto' }}>
                    {setoresDisponiveis.map(s => (
                      <button
                        key={s}
                        onMouseDown={() => addSetor(s)}
                        style={{ width: '100%', textAlign: 'left', padding: '9px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chips */}
              {form.outrosSetores.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.outrosSetores.map(s => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4fb', border: '1px solid #dce6f5', borderRadius: 4, padding: '4px 8px', fontSize: 12, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
                      {s.length > 30 ? s.slice(0, 30) + '…' : s}
                      <button onClick={() => removeSetor(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: 0, display: 'flex', alignItems: 'center' }}>
                        <i className="fa-regular fa-xmark" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Relatórios */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="checkbox" checked={form.podeRelatorios} onChange={e => setForm(p => ({ ...p, podeRelatorios: e.target.checked }))} />
              Pode visualizar relatórios, estatísticas gerais e mapa
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
          <p style={{ margin: 0, fontSize: 14, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Tem certeza de que deseja excluir este usuário?</p>
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

/* ── GestaoUsuariosTab ──────────────────────────────────────────────── */
export default function GestaoUsuariosTab() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<null | { mode: 'novo' | 'edit'; item?: Usuario }>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtrados = usuarios.filter(u =>
    busca === '' || u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase())
  );
  const paginated = filtrados.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (data: FormUsuario) => {
    if (modal?.mode === 'novo') {
      setUsuarios(p => [...p, {
        id: Date.now(),
        nome: data.nome,
        email: data.email,
        nivel: data.nivel,
        setorPrincipal: data.setorPrincipal,
        outrosSetores: data.outrosSetores,
        podeRelatorios: data.podeRelatorios,
      }]);
    } else if (modal?.item) {
      setUsuarios(p => p.map(u => u.id === modal.item!.id
        ? { ...u, nome: data.nome, email: data.email, nivel: data.nivel, setorPrincipal: data.setorPrincipal, outrosSetores: data.outrosSetores, podeRelatorios: data.podeRelatorios }
        : u));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setUsuarios(p => p.filter(u => u.id !== deleteId));
    setDeleteId(null);
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width: 32, height: 32, border: `1.5px solid ${color}20`, borderRadius: 6,
    background: `${color}10`, cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', color,
  });

  return (
    <>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            Gestão de usuários
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>
            Cadastre, edite e gerencie contas de usuários da plataforma.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Open Sans, sans-serif' }}
        >
          <i className="fa-regular fa-plus" style={{ fontSize: 12 }} />
          Novo usuário
        </button>
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 14 }} />
        <input
          style={{ width: '100%', height: 36, border: '1px solid #c5c5c5', borderRadius: 6, paddingLeft: 32, paddingRight: 10, fontSize: 13, fontFamily: 'Open Sans, sans-serif', boxSizing: 'border-box', color: '#333', outline: 'none' }}
          placeholder="Buscar usuário"
          value={busca}
          onChange={e => { setBusca(e.target.value); setPage(1); }}
        />
      </div>

      {/* Tabela */}
      <div>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '56px 1fr 220px 100px',
          background: '#1e2a3b', padding: '0 16px', height: 44,
          alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0',
        }}>
          {['ID', 'Usuário', 'Função', 'Ação'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-users" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhum usuário encontrado.</p>
          </div>
        ) : paginated.map((u, i) => (
          <div
            key={u.id}
            style={{
              display: 'grid', gridTemplateColumns: '56px 1fr 220px 100px',
              padding: '10px 16px', alignItems: 'center', gap: 8,
              borderBottom: '1px solid #f0f0f0',
              background: i % 2 === 0 ? 'white' : '#fafafa',
            }}
          >
            {/* ID */}
            <span style={{ fontSize: 13, color: '#555', fontFamily: 'Open Sans, sans-serif', fontWeight: 600 }}>
              {String(u.id).padStart(4, '0')}
            </span>

            {/* Usuário */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: avatarColor(u.id), color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                fontFamily: 'Open Sans, sans-serif',
              }}>
                {getInitials(u.nome)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{u.nome}</div>
                <div style={{ fontSize: 12, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif', marginBottom: 4 }}>{u.email}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[u.setorPrincipal, ...u.outrosSetores].slice(0, 4).map(s => (
                    <span key={s} style={{ background: '#0058db', color: 'white', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontFamily: 'Open Sans, sans-serif', fontWeight: 600 }}>
                      {s.split(' - ')[0]}
                    </span>
                  ))}
                  {[u.setorPrincipal, ...u.outrosSetores].length > 4 && (
                    <span style={{ background: '#ebebeb', color: '#555', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontFamily: 'Open Sans, sans-serif' }}>
                      +{[u.setorPrincipal, ...u.outrosSetores].length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Função */}
            <span style={{ fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>{u.nivel}</span>

            {/* Ação */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode: 'edit', item: u })}>
                <i className="fa-regular fa-pen-to-square" style={{ fontSize: 13 }} />
              </button>
              <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteId(u.id)}>
                <i className="fa-regular fa-trash" style={{ fontSize: 13 }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} total={filtrados.length} perPage={PER_PAGE} onChange={setPage} />

      {modal && (
        <UsuarioModal
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
