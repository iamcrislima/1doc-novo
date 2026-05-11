import { useNovoDocumentoCtx } from "../context";
import { ALVARA_TIPOS, ALVARA_CATEGORIAS, PROCESSOS_POR_CATEGORIA } from "../constants";
import { SimpleSelect } from "../components/SimpleSelect";
import { EditorBlock } from "../components/EditorBlock";
import { AssinaturasSection } from "../components/AssinaturasSection";

export function AlvaraFields() {
  const {
    alvaraTipo, setAlvaraTipo,
    requerente, setRequerente,
    emitirEm, setEmitirEm,
    processoSelecionado, setProcessoSelecionado,
  } = useNovoDocumentoCtx();

  return (
    <>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Tipo*</label>
          <SimpleSelect value={alvaraTipo} onChange={setAlvaraTipo} options={ALVARA_TIPOS} placeholder="Pesquisar tipo de alvará..." />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Requerente*</label>
          <input
            className="ndm-input"
            placeholder="Busque existente ou faça cadastro..."
            value={requerente}
            onChange={(e) => setRequerente(e.target.value)}
          />
        </div>
      </div>
      <EditorBlock />
      <div className="ndm-field">
        <label className="ndm-label">Emitir e já mencionar em</label>
        <SimpleSelect
          value={emitirEm}
          onChange={(v) => { setEmitirEm(v); setProcessoSelecionado(""); }}
          options={ALVARA_CATEGORIAS}
          placeholder="- selecione categoria -"
        />
      </div>
      {emitirEm && PROCESSOS_POR_CATEGORIA[emitirEm] && (
        <div className="ndm-process-list">
          <div className="ndm-process-list-title">
            <i className="fa-regular fa-folder-open" style={{ marginRight: 6 }} />
            Processos em {emitirEm}
          </div>
          {PROCESSOS_POR_CATEGORIA[emitirEm].map((p) => (
            <label key={p.num} className="ndm-process-item">
              <input
                type="radio"
                name="processo-alvara"
                value={p.num}
                checked={processoSelecionado === p.num}
                onChange={() => setProcessoSelecionado(p.num)}
                style={{ accentColor: "var(--primary-pure)" }}
              />
              <span className="ndm-process-num">{p.num}</span>
              <span className="ndm-process-desc">{p.descricao}</span>
            </label>
          ))}
        </div>
      )}
      <AssinaturasSection />
    </>
  );
}
