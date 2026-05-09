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
  "Matéria Legislativa", "Processo judicial",
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

const MOCK_PESSOAS = [
  "Ana Paula Ferreira", "Beatriz Oliveira", "Carlos Mendes",
  "Cris Lima", "Fernanda Lima", "Inácio Santos",
  "João Pedro Alves", "Moacir Silva de Matos Junior",
  "Roberto Costa", "Samuel Desenvolvedor III",
];

const MOCK_LISTAS_ENVIO: Record<string, string[]> = {
  "Lista Administrativa": ["Cris Lima", "Moacir Silva de Matos Junior", "Ana Paula Ferreira"],
  "Lista Técnica": ["Samuel Desenvolvedor III", "Roberto Costa", "Fernanda Lima"],
  "Lista Executiva": ["Inácio Santos", "Carlos Mendes", "João Pedro Alves"],
};

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

const ASSUNTOS_PROTOCOLO = [
  "Requerimento geral", "Licença ambiental", "Certidão negativa",
  "Alvará de funcionamento", "Habite-se", "Regularização fundiária",
  "Serviços públicos", "Tributário", "Obras e reformas", "Outros",
];

const ENTRADA_TIPOS = [
  "Documento", "Requerimento", "Petição", "Processo",
  "Recurso", "Solicitação", "Ofício", "Carta",
];

const SESSAO_TIPOS = ["Ordinária", "Extraordinária", "Solene", "Especial", "Especial de Posse"];

const FISCALIZACAO_TIPOS = [
  "Ambiental", "Tributária", "Sanitária",
  "Obras e Edificações", "Posturas Municipais", "Transporte",
];

const PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"];

const ATEND_PRIORITARIO_OPTS = [
  "Idoso +80", "Idoso +60", "Pessoa com deficiência (PCD)",
  "Transtorno espectro autista (TEA)", "Gestante",
  "Obesidade", "Mobilidade reduzida", "Doador de sangue",
];

const TIPOS_ADM = [
  "Contrato", "Licitação", "Convênio", "Processo Disciplinar",
  "Prestação de Contas", "Dispensa de Licitação", "Outros",
];

const TIPOS_ATO = [
  "Portaria", "Decreto", "Resolução", "Instrução Normativa",
  "Deliberação", "Regulamentação", "Outros",
];

const CATEGORIAS_ENTRADA = [
  "Geral", "Tributário", "Ambiental", "Obras",
  "Social", "Saúde", "Educação", "Outros",
];

const TIPOS_JUSTICA = [
  "Civil", "Criminal", "Trabalhista", "Previdenciária",
  "Tributária", "Federal", "Eleitoral", "Outros",
];

const TIPOS_MATERIA = [
  "Projeto de Lei", "Proposta de Emenda", "Decreto Legislativo",
  "Resolução", "Indicação", "Requerimento", "Moção", "Outros",
];

const DOCS_ORIGEM = [
  "Ofício", "Memorando", "Requerimento", "Petição",
  "Processo", "Contrato", "Outros",
];

const TIPOS_PARECER = [
  "Jurídico", "Técnico", "Financeiro", "Ambiental", "Contábil", "Outros",
];

const MOCK_EMPRESAS = [
  ...["Ana Paula Ferreira", "Beatriz Oliveira", "Carlos Mendes",
  "Cris Lima", "Fernanda Lima", "Inácio Santos",
  "João Pedro Alves", "Moacir Silva de Matos Junior",
  "Roberto Costa", "Samuel Desenvolvedor III"],
  "Construtora São Paulo Ltda", "TechSolutions ME", "Assessoria Jurídica Mendes",
  "Gráfica Rápida Eireli", "Distribuidora Central S/A",
];

// ── Reutilizável: dropdown pesquisável moderno ─────────────
function SimpleSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="ndm-setor-picker" ref={ref}>
      <div className="ndm-select-custom" onClick={() => { setOpen(true); setSearch(""); }}>
        <input
          className="ndm-para-input"
          placeholder={placeholder ?? "Selecione ou pesquise..."}
          value={open ? search : value}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          onFocus={() => { setSearch(""); setOpen(true); }}
          readOnly={!open}
        />
        <i className="fa-regular fa-chevron-down" style={{ fontSize: 11, color: open ? "#0058db" : "#94a3b8", flexShrink: 0, transition: "transform 0.15s ease", transform: open ? "rotate(180deg)" : "none" }} />
      </div>
      {open && (
        <div className="ndm-setor-drop">
          {filtered.length === 0
            ? <div style={{ padding: "10px 14px", fontSize: 12, color: "#888" }}>Nenhuma opção encontrada</div>
            : filtered.map(o => (
              <button key={o} className={`ndm-setor-item${value === o ? " ndm-setor-item--active" : ""}`}
                onClick={() => { onChange(o); setOpen(false); }}>
                {value === o && <i className="fa-regular fa-check" style={{ fontSize: 11, color: "#0058db", flexShrink: 0 }} />}
                {o}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default function NovoDocumentoModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<ModalMode>("normal");
  const prevMode = useRef<ModalMode>("normal");

  // ── form state ─────────────────────────────────────────────
  const [tipoDoc, setTipoDoc] = useState("Memorando");
  const [assunto, setAssunto] = useState("");
  const [urgente, setUrgente] = useState(false);

  // Para chips (Memorando / Ofício / Ciclo de vida)
  const [paraChips, setParaChips] = useState<string[]>([]);
  const [paraInput, setParaInput] = useState("");

  // CC — oculto por padrão, exibe ao clicar "+ CC"
  const [showCC, setShowCC] = useState(false);
  const [ccChips, setCcChips] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [showCcSuggestions, setShowCcSuggestions] = useState(false);
  const [ccListaSelecionada, setCcListaSelecionada] = useState("");
  const ccRef = useRef<HTMLDivElement>(null);

  // Aos cuidados — oculto por padrão
  const [showCuidados, setShowCuidados] = useState(false);
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

  // Ouvidoria + Chamado técnico (shared)
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
  const [patrimonio, setPatrimonio] = useState("");

  // Sessão Plenária
  const [sessaoNumero, setSessaoNumero] = useState("");
  const [sessaoAno, setSessaoAno] = useState(now.getFullYear().toString());
  const [sessaoTipo, setSessaoTipo] = useState("");
  const [publicarCentral, setPublicarCentral] = useState(false);
  const [dataSessao, setDataSessao] = useState(now.toISOString().split("T")[0]);
  const [horaSessao, setHoraSessao] = useState(now.toTimeString().slice(0, 5));

  // Protocolo / Análise de Projeto
  const [assuntoProtocolo, setAssuntoProtocolo] = useState("");
  const [paraSetorProtocolo, setParaSetorProtocolo] = useState("");
  const [entradaTipo, setEntradaTipo] = useState("");

  // Fiscalização
  const [fiscalizado, setFiscalizado] = useState("");
  const [fiscalizacaoTipo, setFiscalizacaoTipo] = useState("");
  const [fiscalizacaoPara, setFiscalizacaoPara] = useState("");

  // Proc. Administrativo
  const [tipoDocAdm, setTipoDocAdm] = useState("");

  // Ato oficial
  const [atoNumero, setAtoNumero] = useState("");
  const [atoAno, setAtoAno] = useState(now.getFullYear().toString());
  const [atoAssunto, setAtoAssunto] = useState("");
  const [atoTipo, setAtoTipo] = useState("");

  // Entrada de dados
  const [entradaTitulo, setEntradaTitulo] = useState("");
  const [entradaCategoria, setEntradaCategoria] = useState("");
  const [entradaData, setEntradaData] = useState(now.toISOString().split("T")[0]);
  const [entradaHora, setEntradaHora] = useState(now.toTimeString().slice(0, 5));

  // Processo judicial
  const [requerido, setRequerido] = useState("");
  const [processoJudNum, setProcessoJudNum] = useState("");
  const [tipoJustica, setTipoJustica] = useState("");
  const [nomeParteAutora, setNomeParteAutora] = useState("");
  const [numPasta, setNumPasta] = useState("");

  // Matéria Legislativa
  const [ementa, setEmenta] = useState("");
  const [tipoMateria, setTipoMateria] = useState("");
  const [docOrigem, setDocOrigem] = useState("");
  const [docOrigemNum, setDocOrigemNum] = useState("");

  // Parecer
  const [parecerTitulo, setParecerTitulo] = useState("");
  const [parecerTipo, setParecerTipo] = useState("");

  // Para autocomplete (Memorando / Ofício)
  const [showParaSuggestions, setShowParaSuggestions] = useState(false);
  const paraDropRef = useRef<HTMLDivElement>(null);

  // Cuidados autocomplete
  const [showCuidadosSuggestions, setShowCuidadosSuggestions] = useState(false);
  const cuidadosRef = useRef<HTMLDivElement>(null);

  // Documento — contratado/contratante único com autocomplete
  const [contratadoContratante, setContratadoContratante] = useState("");
  const [showContratadoDrop, setShowContratadoDrop] = useState(false);
  const contratadoRef = useRef<HTMLDivElement>(null);

  // Álvará — tipo com busca
  const [alvaraTipoSearch, setAlvaraTipoSearch] = useState("");
  const [showAlvaraTipoDrop, setShowAlvaraTipoDrop] = useState(false);
  const alvaraTipoRef = useRef<HTMLDivElement>(null);

  // sections
  const [secoes, setSecoes] = useState({ prazo: false, anexos: false, assinaturas: false });
  const toggleSecao = (s: keyof typeof secoes) => setSecoes((p) => ({ ...p, [s]: !p[s] }));

  const [prazoTitulo, setPrazoTitulo] = useState("");
  const [prazoData, setPrazoData] = useState("");
  const [prazoHorario, setPrazoHorario] = useState("");
  const [assinaturaType, setAssinaturaType] = useState<"eletronica" | "icp">("eletronica");
  const [sequencial, setSequencial] = useState(false);
  const [internos, setInternos] = useState<string[]>([]);
  const [externos, setExternos] = useState<string[]>([]);
  const [assinaturas, setAssinaturas] = useState<{ ordem: string; assinante: string; papel: string; funcao: string }[]>([]);
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
      if (ccRef.current && !ccRef.current.contains(e.target as Node)) {
        setShowCcSuggestions(false);
      }
      if (paraDropRef.current && !paraDropRef.current.contains(e.target as Node)) {
        setShowParaSuggestions(false);
      }
      if (cuidadosRef.current && !cuidadosRef.current.contains(e.target as Node)) {
        setShowCuidadosSuggestions(false);
      }
      if (contratadoRef.current && !contratadoRef.current.contains(e.target as Node)) {
        setShowContratadoDrop(false);
      }
      if (alvaraTipoRef.current && !alvaraTipoRef.current.contains(e.target as Node)) {
        setShowAlvaraTipoDrop(false);
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
  const filteredPessoas = ccInput.trim().length > 0
    ? MOCK_PESSOAS.filter(p =>
        p.toLowerCase().includes(ccInput.toLowerCase()) && !ccChips.includes(p)
      )
    : [];

  const filteredParaSetores = paraInput.trim().length > 0
    ? MOCK_SETORES.filter(s =>
        s.toLowerCase().includes(paraInput.toLowerCase()) && !paraChips.includes(s)
      )
    : [];

  const filteredCuidadosPessoas = cuidadosInput.trim().length > 0
    ? MOCK_PESSOAS.filter(p =>
        p.toLowerCase().includes(cuidadosInput.toLowerCase()) && !cuidadosChips.includes(p)
      )
    : [];

  const filteredEmpresas = contratadoContratante.trim().length > 0
    ? MOCK_EMPRESAS.filter(e =>
        e.toLowerCase().includes(contratadoContratante.toLowerCase())
      )
    : [];

  const filteredAlvaraTipos = ALVARA_TIPOS.filter(t =>
    t.toLowerCase().includes(alvaraTipoSearch.toLowerCase())
  );

  // ── Footer label ───────────────────────────────────────────
  const footerLabel = (() => {
    switch (tipoDoc) {
      case "Alvará": return "Emitir";
      case "Chamado técnico": return "Abrir chamado";
      case "Ouvidoria": return "Registrar";
      case "Sessão Plenária": return "Salvar";
      case "Entrada de dados":
      case "Parecer": return "Salvar";
      case "Protocolo":
      case "Análise de Projeto":
      case "Matéria Legislativa": return "Protocolar";
      case "Fiscalização":
      case "Proc. Administrativo":
      case "Ato oficial":
      case "Processo judicial": return "Enviar";
      default: return "Postar";
    }
  })();

  // ── Shared: CC panel ───────────────────────────────────────
  const ccPanel = showCC ? (
    <div className="ndm-field ndm-cc-panel">
      <div className="ndm-cc-header">
        <label className="ndm-label" style={{ margin: 0 }}>Com cópia</label>
        <button
          className="ndm-action-btn"
          style={{ fontSize: 11, color: "var(--danger)" }}
          onClick={() => { setShowCC(false); setCcChips([]); setCcInput(""); setCcListaSelecionada(""); }}
        >
          × Remover CC
        </button>
      </div>
      <select
        className="ndm-select"
        style={{ marginBottom: 6 }}
        value={ccListaSelecionada}
        onChange={(e) => {
          const lista = e.target.value;
          setCcListaSelecionada(lista);
          if (lista && MOCK_LISTAS_ENVIO[lista]) {
            const novas = MOCK_LISTAS_ENVIO[lista].filter(p => !ccChips.includes(p));
            setCcChips(prev => [...prev, ...novas]);
          }
        }}
      >
        <option value="">Ou selecione uma lista de envio...</option>
        {Object.keys(MOCK_LISTAS_ENVIO).map(l => <option key={l}>{l}</option>)}
      </select>
      <div className="ndm-setor-picker" ref={ccRef}>
        <div className="ndm-para-row">
          {ccChips.map((chip, i) => (
            <span key={i} className="ndm-chip">
              <i className="fa-regular fa-user" style={{ fontSize: 10 }} />
              {chip}
              <button className="ndm-chip-remove" onClick={() => setCcChips(p => p.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={ccChips.length === 0 ? "Buscar pessoa por nome..." : ""}
            value={ccInput}
            onChange={(e) => { setCcInput(e.target.value); setShowCcSuggestions(e.target.value.trim().length > 0); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && ccInput.trim() && filteredPessoas.length === 0) {
                addChip(ccInput, setCcChips, setCcInput);
                setShowCcSuggestions(false);
              }
            }}
          />
        </div>
        {showCcSuggestions && filteredPessoas.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredPessoas.map(p => (
              <button
                key={p}
                className="ndm-setor-item"
                onClick={() => {
                  setCcChips(prev => [...prev, p]);
                  setCcInput("");
                  setShowCcSuggestions(false);
                }}
              >
                <i className="fa-regular fa-user" style={{ fontSize: 12, color: "#0058db" }} />
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

  const cuidadosPanel = showCuidados ? (
    <div className="ndm-field ndm-cc-panel">
      <div className="ndm-cc-header">
        <label className="ndm-label" style={{ margin: 0 }}>Aos cuidados</label>
        <button
          className="ndm-action-btn"
          style={{ fontSize: 11, color: "var(--danger)" }}
          onClick={() => { setShowCuidados(false); setCuidadosChips([]); setCuidadosInput(""); setShowCuidadosSuggestions(false); }}
        >
          × Remover
        </button>
      </div>
      <div className="ndm-setor-picker" ref={cuidadosRef}>
        <div className="ndm-para-row">
          {cuidadosChips.map((chip, i) => (
            <span key={`cuidados-${i}-${chip}`} className="ndm-chip">
              <i className="fa-regular fa-user" style={{ fontSize: 10 }} />
              {chip}
              <button className="ndm-chip-remove" onClick={() => setCuidadosChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={cuidadosChips.length === 0 ? "Nome do responsável..." : ""}
            value={cuidadosInput}
            onChange={(e) => { setCuidadosInput(e.target.value); setShowCuidadosSuggestions(e.target.value.trim().length > 0); }}
            onKeyDown={(e) => e.key === "Enter" && addChip(cuidadosInput, setCuidadosChips, setCuidadosInput)}
          />
        </div>
        {showCuidadosSuggestions && filteredCuidadosPessoas.length > 0 && (
          <div className="ndm-setor-drop">
            {filteredCuidadosPessoas.map(p => (
              <button key={p} className="ndm-setor-item"
                onClick={() => { setCuidadosChips(prev => [...prev, p]); setCuidadosInput(""); setShowCuidadosSuggestions(false); }}>
                <i className="fa-regular fa-user" style={{ fontSize: 12, color: "#0058db" }} />{p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

  // ── Shared blocks ──────────────────────────────────────────

  const setorPickerBlock = (label: string) => (
    <div className="ndm-field">
      <label className="ndm-label">{label}*</label>
      <div className="ndm-setor-picker" ref={setorPickerRef}>
        <div className="ndm-para-row" onClick={() => setSetorPickerOpen(true)} style={{ cursor: "text" }}>
          {setorChips.map((chip, i) => (
            <span key={i} className="ndm-chip">
              {chip}
              <button className="ndm-chip-remove" onClick={(e) => { e.stopPropagation(); setSetorChips(p => p.filter((_, idx) => idx !== i)); }}>×</button>
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
              <button key={s} className="ndm-setor-item" onClick={() => {
                if (!setorChips.includes(s)) setSetorChips(p => [...p, s]);
                setSetorSearch(""); setSetorPickerOpen(false);
              }}>
                <i className="fa-regular fa-building" style={{ fontSize: 12, color: "#0058db" }} />{s}
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
              <button key={a} className="ndm-setor-item" onClick={() => { setAssuntoValue(a); setAssuntoSearch(a); setShowAssuntoDrop(false); }}>{a}</button>
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
          <button className="ndm-upload-btn"><i className="fa-regular fa-paperclip" /> Anexar arquivo</button>
          {arquivos.length > 0 && (
            <div className="ndm-file-list">
              {arquivos.map((f, i) => (
                <div key={i} className="ndm-file-item">
                  <span className="ndm-file-link">{f.name} ({f.size})</span>
                  <button className="ndm-file-remove" onClick={() => setArquivos((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                  <select className="ndm-file-select-wide" value={f.tipo} onChange={(e) => setArquivos((prev) => prev.map((a, idx) => idx === i ? { ...a, tipo: e.target.value } : a))}>
                    <option value="">Selecione</option><option>Eletrônico</option><option>Sigiloso</option><option>Público</option>
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
                <span className={`ndm-radio-circle ${assinaturaType === "eletronica" ? "ndm-radio-circle--filled" : ""}`} />Assinatura eletrônica
              </button>
              <button className={`ndm-radio-btn ${assinaturaType === "icp" ? "ndm-radio-btn--active" : "ndm-radio-btn--inactive"}`} onClick={() => setAssinaturaType("icp")}>
                <span className={`ndm-radio-circle ${assinaturaType === "icp" ? "ndm-radio-circle--filled" : ""}`} />Certificado ICP - Brasil
              </button>
              <select className="ndm-sig-mode-select"><option value="">Modo de assinatura</option><option>Simples</option><option>Avançado</option></select>
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
              {internos.map((u, i) => <span key={i} className="ndm-chip ndm-chip--user">{u}<button className="ndm-chip-remove" onClick={() => setInternos((p) => p.filter((_, idx) => idx !== i))}>×</button></span>)}
            </div>
            <div className="ndm-user-group-label">Contato externo</div>
            <div className="ndm-chip-box" style={{ marginBottom: 10 }}>
              {externos.map((u, i) => <span key={i} className="ndm-chip ndm-chip--user">{u}<button className="ndm-chip-remove" onClick={() => setExternos((p) => p.filter((_, idx) => idx !== i))}>×</button></span>)}
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
                <div style={{ flex: 1 }}>Assinante</div><div style={{ width: 110 }} /><div style={{ width: 110 }}>Função</div><div style={{ width: 36 }} />
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
                    <button className="ndm-del-btn" onClick={() => setAssinaturas((p) => p.filter((_, idx) => idx !== i))}><i className="fa-regular fa-trash" /></button>
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
        <div className="ndm-setor-picker" ref={paraDropRef}>
          <div className="ndm-para-row">
            {paraChips.map((chip, i) => (
              <span key={`para-${i}-${chip}`} className="ndm-chip">
                <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
                {chip}
                <button className="ndm-chip-remove" onClick={() => setParaChips((p) => p.filter((_, idx) => idx !== i))}>×</button>
              </span>
            ))}
            <input
              className="ndm-para-input"
              placeholder={paraChips.length === 0 ? "Pesquisar setor..." : ""}
              value={paraInput}
              onChange={(e) => { setParaInput(e.target.value); setShowParaSuggestions(e.target.value.trim().length > 0); }}
              onKeyDown={(e) => { if (e.key === "Enter") { addChip(paraInput, setParaChips, setParaInput); setShowParaSuggestions(false); } }}
            />
            {!showCC && <button className="ndm-action-btn" onClick={() => setShowCC(true)}>+ CC</button>}
            {!showCuidados && <button className="ndm-action-btn" onClick={() => setShowCuidados(true)}>Aos cuidados</button>}
          </div>
          {showParaSuggestions && filteredParaSetores.length > 0 && (
            <div className="ndm-setor-drop">
              {filteredParaSetores.map(s => (
                <button key={s} className="ndm-setor-item"
                  onClick={() => { setParaChips(p => [...p, s]); setParaInput(""); setShowParaSuggestions(false); }}>
                  <i className="fa-regular fa-building" style={{ fontSize: 12, color: "#0058db" }} />{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {ccPanel}
      {cuidadosPanel}
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
      <div style={{ background: "#fff8e6", border: "1px solid #f5c842", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#7a5100", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <i className="fa-regular fa-circle-info" style={{ color: "#e6a800", marginTop: 1, flexShrink: 0 }} />
        <span>
          O documento é indicado para solicitar as assinaturas e fazer o acompanhamento de forma digital tanto de contratos anexados em PDF quanto redigidos diretamente na plataforma no campo de texto.{" "}
          <a href="#" style={{ color: "#0058db", fontWeight: 600 }} onClick={(e) => e.preventDefault()}>Clique aqui para saber mais!</a>
        </span>
      </div>
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
              {filteredTiposDoc.length === 0
                ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#888" }}>Nenhum tipo encontrado</div>
                : filteredTiposDoc.map(t => <button key={t} className="ndm-setor-item" onClick={() => { setTipoDocumento(t); setTipoDocSearch(t); setShowTipoDocDrop(false); }}>{t}</button>)
              }
            </div>
          )}
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Contratado / Contratante</label>
        <div className="ndm-setor-picker" ref={contratadoRef}>
          <input
            className="ndm-input"
            placeholder="Busque pelo nome ou razão social..."
            value={contratadoContratante}
            onChange={(e) => { setContratadoContratante(e.target.value); setShowContratadoDrop(e.target.value.trim().length > 0); }}
            onFocus={() => contratadoContratante.trim().length > 0 && setShowContratadoDrop(true)}
          />
          {showContratadoDrop && filteredEmpresas.length > 0 && (
            <div className="ndm-setor-drop">
              {filteredEmpresas.map(e => (
                <button key={e} className="ndm-setor-item"
                  onClick={() => { setContratadoContratante(e); setShowContratadoDrop(false); }}>
                  <i className="fa-regular fa-user" style={{ fontSize: 12, color: "#0058db" }} />{e}
                </button>
              ))}
            </div>
          )}
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
      {prazoSection}
      {assinaturasSection}
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
          <div className="ndm-setor-picker" ref={alvaraTipoRef}>
            <div className="ndm-select-custom" onClick={() => setShowAlvaraTipoDrop(true)}>
              <input
                className="ndm-para-input"
                placeholder="Pesquisar tipo de alvará..."
                value={showAlvaraTipoDrop ? alvaraTipoSearch : alvaraTipo}
                onChange={(e) => { setAlvaraTipoSearch(e.target.value); setShowAlvaraTipoDrop(true); }}
                onFocus={() => { setAlvaraTipoSearch(""); setShowAlvaraTipoDrop(true); }}
              />
              <i className="fa-regular fa-chevron-down" style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }} />
            </div>
            {showAlvaraTipoDrop && (
              <div className="ndm-setor-drop">
                {filteredAlvaraTipos.length === 0
                  ? <div style={{ padding: "10px 12px", fontSize: 12, color: "#888" }}>Nenhum tipo encontrado</div>
                  : filteredAlvaraTipos.map(t => (
                    <button key={t} className="ndm-setor-item" onClick={() => { setAlvaraTipo(t); setAlvaraTipoSearch(t); setShowAlvaraTipoDrop(false); }}>{t}</button>
                  ))
                }
              </div>
            )}
          </div>
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Requerente*</label>
          <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={requerente} onChange={(e) => setRequerente(e.target.value)} />
        </div>
      </div>
      {editorBlock}
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
          {PROCESSOS_POR_CATEGORIA[emitirEm].map((p, i) => (
            <label key={i} className="ndm-process-item">
              <input type="radio" name="processo-alvara" value={p.num} checked={processoSelecionado === p.num} onChange={() => setProcessoSelecionado(p.num)} style={{ accentColor: "#0058db" }} />
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
      <div className="ndm-field">
        <label className="ndm-label">Identificação*</label>
        <div className="ndm-ident-row">
          {[
            { val: "sem-sigilo", label: "Sem sigilo", icon: "fa-eye" },
            { val: "sigilosa", label: "Sigilosa", icon: "fa-lock" },
            { val: "anonima", label: "Anônima", icon: "fa-user-secret" },
          ].map(opt => (
            <button key={opt.val} className={`ndm-ident-btn ${identificacao === opt.val ? "ndm-ident-btn--active" : ""}`} onClick={() => setIdentificacao(opt.val as typeof identificacao)}>
              <i className={`fa-regular ${opt.icon}`} style={{ fontSize: 13 }} />{opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
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
      {ccPanel}
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
            <input className="ndm-input" placeholder="Encontre o endereço..." value={enderecoCompleto} onChange={(e) => setEnderecoCompleto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmarEndereco()} />
          </div>
          <div className="ndm-field" style={{ flex: 1, margin: 0 }}>
            <label className="ndm-label" style={{ fontWeight: 400 }}>Nº ou referência</label>
            <div style={{ display: "flex", gap: 6 }}>
              <input className="ndm-input" placeholder="3651" value={numeroRef} onChange={(e) => setNumeroRef(e.target.value)} onKeyDown={(e) => e.key === "Enter" && confirmarEndereco()} />
              <button className="ndm-gerar-btn" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={confirmarEndereco}>
                <i className="fa-regular fa-location-dot" /> Localizar
              </button>
            </div>
          </div>
        </div>
        {enderecoConfirmado && (
          <div className="ndm-map-frame">
            <iframe title="mapa-localizacao" src={`https://maps.google.com/maps?q=${enderecoConfirmado}&output=embed&hl=pt`} allowFullScreen loading="lazy" />
          </div>
        )}
      </div>
      {editorBlock}
      {anexosSection}
      {prazoSection}
      {assinaturasSection}
    </>
  );

  const chamadoTecnicoFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <SimpleSelect value={assuntoValue} onChange={setAssuntoValue} options={ASSUNTOS_CHAMADO} placeholder="Selecione o assunto..." />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Nº de Patrimônio</label>
          <input className="ndm-input" placeholder="Caso exista" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
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

  const sessaoPlenariaFields = (
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
      {editorBlock}
      {anexosSection}
      {prazoSection}
      {assinaturasSection}
    </>
  );

  // Protocolo e Análise de Projeto compartilham o mesmo form
  const protocoloFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Solicitante*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <SimpleSelect value={assuntoProtocolo} onChange={setAssuntoProtocolo} options={ASSUNTOS_PROTOCOLO} placeholder="Selecione ou pesquise o assunto..." />
      </div>
      <div className="ndm-field">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
            {!showCC && <button className="ndm-add-btn" style={{ fontSize: 12 }} onClick={() => setShowCC(true)}>+ CC</button>}
          </div>
        </div>
        <SimpleSelect value={paraSetorProtocolo} onChange={setParaSetorProtocolo} options={MOCK_SETORES} placeholder="- selecione setor -" />
      </div>
      {ccPanel}
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Entrada*</label>
          <SimpleSelect value={entradaTipo} onChange={setEntradaTipo} options={ENTRADA_TIPOS} placeholder="- selecione -" />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
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

  const fiscalizacaoFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Fiscalizado*</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={fiscalizado} onChange={(e) => setFiscalizado(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={fiscalizacaoTipo} onChange={setFiscalizacaoTipo} options={FISCALIZACAO_TIPOS} placeholder="- selecione -" />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Para*</label>
        <SimpleSelect value={fiscalizacaoPara} onChange={setFiscalizacaoPara} options={MOCK_SETORES} placeholder="- selecione setor -" />
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

  const parecerFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input className="ndm-input" placeholder="Informe o título do parecer..." value={parecerTitulo} onChange={(e) => setParecerTitulo(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={parecerTipo} onChange={setParecerTipo} options={TIPOS_PARECER} placeholder="- selecione -" />
      </div>
      {editorBlock}
      {anexosSection}
      {assinaturasSection}
    </>
  );

  const procAdminFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input className="ndm-input" placeholder="Descreva o assunto..." value={assunto} onChange={(e) => setAssunto(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={tipoDocAdm} onChange={setTipoDocAdm} options={TIPOS_ADM} placeholder="Selecione ou pesquise o tipo..." />
      </div>
      <div className="ndm-field">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
            {!showCC && <button className="ndm-add-btn" style={{ fontSize: 12 }} onClick={() => setShowCC(true)}>+ CC</button>}
          </div>
        </div>
        <SimpleSelect value={paraSetorProtocolo} onChange={setParaSetorProtocolo} options={MOCK_SETORES} placeholder="- selecione setor -" />
      </div>
      {ccPanel}
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

  const atoOficialFields = (
    <>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Número</label>
          <input className="ndm-input" placeholder="Número" value={atoNumero} onChange={(e) => setAtoNumero(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Ano</label>
          <input className="ndm-input" value={atoAno} onChange={(e) => setAtoAno(e.target.value)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Assunto*</label>
        <input className="ndm-input" placeholder="Descreva o assunto..." value={atoAssunto} onChange={(e) => setAtoAssunto(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo*</label>
        <SimpleSelect value={atoTipo} onChange={setAtoTipo} options={TIPOS_ATO} placeholder="Selecione ou pesquise o tipo..." />
      </div>
      {editorBlock}
      {anexosSection}
      {prazoSection}
      {assinaturasSection}
    </>
  );

  const entradaDadosFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Título*</label>
        <input className="ndm-input" placeholder="Informe o título..." value={entradaTitulo} onChange={(e) => setEntradaTitulo(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Categoria*</label>
        <SimpleSelect value={entradaCategoria} onChange={setEntradaCategoria} options={CATEGORIAS_ENTRADA} placeholder="- selecione -" />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Data do documento</label>
          <input className="ndm-input" type="date" value={entradaData} onChange={(e) => setEntradaData(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Hora do documento</label>
          <input className="ndm-input" type="time" value={entradaHora} onChange={(e) => setEntradaHora(e.target.value)} />
        </div>
      </div>
      {editorBlock}
      {anexosSection}
    </>
  );

  const processoJudicialFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Requerido/Executado</label>
        <input className="ndm-input" placeholder="Busque existente ou faça cadastro..." value={requerido} onChange={(e) => setRequerido(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Nº do Processo*</label>
        <input className="ndm-input" placeholder="Ex: 0001234-12.2025.8.26.0001" value={processoJudNum} onChange={(e) => setProcessoJudNum(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo de Justiça*</label>
        <SimpleSelect value={tipoJustica} onChange={setTipoJustica} options={TIPOS_JUSTICA} placeholder="- selecione -" />
      </div>
      <div className="ndm-field">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
          <label className="ndm-label" style={{ margin: 0 }}>Para*</label>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="ndm-add-btn" style={{ fontSize: 12 }}>Lista de envio</button>
            {!showCC && <button className="ndm-add-btn" style={{ fontSize: 12 }} onClick={() => setShowCC(true)}>+ CC</button>}
          </div>
        </div>
        <SimpleSelect value={paraSetorProtocolo} onChange={setParaSetorProtocolo} options={MOCK_SETORES} placeholder="- selecione setor -" />
      </div>
      {ccPanel}
      <div className="ndm-field">
        <label className="ndm-label">Nome da Parte Autora</label>
        <input className="ndm-input" placeholder="Nome completo..." value={nomeParteAutora} onChange={(e) => setNomeParteAutora(e.target.value)} />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Nº da Pasta</label>
          <input className="ndm-input" placeholder="Número identificador..." value={numPasta} onChange={(e) => setNumPasta(e.target.value)} />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Atendimento Prioritário</label>
          <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
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

  const materiaLegislativaFields = (
    <>
      <div className="ndm-field">
        <label className="ndm-label">Ementa*</label>
        <input className="ndm-input" placeholder="Descreva a ementa..." value={ementa} onChange={(e) => setEmenta(e.target.value)} />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Tipo de Matéria*</label>
        <SimpleSelect value={tipoMateria} onChange={setTipoMateria} options={TIPOS_MATERIA} placeholder="- selecione -" />
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Para*</label>
        <SimpleSelect value={paraSetorProtocolo} onChange={setParaSetorProtocolo} options={MOCK_SETORES} placeholder="- selecione setor -" />
      </div>
      <div className="ndm-row-2">
        <div className="ndm-field">
          <label className="ndm-label">Documento de Origem</label>
          <SimpleSelect value={docOrigem} onChange={setDocOrigem} options={DOCS_ORIGEM} placeholder="- selecione -" />
        </div>
        <div className="ndm-field">
          <label className="ndm-label">Número</label>
          <input className="ndm-input" placeholder="Nº do documento de origem" value={docOrigemNum} onChange={(e) => setDocOrigemNum(e.target.value)} />
        </div>
      </div>
      <div className="ndm-field">
        <label className="ndm-label">Atendimento Prioritário</label>
        <SimpleSelect value={atendPrioritario} onChange={setAtendPrioritario} options={ATEND_PRIORITARIO_OPTS} placeholder="- selecione -" />
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
      case "Sessão Plenária": return sessaoPlenariaFields;
      case "Parecer": return parecerFields;
      case "Protocolo":
      case "Análise de Projeto": return protocoloFields;
      case "Proc. Administrativo": return procAdminFields;
      case "Ato oficial": return atoOficialFields;
      case "Entrada de dados": return entradaDadosFields;
      case "Processo judicial": return processoJudicialFields;
      case "Matéria Legislativa": return materiaLegislativaFields;
      case "Fiscalização": return fiscalizacaoFields;
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
            <SimpleSelect
              value={tipoDoc}
              onChange={(v) => { setTipoDoc(v); setShowCC(false); setShowCuidados(false); setShowParaSuggestions(false); }}
              options={TIPOS_DOC}
              placeholder="Selecione o tipo de documento..."
            />
          </div>

          <div key={tipoDoc}>
            {getTypeFields()}
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
            <button className="ndm-btn-post">{footerLabel}</button>
          </div>
        </div>

      </div>
    </>
  );
}
