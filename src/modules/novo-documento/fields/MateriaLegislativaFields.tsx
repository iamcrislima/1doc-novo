import { useNovoDocumentoCtx } from "../context";
import { TIPOS_MATERIA, DOCS_ORIGEM, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function MateriaLegislativaFields() {
  const {
    ementa, setEmenta,
    tipoMateria, setTipoMateria,
    docOrigem, setDocOrigem,
    docOrigemNum, setDocOrigemNum,
    atendPrioritario, setAtendPrioritario,
    acompanhaFisico, setAcompanhaFisico,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Ementa*</label>
        <input
          className="ndm-input"
          placeholder="Descreva a ementa..."
          value={ementa}
          onChange={(e) => setEmenta(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo de Matéria*</label>
        <SimpleSelect value={tipoMateria} onChange={setTipoMateria} options={TIPOS_MATERIA} placeholder="- selecione -" />
      </div>
      <ParaComBusca label="Para*" />
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Documento de Origem</label>
          <SimpleSelect value={docOrigem} onChange={setDocOrigem} options={DOCS_ORIGEM} placeholder="- selecione -" />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Número</label>
          <input
            className="ndm-input"
            placeholder="Nº do documento de origem"
            value={docOrigemNum}
            onChange={(e) => setDocOrigemNum(e.target.value)}
          />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Atendimento Prioritário</label>
        <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
      </div>
      <EditorBlock />
      <div className="ndm-field">
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={acompanhaFisico} onChange={(e) => setAcompanhaFisico(e.target.checked)} />
          Acompanha documento físico, imprimir folha de rosto
        </label>
      </div>
      <AnexosSection />
      <PrazoSection />
      <AssinaturasSection />
    </>
  );
}
