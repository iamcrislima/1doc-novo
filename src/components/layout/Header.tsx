import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

const LISTAR_ITEMS = [
  { id: "list-memorandos",      icon: "fa-regular fa-memo",                   label: "Memorandos" },
  { id: "list-documentos",      icon: "fa-regular fa-file-lines",             label: "Documentos" },
  { id: "list-atas",            icon: "fa-regular fa-clipboard",              label: "Atas" },
  { id: "list-circulares",      icon: "fa-regular fa-bullhorn",               label: "Circulares" },
  { id: "list-oficios",         icon: "fa-regular fa-envelope",               label: "Ofícios" },
  { id: "list-alvaras",         icon: "fa-regular fa-file-certificate",       label: "Alvarás" },
  { id: "list-ouvidorias",      icon: "fa-regular fa-comments",               label: "Ouvidorias" },
  { id: "list-chamados",        icon: "fa-regular fa-screwdriver-wrench",     label: "Chamados" },
  { id: "list-sessoes",         icon: "fa-regular fa-gavel",                  label: "Sessões Plenárias" },
  { id: "list-protocolos",      icon: "fa-regular fa-receipt",                label: "Protocolos" },
  { id: "list-fiscalizacoes",   icon: "fa-regular fa-clipboard-list-check",   label: "Fiscalizações" },
  { id: "list-proc-adm",        icon: "fa-regular fa-scale-balanced",         label: "Proc. Administrativos" },
  { id: "list-atos",            icon: "fa-regular fa-file-shield",            label: "Atos oficiais" },
  { id: "list-entrada-dados",   icon: "fa-regular fa-database",               label: "Entradas de dados" },
];

const USER_MENU_ITEMS_1 = [
  { id: "plano",     label: "Plano 1Doc" },
  { id: "ajuda",     label: "Central de Ajuda" },
  { id: "novidades", label: "Novidades" },
  { id: "blog",      label: "Blog da 1Doc" },
];

const USER_MENU_ITEMS_2 = [
  { id: "adm",    label: "Administração" },
  { id: "relat",  label: "Relatórios" },
  { id: "atend",  label: "Central de Atendimento" },
  { id: "suporte",label: "Chat com Suporte" },
];

interface HeaderProps {
  onNovoClick: () => void;
}

export default function Header({ onNovoClick }: HeaderProps) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);

  useClickOutside(menuRef, () => setOpenMenu(null));

  const toggle = (id: string) => setOpenMenu((prev) => (prev === id ? null : id));

  return (
    <header className="onb-header" ref={menuRef}>
      <div className="onb-header__left">
        <span className="onb-header__logo" onClick={() => navigate("/")}>1Doc</span>

        <nav className="onb-header__nav">
          {/* Novo — primeiro botão, abre modal */}
          <button className="onb-header__novo-btn" onClick={onNovoClick}>
            <i className="fa-regular fa-plus" />
            Novo
          </button>

          {/* Inbox */}
          <span className="onb-header__nav-item" onClick={() => toggle("inbox")}>
            Inbox <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            {openMenu === "inbox" && (
              <div className="onb-header__dropdown">
                <div className="onb-header__dropdown-item">Inbox de SADM</div>
                <div className="onb-header__dropdown-item">Inbox pessoal</div>
              </div>
            )}
          </span>

          {/* Listar */}
          <span className="onb-header__nav-item" onClick={() => toggle("listar")}>
            Listar <span className="onb-header__badge">4</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }} />
            {openMenu === "listar" && (
              <div className="onb-header__dropdown onb-header__dropdown--tall">
                {LISTAR_ITEMS.map((item) => (
                  <div key={item.id} className="onb-header__dropdown-item">
                    <i className={item.icon} style={{ width: 18, textAlign: "center", color: "var(--text-secondary)" }} />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </span>

          <span className="onb-header__nav-item">Fila de Assinaturas</span>
        </nav>
      </div>

      <div className="onb-header__right">
        {/* Search */}
        <div className="onb-header__search">
          <input className="onb-header__search-input" type="text" placeholder="Buscar" readOnly />
          <i className="fa-solid fa-magnifying-glass onb-header__search-icon" />
        </div>

        {/* Action icons */}
        <div className="onb-header__actions">
          <span className="onb-header__action-btn"><i className="fa-regular fa-desktop" /></span>
          <span className="onb-header__action-btn">
            <i className="fa-regular fa-bell" />
            <span className="onb-header__bell-dot" />
          </span>
        </div>

        {/* User */}
        <div className="onb-header__user" onClick={() => toggle("user")}>
          <div className="onb-header__avatar">CL</div>
          <span>Cris Lima</span>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, color: "var(--text-tertiary)" }} />

          {openMenu === "user" && (
            <div className="onb-header__dropdown onb-header__dropdown--user">
              <div className="onb-header__user-info">
                <div>
                  <strong>Cris - Administrador</strong>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>cris.lima@1doc.com.br</div>
                </div>
                <div className="onb-header__user-avatar-lg">CL</div>
              </div>

              <button className="onb-header__user-pref-btn">Preferências da conta</button>

              <div className="onb-header__dropdown-divider" />
              {USER_MENU_ITEMS_1.map((item) => (
                <div key={item.id} className="onb-header__dropdown-item">{item.label}</div>
              ))}

              <div className="onb-header__dropdown-divider" />
              {USER_MENU_ITEMS_2.map((item) => (
                <div
                  key={item.id}
                  className="onb-header__dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id === 'adm') {
                      navigate('/administrativo');
                      setOpenMenu(null);
                    }
                  }}
                >
                  {item.label}
                </div>
              ))}

              <div className="onb-header__dropdown-divider" />
              <div className="onb-header__dropdown-item" style={{ color: "var(--danger)" }}>
                <i className="fa-regular fa-arrow-right-from-bracket" style={{ width: 18, textAlign: "center", color: "var(--danger)" }} />
                Sair
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
