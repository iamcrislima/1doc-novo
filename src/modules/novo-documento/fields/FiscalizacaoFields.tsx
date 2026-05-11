import { useNovoDocumentoCtx } from "../context";
import { FISCALIZACAO_TIPOS, MOCK_SETORES } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function FiscalizacaoFields() {
  const {
    fiscalizado, setFiscalizado,
    fiscalizacaoTipo, setFiscalizacaoTipo,
    fiscalizacaoPara, setFiscalizacaoPara,
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
      <div className="ndm-field">
        <label className="ndm-label">Para*</label>
        <SimpleSelect value={fiscalizacaoPara} onChange={setFiscalizacaoPara} options={MOCK_SETORES} placeholder="- selecione setor -" />
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
