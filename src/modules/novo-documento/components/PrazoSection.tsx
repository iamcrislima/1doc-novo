import { useNovoDocumentoCtx } from "../context";

export function PrazoSection() {
  const {
    secoes, toggleSecao,
    prazoTitulo, setPrazoTitulo,
    prazoData, setPrazoData,
    prazoHorario, setPrazoHorario,
  } = useNovoDocumentoCtx();

  return (
    <div className="ndm-section">
      <button className="ndm-section-trigger" onClick={() => toggleSecao("prazo")}>
        <span>Adicionar prazo/Atividade</span>
        <i className={`fa-regular fa-chevron-${secoes.prazo ? "up" : "down"}`} />
      </button>
      {secoes.prazo && (
        <div className="ndm-section-body">
          <div className="ndm-row-2">
            <div className="ndm-field">
              <label className="ndm-label">Título da atividade</label>
              <input
                className="ndm-input"
                placeholder="Ex: Entregar documento assinado"
                value={prazoTitulo}
                onChange={(e) => setPrazoTitulo(e.target.value)}
              />
            </div>
            <div className="ndm-field">
              <label className="ndm-label">Lembrete</label>
              <select className="ndm-select">
                <option>Nenhum</option>
                <option>1 hora antes</option>
                <option>1 dia antes</option>
              </select>
            </div>
          </div>
          <div className="ndm-row-3">
            <div className="ndm-field">
              <label className="ndm-label">Data do prazo</label>
              <input
                className="ndm-input"
                type="date"
                value={prazoData}
                onChange={(e) => setPrazoData(e.target.value)}
              />
            </div>
            <div className="ndm-field">
              <label className="ndm-label">Horário</label>
              <input
                className="ndm-input"
                type="time"
                value={prazoHorario}
                onChange={(e) => setPrazoHorario(e.target.value)}
              />
            </div>
            <div className="ndm-field">
              <label className="ndm-label">Visibilidade</label>
              <select className="ndm-select">
                <option>Todos os envolvidos</option>
                <option>Somente eu</option>
              </select>
            </div>
          </div>
          <div className="ndm-field">
            <label className="ndm-label">Descrição da atividade</label>
            <textarea
              style={{
                width: "100%", border: "1px solid var(--border-medium)",
                borderRadius: 6, padding: "8px 10px", fontSize: 13,
                fontFamily: "inherit", color: "var(--text-primary)",
                resize: "vertical", minHeight: 72, outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Descreva o que precisa ser feito..."
            />
          </div>
          <button className="ndm-add-btn">+ Adicionar prazo</button>
        </div>
      )}
    </div>
  );
}
