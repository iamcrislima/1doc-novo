import { useNovoDocumentoCtx } from "../context";
import { MOCK_SETORES } from "../constants";
import { CcPanel } from "../components/CcPanel";
import { CuidadosPanel } from "../components/CuidadosPanel";
import { EditorBlock } from "../components/EditorBlock";
import { PrazoSection } from "../components/PrazoSection";
import { AnexosSection } from "../components/AnexosSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function MemorandoFields() {
  const {
    paraChips, setParaChips,
    paraInput, setParaInput,
    showParaSuggestions, setShowParaSuggestions,
    showCC, setShowCC,
    showCuidados, setShowCuidados,
    assunto, setAssunto,
    addChip,
  } = useNovoDocumentoCtx();

  const filteredParaSetores = paraInput.trim().length > 0
    ? MOCK_SETORES.filter(s =>
        s.toLowerCase().includes(paraInput.toLowerCase()) && !paraChips.includes(s)
      )
    : [];

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Para*</label>
        <div className="ndm-setor-picker">
          <div className="ndm-para-row">
            {paraChips.map((chip, i) => (
              <span key={`para-${i}-${chip}`} className="ndm-chip">
                <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
                {chip}
                <button
                  className="ndm-chip-remove"
                  onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              className="ndm-para-input"
              placeholder={paraChips.length === 0 ? "Pesquisar setor..." : ""}
              value={paraInput}
              onChange={(e) => {
                setParaInput(e.target.value);
                setShowParaSuggestions(e.target.value.trim().length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addChip(paraInput, setParaChips, setParaInput);
                  setShowParaSuggestions(false);
                }
              }}
            />
            {!showCC && (
              <button className="ndm-action-btn" onClick={() => setShowCC(true)}>+ CC</button>
            )}
            {!showCuidados && (
              <button className="ndm-action-btn" onClick={() => setShowCuidados(true)}>Aos cuidados</button>
            )}
          </div>
          {showParaSuggestions && filteredParaSetores.length > 0 && (
            <div className="ndm-setor-drop">
              {filteredParaSetores.map(s => (
                <button
                  key={s}
                  className="ndm-setor-item"
                  onClick={() => { setParaChips(p => [...p, s]); setParaInput(""); setShowParaSuggestions(false); }}
                >
                  <i className="fa-regular fa-building" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <CcPanel />
      <CuidadosPanel />
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input
          className="ndm-input"
          placeholder="Descreva o assunto do documento..."
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
      </div>
      <EditorBlock />
      <PrazoSection />
      <AnexosSection />
      <AssinaturasSection />
    </>
  );
}
