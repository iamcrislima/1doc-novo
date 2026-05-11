import { useNovoDocumentoCtx } from "../context";
import { ASSUNTOS_OUVIDORIA, MOCK_SETORES, PRIORIDADES, ATEND_PRIORITARIO_OPTS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { CcPanel } from "../components/CcPanel";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function OuvidoriaFields() {
  const {
    identificacao, setIdentificacao,
    solicitante, setSolicitante,
    assuntoValue, setAssuntoValue,
    paraSetorOuv, setParaSetorOuv,
    showCC, setShowCC,
    prioridade, setPrioridade,
    atendPrioritario, setAtendPrioritario,
    dataOcorrencia, setDataOcorrencia,
    horaOcorrencia, setHoraOcorrencia,
    enderecoCompleto, setEnderecoCompleto,
    numeroRef, setNumeroRef,
    enderecoConfirmado,
    confirmarEndereco,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Identificação*</label>
        <div className="ndm-ident-row">
          {[
            { val: "sem-sigilo", label: "Sem sigilo", icon: "fa-eye" },
            { val: "sigilosa", label: "Sigilosa", icon: "fa-lock" },
            { val: "anonima", label: "Anônima", icon: "fa-user-secret" },
          ].map(opt => (
            <button
              key={opt.val}
              className={`ndm-ident-btn ${identificacao === opt.val ? "ndm-ident-btn--active" : ""}`}
              onClick={() => setIdentificacao(opt.val as typeof identificacao)}
            >
              <i className={`fa-regular ${opt.icon}`} style={{ fontSize: 13 }} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
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
        <SimpleSelect value={assuntoValue} onChange={setAssuntoValue} options={ASSUNTOS_OUVIDORIA} placeholder="Selecione o assunto..." />
      </div>
      <div className="ndm-field">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
            {!showCC && <button className="ndm-add-btn" style={{ fontSize: 12 }} onClick={() => setShowCC(true)}>+ CC</button>}
          </div>
        </div>
        <SimpleSelect value={paraSetorOuv} onChange={setParaSetorOuv} options={MOCK_SETORES} placeholder="- selecione setor -" />
      </div>
      <CcPanel />
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Prioridade</label>
          <SimpleSelect value={prioridade} onChange={setPrioridade} options={PRIORIDADES} placeholder="- selecione -" />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
        </div>
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Data</label>
          <input className="ndm-input" type="date" value={dataOcorrencia} onChange={(e) => setDataOcorrencia(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Hora</label>
          <input className="ndm-input" type="time" value={horaOcorrencia} onChange={(e) => setHoraOcorrencia(e.target.value)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Onde ocorreu?</label>
        <div className="ndm-row-onde">
          <div className="ndm-field" style={{ flex: 2, margin: 0 }}>
            <label className="ndm-label" style={{ fontWeight: 400 }}>Endereço completo</label>
            <input
              className="ndm-input"
              placeholder="Encontre o endereço..."
              value={enderecoCompleto}
              onChange={(e) => setEnderecoCompleto(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmarEndereco()}
            />
          </div>
          <div className="ndm-field" style={{ flex: 1, margin: 0 }}>
            <label className="ndm-label" style={{ fontWeight: 400 }}>Nº ou referência</label>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                className="ndm-input"
                placeholder="3651"
                value={numeroRef}
                onChange={(e) => setNumeroRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmarEndereco()}
              />
              <button className="ndm-gerar-btn" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={confirmarEndereco}>
                <i className="fa-regular fa-location-dot" /> Localizar
              </button>
            </div>
          </div>
        </div>
        {enderecoConfirmado && (
          <div className="ndm-map-frame">
            <iframe
              title="mapa-localizacao"
              src={`https://maps.google.com/maps?q=${enderecoConfirmado}&output=embed&hl=pt`}
              allowFullScreen
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
      <EditorBlock />
      <AnexosSection />
      <PrazoSection />
      <AssinaturasSection />
    </>
  );
}
