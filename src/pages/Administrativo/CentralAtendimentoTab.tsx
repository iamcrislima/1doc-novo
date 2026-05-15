import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── estilos compartilhados ─────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, padding: 24 };
const M_BOX = (w = 560): React.CSSProperties => ({ background: 'white', borderRadius: 8, width: '100%', maxWidth: w, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' });
const M_HDR: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid #ebebeb', flexShrink: 0 };
const M_FTR: React.CSSProperties = { flexShrink: 0, borderTop: '1px solid #ebebeb', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10 };
const BTN_CANCEL: React.CSSProperties = { height: 38, padding: '0 24px', border: '1px solid #0058db', borderRadius: 6, background: 'white', color: '#0058db', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' };
const BTN_OK = (ok = true): React.CSSProperties => ({ height: 38, padding: '0 24px', border: 'none', borderRadius: 6, background: ok ? '#0058db' : '#a3a3a3', color: 'white', fontSize: 14, fontWeight: 600, cursor: ok ? 'pointer' : 'not-allowed', fontFamily: 'Open Sans, sans-serif' });
const INP: React.CSSProperties = { width: '100%', height: 40, border: '1px solid #c5c5c5', borderRadius: 6, padding: '0 10px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333', outline: 'none', boxSizing: 'border-box' };
const LBL: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 5, fontFamily: 'Open Sans, sans-serif' };
const TH: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' };

/* ── Toggle switch ──────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', background: value ? '#0058db' : '#c5c5c5', position: 'relative', transition: 'background 0.2s', padding: 0, flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: value ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
    </button>
  );
}

/* ── Icon picker ────────────────────────────────────────────────────── */
const FA_ICONS = [
  'fa-user','fa-users','fa-building','fa-house','fa-heart','fa-star','fa-shield','fa-book',
  'fa-graduation-cap','fa-briefcase','fa-hospital','fa-phone','fa-envelope','fa-map-location',
  'fa-globe','fa-clock','fa-bell','fa-lock','fa-key','fa-tree','fa-car','fa-bus','fa-bicycle',
  'fa-person-walking','fa-baby','fa-person-elderly','fa-id-card','fa-file','fa-folder',
  'fa-receipt','fa-landmark','fa-gavel','fa-scale-balanced','fa-hands-helping','fa-handshake',
  'fa-leaf','fa-water','fa-fire','fa-sun','fa-moon','fa-seedling','fa-recycle','fa-trash',
  'fa-wrench','fa-screwdriver','fa-hammer','fa-paint-roller','fa-truck','fa-plane',
];

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = FA_ICONS.filter(ic => search === '' || ic.includes(search.replace('fa-', '')));
  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 12 }} />
        <input style={{ ...INP, paddingLeft: 28 }} placeholder="Pesquise o ícone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, maxHeight: 200, overflowY: 'auto', border: '1px solid #ebebeb', borderRadius: 6, padding: 8, background: '#fafafa' }}>
        {filtered.map(ic => (
          <button key={ic} title={ic} onClick={() => onChange(ic)}
            style={{ width: '100%', aspectRatio: '1', border: value === ic ? '2px solid #0058db' : '1px solid #ebebeb', borderRadius: 6, background: value === ic ? '#edf2ff' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: value === ic ? '#0058db' : '#555' }}>
            <i className={`fa-regular ${ic}`} style={{ fontSize: 16 }} />
          </button>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#888', fontSize: 12, fontFamily: 'Open Sans, sans-serif' }}>Nenhum ícone encontrado.</div>}
      </div>
      {value && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className={`fa-regular ${value}`} style={{ fontSize: 18, color: '#0058db' }} />
          <span style={{ fontSize: 12, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{value}</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA: CONFIGURAÇÃO
══════════════════════════════════════════════════════════════════════ */
function SecaoConfig({ titulo, visivel, onToggle, children }: { titulo: string; visivel: boolean; onToggle: () => void; children?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #dde3ee', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#f8f9fc' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{titulo}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Visível?</span>
          <Toggle value={visivel} onChange={onToggle} />
        </div>
      </div>
      {children && <div style={{ padding: '16px 18px' }}>{children}</div>}
    </div>
  );
}

interface ConfigState {
  status: 'habilitada' | 'preview';
  sec1Visivel: boolean; sec1Tipo: 'destaque' | 'solicitados'; sec1Servicos: string[];
  sec2Visivel: boolean; sec2Nome: string; sec2Icones: boolean;
  sec3Visivel: boolean; sec3Nome: string; sec3Icones: boolean;
  sec4Visivel: boolean; sec4Nome: string; sec4OcultarSigla: boolean;
  authDoc: boolean; authCert: boolean; authGoogle: boolean;
}

export function ConfiguracaoTab() {
  const [cfg, setCfg] = useState<ConfigState>({
    status: 'habilitada',
    sec1Visivel: true, sec1Tipo: 'destaque', sec1Servicos: ['Isenção de IPTU'],
    sec2Visivel: true, sec2Nome: 'Categorias', sec2Icones: true,
    sec3Visivel: true, sec3Nome: 'Perfis', sec3Icones: true,
    sec4Visivel: true, sec4Nome: 'Órgãos Responsáveis', sec4OcultarSigla: false,
    authDoc: true, authCert: true, authGoogle: true,
  });

  const set = (k: keyof ConfigState, v: unknown) => setCfg(p => ({ ...p, [k]: v }));

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Configuração</p>
        <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Personalize o portal de atendimento ao cidadão: seções visíveis, nomenclaturas e autenticação.</p>
      </div>
      {/* Status */}
      <div style={{ border: '1px solid #dde3ee', borderRadius: 8, padding: '16px 18px', marginBottom: 16 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Status da nova central de atendimento</p>
        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
          {([['habilitada', 'Habilitada'], ['preview', 'Somente pré-visualização']] as const).map(([val, lbl]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="radio" checked={cfg.status === val} onChange={() => set('status', val)} /> {lbl}
            </label>
          ))}
        </div>
        <button style={{ height: 34, padding: '0 16px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fa-regular fa-eye" />Pré visualizar
        </button>
      </div>

      {/* Seção 01 */}
      <SecaoConfig titulo="Seção 01 - Serviços em evidência" visivel={cfg.sec1Visivel} onToggle={() => set('sec1Visivel', !cfg.sec1Visivel)}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
          {([['destaque', 'Serviços em Destaque'], ['solicitados', 'Serviços mais solicitados']] as const).map(([val, lbl]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
              <input type="radio" checked={cfg.sec1Tipo === val} onChange={() => set('sec1Tipo', val)} /> {lbl}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input style={{ ...INP, flex: 1 }} placeholder="Selecione o serviço para adicionar" />
          <button style={{ height: 38, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Adicionar</button>
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: '#7d7d7d', fontFamily: 'Open Sans, sans-serif' }}>Obs: Você pode facilmente reorganizar a ordem dos serviços simplesmente arrastando e soltando os componentes correspondentes!</p>
        {cfg.sec1Servicos.map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f0f4fb', borderRadius: 6, border: '1px solid #dce6f5', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{s}</span>
            <button onClick={() => set('sec1Servicos', cfg.sec1Servicos.filter(x => x !== s))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b2132e', fontSize: 14 }}>
              <i className="fa-regular fa-xmark" />
            </button>
          </div>
        ))}
      </SecaoConfig>

      {/* Seção 02 */}
      <SecaoConfig titulo="Seção 02 - Categorias" visivel={cfg.sec2Visivel} onToggle={() => set('sec2Visivel', !cfg.sec2Visivel)}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={LBL}>Nomenclatura desejada</label>
            <input style={INP} value={cfg.sec2Nome} onChange={e => set('sec2Nome', e.target.value)} />
          </div>
          <div>
            <label style={LBL}>Exibir Ícones?</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['Sim', 'Não'] as const).map(lbl => (
                <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                  <input type="radio" checked={cfg.sec2Icones === (lbl === 'Sim')} onChange={() => set('sec2Icones', lbl === 'Sim')} /> {lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SecaoConfig>

      {/* Seção 03 */}
      <SecaoConfig titulo="Seção 03 - Perfis" visivel={cfg.sec3Visivel} onToggle={() => set('sec3Visivel', !cfg.sec3Visivel)}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={LBL}>Nomenclatura desejada</label>
            <input style={INP} value={cfg.sec3Nome} onChange={e => set('sec3Nome', e.target.value)} />
          </div>
          <div>
            <label style={LBL}>Exibir Ícones?</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['Sim', 'Não'] as const).map(lbl => (
                <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                  <input type="radio" checked={cfg.sec3Icones === (lbl === 'Sim')} onChange={() => set('sec3Icones', lbl === 'Sim')} /> {lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SecaoConfig>

      {/* Seção 04 */}
      <SecaoConfig titulo="Seção 04 - Órgãos Responsáveis" visivel={cfg.sec4Visivel} onToggle={() => set('sec4Visivel', !cfg.sec4Visivel)}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={LBL}>Nomenclatura desejada</label>
            <input style={INP} value={cfg.sec4Nome} onChange={e => set('sec4Nome', e.target.value)} />
          </div>
          <div>
            <label style={LBL}>Ocultar sigla?</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {(['Sim', 'Não'] as const).map(lbl => (
                <label key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                  <input type="radio" checked={cfg.sec4OcultarSigla === (lbl === 'Sim')} onChange={() => set('sec4OcultarSigla', lbl === 'Sim')} /> {lbl}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SecaoConfig>

      {/* Autenticação */}
      <div style={{ border: '1px solid #dde3ee', borderRadius: 8, padding: '16px 18px', marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Autenticação</p>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Selecione quais opções de autenticação estarão disponíveis:</p>
        {[['authDoc', 'Login 1Doc'], ['authCert', 'Login Certificado Digital'], ['authGoogle', 'Login Google']] .map(([k, lbl]) => (
          <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif', marginBottom: 6 }}>
            <input type="checkbox" checked={cfg[k as keyof ConfigState] as boolean} onChange={e => set(k as keyof ConfigState, e.target.checked)} /> {lbl}
          </label>
        ))}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={{ height: 38, padding: '0 20px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>
          Salvar configurações
        </button>
        <button style={{ height: 38, padding: '0 20px', border: '1px solid #c5c5c5', borderRadius: 6, background: 'white', color: '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>
          Restaurar para padrão 1Doc
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA: SERVIÇOS
══════════════════════════════════════════════════════════════════════ */
interface Servico { id: number; nome: string; categoria: string; perfil: string; orgao: string; tipo: 'Digital' | 'Presencial'; descricoes: { topico: string; conteudo: string }[] }

const DESCRICOES_DEFAULT = [
  { topico: 'O que é?', conteudo: '' },
  { topico: 'Quem pode solicitar?', conteudo: '' },
  { topico: 'Etapas para realização', conteudo: '' },
  { topico: 'O que preciso para solicitar este serviço?', conteudo: '' },
  { topico: 'Outras informações', conteudo: '' },
];
const MOCK_SERVICOS: Servico[] = [
  { id: 1, nome: 'Isenção de IPTU', categoria: 'Saúde', perfil: 'Saúde', orgao: '', tipo: 'Digital', descricoes: DESCRICOES_DEFAULT },
];

function ServicoModal({ mode, initial, onSave, onClose }: {
  mode: 'novo' | 'edit'; initial?: Servico;
  onSave: (s: Servico) => void; onClose: () => void;
}) {
  const [tipoExterno, setTipoExterno] = useState(false);
  const [form, setForm] = useState({ nome: initial?.nome ?? '', tipo: initial?.tipo ?? 'Digital' as 'Digital'|'Presencial', categoria: initial?.categoria ?? '', perfil: initial?.perfil ?? '', orgao: initial?.orgao ?? '', descricoes: initial?.descricoes ?? [...DESCRICOES_DEFAULT] });
  const canSave = !!form.nome.trim();

  const updateDescricao = (i: number, k: 'topico'|'conteudo', v: string) => {
    setForm(p => { const d = [...p.descricoes]; d[i] = { ...d[i], [k]: v }; return { ...p, descricoes: d }; });
  };

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={M_BOX(680)}>
        <div style={M_HDR}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo Serviço' : 'Editar Serviço'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px' }}>
          {/* Tipo externo/1doc */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            {[['1Doc', false], ['Externos', true]].map(([lbl, val]) => (
              <label key={String(lbl)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                <input type="radio" checked={tipoExterno === val} onChange={() => setTipoExterno(val as boolean)} /> Serviços {lbl}
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: '2 1 200px' }}>
              <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label style={LBL}>Tipo<span style={{ color: '#b2132e' }}>*</span></label>
              <div style={{ display: 'flex', gap: 12 }}>
                {(['Digital', 'Presencial'] as const).map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif', height: 38 }}>
                    <input type="radio" checked={form.tipo === t} onChange={() => setForm(p => ({ ...p, tipo: t }))} /> {t}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label style={LBL}>Categoria</label>
              <input style={INP} value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label style={LBL}>Perfil</label>
              <input style={INP} value={form.perfil} onChange={e => setForm(p => ({ ...p, perfil: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 180px' }}>
              <label style={LBL}>Órgão Responsável</label>
              <input style={INP} value={form.orgao} onChange={e => setForm(p => ({ ...p, orgao: e.target.value }))} />
            </div>
          </div>
          {/* Descrições */}
          <div style={{ border: '1px solid #dde3ee', borderRadius: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #ebebeb', background: '#f8f9fc' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Descrições</span>
              <i className="fa-regular fa-angle-down" style={{ color: '#555' }} />
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.descricoes.map((d, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 8, alignItems: 'start' }}>
                  <div>
                    <label style={LBL}>Tópico<span style={{ color: '#b2132e' }}>*</span></label>
                    <input style={INP} value={d.topico} onChange={e => updateDescricao(i, 'topico', e.target.value)} />
                  </div>
                  <div>
                    <label style={LBL}>Conteúdo</label>
                    <input style={INP} value={d.conteudo} onChange={e => updateDescricao(i, 'conteudo', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 20 }}>
                    <button style={{ height: 28, fontSize: 11, fontWeight: 600, border: '1px solid #0058db', borderRadius: 4, background: 'white', color: '#0058db', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Editar</button>
                    <button onClick={() => setForm(p => ({ ...p, descricoes: p.descricoes.filter((_, j) => j !== i) }))}
                      style={{ height: 28, fontSize: 11, fontWeight: 600, border: '1px solid #b2132e', borderRadius: 4, background: 'white', color: '#b2132e', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Remover</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setForm(p => ({ ...p, descricoes: [...p.descricoes, { topico: '', conteudo: '' }] }))}
                style={{ height: 34, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', width: 'fit-content' }}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
        <div style={M_FTR}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => canSave && onSave({ id: initial?.id ?? Date.now(), ...form })} disabled={!canSave} style={BTN_OK(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export function ServicosTab() {
  const [servicos, setServicos] = useState<Servico[]>(MOCK_SERVICOS);
  const [modal, setModal] = useState<null | { mode: 'novo'|'edit'; item?: Servico }>(null);
  const [busca, setBusca] = useState('');

  const filtrados = servicos.filter(s => busca === '' || s.nome.toLowerCase().includes(busca.toLowerCase()));

  const badge = (txt: string, color: string) => (
    <span style={{ background: color + '22', color, borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600, fontFamily: 'Open Sans, sans-serif' }}>{txt}</span>
  );

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({ width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5, background: `${color}10`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Serviços</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Gerencie os serviços disponibilizados no portal de atendimento ao cidadão.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 11 }} />Novo Serviço
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input style={{ ...INP, paddingLeft: 30 }} placeholder="Buscar serviço" value={busca} onChange={e => setBusca(e.target.value)} />
          <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 12 }} />
        </div>
        <button style={{ height: 34, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Buscar</button>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 100px 100px 100px 80px 90px', background: '#1e2a3b', padding: '0 12px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['', 'Nome', 'Categoria', 'Perfil', 'Órgão', 'Tipo', 'Ações'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>
        {filtrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhum serviço cadastrado.</p>
          </div>
        ) : filtrados.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 100px 100px 100px 80px 90px', padding: '0 12px', height: 44, alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <input type="checkbox" />
            <span style={{ fontSize: 12, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 500 }}>{s.nome}</span>
            <div>{s.categoria && badge(s.categoria, '#0058db')}</div>
            <div>{s.perfil && badge(s.perfil, '#0f6b3e')}</div>
            <span style={{ fontSize: 12, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{s.orgao || '-'}</span>
            <div>{badge(s.tipo, s.tipo === 'Digital' ? '#7c3aed' : '#c2570c')}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={actionBtn()} onClick={() => setModal({ mode: 'edit', item: s })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 11 }} /></button>
              <button style={actionBtn('#b2132e')} onClick={() => setServicos(p => p.filter(x => x.id !== s.id))}><i className="fa-regular fa-trash" style={{ fontSize: 11 }} /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && <ServicoModal mode={modal.mode} initial={modal.item} onSave={s => { modal.mode === 'novo' ? setServicos(p => [...p, s]) : setServicos(p => p.map(x => x.id === s.id ? s : x)); setModal(null); }} onClose={() => setModal(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA GENÉRICA: Categorias / Perfis (mesmo layout)
══════════════════════════════════════════════════════════════════════ */
interface CatPerfil { id: number; nome: string; icone: string }

const MOCK_CATS: CatPerfil[] = [{ id: 1, nome: 'Cidadão', icone: 'fa-user' }, { id: 2, nome: 'Servidor', icone: 'fa-building' }];
const MOCK_PERFIS: CatPerfil[] = [{ id: 1, nome: 'Cidadão', icone: 'fa-user' }, { id: 2, nome: 'Servidor', icone: 'fa-id-card' }];

function CatPerfilModal({ titulo, initial, onSave, onClose }: { titulo: string; initial?: CatPerfil; onSave: (d: CatPerfil) => void; onClose: () => void }) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [icone, setIcone] = useState(initial?.icone ?? '');
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={M_BOX(480)}>
        <div style={M_HDR}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{titulo}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label style={LBL}>Ícone</label>
            <IconPicker value={icone} onChange={setIcone} />
          </div>
        </div>
        <div style={M_FTR}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => nome.trim() && onSave({ id: initial?.id ?? Date.now(), nome, icone })} disabled={!nome.trim()} style={BTN_OK(!!nome.trim())}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function CatPerfilTab({ titulo, initial }: { titulo: string; initial: CatPerfil[] }) {
  const [items, setItems] = useState<CatPerfil[]>(initial);
  const [modal, setModal] = useState<null | { mode: 'novo'|'edit'; item?: CatPerfil }>(null);
  const [busca, setBusca] = useState('');
  const filtrados = items.filter(i => busca === '' || i.nome.toLowerCase().includes(busca.toLowerCase()));
  const actionBtn = (color = '#0058db'): React.CSSProperties => ({ width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5, background: `${color}10`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color });
  const subtitulos: Record<string, string> = {
    'Categoria': 'Organize os serviços em categorias para facilitar a navegação dos cidadãos.',
    'Perfil':    'Crie perfis de acesso para segmentar os serviços disponíveis na central.',
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{titulo}s</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>{subtitulos[titulo] ?? `Gerencie ${titulo.toLowerCase()}s da central de atendimento.`}</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 11 }} />Novo {titulo}
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input style={{ ...INP, paddingLeft: 30 }} placeholder={`Buscar ${titulo.toLowerCase()}`} value={busca} onChange={e => setBusca(e.target.value)} />
          <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 12 }} />
        </div>
        <button style={{ height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Buscar</button>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', background: '#1e2a3b', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['Nome', 'Ícone', 'Ações'].map(h => <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>)}
        </div>
        {filtrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhum item cadastrado.</p>
          </div>
        ) : filtrados.map((item, i) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 500 }}>{item.nome}</span>
            <div><i className={`fa-regular ${item.icone}`} style={{ fontSize: 18, color: '#555' }} /></div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={actionBtn()} onClick={() => setModal({ mode: 'edit', item })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 11 }} /></button>
              <button style={actionBtn('#b2132e')} onClick={() => setItems(p => p.filter(x => x.id !== item.id))}><i className="fa-regular fa-trash" style={{ fontSize: 11 }} /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <CatPerfilModal
          titulo={modal.mode === 'novo' ? `Novo ${titulo}` : `Editar ${titulo}`}
          initial={modal.item}
          onSave={d => { modal.mode === 'novo' ? setItems(p => [...p, d]) : setItems(p => p.map(x => x.id === d.id ? d : x)); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA: ÓRGÃOS RESPONSÁVEIS
══════════════════════════════════════════════════════════════════════ */
interface Orgao { id: number; nome: string; sigla: string; setor: string }
const SETORES_MOCK = ['SADM - Secretaria de Administração', 'SPLJ - Secretaria de planejamento', 'DE - Diretoria executiva'];

function OrgaoModal({ initial, onSave, onClose }: { initial?: Orgao; onSave: (d: Orgao) => void; onClose: () => void }) {
  const [form, setForm] = useState({ setor: initial?.setor ?? SETORES_MOCK[0], nome: initial?.nome ?? '', sigla: initial?.sigla ?? '' });
  const canSave = !!form.nome.trim() && !!form.sigla.trim();
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={M_BOX(480)}>
        <div style={M_HDR}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{initial ? 'Editar Órgão' : 'Novo Órgão Responsável'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={LBL}>Setor<span style={{ color: '#b2132e' }}>*</span></label>
            <SimpleSelect value={form.setor} onChange={v => setForm(p => ({ ...p, setor: v }))} options={SETORES_MOCK} />
          </div>
          <div>
            <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
          </div>
          <div>
            <label style={LBL}>Sigla<span style={{ color: '#b2132e' }}>*</span></label>
            <input style={INP} value={form.sigla} onChange={e => setForm(p => ({ ...p, sigla: e.target.value }))} />
          </div>
        </div>
        <div style={M_FTR}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => canSave && onSave({ id: initial?.id ?? Date.now(), ...form })} disabled={!canSave} style={BTN_OK(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export function OrgaosTab() {
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [modal, setModal] = useState<null | { mode: 'novo'|'edit'; item?: Orgao }>(null);
  const [busca, setBusca] = useState('');
  const filtrados = orgaos.filter(o => busca === '' || o.nome.toLowerCase().includes(busca.toLowerCase()));
  const actionBtn = (color = '#0058db'): React.CSSProperties => ({ width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5, background: `${color}10`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color });
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Órgãos Responsáveis</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Cadastre os órgãos que respondem pelos serviços da central de atendimento.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 11 }} />Novo Órgão Responsável
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button onClick={() => setModal({ mode: 'novo' })} style={{ display: 'none' }}></button>
        <div style={{ flex: 1, position: 'relative' }}>
          <input style={{ ...INP, paddingLeft: 30 }} placeholder="Busca Órgão Responsável" value={busca} onChange={e => setBusca(e.target.value)} />
          <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 12 }} />
        </div>
        <button style={{ height: 34, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Buscar</button>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px', background: '#1e2a3b', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['Nome', 'Sigla', 'Setor', 'Ações'].map(h => <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>)}
        </div>
        {filtrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-building-columns" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhum órgão cadastrado.</p>
          </div>
        ) : filtrados.map((o, i) => (
          <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr 80px', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 500 }}>{o.nome}</span>
            <span style={{ fontSize: 12, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{o.sigla}</span>
            <span style={{ fontSize: 12, color: '#555', fontFamily: 'Open Sans, sans-serif' }}>{o.setor.split(' - ')[0]}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={actionBtn()} onClick={() => setModal({ mode: 'edit', item: o })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 11 }} /></button>
              <button style={actionBtn('#b2132e')} onClick={() => setOrgaos(p => p.filter(x => x.id !== o.id))}><i className="fa-regular fa-trash" style={{ fontSize: 11 }} /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && <OrgaoModal initial={modal.item} onSave={d => { modal.mode === 'novo' ? setOrgaos(p => [...p, d]) : setOrgaos(p => p.map(x => x.id === d.id ? d : x)); setModal(null); }} onClose={() => setModal(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA: SISTEMAS INTEGRADOS
══════════════════════════════════════════════════════════════════════ */
const JWT_CAMPOS = ['CpfCnpj', 'Email', 'Nome', 'Razão Social', 'Tipo Pessoa', 'Data Nascimento', 'Ip', 'user-agent', 'token_pessoa', 'token_usuario'];
interface Sistema { id: number; nome: string; chave: string; campos: string[] }

function SistemaModal({ initial, onSave, onClose }: { initial?: Sistema; onSave: (d: Sistema) => void; onClose: () => void }) {
  const [form, setForm] = useState({ nome: initial?.nome ?? '', chave: initial?.chave ?? '', campos: initial?.campos ?? [...JWT_CAMPOS] });
  const [showChave, setShowChave] = useState(false);
  const canSave = !!form.nome.trim() && !!form.chave.trim();
  const toggleCampo = (c: string) => setForm(p => ({ ...p, campos: p.campos.includes(c) ? p.campos.filter(x => x !== c) : [...p.campos, c] }));
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={M_BOX(540)}>
        <div style={M_HDR}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>{initial ? 'Editar Sistema' : 'Novo Sistema Integrado'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={LBL}>Nome<span style={{ color: '#b2132e' }}>*</span></label>
              <input style={INP} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={LBL}>Chave Secreta JWT<span style={{ color: '#b2132e' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...INP, paddingRight: 36 }} type={showChave ? 'text' : 'password'} placeholder="Chave Privada JWT" value={form.chave} onChange={e => setForm(p => ({ ...p, chave: e.target.value }))} />
                <button type="button" onClick={() => setShowChave(v => !v)}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                  <i className={`fa-regular ${showChave ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label style={LBL}>Incluir no JWT</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {JWT_CAMPOS.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#333', fontFamily: 'Open Sans, sans-serif' }}>
                  <input type="checkbox" checked={form.campos.includes(c)} onChange={() => toggleCampo(c)} /> {c}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div style={M_FTR}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => canSave && onSave({ id: initial?.id ?? Date.now(), ...form })} disabled={!canSave} style={BTN_OK(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export function SistemasTab() {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [modal, setModal] = useState<null | { mode: 'novo'|'edit'; item?: Sistema }>(null);
  const [busca, setBusca] = useState('');
  const filtrados = sistemas.filter(s => busca === '' || s.nome.toLowerCase().includes(busca.toLowerCase()));
  const actionBtn = (color = '#0058db'): React.CSSProperties => ({ width: 32, height: 32, border: `1px solid ${color}30`, borderRadius: 5, background: `${color}10`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color });
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Sistemas Integrados</p>
          <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Configure as integrações com sistemas externos que alimentam a central de atendimento.</p>
        </div>
        <button onClick={() => setModal({ mode: 'novo' })}
          style={{ flexShrink: 0, height: 36, padding: '0 14px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fa-regular fa-plus" style={{ fontSize: 11 }} />Novo Sistema Integrado
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input style={{ ...INP, paddingLeft: 30 }} placeholder="Busca serviço" value={busca} onChange={e => setBusca(e.target.value)} />
          <i className="fa-regular fa-magnifying-glass" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 12 }} />
        </div>
        <button style={{ height: 34, padding: '0 14px', border: 'none', borderRadius: 6, background: '#1e2a3b', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>Buscar</button>
      </div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', background: '#1e2a3b', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderRadius: '6px 6px 0 0' }}>
          {['Nome', 'Ações'].map(h => <span key={h} style={{ fontSize: 13, fontWeight: 600, color: 'white', fontFamily: 'Open Sans, sans-serif' }}>{h}</span>)}
        </div>
        {filtrados.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            <i className="fa-regular fa-plug" style={{ fontSize: 36, color: '#c8c8c8', display: 'block', marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 13, color: '#888', fontFamily: 'Open Sans, sans-serif' }}>Nenhum sistema integrado cadastrado.</p>
          </div>
        ) : filtrados.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', padding: '0 14px', height: 44, alignItems: 'center', gap: 8, borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
            <span style={{ fontSize: 13, color: '#222', fontFamily: 'Open Sans, sans-serif', fontWeight: 500 }}>{s.nome}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button style={actionBtn()} onClick={() => setModal({ mode: 'edit', item: s })}><i className="fa-regular fa-pen-to-square" style={{ fontSize: 11 }} /></button>
              <button style={actionBtn('#b2132e')} onClick={() => setSistemas(p => p.filter(x => x.id !== s.id))}><i className="fa-regular fa-trash" style={{ fontSize: 11 }} /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && <SistemaModal initial={modal.item} onSave={d => { modal.mode === 'novo' ? setSistemas(p => [...p, d]) : setSistemas(p => p.map(x => x.id === d.id ? d : x)); setModal(null); }} onClose={() => setModal(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABA: POLÍTICA DE PRIVACIDADE
══════════════════════════════════════════════════════════════════════ */
export function PoliticaTab() {
  const [texto, setTexto] = useState('');
  const TOOLBAR = ['fa-bold','fa-italic','fa-underline','fa-list-ul','fa-list-ol','fa-align-left','fa-align-center','fa-align-right','fa-link'];
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'Open Sans, sans-serif' }}>Política de Privacidade</p>
        <p style={{ margin: 0, fontSize: 13, color: '#565656', fontFamily: 'Open Sans, sans-serif' }}>Configure o texto da política de privacidade exibida na central de atendimento ao cidadão.</p>
      </div>
      <div style={{ border: '1px solid #c5c5c5', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 2, padding: '6px 8px', borderBottom: '1px solid #ebebeb', background: '#fafafa' }}>
          {TOOLBAR.map(b => (
            <button key={b} type="button"
              style={{ width: 30, height: 28, border: '1px solid transparent', borderRadius: 4, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
              <i className={`fa-regular ${b}`} style={{ fontSize: 13 }} />
            </button>
          ))}
        </div>
        <textarea value={texto} onChange={e => setTexto(e.target.value)}
          placeholder="Digite a política de privacidade..."
          style={{ width: '100%', minHeight: 280, border: 'none', outline: 'none', padding: '12px', fontSize: 14, fontFamily: 'Open Sans, sans-serif', color: '#333', resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      <button style={{ height: 38, padding: '0 20px', border: 'none', borderRadius: 6, background: '#0058db', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Open Sans, sans-serif' }}>
        Salvar política
      </button>
    </div>
  );
}

export function CategoriasTab() {
  return <CatPerfilTab titulo="Categoria" initial={MOCK_CATS} />;
}

export function PerfisTab() {
  return <CatPerfilTab titulo="Perfil" initial={MOCK_PERFIS} />;
}

export default {};
