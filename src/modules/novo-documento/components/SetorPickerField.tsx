import { useNovoDocumentoCtx } from "../context";
import { MOCK_SETORES } from "../constants";

interface SetorPickerFieldProps {
  label: string;
}

export function SetorPickerField({ label }: SetorPickerFieldProps) {
  const {
    setorChips, setSetorChips,
    setorPickerOpen, setSetorPickerOpen,
    setorSearch, setSetorSearch,
  } = useNovoDocumentoCtx();

  const filteredSetores = MOCK_SETORES.filter(s =>
    s.toLowerCase().includes(setorSearch.toLowerCase())
  );

  return (
    <div className="ndm-field">
      <label className="ndm-label">{label}*</label>
      <div className="ndm-setor-picker">
        <div
          className="ndm-para-row"
          onClick={() => setSetorPickerOpen(true)}
          style={{ cursor: "text" }}
        >
          {setorChips.map((chip, i) => (
            <span key={chip} className="ndm-chip">
              {chip}
              <button
                className="ndm-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  setSetorChips(p => p.filter((_, idx) => idx !== i));
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={setorChips.length === 0 ? "Pesquisar setor..." : ""}
            value={setorSearch}
            onChange={(e) => { setSetorSearch(e.target.value); setSetorPickerOpen(true); }}
            onFocus={() => setSetorPickerOpen(true)}
          />
          <i className="fa-regular fa-building" style={{ fontSize: 13, color: "var(--border-dark)", flexShrink: 0 }} />
        </div>
        {setorPickerOpen && filteredSetores.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredSetores.map(s => (
              <button
                key={s}
                className="ndm-setor-item"
                onClick={() => {
                  if (!setorChips.includes(s)) setSetorChips(p => [...p, s]);
                  setSetorSearch("");
                  setSetorPickerOpen(false);
                }}
              >
                <i className="fa-regular fa-building" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
