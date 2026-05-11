import { useNovoDocumentoCtx } from "../context";
import { EditorBlock } from "../components/EditorBlock";
import { PrazoSection } from "../components/PrazoSection";
import { AnexosSection } from "../components/AnexosSection";

export function CicloVidaFields() {
  const {
    paraChips, setParaChips,
    paraInput, setParaInput,
    ccChips, setCcChips,
    ccInput, setCcInput,
    assunto, setAssunto,
    addChip,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-info-banner">
        <i className="fa-regular fa-circle-info" />
        <span>
          O ciclo de vida será iniciado automaticamente após a postagem. Todos os responsáveis serão notificados conforme o fluxo configurado.
        </span>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Destinatário*</label>
        <div className="ndm-para-row">
          {paraChips.map((chip, i) => (
            <span key={`dest-${i}-${chip}`} className="ndm-chip">
              {chip}
              <button className="ndm-chip-remove" onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={paraChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""}
            value={paraInput}
            onChange={(e) => setParaInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addChip(paraInput, setParaChips, setParaInput)}
          />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Com cópia</label>
        <div className="ndm-para-row">
          {ccChips.map((chip, i) => (
            <span key={`cc-${i}-${chip}`} className="ndm-chip">
              {chip}
              <button className="ndm-chip-remove" onClick={() => setCcChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={ccChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""}
            value={ccInput}
            onChange={(e) => setCcInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addChip(ccInput, setCcChips, setCcInput)}
          />
        </div>
      </div>
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
    </>
  );
}
