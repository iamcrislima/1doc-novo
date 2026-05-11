import { useNovoDocumentoCtx } from "../context";
import { MOCK_PESSOAS } from "../constants";

export function CuidadosPanel() {
  const {
    showCuidados, setShowCuidados,
    cuidadosChips, setCuidadosChips,
    cuidadosInput, setCuidadosInput,
    showCuidadosSuggestions, setShowCuidadosSuggestions,
    addChip,
  } = useNovoDocumentoCtx();

  const filteredCuidadosPessoas = cuidadosInput.trim().length > 0
    ? MOCK_PESSOAS.filter(p =>
        p.toLowerCase().includes(cuidadosInput.toLowerCase()) && !cuidadosChips.includes(p)
      )
    : [];

  if (!showCuidados) return null;

  return (
    <div className="ndm-field ndm-cc-panel">
      <div className="ndm-cc-header">
        <label className="ndm-label" style={{ margin: 0 }}>Aos cuidados</label>
        <button
          className="ndm-action-btn"
          style={{ fontSize: 11, color: "var(--danger)" }}
          onClick={() => {
            setShowCuidados(false);
            setCuidadosChips([]);
            setCuidadosInput("");
            setShowCuidadosSuggestions(false);
          }}
        >
          × Remover
        </button>
      </div>
      <div className="ndm-setor-picker">
        <div className="ndm-para-row">
          {cuidadosChips.map((chip, i) => (
            <span key={`cuidados-${i}-${chip}`} className="ndm-chip">
              <i className="fa-regular fa-user" style={{ fontSize: 10 }} />
              {chip}
              <button
                className="ndm-chip-remove"
                onClick={() => setCuidadosChips((p) => p.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={cuidadosChips.length === 0 ? "Nome do responsável..." : ""}
            value={cuidadosInput}
            onChange={(e) => {
              setCuidadosInput(e.target.value);
              setShowCuidadosSuggestions(e.target.value.trim().length > 0);
            }}
            onKeyDown={(e) => e.key === "Enter" && addChip(cuidadosInput, setCuidadosChips, setCuidadosInput)}
          />
        </div>
        {showCuidadosSuggestions && filteredCuidadosPessoas.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredCuidadosPessoas.map(p => (
              <button
                key={p}
                className="ndm-setor-item"
                onClick={() => {
                  setCuidadosChips(prev => [...prev, p]);
                  setCuidadosInput("");
                  setShowCuidadosSuggestions(false);
                }}
              >
                <i className="fa-regular fa-user" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
