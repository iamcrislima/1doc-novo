import { useNovoDocumentoCtx } from "../context";
import { TIPOS_DOCUMENTO_SUB, MOCK_EMPRESAS } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function DocumentoFields() {
  const {
    titulo, setTitulo,
    tipoDocumento, setTipoDocumento,
    contratadoContratante, setContratadoContratante,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div style={{
        background: "var(--warning-bg)", border: "1px solid var(--warning-border)",
        borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--warning-text)",
        marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <i className="fa-regular fa-circle-info" style={{ color: "var(--warning-icon)", marginTop: 1, flexShrink: 0 }} />
        <span>
          O documento é indicado para solicitar as assinaturas e fazer o acompanhamento de forma digital tanto de contratos anexados em PDF quanto redigidos diretamente na plataforma no campo de texto.{" "}
          <a href="#" style={{ color: "var(--primary-pure)", fontWeight: 600 }} onClick={(e) => e.preventDefault()}>
            Clique aqui para saber mais!
          </a>
        </span>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input
          className="ndm-input"
          placeholder="Informe o título do documento..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={tipoDocumento} onChange={setTipoDocumento} options={TIPOS_DOCUMENTO_SUB} placeholder="Pesquisar tipo de documento..." />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Contratado / Contratante</label>
        <SimpleSelect value={contratadoContratante} onChange={setContratadoContratante} options={MOCK_EMPRESAS} placeholder="Busque pelo nome ou razão social..." />
      </div>
      <EditorBlock />
      <AssinaturasSection />
    </>
  );
}
