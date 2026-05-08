import { useState, useEffect, useRef } from "react";
import "./NovoDocumentoModal.css";

type ModalMode = "normal" | "expanded" | "fullscreen" | "minimized";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIPOS_DOC = [
  "Memorando", "Ofício", "Ofício Manual", "Ata", "Circular", "Alvará",
  "Ouvidoria", "Chamado técnico", "Sessão Plenária", "Protocolo",
  "Análise de Projeto", "Fiscalização", "Proc. Administrativo",
  "Ato oficial", "Entrada de dados", "Parecer", "Matéria Legislativa",
];


export default function NovoDocumentoModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<ModalMode>("normal");
  const prevMode = useRef<ModalMode>("normal");

  // form
  const [tipoDoc, setTipoDoc] = useState("Memorando");
  const [assunto, setAssunto] = useState("");
  const [urgente, setUrgente] = useState(false);

  // chips dos campos de destinatários
  const [paraChips, setParaChips] = useState<string[]>([]);
  const [paraInput, setParaInput] = useState("");
  const [ccChips, setCcChips] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [cuidadosChips, setCuidadosChips] = useState<string[]>([]);
  const [cuidadosInput, setCuidadosInput] = useState("");

  const addChip = (
    val: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
    clear: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = val.trim();
    if (trimmed) { set((p) => [...p, trimmed]); clear(""); }
  };

  const [secoes, setSecoes] = useState({ prazo: false, anexos: false, assinaturas: false });
  const toggleSecao = (s: keyof typeof secoes) => setSecoes((p) => ({ ...p, [s]: !p[s] }));

  // prazo form
  const [prazoTitulo, setPrazoTitulo] = useState("");
  const [prazoData, setPrazoData] = useState("");
  const [prazoHorario, setPrazoHorario] = useState("");

  // assinaturas
  const [assinaturaType, setAssinaturaType] = useState<"eletronica" | "icp">("eletronica");
  const [sequencial, setSequencial] = useState(false);
  const [internos, setInternos] = useState<string[]>([]);
  const [externos, setExternos] = useState<string[]>([]);
  const [assinaturas, setAssinaturas] = useState<{ ordem: string; assinante: string; papel: string; funcao: string }[]>([]);

  // arquivos
  const [arquivos, setArquivos] = useState<{ name: string; size: string; tipo: string }[]>([]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) { setMode("normal"); return; }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "minimized") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, mode]);

  const handleMinimize = () => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode("minimized");
  };

  const handleSetMode = (m: ModalMode) => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode(m);
  };

  if (!open) return null;

  if (mode === "minimized") {
    return (
      <button className="ndm-minimized" onClick={() => setMode(prevMode.current)}>
        <i className="fa-regular fa-file-pen" />
        Criar Novo Documento
        <i className="fa-regular fa-chevron-up" />
      </button>
    );
  }

  return (
    <>
      {(mode === "normal" || mode === "expanded") && (
        <div className="ndm-overlay" onClick={onClose} />
      )}

      <div className={`ndm-modal ndm-modal--${mode}`}>

        {/* ── Header ── */}
        <div className="ndm-header">
          <div>
            <h2 className="ndm-title">Criar Novo Documento</h2>
            <p className="ndm-subtitle">Escolha o tipo de documento para continuar</p>
          </div>
          <div className="ndm-header-controls">
            <button className={`ndm-ctrl-btn ${mode === "normal" ? "active" : ""}`} title="Modo normal" onClick={() => handleSetMode("normal")}>
              <i className="fa-regular fa-window-restore" />
            </button>
            <button className={`ndm-ctrl-btn ${mode === "expanded" ? "active" : ""}`} title="Expandir" onClick={() => handleSetMode("expanded")}>
              <i className="fa-regular fa-arrows-maximize" />
            </button>
            <button className={`ndm-ctrl-btn ${mode === "fullscreen" ? "active" : ""}`} title="Tela cheia" onClick={() => handleSetMode("fullscreen")}>
              <i className="fa-regular fa-expand" />
            </button>
            <button className="ndm-ctrl-btn" title="Minimizar" onClick={handleMinimize}>
              <i className="fa-regular fa-minus" />
            </button>
            <div className="ndm-ctrl-divider" />
            <button className="ndm-ctrl-btn ndm-ctrl-btn--close" title="Fechar" onClick={onClose}>
              <i className="fa-regular fa-xmark" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ndm-body">

          {/* Tipo de documento */}
          <div className="ndm-field">
            <label className="ndm-label">Tipo de documento*</label>
            <select className="ndm-select" value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>
              {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Para */}
          <div className="ndm-field">
            <label className="ndm-label">Para*</label>
            <div className="ndm-para-row">
              {paraChips.map((chip, i) => (
                <span key={`para-${i}-${chip}`} className="ndm-chip">
                  {chip}
                  <button className="ndm-chip-remove" onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
              <input
                className="ndm-para-input"
                placeholder={paraChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""}
                value={paraInput}
                onChange={(e) => setParaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChip(paraInput, setParaChips, setParaInput)}
              />
              <button className="ndm-action-btn">+ CC</button>
              <button className="ndm-action-btn">Aos cuidados</button>
            </div>
          </div>

          {/* Com cópia */}
          <div className="ndm-field">
            <label className="ndm-label">Com cópia</label>
            <div className="ndm-para-row">
              {ccChips.map((chip, i) => (
                <span key={`cc-${i}-${chip}`} className="ndm-chip">
                  {chip}
                  <button className="ndm-chip-remove" onClick={() => setCcChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
              <input
                className="ndm-para-input"
                placeholder={ccChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""}
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChip(ccInput, setCcChips, setCcInput)}
              />
            </div>
          </div>

          {/* Aos cuidados */}
          <div className="ndm-field">
            <label className="ndm-label">Aos cuidados</label>
            <div className="ndm-para-row">
              {cuidadosChips.map((chip, i) => (
                <span key={`cuidados-${i}-${chip}`} className="ndm-chip">
                  {chip}
                  <button className="ndm-chip-remove" onClick={() => setCuidadosChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
                </span>
              ))}
              <input
                className="ndm-para-input"
                placeholder={cuidadosChips.length === 0 ? "Nome do responsável..." : ""}
                value={cuidadosInput}
                onChange={(e) => setCuidadosInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChip(cuidadosInput, setCuidadosChips, setCuidadosInput)}
              />
            </div>
          </div>

          {/* Assunto */}
          <div className="ndm-field">
            <label className="ndm-label">Assunto*</label>
            <input
              className="ndm-input"
              placeholder="Descreva o assunto do documento..."
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
          </div>

          {/* Descrição */}
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
                <button className="ndm-toolbar-btn"><i className="fa-regular fa-align-left" style={{ fontSize: 11 }} /></button>
                <button className="ndm-toolbar-btn"><i className="fa-regular fa-align-center" style={{ fontSize: 11 }} /></button>
                <button className="ndm-toolbar-btn"><i className="fa-regular fa-align-justify" style={{ fontSize: 11 }} /></button>
                <div className="ndm-toolbar-sep" />
                <button className="ndm-toolbar-btn"><i className="fa-regular fa-list-ul" style={{ fontSize: 11 }} /></button>
                <button className="ndm-toolbar-btn"><i className="fa-regular fa-list-ol" style={{ fontSize: 11 }} /></button>
              </div>
              <div className="ndm-editor" contentEditable suppressContentEditableWarning data-placeholder="Escreva a descrição do documento..." />
              <div className="ndm-author-block">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0e7ff", color: "#0058db", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>CL</div>
                <div className="ndm-author-name">Cris Lima</div>
                <div className="ndm-author-role">Designer de Produto</div>
              </div>
            </div>
          </div>

          {/* ── Prazo / Atividade ── */}
          <div className="ndm-section">
            <button className="ndm-section-trigger" onClick={() => toggleSecao("prazo")}>
              <span>Adicionar prazo/Atividade</span>
              <i className={`fa-regular fa-chevron-${secoes.prazo ? "up" : "down"}`} />
            </button>
            {secoes.prazo && (
              <div className="ndm-section-body">
                <div className="ndm-row-2">
                  <div className="ndm-field">
                    <label className="ndm-label">Título da atividade</label>
                    <input className="ndm-input" placeholder="Ex: Entregar documento assinado" value={prazoTitulo} onChange={(e) => setPrazoTitulo(e.target.value)} />
                  </div>
                  <div className="ndm-field">
                    <label className="ndm-label">Lembrete</label>
                    <select className="ndm-select"><option>Nenhum</option><option>1 hora antes</option><option>1 dia antes</option></select>
                  </div>
                </div>
                <div className="ndm-row-3">
                  <div className="ndm-field">
                    <label className="ndm-label">Data do prazo</label>
                    <input className="ndm-input" type="date" value={prazoData} onChange={(e) => setPrazoData(e.target.value)} />
                  </div>
                  <div className="ndm-field">
                    <label className="ndm-label">Horário</label>
                    <input className="ndm-input" type="time" value={prazoHorario} onChange={(e) => setPrazoHorario(e.target.value)} />
                  </div>
                  <div className="ndm-field">
                    <label className="ndm-label">Visibilidade</label>
                    <select className="ndm-select"><option>Todos os envolvidos</option><option>Somente eu</option></select>
                  </div>
                </div>
                <div className="ndm-field">
                  <label className="ndm-label">Descrição da atividade</label>
                  <textarea style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", color: "#333", resize: "vertical", minHeight: 72, outline: "none", boxSizing: "border-box" }} placeholder="Descreva o que precisa ser feito..." />
                </div>
                <button className="ndm-add-btn">+ Adicionar prazo</button>
              </div>
            )}
          </div>

          {/* ── Anexos ── */}
          <div className="ndm-section">
            <button className="ndm-section-trigger" onClick={() => toggleSecao("anexos")}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#333" }}>
                Anexos
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fa-regular fa-circle-info" style={{ color: "#0058db", fontSize: 14 }} />
                <i className={`fa-regular fa-chevron-${secoes.anexos ? "up" : "down"}`} style={{ fontSize: 12, color: "#888" }} />
              </div>
            </button>

            {secoes.anexos && (
              <div className="ndm-section-body">
                <p style={{ fontSize: 12, color: "#565656", lineHeight: 1.6, margin: 0 }}>
                  Arquivos permitidos: fotos, documentos, planilhas, apresentações, PDFs e arquivos compactados.<br />
                  Limite: até 100 arquivos, máximo de 64 MB cada.
                </p>

                <button className="ndm-upload-btn">
                  <i className="fa-regular fa-paperclip" /> Anexar arquivo
                </button>

                {arquivos.length > 0 && (
                  <div className="ndm-file-list">
                    {arquivos.map((f, i) => (
                      <div key={i} className="ndm-file-item">
                        <span className="ndm-file-link">{f.name} ({f.size})</span>
                        <button
                          className="ndm-file-remove"
                          onClick={() => setArquivos((prev) => prev.filter((_, idx) => idx !== i))}
                        >×</button>
                        <select
                          className="ndm-file-select-wide"
                          value={f.tipo}
                          onChange={(e) => setArquivos((prev) => prev.map((a, idx) => idx === i ? { ...a, tipo: e.target.value } : a))}
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

          {/* ── Assinaturas ── */}
          <div className="ndm-section">
            <button className="ndm-section-trigger" onClick={() => toggleSecao("assinaturas")}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>Assinaturas</span>
              <i className={`fa-regular fa-chevron-${secoes.assinaturas ? "up" : "down"}`} style={{ fontSize: 12, color: "#888" }} />
            </button>

            {secoes.assinaturas && (
              <div className="ndm-section-body">

                {/* Minha assinatura */}
                <div style={{ marginBottom: 4 }}>
                  <div className="ndm-sig-group-title">Minha assinatura</div>
                  <div className="ndm-sig-group-desc">Assine documentos de forma rápida e segura.</div>
                  <div className="ndm-sig-radio-row">
                    <button
                      className={`ndm-radio-btn ${assinaturaType === "eletronica" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`}
                      onClick={() => setAssinaturaType("eletronica")}
                    >
                      <span className={`ndm-radio-circle ${assinaturaType === "eletronica" ? "ndm-radio-circle--filled" : ""}`} />
                      Assinatura eletrônica
                    </button>
                    <button
                      className={`ndm-radio-btn ${assinaturaType === "icp" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`}
                      onClick={() => setAssinaturaType("icp")}
                    >
                      <span className={`ndm-radio-circle ${assinaturaType === "icp" ? "ndm-radio-circle--filled" : ""}`} />
                      Certificado ICP - Brasil
                    </button>
                    <select className="ndm-sig-mode-select">
                      <option value="">Modo de assinatura</option>
                      <option>Simples</option>
                      <option>Avançado</option>
                    </select>
                  </div>
                </div>

                <div className="ndm-sig-divider" />

                {/* Solicitar assinaturas */}
                <div>
                  <div className="ndm-sig-group-title">Solicitar assinatura(s)</div>
                  <div className="ndm-sig-group-desc">Peça a assinatura de outras pessoas para concluir o documento.</div>

                  <div className="ndm-field" style={{ marginBottom: 12 }}>
                    <label className="ndm-label">Enviar para lista de assinantes*</label>
                    <div className="ndm-email-row">
                      <select className="ndm-select" style={{ flex: 1 }}>
                        <option value="">Selecione uma lista</option>
                        <option>Lista padrão</option>
                      </select>
                      <button className="ndm-gerar-btn">
                        <i className="fa-regular fa-gear" /> Gerenciar Listas
                      </button>
                    </div>
                  </div>

                  <div className="ndm-user-group-label">Usuários internos</div>
                  <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
                    {internos.map((u, i) => (
                      <span key={i} className="ndm-chip ndm-chip--user">
                        {u}
                        <button className="ndm-chip-remove" onClick={() => setInternos((p) => p.filter((_, idx) => idx !== i))}>×</button>
                      </span>
                    ))}
                  </div>

                  <div className="ndm-user-group-label">Contato externo</div>
                  <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
                    {externos.map((u, i) => (
                      <span key={i} className="ndm-chip ndm-chip--user">
                        {u}
                        <button className="ndm-chip-remove" onClick={() => setExternos((p) => p.filter((_, idx) => idx !== i))}>×</button>
                      </span>
                    ))}
                  </div>

                  <label className="ndm-checkbox-row">
                    <input type="checkbox" checked={sequencial} onChange={(e) => setSequencial(e.target.checked)} />
                    Requerer assinaturas em ordem sequencial
                  </label>
                </div>

                {/* Tabela de assinaturas */}
                {sequencial && (
                  <div className="ndm-sig-table-wrap">
                    <div className="ndm-sig-table-header">
                      <div style={{ width: 28 }} />
                      <div style={{ width: 60 }}>Ordem</div>
                      <div style={{ flex: 1 }}>Assinante</div>
                      <div style={{ width: 110 }} />
                      <div style={{ width: 110 }}>Função</div>
                      <div style={{ width: 36 }} />
                    </div>
                    <div className="ndm-sig-rows">
                      {assinaturas.map((row, i) => (
                        <div key={i} className="ndm-sig-row">
                          <span className="ndm-drag-handle">
                            <i className="fa-regular fa-grip-dots-vertical" />
                          </span>
                          <input
                            className="ndm-order-input"
                            value={row.ordem}
                            onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, ordem: e.target.value } : a))}
                          />
                          <span className="ndm-sig-row-name">{row.assinante}</span>
                          <select className="ndm-table-select" value={row.papel} onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, papel: e.target.value } : a))}>
                            <option>Parte</option>
                            <option>Testemunha</option>
                            <option>Advogado</option>
                          </select>
                          <select className="ndm-table-select" value={row.funcao} onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, funcao: e.target.value } : a))}>
                            <option>Assinar</option>
                            <option>Reconhecer</option>
                            <option>Validar</option>
                          </select>
                          <button className="ndm-del-btn" onClick={() => setAssinaturas((p) => p.filter((_, idx) => idx !== i))}>
                            <i className="fa-regular fa-trash" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="ndm-footer">
          <label className="ndm-footer-left">
            <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} />
            Urgente
          </label>
          <div className="ndm-footer-right">
            <button className="ndm-btn-discard"><i className="fa-regular fa-trash-can" /> Descartar rascunho</button>
            <button className="ndm-btn-save"><i className="fa-regular fa-floppy-disk" /> Salvar rascunho e fechar</button>
            <button className="ndm-btn-post">Postar</button>
          </div>
        </div>

      </div>
    </>
  );
}
