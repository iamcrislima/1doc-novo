import { useState } from 'react';
import { SimpleSelect } from '../../modules/novo-documento/components/SimpleSelect';

/* ── tipos ──────────────────────────────────────────────────────────── */
interface Assunto {
  id: number; nome: string; sigla: string; categoria: string;
  parentId: number | null; servico: string; icone: string;
  status: 'ativo' | 'suspenso';
  assuntoMaisUsado: boolean; aceitaMapa: boolean;
  naoExibirCA: boolean; requerAssinatura: boolean;
  requerAnexo: boolean; ocultaConteudo: boolean; somentLoginVerificado: boolean;
  codigoAssunto: string; idExterno: string; jsonAtores: string;
  gidPlanilha: string; dataLimiteCriacao: string; diasLembrete: string;
  coordenadas: string; descricao: string; modeloInicial: string;
  setoresReceber: string[];
  direcAuto: string;
}

/* ── constantes ─────────────────────────────────────────────────────── */
const CATEGORIAS = [
  'Geral', 'Ouvidorias', 'Protocolos', 'Proc. Administrativos',
  'Análises de Projetos', 'Atos oficiais', 'Intimações', 'Pareceres',
  'Alvarás', 'Processos Judiciais', 'Documentos GOVBR', 'Fiscalizações',
  'Chamados', 'Matérias Legislativas', 'Sessões Plenárias', 'Selo de Aprovação',
];
const SETORES_MOCK = [
  'SADM - Secretaria de Administração', 'SPLJ - Secretaria de Planejamento',
  'DE - Diretoria Executiva', 'CPL - Comissão de Licitação',
  'SAUD - Secretaria de Saúde', 'EDUC - Secretaria de Educação',
  'PRCU - Procuradoria', 'FISC - Fiscalização', 'OUV - Ouvidoria',
];
const DIAS_OPTIONS = ['', '10', '15', '20', '30', '45', '60', '90'];

const mk = (
  id: number, nome: string, sigla: string, categoria: string,
  parentId: number | null = null, servico = '', status: 'ativo'|'suspenso' = 'ativo',
  extras: Partial<Assunto> = {},
): Assunto => ({
  id, nome, sigla, categoria, parentId, servico, status,
  icone: 'fa-file', assuntoMaisUsado: false, aceitaMapa: false,
  naoExibirCA: false, requerAssinatura: false, requerAnexo: false,
  ocultaConteudo: false, somentLoginVerificado: false,
  codigoAssunto: '', idExterno: '', jsonAtores: '', gidPlanilha: '',
  dataLimiteCriacao: '', diasLembrete: '', coordenadas: '',
  descricao: '', modeloInicial: '', setoresReceber: [], direcAuto: '',
  ...extras,
});

const MOCK_ASSUNTOS: Assunto[] = [
  mk(57001,'Assunto Geral','GER','Geral',null,'',      'ativo',{assuntoMaisUsado:true,icone:'fa-folder'}),

  mk(57010,'Denúncia',                'DEN','Ouvidorias',null,'Ouvidoria Digital','ativo',{assuntoMaisUsado:true,aceitaMapa:true,diasLembrete:'30',icone:'fa-megaphone'}),
  mk(57011,'Reclamação',              'REC','Ouvidorias',null,'Ouvidoria Digital','ativo',{assuntoMaisUsado:true,diasLembrete:'15',icone:'fa-comment-exclamation'}),
  mk(57012,'Sugestão',                'SUG','Ouvidorias',null,'Ouvidoria Digital','ativo',{icone:'fa-lightbulb'}),
  mk(57013,'Elogio',                  'ELO','Ouvidorias',null,'Ouvidoria Digital','ativo',{icone:'fa-thumbs-up'}),
  mk(57014,'Solicitação de Informação','SOI','Ouvidorias',null,'LAI - Transparência','ativo',{somentLoginVerificado:true,diasLembrete:'20',icone:'fa-circle-info'}),

  mk(57020,'Requerimento',  'REQ','Protocolos',null,'','ativo',{assuntoMaisUsado:true,requerAssinatura:true,icone:'fa-file-lines'}),
  mk(57021,'Ofício',        'OFC','Protocolos',null,'','ativo',{assuntoMaisUsado:true,requerAssinatura:true,icone:'fa-envelope'}),
  mk(57022,'Declaração',    'DCL','Protocolos',null,'','ativo',{requerAssinatura:true,icone:'fa-file-certificate'}),
  mk(57023,'Carta',         'CAR','Protocolos',null,'','suspenso',{requerAssinatura:true,icone:'fa-envelope-open-text'}),

  mk(57030,'Alvará de Funcionamento','ALF','Alvarás',null,'Alvarás Online','ativo',{assuntoMaisUsado:true,aceitaMapa:true,requerAssinatura:true,requerAnexo:true,codigoAssunto:'ALV001',diasLembrete:'30',icone:'fa-store'}),
  mk(57031,'Renovação de Alvará',    'REN','Alvarás',57030,'Alvarás Online','ativo',{requerAssinatura:true,requerAnexo:true,codigoAssunto:'ALV002',diasLembrete:'30',icone:'fa-rotate'}),
  mk(57032,'Alvará de Construção',   'ALC','Alvarás',null,'Alvarás Online','ativo',{aceitaMapa:true,requerAssinatura:true,requerAnexo:true,codigoAssunto:'ALV003',diasLembrete:'60',icone:'fa-helmet-safety'}),
  mk(57033,'Licença para Eventos',   'ALE','Alvarás',null,'Alvarás Online','ativo',{aceitaMapa:true,codigoAssunto:'ALV004',diasLembrete:'15',icone:'fa-calendar-star'}),

  mk(57040,'Fiscalização Sanitária','FSA','Fiscalizações',null,'','ativo',{aceitaMapa:true,naoExibirCA:true,icone:'fa-shield-virus'}),
  mk(57041,'Fiscalização de Obras', 'FOB','Fiscalizações',null,'','ativo',{aceitaMapa:true,naoExibirCA:true,icone:'fa-person-digging'}),
  mk(57042,'Auto de Infração',      'AIN','Fiscalizações',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,requerAnexo:true,icone:'fa-gavel'}),
  mk(57043,'Vistoria Técnica',      'VTE','Fiscalizações',null,'','ativo',{aceitaMapa:true,naoExibirCA:true,icone:'fa-clipboard-check'}),

  mk(57050,'Chamado de TI',   'CTI','Chamados',null,'','ativo',{naoExibirCA:true,icone:'fa-desktop'}),
  mk(57051,'Manutenção Predial','MNP','Chamados',null,'','ativo',{aceitaMapa:true,naoExibirCA:true,icone:'fa-wrench'}),
  mk(57052,'Serviços Gerais', 'SGE','Chamados',null,'','ativo',{naoExibirCA:true,icone:'fa-broom'}),

  mk(57060,'Processo Licitatório',  'LIC','Proc. Administrativos',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,requerAnexo:true,icone:'fa-scale-balanced'}),
  mk(57061,'Dispensa de Licitação', 'DIS','Proc. Administrativos',57060,'','ativo',{naoExibirCA:true,requerAssinatura:true,requerAnexo:true,icone:'fa-file-contract'}),
  mk(57062,'Sindicância',           'SIN','Proc. Administrativos',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-magnifying-glass'}),
  mk(57063,'Isenção de IPTU',       'IST','Proc. Administrativos',null,'Isenções Online','ativo',{assuntoMaisUsado:true,somentLoginVerificado:true,requerAnexo:true,diasLembrete:'30',icone:'fa-house-circle-check'}),

  mk(57070,'Decreto',   'DEC','Atos oficiais',null,'','ativo',{assuntoMaisUsado:true,naoExibirCA:true,requerAssinatura:true,icone:'fa-scroll'}),
  mk(57071,'Portaria',  'POR','Atos oficiais',null,'','ativo',{assuntoMaisUsado:true,naoExibirCA:true,requerAssinatura:true,icone:'fa-file-signature'}),
  mk(57072,'Resolução', 'RES','Atos oficiais',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-stamp'}),
  mk(57073,'Instrução Normativa','INO','Atos oficiais',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-book-open'}),

  mk(57080,'Projeto de Lei',          'PJL','Matérias Legislativas',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-landmark'}),
  mk(57081,'Requerimento Legislativo','REL','Matérias Legislativas',null,'','ativo',{naoExibirCA:true,icone:'fa-file-pen'}),
  mk(57082,'Indicação',               'IND','Matérias Legislativas',null,'','ativo',{naoExibirCA:true,icone:'fa-hand-point-right'}),

  mk(57090,'Parecer Jurídico','PJU','Pareceres',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-gavel'}),
  mk(57091,'Parecer Técnico', 'PTC','Pareceres',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-file-magnifying-glass'}),

  mk(57100,'Intimação Fiscal',        'INF','Intimações',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-bell'}),
  mk(57101,'Notificação Administrativa','NTA','Intimações',null,'','ativo',{naoExibirCA:true,requerAssinatura:true,icone:'fa-triangle-exclamation'}),
];

/* ── estilos ────────────────────────────────────────────────────────── */
const OVERLAY: React.CSSProperties = { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:900, padding:24 };
const M_BOX: React.CSSProperties = { background:'white', borderRadius:8, width:'100%', maxWidth:900, maxHeight:'92vh', display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.22)', overflow:'hidden' };
const M_HDR: React.CSSProperties = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px 12px', borderBottom:'1px solid #ebebeb', flexShrink:0 };
const M_FTR: React.CSSProperties = { flexShrink:0, borderTop:'1px solid #ebebeb', padding:'14px 22px', display:'flex', justifyContent:'flex-end', gap:10 };
const BTN_CANCEL: React.CSSProperties = { height:38, padding:'0 24px', border:'1px solid #0058db', borderRadius:6, background:'white', color:'#0058db', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Open Sans, sans-serif' };
const BTN_OK = (ok=true): React.CSSProperties => ({ height:38, padding:'0 24px', border:'none', borderRadius:6, background: ok?'#0058db':'#a3a3a3', color:'white', fontSize:14, fontWeight:600, cursor: ok?'pointer':'not-allowed', fontFamily:'Open Sans, sans-serif' });
const INP: React.CSSProperties = { width:'100%', height:40, border:'1px solid #c5c5c5', borderRadius:6, padding:'0 10px', fontSize:14, fontFamily:'Open Sans, sans-serif', color:'#333', outline:'none', boxSizing:'border-box' };
const LBL: React.CSSProperties = { display:'block', fontSize:13, fontWeight:600, color:'#333', marginBottom:5, fontFamily:'Open Sans, sans-serif' };

/* ── Toggle ─────────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width:36, height:20, borderRadius:10, border:'none', cursor:'pointer', background:value?'#0058db':'#c5c5c5', position:'relative', transition:'background 0.2s', padding:0, flexShrink:0 }}>
      <span style={{ position:'absolute', top:2, left:value?18:2, width:16, height:16, borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.25)' }} />
    </button>
  );
}

/* ── Accordion ──────────────────────────────────────────────────────── */
function Accordion({ titulo, children, defaultOpen=true }: { titulo:string; children:React.ReactNode; defaultOpen?:boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border:'1px solid #dde3ee', borderRadius:6, overflow:'hidden', marginBottom:10 }}>
      <button onClick={() => setOpen(v=>!v)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', background:'#f8f9fc', border:'none', cursor:'pointer' }}>
        <span style={{ fontSize:12, fontWeight:700, color:'#333', fontFamily:'Open Sans, sans-serif' }}>{titulo}</span>
        <i className={`fa-regular fa-angle-${open?'up':'down'}`} style={{ fontSize:12, color:'#888' }} />
      </button>
      {open && <div style={{ padding:'12px' }}>{children}</div>}
    </div>
  );
}

/* ── RichArea (toolbar + textarea simplificado) ──────────────────────── */
const TOOLBAR_BTNS = ['fa-bold','fa-italic','fa-underline','fa-list-ul','fa-list-ol','fa-align-left','fa-link'];
function RichArea({ value, onChange, minHeight=100 }: { value:string; onChange:(v:string)=>void; minHeight?:number }) {
  return (
    <div style={{ border:'1px solid #c5c5c5', borderRadius:6, overflow:'hidden' }}>
      <div style={{ display:'flex', gap:2, padding:'4px 6px', borderBottom:'1px solid #ebebeb', background:'#fafafa' }}>
        {TOOLBAR_BTNS.map(b => (
          <button key={b} type="button" style={{ width:28, height:26, border:'1px solid transparent', borderRadius:4, background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>
            <i className={`fa-regular ${b}`} style={{ fontSize:12 }} />
          </button>
        ))}
      </div>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        style={{ width:'100%', minHeight, border:'none', outline:'none', padding:'8px 10px', fontSize:13, fontFamily:'Open Sans, sans-serif', color:'#333', resize:'vertical', boxSizing:'border-box' }} />
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────── */
type FormState = Omit<Assunto, 'id' | 'status'>;

function AssuntoModal({ mode, initial, allAssuntos, onSave, onClose }: {
  mode: 'novo'|'edit'; initial?: Assunto;
  allAssuntos: Assunto[];
  onSave: (d: FormState) => void; onClose: () => void;
}) {
  const empty: FormState = {
    nome:'', sigla:'', categoria:CATEGORIAS[0], parentId:null, servico:'',
    icone:'fa-file', assuntoMaisUsado:false, aceitaMapa:false, naoExibirCA:false,
    requerAssinatura:false, requerAnexo:false, ocultaConteudo:false, somentLoginVerificado:false,
    codigoAssunto:'', idExterno:'', jsonAtores:'', gidPlanilha:'', dataLimiteCriacao:'',
    diasLembrete:'', coordenadas:'', descricao:'', modeloInicial:'', setoresReceber:[],
    direcAuto:'',
  };
  const [form, setForm] = useState<FormState>(initial ? { ...initial } : empty);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(p => ({ ...p, [k]: v }));
  const canSave = !!form.nome.trim() && !!form.sigla.trim();

  const paiOptions = ['(nenhum)', ...allAssuntos.filter(a => a.id !== initial?.id).map(a => `#${a.id} — ${a.nome}`)];
  const paiValue = form.parentId ? `#${form.parentId} — ${allAssuntos.find(a => a.id === form.parentId)?.nome ?? ''}` : '(nenhum)';

  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={M_BOX}>
        <div style={M_HDR}>
          <span style={{ fontSize:15, fontWeight:700, color:'#222', fontFamily:'Open Sans, sans-serif' }}>
            {mode === 'novo' ? 'Novo assunto' : 'Editar assunto'}
          </span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#888', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6 }}><i className="fa-regular fa-xmark" /></button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'18px 22px', display:'flex', gap:20 }}>
          {/* ── coluna principal ── */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:2 }}>
                <label style={LBL}>Nome<span style={{ color:'#b2132e' }}>*</span></label>
                <input style={INP} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Alvará de Funcionamento" />
              </div>
              <div style={{ flex:'0 0 90px' }}>
                <label style={LBL}>Sigla<span style={{ color:'#b2132e' }}>*</span></label>
                <input style={{ ...INP, textTransform:'uppercase' }} value={form.sigla} maxLength={6} onChange={e => set('sigla', e.target.value.toUpperCase())} placeholder="EX: ALF" />
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label style={LBL}>Categoria</label>
                <SimpleSelect value={form.categoria} onChange={v => set('categoria', v)} options={CATEGORIAS} />
              </div>
              <div style={{ flex:1 }}>
                <label style={LBL}>Assunto pai</label>
                <SimpleSelect
                  value={paiValue}
                  onChange={v => set('parentId', v === '(nenhum)' ? null : Number(v.replace(/#(\d+).*/, '$1')))}
                  options={paiOptions}
                />
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label style={LBL}>Serviço vinculado</label>
                <input style={INP} value={form.servico} onChange={e => set('servico', e.target.value)} placeholder="Nome do serviço (opcional)" />
              </div>
              <div style={{ flex:1 }}>
                <label style={LBL}>Direcionamento automático</label>
                <SimpleSelect
                  value={form.direcAuto ? (SETORES_MOCK.find(s => s.startsWith(form.direcAuto + ' ')) ?? form.direcAuto) : '(nenhum)'}
                  onChange={v => set('direcAuto', v === '(nenhum)' ? '' : v.split(' - ')[0])}
                  options={['(nenhum)', ...SETORES_MOCK]}
                />
              </div>
            </div>

            <div>
              <label style={LBL}>Descrição</label>
              <RichArea value={form.descricao} onChange={v => set('descricao', v)} minHeight={110} />
            </div>

            <Accordion titulo="Modelo inicial do documento" defaultOpen={false}>
              <RichArea value={form.modeloInicial} onChange={v => set('modeloInicial', v)} minHeight={90} />
            </Accordion>
          </div>

          {/* ── coluna avançado ── */}
          <div style={{ width:260, flexShrink:0 }}>
            <Accordion titulo="Configurações">
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div>
                  <label style={LBL}>Código do assunto</label>
                  <input style={INP} value={form.codigoAssunto} onChange={e => set('codigoAssunto', e.target.value)} placeholder="Ex: ALV001" />
                </div>
                <div>
                  <label style={LBL}>Ícone (FontAwesome)</label>
                  <input style={INP} value={form.icone} onChange={e => set('icone', e.target.value)} placeholder="fa-file" />
                </div>
                <div>
                  <label style={LBL}>Dias p/ lembrete de prazo</label>
                  <SimpleSelect value={form.diasLembrete || ''} onChange={v => set('diasLembrete', v)} options={DIAS_OPTIONS} />
                </div>
                <div>
                  <label style={LBL}>Coordenadas geográficas</label>
                  <input style={INP} value={form.coordenadas} onChange={e => set('coordenadas', e.target.value)} placeholder="lat,lng" />
                </div>
              </div>
            </Accordion>

            <Accordion titulo="Central de Atendimento">
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {([
                  ['assuntoMaisUsado',     'Assunto mais usado'],
                  ['aceitaMapa',           'Aceita mapa de localização'],
                  ['requerAssinatura',     'Requer assinatura na abertura'],
                  ['somentLoginVerificado','Somente login verificado'],
                  ['naoExibirCA',          'Não exibir na Central'],
                ] as [keyof FormState, string][]).map(([k, lbl]) => (
                  <label key={k} style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', fontSize:12, color:'#333', fontFamily:'Open Sans, sans-serif' }}>
                    <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked as FormState[typeof k])} /> {lbl}
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion titulo="Comportamento" defaultOpen={false}>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {([
                  ['requerAnexo',     'Requer aprovação de anexos'],
                  ['ocultaConteudo',  'Oculta campo conteúdo'],
                ] as [keyof FormState, string][]).map(([k, lbl]) => (
                  <label key={k} style={{ display:'flex', alignItems:'center', gap:7, cursor:'pointer', fontSize:12, color:'#333', fontFamily:'Open Sans, sans-serif' }}>
                    <input type="checkbox" checked={form[k] as boolean} onChange={e => set(k, e.target.checked as FormState[typeof k])} /> {lbl}
                  </label>
                ))}
              </div>
            </Accordion>

            <Accordion titulo="Integrações" defaultOpen={false}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div>
                  <label style={LBL}>ID externo</label>
                  <input style={INP} value={form.idExterno} onChange={e => set('idExterno', e.target.value)} />
                </div>
                <div>
                  <label style={LBL}>JSON p/ identificação de atores</label>
                  <textarea value={form.jsonAtores} onChange={e => set('jsonAtores', e.target.value)}
                    style={{ ...INP, height:60, resize:'vertical', padding:'6px 10px' }} />
                </div>
                <div>
                  <label style={LBL}>GID da planilha (Google Docs)</label>
                  <input style={INP} value={form.gidPlanilha} onChange={e => set('gidPlanilha', e.target.value)} />
                </div>
                <div>
                  <label style={LBL}>Data limite para criação</label>
                  <input style={INP} type="date" value={form.dataLimiteCriacao} onChange={e => set('dataLimiteCriacao', e.target.value)} />
                </div>
              </div>
            </Accordion>
          </div>
        </div>

        <div style={M_FTR}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={() => canSave && onSave(form)} disabled={!canSave} style={BTN_OK(canSave)}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

/* ── ConfirmDeleteModal ─────────────────────────────────────────────── */
function ConfirmDeleteModal({ nome, onConfirm, onClose }: { nome:string; onConfirm:()=>void; onClose:()=>void }) {
  return (
    <div style={OVERLAY} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'white', borderRadius:8, width:'100%', maxWidth:360, display:'flex', flexDirection:'column', boxShadow:'0 24px 64px rgba(0,0,0,0.22)', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'12px 16px 0' }}>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#888', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6 }}><i className="fa-regular fa-xmark" /></button>
        </div>
        <div style={{ padding:'0 24px 24px', textAlign:'center' }}>
          <div style={{ width:54, height:54, borderRadius:'50%', border:'3px solid #b2132e', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <i className="fa-regular fa-exclamation" style={{ fontSize:22, color:'#b2132e' }} />
          </div>
          <p style={{ margin:'0 0 6px', fontSize:15, fontWeight:700, color:'#222', fontFamily:'Open Sans, sans-serif' }}>Excluir assunto</p>
          <p style={{ margin:0, fontSize:13, color:'#565656', fontFamily:'Open Sans, sans-serif' }}>
            Tem certeza que deseja excluir <strong>"{nome}"</strong>?
          </p>
        </div>
        <div style={{ borderTop:'1px solid #ebebeb', padding:'14px 20px', display:'flex', justifyContent:'center', gap:12 }}>
          <button onClick={onClose} style={BTN_CANCEL}>Cancelar</button>
          <button onClick={onConfirm} style={{ ...BTN_OK(), background:'#b2132e' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

/* ── AssuntosTab (principal) ─────────────────────────────────────────── */
export default function AssuntosTab() {
  const [assuntos, setAssuntos] = useState<Assunto[]>(MOCK_ASSUNTOS);
  const [catFiltro, setCatFiltro] = useState('Todos');
  const [statusFiltro, setStatusFiltro] = useState<'ativo'|'suspenso'>('ativo');
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState<null | { mode:'novo'|'edit'; item?: Assunto }>(null);
  const [deleteItem, setDeleteItem] = useState<Assunto | null>(null);

  const filtered = assuntos.filter(a => {
    if (a.status !== statusFiltro) return false;
    if (catFiltro !== 'Todos' && a.categoria !== catFiltro) return false;
    if (busca && !a.nome.toLowerCase().includes(busca.toLowerCase()) && !a.sigla.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const renderTree = (items: Assunto[], parentId: number | null, depth: number): React.ReactNode[] => {
    return items
      .filter(a => a.parentId === parentId)
      .flatMap(a => [
        <AssuntoRow key={a.id} item={a} depth={depth} />,
        ...renderTree(items, a.id, depth + 1),
      ]);
  };

  const toggleStatus = (id: number) => {
    setAssuntos(p => p.map(a => a.id === id ? { ...a, status: a.status === 'ativo' ? 'suspenso' : 'ativo' } : a));
  };

  const handleSave = (data: FormState) => {
    if (modal?.mode === 'novo') {
      const nextId = Math.max(...assuntos.map(a => a.id)) + 1;
      setAssuntos(p => [...p, { ...data, id: nextId, status: 'ativo' }]);
    } else if (modal?.item) {
      setAssuntos(p => p.map(a => a.id === modal.item!.id ? { ...a, ...data } : a));
    }
    setModal(null);
  };

  const actionBtn = (color = '#0058db'): React.CSSProperties => ({
    width:32, height:32, border:`1px solid ${color}30`, borderRadius:5,
    background:`${color}10`, cursor:'pointer', display:'inline-flex',
    alignItems:'center', justifyContent:'center', color,
  });

  function AssuntoRow({ item, depth }: { item: Assunto; depth: number }) {
    return (
      <div style={{ display:'grid', gridTemplateColumns:'64px 1fr 70px 1fr 44px 90px', padding:'0 14px', height:44, alignItems:'center', gap:8, borderBottom:'1px solid #f0f0f0', background:'white', overflow:'hidden' }}>
        <span style={{ fontSize:11, color:'#888', fontFamily:'Open Sans, sans-serif' }}>{item.id}</span>
        <div style={{ display:'flex', alignItems:'center', gap:6, paddingLeft: depth * 20 }}>
          {depth > 0 && <i className="fa-regular fa-turn-down-right" style={{ fontSize:10, color:'#aaa', flexShrink:0 }} />}
          <i className={`fa-regular ${item.icone}`} style={{ fontSize:13, color:'#0058db', flexShrink:0 }} />
          <span style={{ fontSize:13, color:'#222', fontFamily:'Open Sans, sans-serif', fontWeight:600 }}>{item.nome}</span>
          {item.assuntoMaisUsado && <i className="fa-solid fa-star" style={{ fontSize:9, color:'#f59e0b' }} title="Mais usado" />}
        </div>
        <span style={{ fontSize:11, fontWeight:700, color:'#0058db', fontFamily:'Open Sans, sans-serif', background:'#edf2ff', padding:'2px 6px', borderRadius:4, width:'fit-content' }}>{item.sigla}</span>
        <span style={{ fontSize:12, color:'#555', fontFamily:'Open Sans, sans-serif' }}>{item.servico || <span style={{ color:'#c5c5c5' }}>—</span>}</span>
        <Toggle value={item.status === 'ativo'} onChange={() => toggleStatus(item.id)} />
        <div style={{ display:'flex', gap:4 }}>
          <button style={actionBtn()} title="Editar" onClick={() => setModal({ mode:'edit', item })}><i className="fa-regular fa-pen-to-square" style={{ fontSize:11 }} /></button>
          <button style={actionBtn('#b2132e')} title="Excluir" onClick={() => setDeleteItem(item)}><i className="fa-regular fa-trash" style={{ fontSize:11 }} /></button>
        </div>
      </div>
    );
  }

  const rows = busca || catFiltro !== 'Todos'
    ? filtered.map(a => <AssuntoRow key={a.id} item={a} depth={0} />)
    : renderTree(filtered, null, 0);

  const catOptions = ['Todos', ...CATEGORIAS];
  const countAtivos = assuntos.filter(a => a.status === 'ativo').length;
  const countSuspensos = assuntos.filter(a => a.status === 'suspenso').length;

  return (
    <>
      {/* cabeçalho */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ margin:'0 0 2px', fontSize:14, fontWeight:700, color:'#222', fontFamily:'Open Sans, sans-serif' }}>Assuntos</p>
          <p style={{ margin:0, fontSize:13, color:'#565656', fontFamily:'Open Sans, sans-serif' }}>Gerencie os assuntos disponíveis para abertura de documentos e processos.</p>
        </div>
        <button onClick={() => setModal({ mode:'novo' })}
          style={{ flexShrink:0, height:36, padding:'0 14px', border:'none', borderRadius:6, background:'#0058db', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'Open Sans, sans-serif' }}>
          <i className="fa-regular fa-plus" style={{ fontSize:12 }} />Novo assunto
        </button>
      </div>

      {/* filtros */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ width:220 }}>
          <SimpleSelect value={catFiltro} onChange={setCatFiltro} options={catOptions} />
        </div>
        <div style={{ flex:1, minWidth:180, position:'relative' }}>
          <i className="fa-regular fa-magnifying-glass" style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'#888', fontSize:12 }} />
          <input
            style={{ ...INP, paddingLeft:30 }}
            placeholder="Buscar por nome ou sigla..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div style={{ display:'flex', border:'1px solid #dde3ee', borderRadius:6, overflow:'hidden' }}>
          {(['ativo','suspenso'] as const).map(s => (
            <button key={s} onClick={() => setStatusFiltro(s)}
              style={{ height:38, padding:'0 14px', border:'none', cursor:'pointer', fontFamily:'Open Sans, sans-serif', fontSize:12, fontWeight:600,
                background: statusFiltro === s ? '#0058db' : 'white',
                color: statusFiltro === s ? 'white' : '#555',
              }}>
              {s === 'ativo' ? `Ativos (${countAtivos})` : `Suspensos (${countSuspensos})`}
            </button>
          ))}
        </div>
      </div>

      {/* tabela */}
      <div>
        <div style={{ display:'grid', gridTemplateColumns:'64px 1fr 70px 1fr 44px 90px', background:'#1e2a3b', padding:'0 14px', height:44, alignItems:'center', gap:8, borderRadius:'6px 6px 0 0' }}>
          {['ID','Assunto','Sigla','Serviço','Ativo','Ações'].map(h => (
            <span key={h} style={{ fontSize:13, fontWeight:600, color:'white', fontFamily:'Open Sans, sans-serif' }}>{h}</span>
          ))}
        </div>
        {rows.length === 0 ? (
          <div style={{ padding:'56px', textAlign:'center', border:'1px solid #f0f0f0', borderTop:'none', borderRadius:'0 0 6px 6px' }}>
            <i className="fa-regular fa-folder-open" style={{ fontSize:40, color:'#c8c8c8', display:'block', marginBottom:12 }} />
            <p style={{ margin:'0 0 4px', fontSize:14, fontWeight:600, color:'#555', fontFamily:'Open Sans, sans-serif' }}>Nenhum assunto encontrado</p>
            <p style={{ margin:0, fontSize:13, color:'#888', fontFamily:'Open Sans, sans-serif' }}>Ajuste os filtros ou adicione um novo assunto.</p>
          </div>
        ) : (
          <div style={{ border:'1px solid #f0f0f0', borderTop:'none', borderRadius:'0 0 6px 6px', overflow:'hidden' }}>
            {rows}
          </div>
        )}
      </div>

      {modal && (
        <AssuntoModal
          mode={modal.mode} initial={modal.item} allAssuntos={assuntos}
          onSave={handleSave} onClose={() => setModal(null)}
        />
      )}
      {deleteItem && (
        <ConfirmDeleteModal
          nome={deleteItem.nome}
          onConfirm={() => { setAssuntos(p => p.filter(a => a.id !== deleteItem.id)); setDeleteItem(null); }}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </>
  );
}
