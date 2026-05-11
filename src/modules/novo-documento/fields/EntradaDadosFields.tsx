import { useNovoDocumentoCtx } from "../context";
import { CATEGORIAS_ENTRADA } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";

export function EntradaDadosFields() {
  const {
    entradaTitulo, setEntradaTitulo,
    entradaCategoria, setEntradaCategoria,
    entradaData, setEntradaData,
    entradaHora, setEntradaHora,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input
          className="ndm-input"
          placeholder="Informe o título..."
          value={entradaTitulo}
          onChange={(e) => setEntradaTitulo(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Categoria*</label>
        <SimpleSelect value={entradaCategoria} onChange={setEntradaCategoria} options={CATEGORIAS_ENTRADA} placeholder="- selecione -" />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Data do documento</label>
          <input className="ndm-input" type="date" value={entradaData} onChange={(e) => setEntradaData(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Hora do documento</label>
          <input className="ndm-input" type="time" value={entradaHora} onChange={(e) => setEntradaHora(e.target.value)} />
        </div>
      </div>
      <EditorBlock />
      <AnexosSection />
    </>
  );
}
