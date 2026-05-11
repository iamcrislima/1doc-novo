import { useNovoDocumentoCtx } from "../context";
import { SESSAO_TIPOS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AnexosSection } from "../components/AnexosSection";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function SessaoPlenariaFields() {
  const {
    sessaoNumero, setSessaoNumero,
    sessaoAno, setSessaoAno,
    sessaoTipo, setSessaoTipo,
    publicarCentral, setPublicarCentral,
    dataSessao, setDataSessao,
    horaSessao, setHoraSessao,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Número</label>
          <input className="ndm-input" placeholder="Número" value={sessaoNumero} onChange={(e) => setSessaoNumero(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Ano</label>
          <input className="ndm-input" value={sessaoAno} onChange={(e) => setSessaoAno(e.target.value)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={sessaoTipo} onChange={setSessaoTipo} options={SESSAO_TIPOS} placeholder="- selecione -" />
      </div>
      <div className="ndm-field">
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={publicarCentral} onChange={(e) => setPublicarCentral(e.target.checked)} />
          Publicar em Central de Atendimento
        </label>
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Data da sessão</label>
          <input className="ndm-input" type="date" value={dataSessao} onChange={(e) => setDataSessao(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Hora da sessão</label>
          <input className="ndm-input" type="time" value={horaSessao} onChange={(e) => setHoraSessao(e.target.value)} />
        </div>
      </div>
      <EditorBlock />
      <AnexosSection />
      <PrazoSection />
      <AssinaturasSection />
    </>
  );
}
