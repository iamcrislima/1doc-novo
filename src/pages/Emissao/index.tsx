import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── tipos ───────────────────────────────────────────────────────────────────
interface HistoryItem {
  id: number;
  name: string;
  count: string | null;
  files?: string[];
}
interface HistoryGroup { label: string; items: HistoryItem[] }
type StepStatus = 'completed' | 'active' | 'pending';
interface Step { id: number; name: string; status: StepStatus; prazo: string; tempo: string; assignees: string[] }

// ─── dados mock ───────────────────────────────────────────────────────────────
const HISTORY: HistoryGroup[] = [
  {
    label: '28 de maio de 2025',
    items: [
      { id: 5, name: 'Despacho 05', count: '05 anexos', files: [] },
      { id: 4, name: 'Despacho 04', count: null,        files: [] },
    ],
  },
  {
    label: '27 de maio de 2025',
    items: [
      { id: 3, name: 'Despacho 03', count: '05 anexos', files: ['Orçamento curso.pdf','Anexo 2.pdf','Anexo 3.pdf','Anexo 4.pdf','Anexo 5.pdf'] },
      { id: 2, name: 'Despacho 02', count: '01 anexo',  files: ['Orçamento curso.pdf'] },
      { id: 1, name: 'Despacho 01', count: '01 anexo',  files: ['Primeiro anexo.pdf'] },
    ],
  },
];

const STEPS: Step[] = [
  { id: 1, name: 'Cotação',                                         status: 'completed', prazo: '5 Dias',  tempo: '12 dias', assignees: ['Nome de setor','Setor 02','Mais 3'] },
  { id: 2, name: 'Etapa 02',                                        status: 'completed', prazo: '3 Dias',  tempo: '12 dias', assignees: ['Nome de setor'] },
  { id: 3, name: 'Aprovação do solicitante',                        status: 'active',    prazo: '3 Dias',  tempo: '12 dias', assignees: ['Nome de setor'] },
  { id: 4, name: 'Envio de ordem de compra ao fornecedor',          status: 'pending',   prazo: '2 Dias',  tempo: '12 dias', assignees: ['Nome de setor','Nome de setor 02'] },
  { id: 5, name: 'Recebimento de nota fiscal e pagamento',          status: 'pending',   prazo: '2 Dias',  tempo: '12 dias', assignees: ['Nome de setor','Nome de setor 02'] },
];

const DEADLINES = [
  { id: 1, prazo: 'Prazo teste', vencimento: 'Há 1 ano 9 meses 16 dias - 31/01/2026', lembrete: '30/01/2026', visibilidade: 'Todos' },
  { id: 2, prazo: 'Prazo teste', vencimento: 'Há 1 ano 9 meses 16 dias - 31/01/2026', lembrete: '30/01/2026', visibilidade: 'Todos' },
  { id: 3, prazo: 'Prazo teste', vencimento: 'Há 1 ano 9 meses 16 dias - 31/01/2026', lembrete: '30/01/2026', visibilidade: 'Todos' },
];

const EVENTS = [
  { id: 1, date: '10 de maio de 2025 às 12:11', icon: 'fa-regular fa-file-signature', content: (<><strong>Carol</strong> solicitou assinatura de <strong>Inácio Steffen</strong> com <em>Certificado de assinatura</em> em <strong>5 documentos</strong> da <span style={{ color: '#0058db', cursor: 'pointer' }}>Link</span></>) },
  { id: 2, date: '10 de maio de 2025 às 12:11', icon: 'fa-regular fa-file-signature', content: (<><strong>Taís Belon</strong> assinou 5 documentos do <span style={{ color: '#0058db', cursor: 'pointer' }}>Link</span> com <em>Certificado de assinatura</em> — CPF 232.XXX.XXX-17</>) },
  { id: 3, date: '10 de maio de 2025 às 12:11', icon: 'fa-regular fa-eye-slash',      content: (<><strong>Marcos Costa</strong> parou de acompanhar</>) },
];

// ─── sub-componentes internos ─────────────────────────────────────────────────
function Badge({ label, color, outlined = false, withIcon = false }: { label: string; color?: string; outlined?: boolean; withIcon?: boolean }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    borderRadius: 100, padding: '1px 10px',
    fontSize: 11, fontWeight: 600, lineHeight: '18px', whiteSpace: 'nowrap',
    fontFamily: 'Open Sans, sans-serif',
  };
  if (outlined) return (
    <span style={{ ...base, background: 'white', border: `1.5px solid ${color ?? '#0058db'}`, color: color ?? '#0058db' }}>
      {label}
    </span>
  );
  return (
    <span style={{ ...base, background: color ?? '#0058db', color: 'white' }}>
      {withIcon && <i className="fa-solid fa-tag" style={{ fontSize: 10 }} />}
      {label}
    </span>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#f0f4fb', border: '1px solid #dde3ee', borderRadius: 100,
      padding: '1px 8px', fontSize: 10, fontWeight: 500, color: '#565656',
      whiteSpace: 'nowrap', fontFamily: 'Open Sans, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#aab4c8', flexShrink: 0 }} />
      {label}
    </span>
  );
}

function StepCard({ step }: { step: Step }) {
  const isCompleted = step.status === 'completed';
  const isActive    = step.status === 'active';

  const cardStyle: React.CSSProperties = {
    minWidth: 182, maxWidth: 182, borderRadius: 8, padding: '8px',
    position: 'relative', flexShrink: 0,
    background: isCompleted ? '#f0fdf4' : 'white',
    border: isCompleted
      ? '1.5px solid #86efac'
      : isActive
        ? '1.5px solid #0058db'
        : '1.5px solid #e5e7eb',
    fontFamily: 'Open Sans, sans-serif',
  };

  const iconColor  = isCompleted ? '#16a34a' : isActive ? '#0058db' : '#aab4c8';
  const iconClass  = isCompleted
    ? 'fa-solid fa-circle-check'
    : isActive
      ? 'fa-solid fa-circle-dot'
      : 'fa-regular fa-clock-rotate-left';

  return (
    <div style={cardStyle}>
      {/* Active accent */}
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 4, background: '#0058db', borderRadius: '4px 0 0 4px' }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, paddingLeft: isActive ? 6 : 0 }}>
        <i className={iconClass} style={{ color: iconColor, fontSize: 14, marginTop: 1, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#333', lineHeight: '14px' }}>{step.name}</span>
            {step.id === 1 && <i className="fa-regular fa-circle-info" style={{ fontSize: 11, color: '#aab4c8' }} />}
          </div>
        </div>
      </div>

      {/* Prazo / Tempo */}
      <div style={{ display: 'flex', gap: 0, marginTop: 8, paddingLeft: isActive ? 6 : 0 }}>
        <div style={{ flex: 1, borderRight: '1px solid #e5e7eb', paddingRight: 8 }}>
          <div style={{ fontSize: 10, color: '#7d7d7d' }}>Prazo</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{step.prazo}</div>
        </div>
        <div style={{ flex: 1, paddingLeft: 8 }}>
          <div style={{ fontSize: 10, color: '#7d7d7d' }}>Tempo na etapa</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{step.tempo}</div>
        </div>
      </div>

      {/* Assignees */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8, paddingLeft: isActive ? 6 : 0 }}>
        {step.assignees.map((a, i) => <TagPill key={i} label={a} />)}
      </div>
    </div>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────
export default function Emissao() {
  const navigate = useNavigate();
  const [expandedHistory, setExpandedHistory] = useState<number[]>([3]);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  const toggleHistory = (id: number) =>
    setExpandedHistory(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden', fontFamily: 'Open Sans, sans-serif' }}>

      {/* ── Faixa cinza lateral (collapsed history) ── */}
      <div style={{
        width: 49, flexShrink: 0, background: '#ebebeb',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 5px', gap: 8, overflowY: 'auto',
      }}>
        <i className="fa-regular fa-clock-rotate-left" style={{ fontSize: 18, color: '#565656' }} />
      </div>

      {/* ── Painel de histórico ── */}
      <div style={{
        width: 254, flexShrink: 0, background: 'white',
        borderRight: '1px solid #ebebeb', borderBottomRightRadius: 8,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Topo do painel */}
        <div style={{ padding: '16px 10px 10px', flexShrink: 0 }}>
          {/* Título + fechar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>Histórico</span>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#7d7d7d', display: 'flex', alignItems: 'center' }}>
              <i className="fa-regular fa-xmark" style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Buscar anexo */}
          <button style={{
            width: '100%', height: 24, background: 'white',
            border: '1.5px solid #0058db', borderRadius: 6, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, color: '#0058db',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <i className="fa-regular fa-magnifying-glass" style={{ fontSize: 11 }} />
            Buscar anexo
          </button>

          {/* Ordenação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 12, color: '#333' }}>Mais recentes primeiro</span>
            <i className="fa-regular fa-arrow-down-short-wide" style={{ fontSize: 12, color: '#333' }} />
          </div>
        </div>

        {/* Lista de histórico */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 16px' }}>
          {HISTORY.map(group => (
            <div key={group.label}>
              {/* Pílula de data */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, marginTop: 4 }}>
                <span style={{
                  background: '#dce6f5', borderRadius: 8, padding: '4px 8px',
                  fontSize: 12, color: '#333',
                }}>
                  {group.label}
                </span>
              </div>

              {/* Itens */}
              {group.items.map(item => {
                const isOpen = expandedHistory.includes(item.id);
                return (
                  <div key={item.id} style={{
                    background: 'white', border: '1px solid #ebebeb', borderRadius: 8,
                    padding: 10, marginBottom: 8,
                  }}>
                    {/* Header do item */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: item.count || (item.files && item.files.length > 0) ? 8 : 0, borderBottom: (isOpen && item.files && item.files.length > 0) ? '1px solid #ebebeb' : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>{item.name}</span>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12, fontWeight: 600, color: '#0058db' }}>
                            Ver
                          </button>
                        </div>
                        {item.count && (
                          <span style={{ fontSize: 12, color: '#333' }}>{item.count}</span>
                        )}
                      </div>
                      {item.files && item.files.length > 0 && (
                        <button
                          onClick={() => toggleHistory(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#565656', display: 'flex', alignItems: 'center' }}
                        >
                          <i className={`fa-regular ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: 13 }} />
                        </button>
                      )}
                    </div>

                    {/* Arquivos expandidos */}
                    {isOpen && item.files && item.files.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <i className="fa-regular fa-file-pdf" style={{ fontSize: 13, color: '#565656' }} />
                          <span style={{ fontSize: 12, color: '#194280', cursor: 'pointer' }}>{f}</span>
                        </div>
                        <i className="fa-regular fa-file-signature" style={{ fontSize: 11, color: '#7d7d7d' }} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Conteúdo principal ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f4f6f9', minWidth: 0 }}>

        {/* Toolbar do visualizador */}
        <div style={{
          background: 'white', borderBottom: '1px solid #ebebeb',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 38, flexShrink: 0, position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-regular fa-chevron-left" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-star" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-rotate-left" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-rotate-right" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-file-lines" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-eye" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-ellipsis-vertical" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#333' }}>
              <strong>01</strong> de <span>524</span>
            </span>
            <i className="fa-regular fa-angle-left" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
            <i className="fa-regular fa-angle-right" style={{ fontSize: 14, color: '#565656', cursor: 'pointer' }} />
          </div>
        </div>

        {/* Card principal do processo */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: 'white', border: '1px solid #ebebeb',
            borderRadius: 8, overflow: 'hidden',
          }}>

            {/* ── Cabeçalho do processo ── */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #ebebeb' }}>
              {/* Título + badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#565656' }}>
                  Processo Administrativo 186/2025
                </span>
                <Badge label="Urgente" color="#c0182d" />
                <Badge label="Marcador 02" color="#0058db" withIcon />
              </div>

              {/* Sub-row: tipo + descrição */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <Badge label="Solicitação de compra" outlined color="#0058db" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#565656' }}>
                  Compra de curso para o time de Ux
                </span>
              </div>

              {/* Ações + código externo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#0058db', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className="fa-regular fa-tag" style={{ fontSize: 12 }} />
                    Aplicar marcadores
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#0058db', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className="fa-regular fa-calendar" style={{ fontSize: 12 }} />
                    Atribuir Prazos
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#0058db', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className="fa-regular fa-sitemap" style={{ fontSize: 12 }} />
                    Árvore unificada
                  </button>
                </div>
                <span style={{ fontSize: 13, color: '#565656' }}>
                  Código externo: <strong style={{ color: '#333' }}>517.317.664.081.040.28</strong>
                </span>
              </div>
            </div>

            {/* ── Etapas ── */}
            <div style={{ padding: '12px 16px' }}>
              {/* Etapa atual + meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#333' }}>
                  Etapa atual: <strong>Aprovação do solicitante</strong>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, color: '#565656' }}>Prazo: <strong>9 Dias</strong></span>
                  <span style={{ fontSize: 13, color: '#565656' }}>Tempo na etapa: <strong>8 Dias</strong></span>
                  <button
                    onClick={() => setShowAllSteps(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0058db', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    Ver todas as etapas
                    <i className={`fa-regular ${showAllSteps ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: 11 }} />
                  </button>
                </div>
              </div>

              {/* Cards das etapas */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {(showAllSteps ? STEPS : STEPS).map((step, idx) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <StepCard step={step} />
                    {idx < STEPS.length - 1 && (
                      <div style={{ width: 16, height: 2, background: '#e5e7eb', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tabela de prazos ── */}
            <div style={{ marginTop: 4 }}>
              {/* Header da tabela */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 1fr 100px',
                background: '#1a2942', padding: '8px 16px',
                gap: 0,
              }}>
                {['Prazo','Vencimento','Lembrete','Visibilidade','Ação'].map(h => (
                  <span key={h} style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{h}</span>
                ))}
              </div>

              {/* Linhas */}
              {DEADLINES.map((row, i) => (
                <div key={row.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr 1fr 100px',
                  padding: '8px 16px', gap: 0,
                  borderBottom: i < DEADLINES.length - 1 ? '1px solid #f0f2f5' : 'none',
                  background: 'white',
                }}>
                  <span style={{ fontSize: 13, color: '#333' }}>{row.prazo}</span>
                  <span style={{ fontSize: 13, color: '#565656' }}>{row.vencimento}</span>
                  <span style={{ fontSize: 13, color: '#333' }}>{row.lembrete}</span>
                  <span style={{ fontSize: 13, color: '#333' }}>{row.visibilidade}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <i className="fa-regular fa-pen" style={{ fontSize: 13, color: '#0058db', cursor: 'pointer' }} />
                    <i className="fa-regular fa-check" style={{ fontSize: 13, color: '#0058db', cursor: 'pointer' }} />
                    <i className="fa-regular fa-calendar" style={{ fontSize: 13, color: '#0058db', cursor: 'pointer' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Seção de atividade / timeline ── */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: 'white', border: '1px solid #ebebeb', borderRadius: 8, overflow: 'hidden',
          }}>
            {/* Header da seção */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid #ebebeb',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>Atividade</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, color: '#333' }}>Mais recentes primeiro</span>
                  <i className="fa-regular fa-arrow-down-short-wide" style={{ fontSize: 12, color: '#333' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: '#565656' }}>Mostrar:</span>
                  <button style={{ background: 'none', border: '1px solid #dde3ee', borderRadius: 6, padding: '2px 8px', fontSize: 12, color: '#565656', cursor: 'pointer' }}>
                    Todos os tipos
                    <i className="fa-regular fa-chevron-down" style={{ fontSize: 10, marginLeft: 4 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Eventos */}
            {EVENTS.slice(0, showMoreEvents ? undefined : 3).map(ev => (
              <div key={ev.id} style={{
                display: 'flex', gap: 12, padding: '12px 16px',
                borderBottom: '1px solid #f4f6f9',
              }}>
                {/* Icon column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#f0f4fb', border: '1px solid #dde3ee',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className={ev.icon} style={{ fontSize: 11, color: '#565656' }} />
                  </div>
                  <div style={{ width: 1, flex: 1, background: '#e5e7eb', minHeight: 12 }} />
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ fontSize: 11, color: '#7d7d7d', marginBottom: 4 }}>{ev.date}</div>
                  <div style={{ fontSize: 13, color: '#333', lineHeight: '18px' }}>{ev.content}</div>
                </div>

                {/* Botão reenviar */}
                <button style={{ background: 'none', border: '1px solid #dde3ee', borderRadius: 6, padding: '2px 10px', fontSize: 12, color: '#565656', cursor: 'pointer', height: 24, alignSelf: 'flex-start', flexShrink: 0 }}>
                  Reenviar
                </button>
              </div>
            ))}

            {/* Ver mais */}
            <div style={{ padding: '8px 16px 12px', display: 'flex', justifyContent: 'center', borderTop: '1px solid #f4f6f9', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: '#e5e7eb', zIndex: 0 }} />
              <button
                onClick={() => setShowMoreEvents(v => !v)}
                style={{ background: 'white', border: '1px solid #dde3ee', borderRadius: 6, padding: '6px 18px', fontSize: 13, fontWeight: 600, color: '#565656', cursor: 'pointer', position: 'relative', zIndex: 1 }}
              >
                {showMoreEvents ? 'Ver menos' : 'Ver mais 5'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Despachos ── */}
        <div style={{ padding: '16px' }}>

          {/* Despacho 10 */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
            {/* Timeline connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 42, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0f4fb', border: '1px solid #dde3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-regular fa-turn-left" style={{ fontSize: 12, color: '#565656' }} />
              </div>
              <div style={{ width: 1, flex: 1, background: '#e5e7eb', minHeight: 12 }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6, display: 'block' }}>
                Despacho 10 - 965/2025
              </span>

              <div style={{ background: '#f4fef7', border: '1px solid #c6f0d5', borderRadius: 8, overflow: 'hidden' }}>
                {/* Header do despacho */}
                <div style={{ padding: '12px 16px', background: '#eafaf1', borderBottom: '1px solid #c6f0d5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: '#565656' }}>De:</span>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dce6f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0058db' }}>OS</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Oswaldo Silva</span>
                      <span style={{ fontSize: 13, color: '#565656' }}>Diretor do departamento</span>
                      <Badge label="Setor" outlined color="#0058db" />
                    </div>
                    <button style={{ background: 'none', border: '1px solid #dde3ee', borderRadius: 6, padding: '2px 8px', fontSize: 12, color: '#565656', cursor: 'pointer' }}>
                      <i className="fa-regular fa-ellipsis" />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: '#565656' }}>Para:</span>
                      <Badge label="SADM - Secretaria de Administração" outlined color="#0058db" />
                      <span style={{ fontSize: 13, color: '#565656', marginLeft: 8 }}>CC:</span>
                      {['SAJBC','SAJJV','SAIUD','SAEIDH','SAEEE'].map(s => (
                        <Badge key={s} label={s} outlined color="#0058db" />
                      ))}
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#565656' }}>+3 outros</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#7d7d7d', flexShrink: 0 }}>Qua, 08/08/2025 08:08</span>
                  </div>
                </div>

                {/* Corpo do despacho */}
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: 13, color: '#333', marginBottom: 12, lineHeight: '20px' }}>
                    Prezados,<br />
                    Seguem os dados da dotação orçamentária
                  </p>

                  {/* Tabela de dados */}
                  <table style={{ borderCollapse: 'collapse', border: '1px solid #dde3ee', marginBottom: 16, width: 'auto' }}>
                    <tbody>
                      {[
                        ['Entidade:', '1Doc'],
                        ['Órgão:',    '12 - Setor de Compras'],
                        ['Unidade:',  '001 - Setor de Compras'],
                        ['Atividade:','Compra de material'],
                        ['Recurso:',  'R$ 200.000,00'],
                        ['Dotação:',  '119'],
                        ['Elemento:', '3.3.90.3001'],
                        ['Valor:',    'R$ 20.000,00'],
                      ].map(([label, val]) => (
                        <tr key={label}>
                          <td style={{ fontSize: 13, color: '#565656', padding: '6px 12px', border: '1px solid #dde3ee', whiteSpace: 'nowrap', background: '#fafbfc' }}>{label}</td>
                          <td style={{ fontSize: 13, color: '#333',    padding: '6px 12px', border: '1px solid #dde3ee', minWidth: 200 }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Assinatura */}
                  <div style={{ fontSize: 12, color: '#7d7d7d', lineHeight: '18px', marginBottom: 16 }}>
                    Atenciosamente,<br />
                    Oswaldo F. Cardoso Block<br />
                    Contador CRC S/C 02321464/0-1<br />
                    Prefeitura Municipal de Ilhota<br />
                    Secretaria Municipal de Finanças
                  </div>

                  {/* Folha de rosto */}
                  <button style={{
                    background: 'white', border: '1px solid #aab4c8', borderRadius: 6,
                    padding: '5px 14px', fontSize: 13, color: '#333', cursor: 'pointer', marginBottom: 10,
                  }}>
                    Folha de rosto: contém documento físico
                  </button>

                  {/* Avaliação */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: '#565656' }}>Avaliação:</span>
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className={s <= 2 ? 'fa-solid fa-star' : 'fa-regular fa-star'} style={{ fontSize: 14, color: s <= 2 ? '#f59e0b' : '#dde3ee', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '8px 16px', borderTop: '1px solid #c6f0d5', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#565656' }}>Visualizado por:</span>
                  <span style={{
                    background: '#0058db', color: 'white', borderRadius: 100,
                    padding: '2px 10px', fontSize: 11, fontWeight: 600,
                  }}>
                    2 ou mais pessoas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Despacho 09 - card mais simples */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 42, flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f0f4fb', border: '1px solid #dde3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-regular fa-turn-left" style={{ fontSize: 12, color: '#565656' }} />
              </div>
              <div style={{ width: 1, flex: 1, background: '#e5e7eb' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6, display: 'block' }}>
                Despacho 09 - 964/2025
              </span>

              <div style={{ background: '#f4fef7', border: '1px solid #c6f0d5', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#eafaf1', borderBottom: '1px solid #c6f0d5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#565656' }}>De:</span>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#dce6f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0058db' }}>CL</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Cris Lima</span>
                    <span style={{ fontSize: 13, color: '#565656' }}>Ux Designer</span>
                    <span style={{ fontSize: 12, color: '#7d7d7d', marginLeft: 'auto' }}>Ter, 07/08/2025 14:22</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#565656' }}>Para:</span>
                    <Badge label="Responsáveis" outlined color="#0058db" />
                    <span style={{ fontSize: 13, color: '#565656', marginLeft: 8 }}>CC:</span>
                    <Badge label="Setores envolvidos" outlined color="#0058db" />
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: 13, color: '#333', lineHeight: '20px', marginBottom: 12 }}>
                    Boa tarde,<br />
                    Curso de UX Design para a equipe inteira que acontecerá nos dias 20/08 a 25/08/2025.
                  </p>
                  <p style={{ fontSize: 13, color: '#333', lineHeight: '20px', marginBottom: 8 }}>
                    <strong>Documento de formalização de demanda</strong>
                  </p>
                  <p style={{ fontSize: 13, color: '#565656', lineHeight: '18px', marginBottom: 4 }}>
                    Setor requisitante (unidade/setor/departamento): <strong>Time de UX</strong>
                  </p>
                  <p style={{ fontSize: 13, color: '#565656', lineHeight: '18px', marginBottom: 4 }}>
                    Responsável pela demanda: <strong>Cris</strong> — Matrícula: <strong>93033</strong>
                  </p>
                  <p style={{ fontSize: 13, color: '#565656', lineHeight: '18px' }}>
                    Objeto: O TIME DE UX DESIGN VAI FAZER UMA VIAGEM PARA REALIZAR UM CURSO DE UX DESIGN...
                  </p>
                </div>
                <div style={{ padding: '8px 16px', borderTop: '1px solid #c6f0d5', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#565656' }}>Visualizado por:</span>
                  <span style={{ background: '#0058db', color: 'white', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                    1 pessoa
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* fim padding bottom */}
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
