import { useNovoDocumentoCtx } from "../context";
import { MOCK_LISTAS_ENVIO, MOCK_PESSOAS } from "../constants";

export function CcPanel() {
  const {
    showCC, setShowCC,
    ccChips, setCcChips,
    ccInput, setCcInput,
    showCcSuggestions, setShowCcSuggestions,
    ccListaSelecionada, setCcListaSelecionada,
    addChip,
  } = useNovoDocumentoCtx();

  const filteredPessoas = ccInput.trim().length > 0
    ? MOCK_PESSOAS.filter(p =>
        p.toLowerCase().includes(ccInput.toLowerCase()) && !ccChips.includes(p)
      )
    : [];

  if (!showCC) return null;

  return (
    <div className="ndm-field ndm-cc-panel">
      <div className="ndm-cc-header">
        <label className="ndm-label" style={{ margin: 0 }}>Com cópia</label>
        <button
          className="ndm-action-btn"
          style={{ fontSize: 11, color: "var(--danger)" }}
          onClick={() => {
            setShowCC(false);
            setCcChips([]);
            setCcInput("");
            setCcListaSelecionada("");
          }}
        >
          × Remover CC
        </button>
      </div>
      <select
        className="ndm-select"
        style={{ marginBottom: 6 }}
        value={ccListaSelecionada}
        onChange={(e) => {
          const lista = e.target.value;
          setCcListaSelecionada(lista);
          if (lista && MOCK_LISTAS_ENVIO[lista]) {
            const novas = MOCK_LISTAS_ENVIO[lista].filter(p => !ccChips.includes(p));
            setCcChips(prev => [...prev, ...novas]);
          }
        }}
      >
        <option value="">Ou selecione uma lista de envio...</option>
        {Object.keys(MOCK_LISTAS_ENVIO).map(l => <option key={l}>{l}</option>)}
      </select>
      <div className="ndm-setor-picker">
        <div className="ndm-para-row">
          {ccChips.map((chip, i) => (
            <span key={chip} className="ndm-chip">
              <i className="fa-regular fa-user" style={{ fontSize: 10 }} />
              {chip}
              <button
                className="ndm-chip-remove"
                onClick={() => setCcChips(p => p.filter((_, idx) => idx !== i))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={ccChips.length === 0 ? "Buscar pessoa por nome..." : ""}
            value={ccInput}
            onChange={(e) => {
              setCcInput(e.target.value);
              setShowCcSuggestions(e.target.value.trim().length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ccInput.trim() && filteredPessoas.length === 0) {
                addChip(ccInput, setCcChips, setCcInput);
                setShowCcSuggestions(false);
              }
            }}
          />
        </div>
        {showCcSuggestions && filteredPessoas.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredPessoas.map(p => (
              <button
                key={p}
                className="ndm-setor-item"
                onClick={() => {
                  setCcChips(prev => [...prev, p]);
                  setCcInput("");
                  setShowCcSuggestions(false);
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
