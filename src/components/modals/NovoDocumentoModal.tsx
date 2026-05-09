import { useState, useEffect, useRef } from "react";
import "./NovoDocumentoModal.css";

type ModalMode = "normal" | "expanded" | "fullscreen" | "minimized";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIPOS_DOC = [
  "Memorando", "Documento", "Ata", "Circular", "Ciclo de vida",
  "Ofício", "Ofício Manual", "Alvará", "Ouvidoria", "Chamado técnico",
  "Sessão Plenária", "Protocolo", "Análise de Projeto", "Fiscalização",
  "Proc. Administrativo", "Ato oficial", "Entrada de dados", "Parecer",
  "Matéria Legislativa",
];

const TIPOS_DOCUMENTO_SUB = [
  "Contrato", "Convênio", "Termo de Parceria", "Edital", "Portaria",
  "Decreto", "Resolução", "Instrução Normativa", "Parecer Técnico",
  "Relatório de Fiscalização", "Memorando de Entendimento", "Apostila",
  "Termo Aditivo", "Acordo de Cooperação", "Autorização",
];

const MOCK_SETORES = [
  "Gabinete do Prefeito", "Secretaria de Administração", "Secretaria de Educação",
  "Secretaria de Saúde", "Secretaria de Finanças", "Departamento Financeiro",
  "Recursos Humanos", "Tecnologia da Informação", "Assessoria Jurídica",
  "Câmara Municipal", "Controladoria Geral", "Serviços Gerais",
  "Obras e Infraestrutura", "Planejamento Urbano", "Transporte e Mobilidade",
];

const ALVARA_TIPOS = [
  "Construção", "Demolição", "Funcionamento", "Habite-se",
  "Licença especial", "Publicidade", "Reforma", "Regularização",
];

const ALVARA_CATEGORIAS = [
  "Análise de Projeto", "Matéria Legislativa",
  "Processo Administrativo", "Selo de Administração",
];

const PROCESSOS_POR_CATEGORIA: Record<string, { num: string; descricao: string }[]> = {
  "Análise de Projeto": [
    { num: "Proj. 001/2025", descricao: "Residência Rua das Flores, 42" },
    { num: "Proj. 002/2025", descricao: "Comercial Av. Central, 880" },
    { num: "Proj. 003/2025", descricao: "Galpão Industrial Zona Norte" },
  ],
  "Matéria Legislativa": [
    { num: "ML 001/2025", descricao: "PL de Mobilidade Urbana" },
    { num: "ML 002/2025", descricao: "PL Ambiental — Áreas Verdes" },
    { num: "ML 003/2025", descricao: "PEC Municipal — Revisão Fiscal" },
  ],
  "Processo Administrativo": [
    { num: "PA 001/2025", descricao: "Licitação Tecnologia da Informação" },
    { num: "PA 002/2025", descricao: "Contrato de Serviços Gerais" },
    { num: "PA 003/2025", descricao: "Processo Disciplinar ADM-043" },
  ],
  "Selo de Administração": [
    { num: "SA 001/2025", descricao: "Certificação ABNT NBR 16001" },
    { num: "SA 002/2025", descricao: "Qualidade ISO 9001:2015" },
    { num: "SA 003/2025", descricao: "Conformidade Regulatória 2025" },
  ],
};

const ASSUNTOS_OUVIDORIA = [
  "Saúde", "Educação", "Infraestrutura urbana", "Transporte público",
  "Segurança pública", "Habitação", "Meio ambiente", "Assistência social",
  "Cultura e lazer", "Tributação e finanças", "Iluminação pública",
  "Coleta de lixo", "Saneamento básico", "Obras e pavimentação",
];

const ASSUNTOS_CHAMADO = [
  "Manutenção elétrica", "Manutenção hidráulica", "Ar-condicionado / climatização",
  "Suporte em informática", "Segurança eletrônica", "Limpeza e conservação",
  "Infraestrutura civil", "Elevadores", "Telefonia", "Outros",
];

const PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"];

const ATEND_PRIORITARIO_OPTS = [
  "Idoso +80", "Idoso +60", "Pessoa com deficiência (PCD)",
  "Transtorno espectro autista (TEA)", "Gestante",
  "Obesidade", "Mobilidade reduzida", "Doador de sangue",
];

export default function NovoDocumentoModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<ModalMode>("normal");
  const prevMode = useRef<ModalMode>("normal");

  // ── form state ─────────────────────────────────────────────
  const [tipoDoc, setTipoDoc] = useState("Memorando");
  const [assunto, setAssunto] = useState("");
  const [urgente, setUrgente] = useState(false);

  // Memorando / Ofício / Ciclo de vida
  const [paraChips, setParaChips] = useState<string[]>([]);
  const [paraInput, setParaInput] = useState("");
  const [ccChips, setCcChips] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [cuidadosChips, setCuidadosChips] = useState<string[]>([]);
  const [cuidadosInput, setCuidadosInput] = useState("");

  // Documento
  const [titulo, setTitulo] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [tipoDocSearch, setTipoDocSearch] = useState("");
  const [showTipoDocDrop, setShowTipoDocDrop] = useState(false);
  const [contratado, setContratado] = useState("");
  const [contratante, setContratante] = useState("");

  // Ata
  const [tituloReuniao, setTituloReuniao] = useState("");
  const [dataReuniao, setDataReuniao] = useState("");
  const [horaReuniao, setHoraReuniao] = useState("");
  const [participantes, setParticipantes] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [topicos, setTopicos] = useState("");

  // Circular
  const [autoArquivamento, setAutoArquivamento] = useState("");
  const [acompanhaFisico, setAcompanhaFisico] = useState(false);
  const [caraterInformativo, setCaraterInformativo] = useState(false);

  // Sector picker (Ata, Circular)
  const [setorChips, setSetorChips] = useState<string[]>([]);
  const [setorPickerOpen, setSetorPickerOpen] = useState(false);
  const [setorSearch, setSetorSearch] = useState("");
  const setorPickerRef = useRef<HTMLDivElement>(null);
  const tipoDocDropRef = useRef<HTMLDivElement>(null);

  // Álvará
  const [alvaraTipo, setAlvaraTipo] = useState("");
  const [requerente, setRequerente] = useState("");
  const [emitirEm, setEmitirEm] = useState("");
  const [processoSelecionado, setProcessoSelecionado] = useState("");

  // Ouvidoria + Chamado técnico (shared — mutually exclusive)
  const [identificacao, setIdentificacao] = useState<"sigilosa" | "sem-sigilo" | "anonima">("sem-sigilo");
  const [solicitante, setSolicitante] = useState("");
  const [assuntoValue, setAssuntoValue] = useState("");
  const [assuntoSearch, setAssuntoSearch] = useState("");
  const [showAssuntoDrop, setShowAssuntoDrop] = useState(false);
  const assuntoDropRef = useRef<HTMLDivElement>(null);
  const [paraSetorOuv, setParaSetorOuv] = useState("");
  const [prioridade, setPrioridade] = useState("Média");
  const [atendPrioritario, setAtendPrioritario] = useState("");
  const now = new Date();
  const [dataOcorrencia, setDataOcorrencia] = useState(now.toISOString().split("T")[0]);
  const [horaOcorrencia, setHoraOcorrencia] = useState(now.toTimeString().slice(0, 5));
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [numeroRef, setNumeroRef] = useState("");
  const [enderecoConfirmado, setEnderecoConfirmado] = useState("");

  // Chamado técnico
  const [patrimonio, setPatrimonio] = useState("");

  // sections
  const [secoes, setSecoes] = useState({ prazo: false, anexos: false, assinaturas: false });
  const toggleSecao = (s: keyof typeof secoes) => setSecoes((p) => ({ ...p, [s]: !p[s] }));

  // prazo
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

  const addChip = (
    val: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
    clear: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = val.trim();
    if (trimmed) { set((p) => [...p, trimmed]); clear(""); }
  };

  useEffect(() => {
    if (!open) { setMode("normal"); return; }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "minimized") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, mode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (setorPickerRef.current && !setorPickerRef.current.contains(e.target as Node)) {
        setSetorPickerOpen(false);
      }
      if (tipoDocDropRef.current && !tipoDocDropRef.current.contains(e.target as Node)) {
        setShowTipoDocDrop(false);
      }
      if (assuntoDropRef.current && !assuntoDropRef.current.contains(e.target as Node)) {
        setShowAssuntoDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMinimize = () => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode("minimized");
  };

  const handleSetMode = (m: ModalMode) => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode(m);
  };

  const confirmarEndereco = () => {
    if (enderecoCompleto.trim()) {
      const q = numeroRef.trim() ? `${enderecoCompleto}, ${numeroRef}` : enderecoCompleto;
      setEnderecoConfirmado(encodeURIComponent(q));
    }
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

  // ── Filtered lists ─────────────────────────────────────────
  const filteredSetores = MOCK_SETORES.filter(s =>
    s.toLowerCase().includes(setorSearch.toLowerCase())
  );
  const filteredTiposDoc = TIPOS_DOCUMENTO_SUB.filter(t =>
    t.toLowerCase().includes(tipoDocSearch.toLowerCase())
  );
  const filteredAssuntos = (tipoDoc === "Ouvidoria" ? ASSUNTOS_OUVIDORIA : ASSUNTOS_CHAMADO)
    .filter(a => a.toLowerCase().includes(assuntoSearch.toLowerCase()));

  // ── Footer label ───────────────────────────────────────────
  const footerLabel = (() => {
    switch (tipoDoc) {
      case "Alvará": return "Emitir";
      case "Chamado técnico": return "Abrir chamado";
      case "Ouvidoria": return "Registrar";
      default: return "Postar";
    }
  })();

  // ── Shared blocks ──────────────────────────────────────────

  const setorPickerBlock = (label: string) => (
    <div className="ndm-field">
      <label className="ndm-label">{label}*</label>
      <div className="ndm-setor-picker" ref={setorPickerRef}>
        <div className="ndm-para-row" onClick={() => setSetorPickerOpen(true)} style={{ cursor: "text" }}>
          {setorChips.map((chip, i) => (
            <span key={i} className="ndm-chip">
              {chip}
              <button
                className="ndm-chip-remove"
                onClick={(e) => { e.stopPropagation(); setSetorChips(p => p.filter((_, idx) => idx !== i)); }}
              >×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={setorChips.length === 0 ? "Pesquisar setor..." : ""}
            value={setorSearch}
            onChange={(e) => { setSetorSearch(e.target.value); setSetorPickerOpen(true); }}
            onFocus={() => setSetorPickerOpen(true)}
          />
          <i className="fa-regular fa-building" style={{ fontSize: 13, color: "#94a3b8", flexShrink: 0 }} />
        </div>
        {setorPickerOpen && filteredSetores.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredSetores.map(s => (
              <button
                key={s}
                className="ndm-setor-item"
                onClick={() => {
                  if (!setorChips.includes(s)) setSetorChips(p => [...p, s]);
                  setSetorSearch("");
                  setSetorPickerOpen(false);
                }}
              >
                <i className="fa-regular fa-building" style={{ fontSize: 12, color: "#0058db" }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const assuntoSearchBlock = (lista: string[]) => (
    <div className="ndm-field">
      <label className="ndm-label">Assunto*</label>
      <div className="ndm-setor-picker" ref={assuntoDropRef}>
        <div className="ndm-select-custom" onClick={() => setShowAssuntoDrop(true)}>
          <input
            className="ndm-para-input"
            placeholder="Pesquisar assunto..."
            value={showAssuntoDrop ? assuntoSearch : assuntoValue}
            onChange={(e) => { setAssuntoSearch(e.target.value); setShowAssuntoDrop(true); }}
            onFocus={() => { setAssuntoSearch(""); setShowAssuntoDrop(true); }}
          />
          <i className="fa-regular fa-chevron-down" style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }} />
        </div>
        {showAssuntoDrop && (
          <div className="ndm-setor-drop">
            {lista.filter(a => a.toLowerCase().includes(assuntoSearch.toLowerCase())).map(a => (
              <button
                key={a}
                className="ndm-setor-item"
                onClick={() => { setAssuntoValue(a); setAssuntoSearch(a); setShowAssuntoDrop(false); }}
              >
                {a}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const editorBlock = (
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
  );

  const prazoSection = (
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
  );

  const anexosSection = (
    <div className="ndm-section">
      <button className="ndm-section-trigger" onClick={() => toggleSecao("anexos")}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#333" }}>Anexos</span>
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
                  <button className="ndm-file-remove" onClick={() => setArquivos((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
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
  );

  const assinaturasSection = (
    <div className="ndm-section">
      <button className="ndm-section-trigger" onClick={() => toggleSecao("assinaturas")}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>Assinaturas</span>
        <i className={`fa-regular fa-chevron-${secoes.assinaturas ? "up" : "down"}`} style={{ fontSize: 12, color: "#888" }} />
      </button>
      {secoes.assinaturas && (
        <div className="ndm-section-body">
          <div style={{ marginBottom: 4 }}>
            <div className="ndm-sig-group-title">Minha assinatura</div>
            <div className="ndm-sig-group-desc">Assine documentos de forma rápida e segura.</div>
            <div className="ndm-sig-radio-row">
              <button className={`ndm-radio-btn ${assinaturaType === "eletronica" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`} onClick={() => setAssinaturaType("eletronica")}>
                <span className={`ndm-radio-circle ${assinaturaType === "eletronica" ? "ndm-radio-circle--filled" : ""}`} />
                Assinatura eletrônica
              </button>
              <button className={`ndm-radio-btn ${assinaturaType === "icp" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`} onClick={() => setAssinaturaType("icp")}>
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
          <div>
            <div className="ndm-sig-group-title">Solicitar assinatura(s)</div>
            <div className="ndm-sig-group-desc">Peça a assinatura de outras pessoas para concluir o documento.</div>
            <div className="ndm-field" style={{ marginBottom: 12 }}>
              <label className="ndm-label">Enviar para lista de assinantes*</label>
              <div className="ndm-email-row">
                <select className="ndm-select" style={{ flex: 1 }}><option value="">Selecione uma lista</option><option>Lista padrão</option></select>
                <button className="ndm-gerar-btn"><i className="fa-regular fa-gear" /> Gerenciar Listas</button>
              </div>
            </div>
            <div className="ndm-user-group-label">Usuários internos</div>
            <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
              {internos.map((u, i) => (
                <span key={i} className="ndm-chip ndm-chip--user">{u}<button className="ndm-chip-remove" onClick={() => setInternos((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
              ))}
            </div>
            <div className="ndm-user-group-label">Contato externo</div>
            <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
              {externos.map((u, i) => (
                <span key={i} className="ndm-chip ndm-chip--user">{u}<button className="ndm-chip-remove" onClick={() => setExternos((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
              ))}
            </div>
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={sequencial} onChange={(e) => setSequencial(e.target.checked)} />
              Requerer assinaturas em ordem sequencial
            </label>
          </div>
          {sequencial && (
            <div className="ndm-sig-table-wrap">
              <div className="ndm-sig-table-header">
                <div style={{ width: 28 }} /><div style={{ width: 60 }}>Ordem</div>
                <div style={{ flex: 1 }}>Assinante</div>
                <div style={{ width: 110 }} /><div style={{ width: 110 }}>Função</div><div style={{ width: 36 }} />
              </div>
              <div className="ndm-sig-rows">
                {assinaturas.map((row, i) => (
                  <div key={i} className="ndm-sig-row">
                    <span className="ndm-drag-handle"><i className="fa-regular fa-grip-dots-vertical" /></span>
                    <input className="ndm-order-input" value={row.ordem} onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, ordem: e.target.value } : a))} />
                    <span className="ndm-sig-row-name">{row.assinante}</span>
                    <select className="ndm-table-select" value={row.papel} onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, papel: e.target.value } : a))}>
                      <option>Parte</option><option>Testemunha</option><option>Advogado</option>
                    </select>
                    <select className="ndm-table-select" value={row.funcao} onChange={(e) => setAssinaturas((p) => p.map((a, idx) => idx === i ? { ...a, funcao: e.target.value } : a))}>
                      <option>Assinar</option><option>Reconhecer</option><option>Validar</option>
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
  );

  // ── Type-specific field sets ───────────────────────────────

  const memorandoFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Para*</label>
        <div className="ndm-para-row">
          {paraChips.map((chip, i) => (
            <span key={`para-${i}-${chip}`} className="ndm-chip">{chip}<button className="ndm-chip-remove" onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
          ))}
          <input className="ndm-para-input" placeholder={paraChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""} value={paraInput} onChange={(e) => setParaInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChip(paraInput, setParaChips, setParaInput)} />
          <button className="ndm-action-btn">+ CC</button>
          <button className="ndm-action-btn">Aos cuidados</button>
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Com cópia</label>
        <div className="ndm-para-row">
          {ccChips.map((chip, i) => (
            <span key={`cc-${i}-${chip}`} className="ndm-chip">{chip}<button className="ndm-chip-remove" onClick={() => setCcChips((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
          ))}
          <input className="ndm-para-input" placeholder={ccChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""} value={ccInput} onChange={(e) => setCcInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChip(ccInput, setCcChips, setCcInput)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Aos cuidados</label>
        <div className="ndm-para-row">
          {cuidadosChips.map((chip, i) => (
            <span key={`cuidados-${i}-${chip}`} className="ndm-chip">{chip}<button className="ndm-chip-remove" onClick={() => setCuidadosChips((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
          ))}
          <input className="ndm-para-input" placeholder={cuidadosChips.length === 0 ? "Nome do responsável..." : ""} value={cuidadosInput} onChange={(e) => setCuidadosInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChip(cuidadosInput, setCuidadosChips, setCuidadosInput)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input className="ndm-input" placeholder="Descreva o assunto do documento..." value={assunto} onChange={(e) => setAssunto(e.target.value)} />
      </div>
      {editorBlock}
      {prazoSection}
      {anexosSection}
      {assinaturasSection}
    </>
  );

  const documentoFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input className="ndm-input" placeholder="Informe o título do documento..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <div className="ndm-setor-picker" ref={tipoDocDropRef}>
          <div className="ndm-select-custom" onClick={() => setShowTipoDocDrop(true)}>
            <input className="ndm-para-input" placeholder="Pesquisar tipo de documento..." value={showTipoDocDrop ? tipoDocSearch : tipoDocumento} onChange={(e) => { setTipoDocSearch(e.target.value); setShowTipoDocDrop(true); }} onFocus={() => { setTipoDocSearch(""); setShowTipoDocDrop(true); }} />
            <i className="fa-regular fa-chevron-down" style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }} />
          </div>
          {showTipoDocDrop && (
            <div className="ndm-setor-drop">
              {filteredTiposDoc.length === 0 ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#888" }}>Nenhum tipo encontrado</div> : filteredTiposDoc.map(t => (
                <button key={t} className="ndm-setor-item" onClick={() => { setTipoDocumento(t); setTipoDocSearch(t); setShowTipoDocDrop(false); }}>{t}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Contratado</label>
          <input className="ndm-input" placeholder="Nome ou razão social..." value={contratado} onChange={(e) => setContratado(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Contratante</label>
          <input className="ndm-input" placeholder="Nome ou razão social..." value={contratante} onChange={(e) => setContratante(e.target.value)} />
        </div>
      </div>
      {editorBlock}
      {assinaturasSection}
    </>
  );

  const ataFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título da reunião*</label>
        <input className="ndm-input" placeholder="Ex: Reunião de planejamento estratégico..." value={tituloReuniao} onChange={(e) => setTituloReuniao(e.target.value)} />
      </div>
      {setorPickerBlock("Destinatário")}
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
    </>
  );

  const circularFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input className="ndm-input" placeholder="Descreva o assunto da circular..." value={assunto} onChange={(e) => setAssunto(e.target.value)} />
      </div>
      {setorPickerBlock("Para")}
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
      {anexosSection}
      {assinaturasSection}
      {prazoSection}
    </>
  );

  const cicloVidaFields = (
    <>
      <div className="ndm-info-banner">
        <i className="fa-regular fa-circle-info" />
        <span>O ciclo de vida será iniciado automaticamente após a postagem. Todos os responsáveis serão notificados conforme o fluxo configurado.</span>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Destinatário*</label>
        <div className="ndm-para-row">
          {paraChips.map((chip, i) => (
            <span key={`dest-${i}-${chip}`} className="ndm-chip">{chip}<button className="ndm-chip-remove" onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
          ))}
          <input className="ndm-para-input" placeholder={paraChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""} value={paraInput} onChange={(e) => setParaInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChip(paraInput, setParaChips, setParaInput)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Com cópia</label>
        <div className="ndm-para-row">
          {ccChips.map((chip, i) => (
            <span key={`cc-${i}-${chip}`} className="ndm-chip">{chip}<button className="ndm-chip-remove" onClick={() => setCcChips((p) => p.filter((_, idx) => idx !== i))}>×</button></span>
          ))}
          <input className="ndm-para-input" placeholder={ccChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""} value={ccInput} onChange={(e) => setCcInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChip(ccInput, setCcChips, setCcInput)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input className="ndm-input" placeholder="Descreva o assunto do documento..." value={assunto} onChange={(e) => setAssunto(e.target.value)} />
      </div>
      {editorBlock}
      {prazoSection}
      {anexosSection}
    </>
  );

  const alvaraFields = (
    <>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Tipo*</label>
          <select className="ndm-select" value={alvaraTipo} onChange={(e) => setAlvaraTipo(e.target.value)}>
            <option value="">- selecione -</option>
            {ALVARA_TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Requerente*</label>
          <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={requerente} onChange={(e) => setRequerente(e.target.value)} />
        </div>
      </div>

      {editorBlock}

      <div className="ndm-field">
        <label className="ndm-label">Emitir e já mencionar em</label>
        <select className="ndm-select" value={emitirEm} onChange={(e) => { setEmitirEm(e.target.value); setProcessoSelecionado(""); }}>
          <option value="">- selecione categoria -</option>
          {ALVARA_CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {emitirEm && PROCESSOS_POR_CATEGORIA[emitirEm] && (
        <div className="ndm-process-list">
          <div className="ndm-process-list-title">
            <i className="fa-regular fa-folder-open" style={{ marginRight: 6 }} />
            Processos em {emitirEm}
          </div>
          {PROCESSOS_POR_CATEGORIA[emitirEm].map((p, i) => (
            <label key={i} className="ndm-process-item">
              <input
                type="radio"
                name="processo-alvara"
                value={p.num}
                checked={processoSelecionado === p.num}
                onChange={() => setProcessoSelecionado(p.num)}
                style={{ accentColor: "#0058db" }}
              />
              <span className="ndm-process-num">{p.num}</span>
              <span className="ndm-process-desc">{p.descricao}</span>
            </label>
          ))}
        </div>
      )}

      {assinaturasSection}
    </>
  );

  const ouvidoriaFields = (
    <>
      {/* Identificação */}
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

      {/* Solicitante */}
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
      </div>

      {assuntoSearchBlock(ASSUNTOS_OUVIDORIA)}

      {/* Para + links */}
      <div className="ndm-field">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>+ CC</button>
          </div>
        </div>
        <select className="ndm-select" value={paraSetorOuv} onChange={(e) => setParaSetorOuv(e.target.value)}>
          <option value="">- selecione setor -</option>
          {MOCK_SETORES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Prioridade + Atendimento */}
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Prioridade</label>
          <select className="ndm-select" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <select className="ndm-select" value={atendPrioritario} onChange={(e) => setAtendPrioritario(e.target.value)}>
            <option value="">- selecione -</option>
            {ATEND_PRIORITARIO_OPTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Data + Hora */}
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

      {/* Onde ocorreu */}
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
              <button
                className="ndm-gerar-btn"
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                onClick={confirmarEndereco}
              >
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
            />
          </div>
        )}
      </div>

      {editorBlock}
      {anexosSection}
    </>
  );

  const chamadoTecnicoFields = (
    <>
      {/* Solicitante */}
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
      </div>

      {assuntoSearchBlock(ASSUNTOS_CHAMADO)}

      {/* Nº Patrimônio */}
      <div className="ndm-field">
        <label className="ndm-label">Nº de Patrimônio</label>
        <input className="ndm-input" placeholder="Caso exista" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
      </div>

      {/* Urgente + Atendimento */}
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Urgência</label>
          <label className="ndm-checkbox-row" style={{ marginTop: 7 }}>
            <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} />
            Urgente
          </label>
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <select className="ndm-select" value={atendPrioritario} onChange={(e) => setAtendPrioritario(e.target.value)}>
            <option value="">- selecione -</option>
            {ATEND_PRIORITARIO_OPTS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {editorBlock}

      <div className="ndm-field">
        <label className="ndm-checkbox-row">
          <input type="checkbox" checked={acompanhaFisico} onChange={(e) => setAcompanhaFisico(e.target.checked)} />
          Acompanha documento físico, imprimir folha de rosto
        </label>
      </div>

      {anexosSection}
      {prazoSection}
      {assinaturasSection}
    </>
  );

  const getTypeFields = () => {
    switch (tipoDoc) {
      case "Documento": return documentoFields;
      case "Ata": return ataFields;
      case "Circular": return circularFields;
      case "Ciclo de vida": return cicloVidaFields;
      case "Alvará": return alvaraFields;
      case "Ouvidoria": return ouvidoriaFields;
      case "Chamado técnico": return chamadoTecnicoFields;
      default: return memorandoFields;
    }
  };

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
          <div className="ndm-field">
            <label className="ndm-label">Tipo de documento*</label>
            <select className="ndm-select" value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>
              {TIPOS_DOC.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {getTypeFields()}
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
            <button className="ndm-btn-post">{footerLabel}</button>
          </div>
        </div>

      </div>
    </>
  );
}
