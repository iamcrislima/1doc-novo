import { useState } from 'react';
import IdentidadeSection from './IdentidadeSection';
import SetoresTab from './SetoresTab';

/* ── tipos ─────────────────────────────────────────────────────────── */

type SectionId =
  | 'identidade' | 'setores' | 'cargos-funcoes' | 'carimbos-digitais'
  | 'assuntos' | 'tipos' | 'modelos' | 'listas-assinantes' | 'listas-envio' | 'carta-servico'
  | 'usuarios' | 'papeis'
  | 'central-atendimento';

interface NavItem { id: SectionId; label: string }
interface NavGroup { id: string; label: string; icon: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'institucional', label: 'Institucional', icon: 'fa-regular fa-building',
    items: [
      { id: 'identidade',        label: 'Identidade' },
      { id: 'setores',           label: 'Setores' },
      { id: 'cargos-funcoes',    label: 'Cargos e funções' },
      { id: 'carimbos-digitais', label: 'Carimbos digitais' },
    ],
  },
  {
    id: 'documentos', label: 'Documentos e processos', icon: 'fa-regular fa-folder-tree',
    items: [
      { id: 'assuntos',          label: 'Assuntos' },
      { id: 'tipos',             label: 'Tipos' },
      { id: 'modelos',           label: 'Modelos' },
      { id: 'listas-assinantes', label: 'Listas de assinantes' },
      { id: 'listas-envio',      label: 'Listas de envio' },
      { id: 'carta-servico',     label: 'Carta de serviço' },
    ],
  },
  {
    id: 'usuarios', label: 'Usuários e permissões', icon: 'fa-regular fa-user-shield',
    items: [
      { id: 'usuarios', label: 'Usuários' },
      { id: 'papeis',   label: 'Papéis' },
    ],
  },
  {
    id: 'atendimento', label: 'Central de atendimento', icon: 'fa-regular fa-headset',
    items: [{ id: 'central-atendimento', label: 'Central de atendimento' }],
  },
];

const SUBTITLES: Partial<Record<SectionId, string>> = {
  identidade: 'Gerencie nome, brasão, logotipo e demais informações institucionais.',
};

function PlaceholderSection({ label }: { label: string }) {
  return (
    <div style={{ padding: '56px 32px', textAlign: 'center', color: '#888' }}>
      <i className="fa-regular fa-screwdriver-wrench"
        style={{ fontSize: 38, color: '#c8c8c8', display: 'block', marginBottom: 14 }} />
      <div style={{ fontSize: 15, fontWeight: 700, color: '#555', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13 }}>Esta seção está em desenvolvimento.</div>
    </div>
  );
}

export default function Administrativo() {
  const [active, setActive]       = useState<SectionId>('identidade');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['institucional']));

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === active);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#f4f6f9', overflow: 'hidden',
      fontFamily: 'Open Sans, sans-serif',
    }}>

      {/* ── Corpo ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: 268, flexShrink: 0,
          background: 'white', overflowY: 'auto',
          padding: '16px 10px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {NAV_GROUPS.map((group) => {
            const isOpen    = openGroups.has(group.id);
            const hasActive = group.items.some((i) => i.id === active);

            return (
              <div key={group.id} style={{ width: 248 }}>
                {/* Cabeçalho do grupo */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: hasActive && isOpen ? '#dce6f5' : 'none',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={group.icon} style={{ fontSize: 16, width: 20, textAlign: 'center', color: '#333' }} />
                    <span style={{
                      fontSize: 14,
                      fontWeight: hasActive && isOpen ? 700 : 400,
                      color: '#333',
                    }}>
                      {group.label}
                    </span>
                  </div>
                  <i
                    className={`fa-regular fa-angle-${isOpen ? 'up' : 'down'}`}
                    style={{ fontSize: 14, color: '#333' }}
                  />
                </button>

                {/* Sub-itens */}
                {isOpen && (
                  <div style={{ padding: '4px 20px 4px' }}>
                    <div style={{
                      borderLeft: '2px solid #a3a3a3',
                      paddingLeft: 16,
                      display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActive(item.id)}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '8px 12px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: active === item.id ? 700 : 600,
                            color: '#565656',
                            fontFamily: 'Open Sans, sans-serif',
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Painel de conteúdo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 12px 12px' }}>
          <div style={{ background: 'white', borderRadius: 8, padding: '16px 16px 24px', minHeight: '100%' }}>
            {active === 'identidade' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#353535', lineHeight: 1.2 }}>
                    {activeItem?.label ?? ''}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#565656', lineHeight: 1.5 }}>
                    {SUBTITLES[active] ?? ''}
                  </p>
                </div>
                <IdentidadeSection />
              </>
            )}
            {active === 'setores' && <SetoresTab />}
            {active !== 'identidade' && active !== 'setores' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#353535', lineHeight: 1.2 }}>
                    {activeItem?.label ?? ''}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#565656', lineHeight: 1.5 }}>
                    Esta seção está em desenvolvimento.
                  </p>
                </div>
                <PlaceholderSection label={activeItem?.label ?? ''} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer sticky (full width) ─────────────────────── */}
      <div style={{
        flexShrink: 0, height: 72,
        background: 'white',
        boxShadow: '0px -8px 8px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 16, padding: '0 24px',
      }}>
        <button style={{
          height: 40, padding: '0 16px',
          border: '1px solid #b2132e', borderRadius: 8,
          background: 'white', color: '#b2132e',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Open Sans, sans-serif',
        }}>
          Cancelar
        </button>
        <button style={{
          height: 40, padding: '0 16px',
          border: 'none', borderRadius: 8,
          background: '#0058db', color: 'white',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Open Sans, sans-serif',
        }}>
          Salvar e continuar
        </button>
      </div>
    </div>
  );
}
