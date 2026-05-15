import { useState } from 'react';
import IdentidadeSection from './IdentidadeSection';
import SetoresTab from './SetoresTab';
import CargosEFuncoesTab from './CargosEFuncoesTab';
import GestaoUsuariosTab from './GestaoUsuariosTab';
import MarcadoresTab from './MarcadoresTab';
import TiposDocumentosTab from './TiposDocumentosTab';
import AssuntosTab from './AssuntosTab';
import ModelosDocumentosTab from './ModelosDocumentosTab';
import ListasAssinantesTab from './ListasAssinantesTab';
import CartaServicosTab from './CartaServicosTab';
import CarimbosDigitaisTab from './CarimbosDigitaisTab';
import {
  ConfiguracaoTab, ServicosTab, CategoriasTab, PerfisTab,
  OrgaosTab, SistemasTab, PoliticaTab,
} from './CentralAtendimentoTab';

/* ── tipos ─────────────────────────────────────────────────────────── */

type SectionId =
  | 'identidade' | 'setores' | 'cargos-funcoes' | 'carimbos-digitais'
  | 'assuntos' | 'tipos-documentos' | 'modelos-documentos' | 'marcadores'
  | 'fluxo-assinaturas' | 'carta-servicos'
  | 'gestao-usuarios' | 'perfis-acesso'
  | 'ca-config' | 'ca-servicos' | 'ca-categorias' | 'ca-perfis'
  | 'ca-orgaos' | 'ca-sistemas' | 'ca-politica';

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
      { id: 'assuntos',           label: 'Assuntos' },
      { id: 'tipos-documentos',   label: 'Tipos de documentos' },
      { id: 'modelos-documentos', label: 'Modelos de documentos' },
      { id: 'marcadores',         label: 'Marcadores' },
      { id: 'fluxo-assinaturas',  label: 'Fluxo de Assinaturas' },
      { id: 'carta-servicos',     label: 'Carta de serviços' },
    ],
  },
  {
    id: 'usuarios', label: 'Usuários e permissões', icon: 'fa-regular fa-user-shield',
    items: [
      { id: 'gestao-usuarios', label: 'Gestão de usuários' },
      { id: 'perfis-acesso',   label: 'Perfis de acesso' },
    ],
  },
  {
    id: 'atendimento', label: 'Central de atendimento', icon: 'fa-regular fa-headset',
    items: [
      { id: 'ca-config',     label: 'Configuração'           },
      { id: 'ca-servicos',   label: 'Serviços'               },
      { id: 'ca-categorias', label: 'Categorias'             },
      { id: 'ca-perfis',     label: 'Perfis'                 },
      { id: 'ca-orgaos',     label: 'Órgãos Responsáveis'   },
      { id: 'ca-sistemas',   label: 'Sistemas Integrados'   },
      { id: 'ca-politica',   label: 'Política de privacidade'},
    ],
  },
];

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
  const [active, setActive]         = useState<SectionId>('identidade');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['institucional']));

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const navigate = (id: SectionId) => {
    setActive(id);
    const group = NAV_GROUPS.find((g) => g.items.some((i) => i.id === id));
    if (group) setOpenGroups((prev) => new Set([...prev, group.id]));
  };

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === active);

  const renderContent = () => {
    switch (active) {
      case 'identidade':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: '#353535', lineHeight: 1.2 }}>
                Identidade
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 400, color: '#565656', lineHeight: 1.5 }}>
                Gerencie nome, brasão, logotipo e demais informações institucionais.
              </p>
            </div>
            <IdentidadeSection />
          </>
        );
      case 'setores':          return <SetoresTab />;
      case 'cargos-funcoes':   return <CargosEFuncoesTab />;
      case 'assuntos':          return <AssuntosTab />;
      case 'tipos-documentos': return <TiposDocumentosTab />;
      case 'marcadores':       return <MarcadoresTab />;
      case 'gestao-usuarios':       return <GestaoUsuariosTab />;
      case 'modelos-documentos':    return <ModelosDocumentosTab />;
      case 'fluxo-assinaturas':     return <ListasAssinantesTab />;
      case 'carta-servicos':        return <CartaServicosTab />;
      case 'carimbos-digitais':     return <CarimbosDigitaisTab />;
      case 'ca-config':     return <ConfiguracaoTab />;
      case 'ca-servicos':   return <ServicosTab />;
      case 'ca-categorias': return <CategoriasTab />;
      case 'ca-perfis':     return <PerfisTab />;
      case 'ca-orgaos':     return <OrgaosTab />;
      case 'ca-sistemas':   return <SistemasTab />;
      case 'ca-politica':   return <PoliticaTab />;
      default:
        return (
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
        );
    }
  };

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
                          onClick={() => navigate(item.id)}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '8px 12px',
                            background: active === item.id ? '#edf2ff' : 'none',
                            border: 'none', cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: active === item.id ? 700 : 600,
                            color: active === item.id ? '#0058db' : '#565656',
                            borderRadius: 6,
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
            {renderContent()}
          </div>
        </div>
      </div>

    </div>
  );
}
