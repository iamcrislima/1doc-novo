import { useNovoDocumentoCtx } from "../context";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { PrazoSection } from "../components/PrazoSection";
import { AnexosSection } from "../components/AnexosSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function MemorandoFields() {
  const { assunto, setAssunto } = useNovoDocumentoCtx();

  return (
    <>
      <ParaComBusca label="Para*" />

      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input
          className="ndm-input"
          placeholder="Descreva o assunto do documento..."
          value={assunto}
          onChange={e => setAssunto(e.target.value)}
        />
      </div>
      <EditorBlock />
      <PrazoSection />
      <AnexosSection />
      <AssinaturasSection />
    </>
  );
}
