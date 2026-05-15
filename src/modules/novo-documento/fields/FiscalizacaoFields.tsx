import { useNovoDocumentoCtx } from "../context";
import { FISCALIZACAO_TIPOS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function FiscalizacaoFields() {
  const {
    fiscalizado, setFiscalizado,
    fiscalizacaoTipo, setFiscalizacaoTipo,
    acompanhaFisico, setAcompanhaFisico,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Fiscalizado*</label>
        <input
          className="ndm-input"
          placeholder="Busque existente ou faça cadastro..."
          value={fiscalizado}
          onChange={(e) => setFiscalizado(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={fiscalizacaoTipo} onChange={setFiscalizacaoTipo} options={FISCALIZACAO_TIPOS} placeholder="- selecione -" />
      </div>
      <ParaComBusca label="Para*" />
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
