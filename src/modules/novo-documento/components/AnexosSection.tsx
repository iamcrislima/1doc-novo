import { useNovoDocumentoCtx } from "../context";

export function AnexosSection() {
  const { secoes, toggleSecao, arquivos, setArquivos } = useNovoDocumentoCtx();

  return (
    <div className="ndm-section">
      <button className="ndm-section-trigger" onClick={() => toggleSecao("anexos")}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
          Anexos
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fa-regular fa-circle-info" style={{ color: "var(--primary-pure)", fontSize: 14 }} />
          <i className={`fa-regular fa-chevron-${secoes.anexos ? "up" : "down"}`} style={{ fontSize: 12, color: "var(--text-tertiary)" }} />
        </div>
      </button>
      {secoes.anexos && (
        <div className="ndm-section-body">
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            Arquivos permitidos: fotos, documentos, planilhas, apresentações, PDFs e arquivos compactados.<br />
            Limite: até 100 arquivos, máximo de 64 MB cada.
          </p>
          <button className="ndm-upload-btn">
            <i className="fa-regular fa-paperclip" /> Anexar arquivo
          </button>
          {arquivos.length > 0 && (
            <div className="ndm-file-list">
              {arquivos.map((f, i) => (
                <div key={f.name} className="ndm-file-item">
                  <span className="ndm-file-link">{f.name} ({f.size})</span>
                  <button
                    className="ndm-file-remove"
                    onClick={() => setArquivos((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                  <select
                    className="ndm-file-select-wide"
                    value={f.tipo}
                    onChange={(e) => setArquivos((prev) =>
                      prev.map((a, idx) => idx === i ? { ...a, tipo: e.target.value } : a)
                    )}
                  >
                    <option value="">Selecione</option>
                    <option>Eletrônico</option>
                    <option>Sigiloso</option>
                    <option>Público</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
