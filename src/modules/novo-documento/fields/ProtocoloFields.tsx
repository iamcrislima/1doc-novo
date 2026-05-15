import { useNovoDocumentoCtx } from "../context";
import { ASSUNTOS_PROTOCOLO, ENTRADA_TIPOS, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";
import { SigiloPanel } from "../sigilo";

export function ProtocoloFields() {
  const {
    sigiloso, tipoDoc,
    solicitante, setSolicitante,
    assuntoProtocolo, setAssuntoProtocolo,
    entradaTipo, setEntradaTipo,
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
        <SimpleSelect value={assuntoProtocolo} onChange={setAssuntoProtocolo} options={ASSUNTOS_PROTOCOLO} placeholder="Selecione ou pesquise o assunto..." />
      </div>
      {tipoDoc === "Protocolo" && <SigiloPanel />}
      {(!sigiloso || tipoDoc !== "Protocolo") && <ParaComBusca label="Para*" />}
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Entrada*</label>
          <SimpleSelect value={entradaTipo} onChange={setEntradaTipo} options={ENTRADA_TIPOS} placeholder="- selecione -" />
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
