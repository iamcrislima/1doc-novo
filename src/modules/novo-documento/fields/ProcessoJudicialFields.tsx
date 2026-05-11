import { useNovoDocumentoCtx } from "../context";
import { TIPOS_JUSTICA, MOCK_SETORES, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { CcPanel } from "../components/CcPanel";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function ProcessoJudicialFields() {
  const {
    requerido, setRequerido,
    processoJudNum, setProcessoJudNum,
    tipoJustica, setTipoJustica,
    paraSetorProtocolo, setParaSetorProtocolo,
    showCC, setShowCC,
    nomeParteAutora, setNomeParteAutora,
    numPasta, setNumPasta,
    atendPrioritario, setAtendPrioritario,
    acompanhaFisico, setAcompanhaFisico,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Requerido/Executado</label>
        <input
          className="ndm-input"
          placeholder="Busque existente ou faça cadastro..."
          value={requerido}
          onChange={(e) => setRequerido(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Nº do Processo*</label>
        <input
          className="ndm-input"
          placeholder="Ex: 0001234-12.2025.8.26.0001"
          value={processoJudNum}
          onChange={(e) => setProcessoJudNum(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo de Justiça*</label>
        <SimpleSelect value={tipoJustica} onChange={setTipoJustica} options={TIPOS_JUSTICA} placeholder="- selecione -" />
      </div>
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
      <div className="ndm-field">
        <label className="ndm-label">Nome da Parte Autora</label>
        <input
          className="ndm-input"
          placeholder="Nome completo..."
          value={nomeParteAutora}
          onChange={(e) => setNomeParteAutora(e.target.value)}
        />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Nº da Pasta</label>
          <input
            className="ndm-input"
            placeholder="Número identificador..."
            value={numPasta}
            onChange={(e) => setNumPasta(e.target.value)}
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
