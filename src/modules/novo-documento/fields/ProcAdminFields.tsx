import { useNovoDocumentoCtx } from "../context";
import { TIPOS_ADM, MOCK_SETORES } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { CcPanel } from "../components/CcPanel";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";
import { SigiloPanel } from "../sigilo";

export function ProcAdminFields() {
  const {
    sigiloso,
    assunto, setAssunto,
    tipoDocAdm, setTipoDocAdm,
    paraSetorProtocolo, setParaSetorProtocolo,
    showCC, setShowCC,
    acompanhaFisico, setAcompanhaFisico,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input
          className="ndm-input"
          placeholder="Descreva o assunto..."
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={tipoDocAdm} onChange={setTipoDocAdm} options={TIPOS_ADM} placeholder="Selecione ou pesquise o tipo..." />
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
