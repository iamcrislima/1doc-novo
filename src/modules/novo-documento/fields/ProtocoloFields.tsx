import { useNovoDocumentoCtx } from "../context";
import { ASSUNTOS_PROTOCOLO, MOCK_SETORES, ENTRADA_TIPOS, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { CcPanel } from "../components/CcPanel";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";
import { SigiloPanel } from "../sigilo";

export function ProtocoloFields() {
  const {
    sigiloso,
    solicitante, setSolicitante,
    assuntoProtocolo, setAssuntoProtocolo,
    paraSetorProtocolo, setParaSetorProtocolo,
    showCC, setShowCC,
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
      <SigiloPanel />
      {!sigiloso && (
        <>
          <div className="ndm-field">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
              <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
              <div style={{ display: "flex", gap: 14 }}>
                <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
                {!showCC && <button className="ndm-add-btn" style={{ fontSize: 12 }} onClick={() => setShowCC(true)}>+ CC</button>}
              </div>
            </div>
            <SimpleSelect value={paraSetorProtocolo} onChange={setParaSetorProtocolo} options={MOCK_SETORES} placeholder="- selecione setor -" />
          </div>
          <CcPanel />
        </>
      )}
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
