import { useNovoDocumentoCtx } from "../context";
import { TIPOS_ATO } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function AtoOficialFields() {
  const {
    atoNumero, setAtoNumero,
    atoAno, setAtoAno,
    atoAssunto, setAtoAssunto,
    atoTipo, setAtoTipo,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Número</label>
          <input className="ndm-input" placeholder="Número" value={atoNumero} onChange={(e) => setAtoNumero(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Ano</label>
          <input className="ndm-input" value={atoAno} onChange={(e) => setAtoAno(e.target.value)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input
          className="ndm-input"
          placeholder="Descreva o assunto..."
          value={atoAssunto}
          onChange={(e) => setAtoAssunto(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={atoTipo} onChange={setAtoTipo} options={TIPOS_ATO} placeholder="Selecione ou pesquise o tipo..." />
      </div>
      <EditorBlock />
      <AnexosSection />
      <PrazoSection />
      <AssinaturasSection />
    </>
  );
}
