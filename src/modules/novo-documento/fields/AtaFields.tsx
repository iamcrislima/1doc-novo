import { useNovoDocumentoCtx } from "../context";
import { SetorPickerField } from "../components/SetorPickerField";
import { PrazoSection } from "../components/PrazoSection";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function AtaFields() {
  const {
    tituloReuniao, setTituloReuniao,
    dataReuniao, setDataReuniao,
    horaReuniao, setHoraReuniao,
    participantes, setParticipantes,
    objetivos, setObjetivos,
    topicos, setTopicos,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título da reunião*</label>
        <input
          className="ndm-input"
          placeholder="Ex: Reunião de planejamento estratégico..."
          value={tituloReuniao}
          onChange={(e) => setTituloReuniao(e.target.value)}
        />
      </div>
      <SetorPickerField label="Destinatário" />
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Data da reunião</label>
          <input className="ndm-input" type="date" value={dataReuniao} onChange={(e) => setDataReuniao(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Hora da reunião</label>
          <input className="ndm-input" type="time" value={horaReuniao} onChange={(e) => setHoraReuniao(e.target.value)} />
        </div>
      </div>
      <div className="ndm-row-3">
        <div className="ndm-field">
          <label className="ndm-label">Participantes</label>
          <textarea className="ndm-textarea" placeholder="Liste os participantes..." value={participantes} onChange={(e) => setParticipantes(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Objetivos</label>
          <textarea className="ndm-textarea" placeholder="Liste os objetivos da reunião..." value={objetivos} onChange={(e) => setObjetivos(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Tópicos discutidos</label>
          <textarea className="ndm-textarea" placeholder="Registre os tópicos abordados..." value={topicos} onChange={(e) => setTopicos(e.target.value)} />
        </div>
      </div>
      <PrazoSection />
      <AssinaturasSection />
    </>
  );
}
