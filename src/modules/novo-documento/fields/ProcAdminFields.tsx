import { useNovoDocumentoCtx } from "../context";
import { TIPOS_ADM } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { ParaComBusca } from "../components/ParaComBusca";
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
      {!sigiloso && <ParaComBusca label="Para*" />}
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
