import { useState, useRef, useEffect } from 'react';
import './Inbox.css';

/* ── Types ─────────────────────────────────────────────────────── */
type Tab = 'em-aberto' | 'caixa-saida' | 'favoritos' | 'arquivados';
type ViewMode = 'list' | 'calendar';
type CalMode = 'month' | 'week';
type ViewStatus = 'visto-mim' | 'visto-setor' | 'nao-visto-mim' | 'nao-visto-todos';
type ModalKind = null | 'archive' | 'remove-tag' | 'legend-inbox' | 'legend-calendar';
type CalEventType = 'Prazo' | 'Resposta final' | 'Vencido' | 'Assinaturas';

interface Tag { label: string; color: string; }
interface Marcador { label: string; color: string; }
interface ToEntry { kind: 'setor' | 'person' | 'email'; label: string; fullLabel?: string; }
interface Alert { id: string; text: string; link?: string; linkLabel?: string; }
interface CalEvent { id: string; title: string; sub: string; type: CalEventType; year: number; month: number; day: number; }

interface InboxItem {
  id: string;
  isRead: boolean;
  isFavorite: boolean;
  type: string;
  number: string;
  date: string;
  tags: Tag[];
  marcadores: Marcador[];
  from: { name: string; org?: string; email?: string; setor?: string; setorFull?: string };
  to: ToEntry[];
  subject: string;
  subjectPreview: string;
  movimentacao: string;
  viewStatus: ViewStatus;
  avatars: string[];
  commentCount: number;
  hasAssinaturaDigital?: boolean;
  isSigiloso?: boolean;
  hasAnexos?: boolean;
  hasDocFisico?: boolean;
  consultaExterna?: 'disponivel' | 'indisponivel';
  localizacao?: 'automatica' | 'cadastrada';
  prazoPerto?: boolean;
  avaliacaoPositiva?: boolean;
  avaliacaoNegativa?: boolean;
  atribuidoSorteio?: boolean;
}

/* ── Constants ──────────────────────────────────────────────────── */
const MARCADORES_OPTIONS = [
  'Todos os marcadores', 'Sem Marcadores', 'Aguardando Assinatura',
  'Doc de Demonstração 💞', 'Juliano', 'teste henrique', 'Moacir 😀',
  'Não Utilizar para Testes ❌', 'Pago', 'Pietro', 'Renan', 'TESTE', 'teste',
  'Teste Mobile', 'Um Marcador Realmente Muito Grande Para Exibir na Tela com Emojis 😜😜',
];

const DOCUMENTO_OPTIONS = [
  'Todos os documentos', 'Memorando', 'Ciclo de Vida', 'Ouvidoria e-Ouve', 'Ata',
  'Circular', 'Ofício Manual', 'Ofício', 'Alvará', 'Ouvidoria', 'Chamado técnico',
  'Sessão Plenária', 'Análise de Projeto (atual)', 'Protocolo', 'Protocolo Pref.',
  'Análise de Projeto', 'Fiscalização', 'Parecer', 'Proc. Administrativo',
];

const SELECIONE_OPTIONS = [
  'Protocolo', 'Proc. Administrativo', 'Ofício', 'Circular', 'Ouvidoria',
  'Memorando', 'Ciclo de Vida', 'Ata', 'Alvará', 'Chamado técnico',
  'Sessão Plenária', 'Fiscalização', 'Parecer',
];

const DOC_SCOPE_OPTIONS = [
  'Todos os documentos do setor',
  'Documentos em aberto em meu setor',
  'Documentos arquivados em meu setor',
];

const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const CAL_EVENT_STYLE: Record<CalEventType, { bg: string; color: string }> = {
  'Prazo':          { bg: '#fce7f3', color: '#be185d' },
  'Resposta final': { bg: '#dcfce7', color: '#15803d' },
  'Vencido':        { bg: '#fee2e2', color: '#dc2626' },
  'Assinaturas':    { bg: '#f3f4f6', color: '#6b7280' },
};

const MOCK_CAL_EVENTS: CalEvent[] = [
  { id: 'ce1', title: 'Proc. Administrativo 002/2020', sub: 'Prazo', type: 'Prazo', year: 2026, month: 4, day: 4 },
  { id: 'ce2', title: 'Ouvidoria 002/2025', sub: 'Assinaturas', type: 'Assinaturas', year: 2026, month: 4, day: 6 },
  { id: 'ce3', title: 'Protocolo 005/2020', sub: 'Resposta final', type: 'Resposta final', year: 2026, month: 4, day: 11 },
  { id: 'ce4', title: 'Ofício 001/2020', sub: 'Vencido', type: 'Vencido', year: 2026, month: 4, day: 11 },
  { id: 'ce5', title: 'Proc. Administrativo 010/2020', sub: 'Prazo', type: 'Prazo', year: 2026, month: 4, day: 15 },
  { id: 'ce6', title: 'Circular 003/2020', sub: 'Assinaturas', type: 'Assinaturas', year: 2026, month: 4, day: 18 },
  { id: 'ce7', title: 'Ouvidoria 004/2020', sub: 'Resposta final', type: 'Resposta final', year: 2026, month: 4, day: 22 },
  { id: 'ce8', title: 'Proc. Administrativo 001/2021', sub: 'Prazo', type: 'Prazo', year: 2026, month: 4, day: 27 },
  { id: 'ce9', title: 'Análise de Projeto 001/2021', sub: 'Vencido', type: 'Vencido', year: 2026, month: 4, day: 29 },
];

/* ── Mock Data ──────────────────────────────────────────────────── */
const MOCK: InboxItem[] = [
  {
    id: '1', isRead: true, isFavorite: false,
    type: 'Protocolo', number: '005/2020', date: '20/10/2020 às 14h14',
    tags: [{ label: 'Julinho', color: '#0058db' }], marcadores: [],
    from: { name: 'Moacir', org: 'Moacir S.A.', email: 'moacir@1doc.com.br' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Teste com Template', subjectPreview: 'teste teste teste teste teste  teste ...',
    movimentacao: '5 anos 25 dias', viewStatus: 'visto-mim', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '2', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '001/2020', date: '11/11/2020 às 10h51',
    tags: [{ label: 'Julinho', color: '#0058db' }], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [
      { kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' },
      { kind: 'setor', label: 'SSES', fullLabel: 'Secretaria de Saúde e Serviços' },
      { kind: 'person', label: 'Admin' },
    ],
    subject: 'Solicitação de Pagamento', subjectPreview: 'teste',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-mim', avatars: ['MA'], commentCount: 0,
    hasAssinaturaDigital: true, hasAnexos: true,
  },
  {
    id: '3', isRead: false, isFavorite: false,
    type: 'Proc. Administrativo', number: '002/2020', date: '11/11/2020 às 10h52',
    tags: [{ label: 'Julinho', color: '#0058db' }], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [
      { kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' },
      { kind: 'setor', label: 'DAOM', fullLabel: 'Departamento de Administração e Obras' },
    ],
    subject: 'Solicitação de Pagamento', subjectPreview: 'testes',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
    hasAnexos: true,
  },
  {
    id: '4', isRead: true, isFavorite: true,
    type: 'Proc. Administrativo', number: '003/2020', date: '11/11/2020 às 12h13',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'teste',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '5', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '004/2020', date: '11/11/2020 às 12h19',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'testes',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-mim', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '6', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '005/2020', date: '11/11/2020 às 12h21',
    tags: [{ label: 'Julinho', color: '#0058db' }], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'teste',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '7', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '006/2020', date: '11/11/2020 às 13h35',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'TESTE',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '8', isRead: true, isFavorite: false,
    type: 'Ciclo de Vida', number: '001/2020', date: '11/11/2020 às 17h40',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'DAOM', setorFull: 'Departamento de Administração e Obras', org: 'Moacir S.A.' },
    to: [
      { kind: 'person', label: 'Moacir S.A.' },
      { kind: 'email', label: 'moacir+sa@1doc.com.br' },
    ],
    subject: 'Documentos Moacir S.A.', subjectPreview: 'Contrato 001/2020, Moacir Silva de Matos Junior Admin',
    movimentacao: '5 anos 6 meses 3 dias', viewStatus: 'visto-mim', avatars: ['MA'], commentCount: 1,
  },
  {
    id: '9', isRead: true, isFavorite: false,
    type: 'Ofício', number: '001/2020', date: '18/09/2020 às 17h52',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [
      { kind: 'person', label: 'Moacir Silva de Matos Junior' },
      { kind: 'email', label: 'adm.moacirjunior@gmail.com' },
    ],
    subject: 'Teste de Ofício', subjectPreview: 'RESPONDENDO E ADD MAIS 1 EMAIL Livre de vírus. www.avast.com. Em s...',
    movimentacao: '5 anos 5 meses 27 dias', viewStatus: 'visto-mim', avatars: ['MA'], commentCount: 4,
    hasDocFisico: true,
  },
  {
    id: '10', isRead: false, isFavorite: false,
    type: 'Ouvidoria', number: '002/2020', date: '01/12/2020 às 11h22',
    tags: [], marcadores: [{ label: 'Urgente', color: '#c0182d' }, { label: 'Privado', color: '#3d3d3d' }],
    from: { name: 'Sigma, Moacir S.A.', email: 'moacir+sa@1doc.com.br', setor: 'SAOM', setorFull: 'Secretaria de Assessoria e Obras' },
    to: [
      { kind: 'setor', label: 'SAOM', fullLabel: 'Secretaria de Assessoria e Obras' },
      { kind: 'setor', label: 'SOBR', fullLabel: 'Secretaria de Obras' },
    ],
    subject: 'Conduta de Funcionários', subjectPreview: 'teste Moacir Silva de Matos Junior Admin',
    movimentacao: '5 anos 5 meses 13 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '11', isRead: true, isFavorite: false,
    type: 'Protocolo', number: '007/2020', date: '23/10/2020 às 08h39',
    tags: [{ label: 'Teste Mobile', color: '#0058db' }], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [
      { kind: 'person', label: 'Moacir Silva de Matos Junior' },
      { kind: 'email', label: 'adm.moacirjunior@gmail.com' },
    ],
    subject: 'Outro Assinatura', subjectPreview: 'Teste',
    movimentacao: '5 anos 5 meses 11 dias', viewStatus: 'visto-mim', avatars: ['MA', 'JS', 'PL'], commentCount: 15,
    hasAssinaturaDigital: true,
  },
  {
    id: '12', isRead: false, isFavorite: false,
    type: 'Ouvidoria', number: '003/2020', date: '04/12/2020 às 13h39',
    tags: [], marcadores: [{ label: 'Média', color: '#70A9D3' }],
    from: { name: 'Anônima' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Condição sanitária irregular', subjectPreview: '',
    movimentacao: '5 anos 5 meses 10 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
    hasAnexos: true,
  },
  {
    id: '13', isRead: false, isFavorite: false,
    type: 'Ouvidoria', number: '004/2020', date: '07/12/2020 às 09h05',
    tags: [], marcadores: [],
    from: { name: 'Sigma, Moacir Silva de Matos Junior', setor: 'SAOM', setorFull: 'Secretaria de Assessoria e Obras' },
    to: [
      { kind: 'setor', label: 'SAOM', fullLabel: 'Secretaria de Assessoria e Obras' },
      { kind: 'setor', label: 'SOBR', fullLabel: 'Secretaria de Obras' },
      { kind: 'person', label: 'Admin' },
    ],
    subject: 'Esgoto', subjectPreview: 'COMPORTAMENTO NOME RESPOSTA',
    movimentacao: '5 anos 5 meses 8 dias', viewStatus: 'visto-setor', avatars: ['MA', 'JS'], commentCount: 2,
    hasAnexos: true,
  },
  {
    id: '14', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '010/2020', date: '10/12/2020 às 12h21',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'PROC TESTE', subjectPreview: 'Teste',
    movimentacao: '5 anos 5 meses 4 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '15', isRead: true, isFavorite: false,
    type: 'Circular', number: '003/2020', date: '24/09/2020 às 09h39',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: '1 setores' }],
    subject: 'Testa Circular', subjectPreview: 'teste Moacir Silva de Matos Junior Admin',
    movimentacao: '5 anos 4 meses 30 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 1,
  },
  {
    id: '16', isRead: true, isFavorite: false,
    type: 'Proc. Administrativo', number: '011/2020', date: '29/12/2020 às 10h48',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'Solicitação de Aquisição (JÁ ESTÁ LICITADO)', subjectPreview: 'Teste',
    movimentacao: '5 anos 4 meses 16 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '17', isRead: true, isFavorite: false,
    type: 'Análise de Projeto', number: '001/2021', date: '19/01/2021 às 15h10',
    tags: [], marcadores: [],
    from: { name: 'Moacir', org: 'Moacir S.A.', email: 'moacir@1doc.com.br' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Alvará de Construção', subjectPreview: 'teste',
    movimentacao: '5 anos 3 meses 26 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '18', isRead: true, isFavorite: false,
    type: 'Análise de Projeto', number: '002/2021', date: '20/01/2021 às 14h28',
    tags: [], marcadores: [],
    from: { name: 'Moacir', org: 'Moacir S.A.', email: 'moacir@1doc.com.br' },
    to: [{ kind: 'setor', label: 'SADM', fullLabel: 'Secretaria de Administração' }],
    subject: 'Alvará de Construção', subjectPreview: '',
    movimentacao: '5 anos 3 meses 25 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 0,
  },
  {
    id: '19', isRead: false, isFavorite: false,
    type: 'Proc. Administrativo', number: '001/2021', date: '08/02/2021 às 14h27',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'Teste',
    movimentacao: '5 anos 3 meses 4 dias', viewStatus: 'visto-setor', avatars: ['MA', 'AB'], commentCount: 2,
    hasAssinaturaDigital: true, hasAnexos: true, isSigiloso: true,
  },
  {
    id: '20', isRead: false, isFavorite: false,
    type: 'Proc. Administrativo', number: '002/2021', date: '10/02/2021 às 10h09',
    tags: [], marcadores: [],
    from: { name: 'Moacir', setor: 'SADM', setorFull: 'Secretaria de Administração' },
    to: [{ kind: 'person', label: 'Admin' }],
    subject: 'Solicitação de Pagamento', subjectPreview: 'Teste',
    movimentacao: '5 anos 3 meses 4 dias', viewStatus: 'visto-setor', avatars: ['MA'], commentCount: 1,
    prazoPerto: true,
  },
];

const VIEW_STATUS_CONFIG: Record<ViewStatus, { icon: string; label: string; color: string }> = {
  'visto-mim':       { icon: 'fa-solid fa-check',           label: 'Visto por mim',       color: '#333333' },
  'visto-setor':     { icon: 'fa-solid fa-check-double',    label: 'Visto pelo setor',     color: '#333333' },
  'nao-visto-mim':   { icon: 'fa-solid fa-eye-slash',       label: 'Não visto por mim',    color: '#333333' },
  'nao-visto-todos': { icon: 'fa-solid fa-eye-low-vision',  label: 'Não visto por todos',  color: '#333333' },
};

/* ── Tooltip ────────────────────────────────────────────────────── */
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="ibx-tip">
      {children}
      <span className="ibx-tip__bubble">{text}</span>
    </span>
  );
}

/* ── Setor Badge ────────────────────────────────────────────────── */
function SetorBadge({ sigla, full, variant = 'neutral' }: { sigla: string; full?: string; variant?: 'neutral' | 'filled' }) {
  return (
    <Tooltip text={full ?? sigla}>
      <span className={`ibx-setor-badge ibx-setor-badge--${variant}`}>
        {sigla}
      </span>
    </Tooltip>
  );
}

/* ── Avatar Group ───────────────────────────────────────────────── */
function AvatarGroup({ avatars }: { avatars: string[] }) {
  const visible = avatars.slice(0, 3);
  const extra = avatars.length - visible.length;
  return (
    <div className="ibx-avatars">
      {visible.map((av, i) => (
        <Tooltip key={i} text={av}>
          <span className="ibx-avatar">{av}</span>
        </Tooltip>
      ))}
      {extra > 0 && <span className="ibx-avatar ibx-avatar--extra">+{extra}</span>}
    </div>
  );
}

/* ── Doc Icons ──────────────────────────────────────────────────── */
function DocIcons({ item }: { item: InboxItem }) {
  const icons: { fa: string; tip: string }[] = [];
  if (item.hasAssinaturaDigital) icons.push({ fa: 'fa-solid fa-file-signature', tip: 'Assinatura Digital Verificada' });
  if (item.isSigiloso)           icons.push({ fa: 'fa-solid fa-lock',           tip: 'Documento sigiloso' });
  if (item.hasAnexos)            icons.push({ fa: 'fa-solid fa-paperclip',      tip: 'Possui anexos' });
  if (item.hasDocFisico)         icons.push({ fa: 'fa-solid fa-file',           tip: 'Contém documento físico' });
  if (item.consultaExterna === 'disponivel')   icons.push({ fa: 'fa-solid fa-eye',       tip: 'Consulta externa disponível' });
  if (item.consultaExterna === 'indisponivel') icons.push({ fa: 'fa-solid fa-eye-slash', tip: 'Consulta externa indisponível' });
  if (item.localizacao === 'automatica')  icons.push({ fa: 'fa-solid fa-location-dot', tip: 'Localização automática' });
  if (item.localizacao === 'cadastrada')  icons.push({ fa: 'fa-solid fa-location-pin', tip: 'Localização cadastrada' });
  if (item.prazoPerto)           icons.push({ fa: 'fa-solid fa-clock',          tip: 'Prazo próximo do vencimento' });
  if (item.avaliacaoPositiva)    icons.push({ fa: 'fa-solid fa-star',           tip: 'Avaliação positiva' });
  if (item.avaliacaoNegativa)    icons.push({ fa: 'fa-solid fa-thumbs-down',    tip: 'Avaliação negativa' });
  if (item.atribuidoSorteio)     icons.push({ fa: 'fa-solid fa-shuffle',        tip: 'Atribuído por sorteio' });

  if (icons.length === 0) return null;
  const visible = icons.slice(0, 4);
  const extra = icons.length - visible.length;
  return (
    <div className="ibx-doc-icons">
      {visible.map((ic, i) => (
        <Tooltip key={i} text={ic.tip}>
          <i className={ic.fa} />
        </Tooltip>
      ))}
      {extra > 0 && <span className="ibx-doc-icons__extra">+{extra}</span>}
    </div>
  );
}

/* ── View Status ────────────────────────────────────────────────── */
function ViewStatusBadge({ status }: { status: ViewStatus }) {
  const cfg = VIEW_STATUS_CONFIG[status];
  return (
    <span className="ibx-view-status" style={{ color: cfg.color }}>
      <i className={cfg.icon} />
      {cfg.label}
    </span>
  );
}

/* ── Empty State ────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="ibx-empty">
      <div className="ibx-empty__icon-wrap">
        <i className="fa-regular fa-envelope-open" />
      </div>
      <strong className="ibx-empty__title">Tudo certo por aqui!</strong>
      <p className="ibx-empty__sub">Sua caixa de entrada está limpa. Continue assim!</p>
    </div>
  );
}

/* ── Searchable Select ──────────────────────────────────────────── */
interface SearchableSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  footer?: React.ReactNode;
  placeholder?: string;
  variant?: 'filter' | 'search' | 'combo';
  icon?: string;
}

function SearchableSelect({ label, value, options, onChange, footer, placeholder = 'Buscar...', variant = 'filter', icon }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQ('');
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const display = value && value !== options[0] ? value : label;

  return (
    <div ref={ref} className={`ibx-sselect ibx-sselect--${variant}`}>
      <button
        className={`ibx-sselect__btn${value && value !== options[0] ? ' ibx-sselect__btn--active' : ''}`}
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        {icon && <i className={icon} style={{ fontSize: 12, flexShrink: 0 }} />}
        <span className="ibx-sselect__label">{display}</span>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, flexShrink: 0 }} />
      </button>
      {open && (
        <div className="ibx-sselect__panel">
          <div className="ibx-sselect__search-wrap">
            <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 12, color: '#7d7d7d' }} />
            <input
              ref={inputRef}
              className="ibx-sselect__search-input"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <div className="ibx-sselect__list">
            {filtered.length === 0 && (
              <div className="ibx-sselect__empty">Nenhum resultado</div>
            )}
            {filtered.map(o => (
              <div
                key={o}
                className={`ibx-sselect__item${value === o ? ' ibx-sselect__item--active' : ''}`}
                onClick={() => { onChange(o); setOpen(false); }}
              >
                {value === o && <i className="fa-solid fa-check" style={{ fontSize: 11, marginRight: 6, color: '#0058db' }} />}
                {o}
              </div>
            ))}
          </div>
          {footer && <div className="ibx-sselect__footer">{footer}</div>}
        </div>
      )}
    </div>
  );
}

/* ── Alert Banner ───────────────────────────────────────────────── */
function AlertBanner({ alert, onDismiss }: { alert: Alert; onDismiss: () => void }) {
  return (
    <div className="ibx-alert">
      <i className="fa-regular fa-triangle-exclamation ibx-alert__icon" />
      <span className="ibx-alert__text">
        {alert.text}
        {alert.link && (
          <> <a href={alert.link} className="ibx-alert__link">{alert.linkLabel ?? alert.link}</a></>
        )}
      </span>
      <button className="ibx-alert__close" onClick={onDismiss} type="button">
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}

/* ── Calendar View ──────────────────────────────────────────────── */
function CalendarView({ onShowLegend }: { onShowLegend: () => void }) {
  const today = new Date(2026, 4, 15);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [calMode, setCalMode] = useState<CalMode>('month');
  const [modeOpen, setModeOpen] = useState(false);
  const [docScope, setDocScope] = useState(DOC_SCOPE_OPTIONS[0]);
  const modeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) setModeOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function prevPeriod() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextPeriod() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function buildMonthDays(): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }

  function buildWeekDays(): (Date | null)[] {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const days: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }

  function eventsForDay(d: Date) {
    return MOCK_CAL_EVENTS.filter(e => e.year === d.getFullYear() && e.month === d.getMonth() && e.day === d.getDate());
  }

  function isToday(d: Date) {
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }

  const days = calMode === 'month' ? buildMonthDays() : buildWeekDays();

  return (
    <div className="ibx-cal">
      <div className="ibx-cal__toolbar">
        <div className="ibx-cal__toolbar-left">
          <SearchableSelect
            label="Todos os documentos do setor"
            value={docScope}
            options={DOC_SCOPE_OPTIONS}
            onChange={setDocScope}
            placeholder="Filtrar..."
            variant="filter"
          />
        </div>
        <div className="ibx-cal__nav">
          <button className="ibx-cal__nav-btn" onClick={prevPeriod} type="button">
            <i className="fa-regular fa-chevron-left" />
          </button>
          <span className="ibx-cal__period">
            {calMode === 'month'
              ? `${MONTH_NAMES[month]} ${year}`
              : `Semana de ${today.getDate()} de ${MONTH_NAMES[today.getMonth()]} de ${today.getFullYear()}`}
          </span>
          <button className="ibx-cal__nav-btn" onClick={nextPeriod} type="button">
            <i className="fa-regular fa-chevron-right" />
          </button>
        </div>
        <div className="ibx-cal__toolbar-right">
          <button className="ibx-cal__legend-btn" onClick={onShowLegend} type="button">
            <i className="fa-regular fa-circle-info" />
            Legenda
          </button>
          <div ref={modeRef} className="ibx-cal__mode-wrap">
            <button className="ibx-cal__mode-btn" onClick={() => setModeOpen(v => !v)} type="button">
              {calMode === 'month' ? 'Mês' : 'Semana'}
              <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            </button>
            {modeOpen && (
              <div className="ibx-cal__mode-dropdown">
                {(['month', 'week'] as CalMode[]).map(m => (
                  <div
                    key={m}
                    className={`ibx-cal__mode-item${calMode === m ? ' ibx-cal__mode-item--active' : ''}`}
                    onClick={() => { setCalMode(m); setModeOpen(false); }}
                  >
                    {m === 'month' ? 'Mês' : 'Semana'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ibx-cal__grid-wrap">
        <div className="ibx-cal__grid ibx-cal__grid--header">
          {DOW.map(d => (
            <div key={d} className="ibx-cal__dow">{d}</div>
          ))}
        </div>
        <div className="ibx-cal__grid ibx-cal__grid--days">
          {days.map((day, i) => {
            if (!day) return <div key={i} className="ibx-cal__cell ibx-cal__cell--empty" />;
            const events = eventsForDay(day);
            const todayCell = isToday(day);
            const otherMonth = day.getMonth() !== month;
            return (
              <div
                key={i}
                className={`ibx-cal__cell${todayCell ? ' ibx-cal__cell--today' : ''}${otherMonth ? ' ibx-cal__cell--other' : ''}`}
              >
                <span className="ibx-cal__day-num">{day.getDate()}</span>
                <div className="ibx-cal__events">
                  {events.slice(0, 3).map(ev => {
                    const s = CAL_EVENT_STYLE[ev.type];
                    return (
                      <div
                        key={ev.id}
                        className="ibx-cal__event"
                        style={{ background: s.bg, color: s.color }}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                  {events.length > 3 && (
                    <div className="ibx-cal__event-more">+{events.length - 3} mais</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ibx-cal__legend-strip">
        {(Object.entries(CAL_EVENT_STYLE) as [CalEventType, { bg: string; color: string }][]).map(([type, s]) => (
          <div key={type} className="ibx-cal__legend-item">
            <span className="ibx-cal__legend-dot" style={{ background: s.color }} />
            <span style={{ color: s.color, fontWeight: 600 }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Card Row ───────────────────────────────────────────────────── */
function CardRow({
  item, selected, onToggle, onToggleFav, onArchive, onRemoveTag,
}: {
  item: InboxItem;
  selected: boolean;
  onToggle: () => void;
  onToggleFav: () => void;
  onArchive: () => void;
  onRemoveTag: (tag: string) => void;
}) {
  const cardClass = [
    'ibx-card',
    selected ? 'ibx-card--selected' : '',
    !item.isRead ? 'ibx-card--unread' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      {/* Marcadores: pill badges at top */}
      {item.marcadores.length > 0 && (
        <div className="ibx-card__marcadores">
          {item.marcadores.map(m => (
            <span key={m.label} className="ibx-card__marcador-badge" style={{ background: m.color }}>
              {m.label}
            </span>
          ))}
        </div>
      )}

      {/* Main grid row */}
      <div className="ibx-grid ibx-card__grid">
        {/* Col 1: Check + Star */}
        <div className="ibx-card__cell ibx-card__cell--check">
          <input type="checkbox" className="ibx-checkbox" checked={selected} onChange={onToggle} />
          <button className={`ibx-star${item.isFavorite ? ' ibx-star--on' : ''}`} onClick={onToggleFav}>
            <i className={item.isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
          </button>
        </div>

        {/* Col 2: Requisição */}
        <div className="ibx-card__cell">
          <div className="ibx-card__req-type">
            {item.type} <span className="ibx-card__req-num">{item.number}</span>
          </div>
          <div className="ibx-card__req-date">{item.date}</div>
          {item.tags.length > 0 && (
            <div className="ibx-card__tags-inline">
              {item.tags.map(t => (
                <span key={t.label} className="ibx-tag" style={{ background: t.color + '18', color: t.color, borderColor: t.color + '55' }}>
                  <i className="fa-solid fa-tag" style={{ fontSize: 9 }} />
                  {t.label}
                  <button className="ibx-tag__rm" onClick={e => { e.stopPropagation(); onRemoveTag(t.label); }}>
                    <i className="fa-solid fa-xmark" style={{ fontSize: 9 }} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Col 3: De */}
        <div className="ibx-card__cell">
          <div className="ibx-card__from-name">
            {item.from.name}
            {item.from.org && <> - <em className="ibx-card__from-org">{item.from.org}</em></>}
          </div>
          {item.from.setor && (
            <SetorBadge sigla={item.from.setor} full={item.from.setorFull} variant="neutral" />
          )}
          {item.from.email && !item.from.setor && (
            <div className="ibx-card__from-email">{item.from.email}</div>
          )}
        </div>

        {/* Col 4: Para */}
        <div className="ibx-card__cell">
          <div className="ibx-card__to-list">
            {item.to.map((t, i) => (
              t.kind === 'setor'
                ? <SetorBadge key={i} sigla={t.label} full={t.fullLabel} variant="filled" />
                : <Tooltip key={i} text={t.fullLabel ?? t.label}>
                    <span className={t.kind === 'email' ? 'ibx-card__to-email' : 'ibx-card__to-person'}>{t.label}</span>
                  </Tooltip>
            ))}
          </div>
        </div>

        {/* Col 5: Assunto */}
        <div className="ibx-card__cell">
          <div className="ibx-card__subject-title">{item.subject}</div>
          {item.subjectPreview && (
            <div className="ibx-card__subject-preview">{item.subjectPreview}</div>
          )}
        </div>

        {/* Col 6: Movimentação */}
        <div className="ibx-card__cell ibx-card__cell--mov">
          <div className="ibx-card__mov-time">{item.movimentacao}</div>
          <div className="ibx-card__mov-bottom">
            <AvatarGroup avatars={item.avatars} />
            <span className="ibx-card__comments-badge">
              {item.commentCount}
              <i className="fa-solid fa-message" />
            </span>
          </div>
        </div>

        {/* Col 7: Visualização */}
        <div className="ibx-card__cell ibx-card__cell--view">
          <ViewStatusBadge status={item.viewStatus} />
          <div style={{ marginTop: 6 }}>
            <DocIcons item={item} />
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── Archive Modal ──────────────────────────────────────────────── */
function ArchiveModal({ onClose, onArchive }: { onClose: () => void; onArchive: (stopFollowing: boolean) => void }) {
  return (
    <div className="ibx-modal-overlay" onClick={onClose}>
      <div className="ibx-modal" onClick={e => e.stopPropagation()}>
        <button className="ibx-modal__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        <div className="ibx-modal__icon ibx-modal__icon--warn">
          <i className="fa-regular fa-circle-exclamation" />
        </div>
        <h3 className="ibx-modal__title">Arquivar</h3>
        <p className="ibx-modal__text">Tem certeza que deseja arquivar esta requisição?</p>
        <div className="ibx-modal__actions ibx-modal__actions--row">
          <button className="ibx-modal__btn ibx-modal__btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="ibx-modal__btn ibx-modal__btn--primary" onClick={() => onArchive(false)}>Arquivar</button>
          <button className="ibx-modal__btn ibx-modal__btn--primary" onClick={() => onArchive(true)}>Arquivar e parar de acompanhar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Remove Tag Modal ───────────────────────────────────────────── */
function RemoveTagModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="ibx-modal-overlay" onClick={onClose}>
      <div className="ibx-modal ibx-modal--sm" onClick={e => e.stopPropagation()}>
        <button className="ibx-modal__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        <div className="ibx-modal__icon ibx-modal__icon--warn">
          <i className="fa-regular fa-circle-exclamation" />
        </div>
        <h3 className="ibx-modal__title">Remover tag</h3>
        <p className="ibx-modal__text">Tem certeza de que deseja remover esta tag?<br />Essa ação não poderá ser desfeita.</p>
        <div className="ibx-modal__actions">
          <button className="ibx-modal__btn ibx-modal__btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="ibx-modal__btn ibx-modal__btn--danger" onClick={onConfirm}>Remover</button>
        </div>
      </div>
    </div>
  );
}

/* ── Legend Inbox Modal ─────────────────────────────────────────── */
function LegendInboxModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="ibx-modal-overlay" onClick={onClose}>
      <div className="ibx-modal ibx-modal--legend" onClick={e => e.stopPropagation()}>
        <div className="ibx-modal__legend-head">
          <strong>Como interpretar os cards da listagem</strong>
          <p style={{ fontSize: 12, color: '#565656', marginTop: 2 }}>Os tons escuro, médio e claro servem para indicar se um item já foi visualizado por você ou por alguém do seu setor.</p>
        </div>
        <button className="ibx-modal__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        <div className="ibx-legend-items">
          {[
            { sample: 'visto-mim',   desc: 'Você já leu este card.' },
            { sample: 'visto-setor', desc: 'Alguém do seu setor já leu este card, mas ainda assim ele pode ser relevante para você.' },
            { sample: 'nao-visto',   desc: 'Este card ainda não foi lido por ninguém do setor.' },
            { sample: 'selecionado', desc: 'Este é o card que está selecionado no momento.' },
          ].map((it, i) => (
            <div key={i} className={`ibx-legend-item ibx-legend-item--${it.sample}`}>
              <div className="ibx-legend-item__preview">
                <ViewStatusBadge status={it.sample.includes('visto-mim') ? 'visto-mim' : it.sample.includes('setor') ? 'visto-setor' : 'nao-visto-mim'} />
              </div>
              <p className="ibx-legend-item__desc">{it.desc}</p>
            </div>
          ))}
        </div>
        <div className="ibx-modal__legend-note">
          Os textos em <strong>negrito</strong> sinalizam que este card ainda não foi visualizado por você.
        </div>
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button className="ibx-modal__btn ibx-modal__btn--primary" onClick={onClose}>Ok, entendi</button>
        </div>
      </div>
    </div>
  );
}

/* ── Legend Calendar Modal ──────────────────────────────────────── */
function LegendCalendarModal({ onClose }: { onClose: () => void }) {
  const items = [
    { color: '#22c55e', label: 'Verde – Prazo com folga', desc: 'Ainda há bastante tempo para cumprir esse prazo.' },
    { color: '#f59e0b', label: 'Amarelo – Prazo chegando', desc: 'Fique atento para não deixar para a última hora.' },
    { color: '#94a3b8', label: 'Cinza – Prazo já cumprido', desc: 'Tarefa Finalizada. Nada mais precisa ser feito aqui.' },
    { color: '#c0182d', label: 'Vermelho – Prazo vencido', desc: 'É importante priorizar este item o quanto antes.' },
    { color: '#ec4899', label: 'Rosa – Prazo finalizado', desc: '' },
  ];
  return (
    <div className="ibx-modal-overlay" onClick={onClose}>
      <div className="ibx-modal ibx-modal--legend" onClick={e => e.stopPropagation()}>
        <div className="ibx-modal__legend-head">
          <strong>Situação atual dos prazos no calendário</strong>
          <p style={{ fontSize: 12, color: '#565656', marginTop: 2 }}>As cores ajudam a identificar rapidamente o status de cada prazo.</p>
        </div>
        <button className="ibx-modal__close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        <div className="ibx-cal-legend">
          {items.map(it => (
            <div key={it.label} className="ibx-cal-legend__item">
              <span className="ibx-cal-legend__dot" style={{ background: it.color }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: it.color }}>{it.label}</div>
                {it.desc && <div style={{ fontSize: 12, color: '#565656' }}>{it.desc}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button className="ibx-modal__btn ibx-modal__btn--primary" onClick={onClose}>Ok, entendi</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────── */
export default function InboxPage() {
  const [tab, setTab] = useState<Tab>('em-aberto');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [items, setItems] = useState<InboxItem[]>(MOCK);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalKind>(null);
  const [modalTarget, setModalTarget] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [marcadorFilter, setMarcadorFilter] = useState(MARCADORES_OPTIONS[0]);
  const [documentoFilter, setDocumentoFilter] = useState(DOCUMENTO_OPTIONS[0]);
  const [selectTipo, setSelectTipo] = useState('');

  const PAGE_SIZE = 20;
  const total = 256;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, total);

  const tabItems = tab === 'favoritos' ? items.filter(i => i.isFavorite) : items;
  const allSelected = tabItems.length > 0 && tabItems.every(i => selected.has(i.id));

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(tabItems.map(i => i.id)));
  }

  function toggleItem(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleFav(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  }

  function archiveItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    setModal(null);
    setModalTarget(null);
  }

  function archiveSelected() {
    setItems(prev => prev.filter(i => !selected.has(i.id)));
    setSelected(new Set());
  }

  function removeTag(itemId: string, tagLabel: string) {
    setItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, tags: i.tags.filter(t => t.label !== tagLabel) } : i
    ));
    setModal(null);
  }

  function dismissAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'em-aberto',   label: 'Em aberto' },
    { id: 'caixa-saida', label: 'Caixa de Saída' },
    { id: 'favoritos',   label: 'Favoritos' },
    { id: 'arquivados',  label: 'Arquivados' },
  ];

  return (
    <div className="ibx">
      {/* Alerts */}
      {alerts.map(a => (
        <AlertBanner key={a.id} alert={a} onDismiss={() => dismissAlert(a.id)} />
      ))}

      {/* Search bar — alinhada à direita, 40px */}
      <div className="ibx__search-bar">
        {/* Selecione + Número: componente combinado */}
        <div className="ibx__search-combo">
          <SearchableSelect
            label="Selecione"
            value={selectTipo}
            options={SELECIONE_OPTIONS}
            onChange={setSelectTipo}
            placeholder="Buscar tipo..."
            variant="combo"
          />
          <span className="ibx__search-vsep" />
          <div className="ibx__search-num-field">
            <input type="text" placeholder="Número" className="ibx__search-num-input" />
            <i className="fa-regular fa-magnifying-glass ibx__search-num-icon" />
          </div>
        </div>
        {/* Ano com ícone à direita */}
        <div className="ibx__search-year-field">
          <input
            type="number"
            className="ibx__search-year-input"
            min={2000}
            max={2099}
            defaultValue={new Date().getFullYear()}
          />
          <i className="fa-regular fa-calendar" />
        </div>
        <button className="ibx__search-btn">Buscar</button>
      </div>

      {/* Tabs */}
      <div className="ibx__tabs-bar">
        <div className="ibx__tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ibx__tab${tab === t.id ? ' ibx__tab--active' : ''}`}
              onClick={() => { setTab(t.id); setSelected(new Set()); }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Tooltip text="Legenda de visualizações">
          <button className="ibx__legend-btn" onClick={() => setModal('legend-inbox')}>
            <i className="fa-regular fa-circle-info" />
          </button>
        </Tooltip>
      </div>

      {/* Toolbar */}
      <div className="ibx__toolbar">
        <div className="ibx__toolbar-left">
          {viewMode === 'list' && (
            <>
              <input
                type="checkbox"
                className="ibx-checkbox"
                checked={allSelected}
                onChange={toggleAll}
                title="Selecionar todos"
              />
              <Tooltip text="Atualizar">
                <button className="ibx__tool-btn"><i className="fa-regular fa-rotate-right" /></button>
              </Tooltip>
              <Tooltip text="Arquivar selecionados">
                <button className="ibx__tool-btn" onClick={archiveSelected} disabled={selected.size === 0}>
                  <i className="fa-regular fa-folder-arrow-down" />
                </button>
              </Tooltip>
              <Tooltip text="Gerenciar tags">
                <button className="ibx__tool-btn"><i className="fa-regular fa-tag" /></button>
              </Tooltip>
            </>
          )}
        </div>

        <div className="ibx__toolbar-center">
          <div className="ibx__view-toggle">
            <Tooltip text="Visualização em lista">
              <button
                className={`ibx__view-btn${viewMode === 'list' ? ' ibx__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fa-solid fa-list" />
              </button>
            </Tooltip>
            <Tooltip text="Visualização em calendário">
              <button
                className={`ibx__view-btn${viewMode === 'calendar' ? ' ibx__view-btn--active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                <i className="fa-solid fa-calendar" />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="ibx__toolbar-right">
          {viewMode === 'list' && (
            <>
              <SearchableSelect
                label="Marcadores"
                value={marcadorFilter}
                options={MARCADORES_OPTIONS}
                onChange={setMarcadorFilter}
                placeholder="Buscar marcador..."
                footer={
                  <button className="ibx-sselect__footer-btn" type="button">
                    <i className="fa-regular fa-gear" style={{ fontSize: 12 }} />
                    Gerenciar marcadores
                  </button>
                }
              />
              <SearchableSelect
                label="Documentos"
                value={documentoFilter}
                options={DOCUMENTO_OPTIONS}
                onChange={setDocumentoFilter}
                placeholder="Buscar documento..."
              />
              <span className="ibx__page-info">{pageStart}–{pageEnd} de {total}</span>
              <button className="ibx__page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <i className="fa-regular fa-chevron-left" />
              </button>
              <button className="ibx__page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <i className="fa-regular fa-chevron-right" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="ibx__content">
        {viewMode === 'calendar' ? (
          <CalendarView onShowLegend={() => setModal('legend-calendar')} />
        ) : tabItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="ibx__list-wrap">
            {/* Dark header bar */}
            <div className="ibx-grid ibx-list-header">
              <div className="ibx-list-header__cell" />
              <div className="ibx-list-header__cell">
                Requisição <i className="fa-regular fa-arrow-up-arrow-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </div>
              <div className="ibx-list-header__cell">De</div>
              <div className="ibx-list-header__cell">Para</div>
              <div className="ibx-list-header__cell">Assunto</div>
              <div className="ibx-list-header__cell">
                Movimentação <i className="fa-regular fa-arrow-up-arrow-down" style={{ fontSize: 10, marginLeft: 4 }} />
              </div>
              <div className="ibx-list-header__cell">
                Visualização
                <Tooltip text="Legenda de visualizações">
                  <button className="ibx-th__info" onClick={() => setModal('legend-inbox')}>
                    <i className="fa-regular fa-circle-info" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Cards */}
            <div className="ibx__cards-list">
              {tabItems.map(item => (
                <CardRow
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  onToggleFav={() => toggleFav(item.id)}
                  onArchive={() => { setModalTarget(item.id); setModal('archive'); }}
                  onRemoveTag={tag => { setModalTarget(item.id + ':' + tag); setModal('remove-tag'); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {viewMode === 'list' && (
        <div className="ibx__pagination">
          <button className="ibx__pag-btn ibx__pag-btn--text" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Página anterior
          </button>
          <input
            type="number"
            className="ibx__pag-input"
            value={page}
            min={1}
            max={totalPages}
            onChange={e => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= totalPages) setPage(v);
            }}
          />
          <span className="ibx__pag-of">de {totalPages}</span>
          <button className="ibx__pag-btn ibx__pag-btn--text" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Próxima página
          </button>
        </div>
      )}

      {/* Modals */}
      {modal === 'archive' && (
        <ArchiveModal
          onClose={() => setModal(null)}
          onArchive={() => modalTarget && archiveItem(modalTarget)}
        />
      )}
      {modal === 'remove-tag' && modalTarget && (
        <RemoveTagModal
          onClose={() => setModal(null)}
          onConfirm={() => {
            const [id, tag] = modalTarget.split(':');
            removeTag(id, tag);
          }}
        />
      )}
      {modal === 'legend-inbox' && <LegendInboxModal onClose={() => setModal(null)} />}
      {modal === 'legend-calendar' && <LegendCalendarModal onClose={() => setModal(null)} />}
    </div>
  );
}
