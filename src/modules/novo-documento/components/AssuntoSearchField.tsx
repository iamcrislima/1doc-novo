import { useNovoDocumentoCtx } from "../context";

interface AssuntoSearchFieldProps {
  lista: string[];
}

export function AssuntoSearchField({ lista }: AssuntoSearchFieldProps) {
  const {
    assuntoValue, setAssuntoValue,
    assuntoSearch, setAssuntoSearch,
    showAssuntoDrop, setShowAssuntoDrop,
  } = useNovoDocumentoCtx();

  return (
    <div className="ndm-field">
      <label className="ndm-label">Assunto*</label>
      <div className="ndm-setor-picker">
        <div className="ndm-select-custom" onClick={() => setShowAssuntoDrop(true)}>
          <input
            className="ndm-para-input"
            placeholder="Pesquisar assunto..."
            value={showAssuntoDrop ? assuntoSearch : assuntoValue}
            onChange={(e) => { setAssuntoSearch(e.target.value); setShowAssuntoDrop(true); }}
            onFocus={() => { setAssuntoSearch(""); setShowAssuntoDrop(true); }}
          />
          <i className="fa-regular fa-chevron-down" style={{ fontSize: 12, color: "var(--border-dark)", flexShrink: 0 }} />
        </div>
        {showAssuntoDrop && (
          <div className="ndm-setor-drop">
            {lista.filter(a => a.toLowerCase().includes(assuntoSearch.toLowerCase())).map(a => (
              <button
                key={a}
                className="ndm-setor-item"
                onClick={() => { setAssuntoValue(a); setAssuntoSearch(a); setShowAssuntoDrop(false); }}
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
