// TODO: toolbar atualmente decorativa — implementar comandos com document.execCommand()
//       ou integrar editor rico (Tiptap/Lexical). Conteúdo vive no DOM via contentEditable;
//       na submissão, ler via ref.current.innerHTML.
// TODO: "Cris Lima / Designer de Produto" hardcoded — substituir pelo usuário autenticado da sessão.
export function EditorBlock() {
  return (
    <div className="ndm-field">
      <label className="ndm-label">Descrição</label>
      <div className="ndm-editor-wrap">
        <div className="ndm-toolbar">
          <span className="ndm-toolbar-size">16</span>
          <div className="ndm-toolbar-sep" />
          <button className="ndm-toolbar-btn"><strong>B</strong></button>
          <button className="ndm-toolbar-btn"><em>I</em></button>
          <button className="ndm-toolbar-btn" style={{ textDecoration: "underline" }}>U</button>
          <button className="ndm-toolbar-btn" style={{ textDecoration: "line-through" }}>S</button>
          <div className="ndm-toolbar-sep" />
          <button className="ndm-toolbar-btn">
            <i className="fa-regular fa-align-left" style={{ fontSize: 11 }} />
          </button>
          <button className="ndm-toolbar-btn">
            <i className="fa-regular fa-align-center" style={{ fontSize: 11 }} />
          </button>
          <button className="ndm-toolbar-btn">
            <i className="fa-regular fa-align-justify" style={{ fontSize: 11 }} />
          </button>
          <div className="ndm-toolbar-sep" />
          <button className="ndm-toolbar-btn">
            <i className="fa-regular fa-list-ul" style={{ fontSize: 11 }} />
          </button>
          <button className="ndm-toolbar-btn">
            <i className="fa-regular fa-list-ol" style={{ fontSize: 11 }} />
          </button>
        </div>
        <div
          className="ndm-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Escreva a descrição do documento..."
        />
        <div className="ndm-author-block">
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--primary-light)", color: "var(--primary-pure)",
            fontSize: 11, fontWeight: 700, display: "flex",
            alignItems: "center", justifyContent: "center", marginBottom: 4,
          }}>
            CL
          </div>
          <div className="ndm-author-name">Cris Lima</div>
          <div className="ndm-author-role">Designer de Produto</div>
        </div>
      </div>
    </div>
  );
}
