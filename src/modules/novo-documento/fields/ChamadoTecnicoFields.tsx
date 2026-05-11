import { useNovoDocumentoCtx } from "../context";
import { ASSUNTOS_CHAMADO, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function ChamadoTecnicoFields() {
  const {
    solicitante, setSolicitante,
    assuntoValue, setAssuntoValue,
    patrimonio, setPatrimonio,
    atendPrioritario, setAtendPrioritario,
    acompanhaFisico, setAcompanhaFisico,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input
          className="ndm-input"
          placeholder="Busque existente ou faça cadastro..."
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <SimpleSelect value={assuntoValue} onChange={setAssuntoValue} options={ASSUNTOS_CHAMADO} placeholder="Selecione o assunto..." />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Nº de Patrimônio</label>
          <input
            className="ndm-input"
            placeholder="Caso exista"
            value={patrimonio}
            onChange={(e) => setPatrimonio(e.target.value)}
          />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
        </div>
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
