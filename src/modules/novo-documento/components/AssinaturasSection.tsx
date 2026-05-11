// TODO: drag-and-drop de assinaturas é visual (ícone fa-grip-dots-vertical sem handler).
//       Implementar reordenação com @dnd-kit/sortable ou react-beautiful-dnd.
// TODO: "Lista padrão" de assinantes é mock — substituir por GET /api/listas-assinantes.
// TODO: Usuários internos/externos adicionados via chips mas sem integração com API de usuários.
import { useNovoDocumentoCtx } from "../context";

export function AssinaturasSection() {
  const {
    secoes, toggleSecao,
    assinaturaType, setAssinaturaType,
    sequencial, setSequencial,
    internos, setInternos,
    externos, setExternos,
    assinaturas, setAssinaturas,
  } = useNovoDocumentoCtx();

  return (
    <div className="ndm-section">
      <button className="ndm-section-trigger" onClick={() => toggleSecao("assinaturas")}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Assinaturas</span>
        <i className={`fa-regular fa-chevron-${secoes.assinaturas ? "up" : "down"}`} style={{ fontSize: 12, color: "var(--text-tertiary)" }} />
      </button>
      {secoes.assinaturas && (
        <div className="ndm-section-body">
          <div style={{ marginBottom: 4 }}>
            <div className="ndm-sig-group-title">Minha assinatura</div>
            <div className="ndm-sig-group-desc">Assine documentos de forma rápida e segura.</div>
            <div className="ndm-sig-radio-row">
              <button
                className={`ndm-radio-btn ${assinaturaType === "eletronica" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`}
                onClick={() => setAssinaturaType("eletronica")}
              >
                <span className={`ndm-radio-circle ${assinaturaType === "eletronica" ? "ndm-radio-circle--filled" : ""}`} />
                Assinatura eletrônica
              </button>
              <button
                className={`ndm-radio-btn ${assinaturaType === "icp" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`}
                onClick={() => setAssinaturaType("icp")}
              >
                <span className={`ndm-radio-circle ${assinaturaType === "icp" ? "ndm-radio-circle--filled" : ""}`} />
                Certificado ICP - Brasil
              </button>
              <select className="ndm-sig-mode-select">
                <option value="">Modo de assinatura</option>
                <option>Simples</option>
                <option>Avançado</option>
              </select>
            </div>
          </div>
          <div className="ndm-sig-divider" />
          <div>
            <div className="ndm-sig-group-title">Solicitar assinatura(s)</div>
            <div className="ndm-sig-group-desc">Peça a assinatura de outras pessoas para concluir o documento.</div>
            <div className="ndm-field" style={{ marginBottom: 12 }}>
              <label className="ndm-label">Enviar para lista de assinantes*</label>
              <div className="ndm-email-row">
                <select className="ndm-select" style={{ flex: 1 }}>
                  <option value="">Selecione uma lista</option>
                  <option>Lista padrão</option>
                </select>
                <button className="ndm-gerar-btn">
                  <i className="fa-regular fa-gear" /> Gerenciar Listas
                </button>
              </div>
            </div>
            <div className="ndm-user-group-label">Usuários internos</div>
            <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
              {internos.map((u, i) => (
                <span key={u} className="ndm-chip ndm-chip--user">
                  {u}
                  <button className="ndm-chip-remove" onClick={() => setInternos((p) => p.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
            </div>
            <div className="ndm-user-group-label">Contato externo</div>
            <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
              {externos.map((u, i) => (
                <span key={u} className="ndm-chip ndm-chip--user">
                  {u}
                  <button className="ndm-chip-remove" onClick={() => setExternos((p) => p.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
            </div>
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={sequencial} onChange={(e) => setSequencial(e.target.checked)} />
              Requerer assinaturas em ordem sequencial
            </label>
          </div>
          {sequencial && (
            <div className="ndm-sig-table-wrap">
              <div className="ndm-sig-table-header">
                <div style={{ width: 28 }} />
                <div style={{ width: 60 }}>Ordem</div>
                <div style={{ flex: 1 }}>Assinante</div>
                <div style={{ width: 110 }} />
                <div style={{ width: 110 }}>Função</div>
                <div style={{ width: 36 }} />
              </div>
              <div className="ndm-sig-rows">
                {assinaturas.map((row, i) => (
                  <div key={`${row.assinante}-${i}`} className="ndm-sig-row">
                    <span className="ndm-drag-handle">
                      <i className="fa-regular fa-grip-dots-vertical" />
                    </span>
                    <input
                      className="ndm-order-input"
                      value={row.ordem}
                      onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, ordem: e.target.value } : a))}
                    />
                    <span className="ndm-sig-row-name">{row.assinante}</span>
                    <select
                      className="ndm-table-select"
                      value={row.papel}
                      onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, papel: e.target.value } : a))}
                    >
                      <option>Parte</option>
                      <option>Testemunha</option>
                      <option>Advogado</option>
                    </select>
                    <select
                      className="ndm-table-select"
                      value={row.funcao}
                      onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, funcao: e.target.value } : a))}
                    >
                      <option>Assinar</option>
                      <option>Reconhecer</option>
                      <option>Validar</option>
                    </select>
                    <button
                      className="ndm-del-btn"
                      onClick={() => setAssinaturas((p) => p.filter((_, idx) => idx !== i))}
                    >
                      <i className="fa-regular fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
