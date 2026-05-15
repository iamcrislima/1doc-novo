import { useNovoDocumentoCtx } from "../context";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { PrazoSection } from "../components/PrazoSection";
import { AnexosSection } from "../components/AnexosSection";

export function CicloVidaFields() {
  const { assunto, setAssunto } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-info-banner">
        <i className="fa-regular fa-circle-info" />
        <span>
          O ciclo de vida será iniciado automaticamente após a postagem. Todos os responsáveis serão notificados conforme o fluxo configurado.
        </span>
      </div>
      <ParaComBusca label="Destinatário*" />

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
