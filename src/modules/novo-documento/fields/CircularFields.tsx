import { useNovoDocumentoCtx } from "../context";
import { SetorPickerField } from "../components/SetorPickerField";
import { AnexosSection } from "../components/AnexosSection";
import { AssinaturasSection } from "../components/AssinaturasSection";
import { PrazoSection } from "../components/PrazoSection";

export function CircularFields() {
  const {
    assunto, setAssunto,
    autoArquivamento, setAutoArquivamento,
    acompanhaFisico, setAcompanhaFisico,
    caraterInformativo, setCaraterInformativo,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input
          className="ndm-input"
          placeholder="Descreva o assunto da circular..."
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
      </div>
      <SetorPickerField label="Para" />
      <div className="ndm-field">
        <label className="ndm-label">Auto arquivamento em</label>
        <input className="ndm-input" type="date" value={autoArquivamento} onChange={(e) => setAutoArquivamento(e.target.value)} />
      </div>
      <div className="ndm-field" style={{ gap: 10 }}>
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={acompanhaFisico} onChange={(e) => setAcompanhaFisico(e.target.checked)} />
          Acompanha documento físico, imprimir folha de rosto
        </label>
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={caraterInformativo} onChange={(e) => setCaraterInformativo(e.target.checked)} />
          Caráter informativo: não aceitar respostas
        </label>
      </div>
      <AnexosSection />
      <AssinaturasSection />
      <PrazoSection />
    </>
  );
}
