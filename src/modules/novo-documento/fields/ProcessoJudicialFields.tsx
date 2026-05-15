import { useNovoDocumentoCtx } from "../context";
import { TIPOS_JUSTICA, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { ParaComBusca } from "../components/ParaComBusca";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function ProcessoJudicialFields() {
  const {
    requerido, setRequerido,
    processoJudNum, setProcessoJudNum,
    tipoJustica, setTipoJustica,
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
      <ParaComBusca label="Para*" />
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
