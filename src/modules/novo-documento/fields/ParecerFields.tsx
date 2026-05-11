import { useNovoDocumentoCtx } from "../context";
import { TIPOS_PARECER } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function ParecerFields() {
  const {
    parecerTitulo, setParecerTitulo,
    parecerTipo, setParecerTipo,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input
          className="ndm-input"
          placeholder="Informe o título do parecer..."
          value={parecerTitulo}
          onChange={(e) => setParecerTitulo(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={parecerTipo} onChange={setParecerTipo} options={TIPOS_PARECER} placeholder="- selecione -" />
      </div>
      <EditorBlock />
      <AnexosSection />
      <AssinaturasSection />
    </>
  );
}
