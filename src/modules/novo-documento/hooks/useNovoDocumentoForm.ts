import { useState } from "react";
import type { ModalMode, AssinaturaRow, ArquivoItem, SecoesState } from "../types";

export function useNovoDocumentoForm() {
  const [mode, setMode] = useState<ModalMode>("normal");

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

  // Aos cuidados — oculto por padrão
  const [showCuidados, setShowCuidados] = useState(false);
  const [cuidadosChips, setCuidadosChips] = useState<string[]>([]);
  const [cuidadosInput, setCuidadosInput] = useState("");

  // Documento
  const [titulo, setTitulo] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");

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

  // Cuidados autocomplete
  const [showCuidadosSuggestions, setShowCuidadosSuggestions] = useState(false);

  // Documento — contratado/contratante único com autocomplete
  const [contratadoContratante, setContratadoContratante] = useState("");

  // sections
  const [secoes, setSecoes] = useState<SecoesState>({ prazo: false, anexos: false, assinaturas: false });
  const toggleSecao = (s: keyof SecoesState) => setSecoes((p) => ({ ...p, [s]: !p[s] }));

  const [prazoTitulo, setPrazoTitulo] = useState("");
  const [prazoData, setPrazoData] = useState("");
  const [prazoHorario, setPrazoHorario] = useState("");
  const [assinaturaType, setAssinaturaType] = useState<"eletronica" | "icp">("eletronica");
  const [sequencial, setSequencial] = useState(false);
  const [internos, setInternos] = useState<string[]>([]);
  const [externos, setExternos] = useState<string[]>([]);
  const [assinaturas, setAssinaturas] = useState<AssinaturaRow[]>([]);
  const [arquivos, setArquivos] = useState<ArquivoItem[]>([]);

  const resetForm = () => {
    setTipoDoc("Memorando");
    setAssunto(""); setUrgente(false);
    setParaChips([]); setParaInput("");
    setShowCC(false); setCcChips([]); setCcInput(""); setShowCcSuggestions(false); setCcListaSelecionada("");
    setShowCuidados(false); setCuidadosChips([]); setCuidadosInput("");
    setTitulo(""); setTipoDocumento("");
    setTituloReuniao(""); setDataReuniao(""); setHoraReuniao(""); setParticipantes(""); setObjetivos(""); setTopicos("");
    setAutoArquivamento(""); setAcompanhaFisico(false); setCaraterInformativo(false);
    setSetorChips([]); setSetorPickerOpen(false); setSetorSearch("");
    setAlvaraTipo(""); setRequerente(""); setEmitirEm(""); setProcessoSelecionado("");
    setSolicitante(""); setAssuntoValue(""); setAssuntoSearch(""); setShowAssuntoDrop(false);
    setParaSetorOuv(""); setPrioridade("Média"); setAtendPrioritario("");
    setEnderecoCompleto(""); setNumeroRef(""); setEnderecoConfirmado(""); setPatrimonio("");
    setSessaoNumero(""); setSessaoAno(new Date().getFullYear().toString()); setSessaoTipo(""); setPublicarCentral(false);
    setAssuntoProtocolo(""); setParaSetorProtocolo(""); setEntradaTipo("");
    setFiscalizado(""); setFiscalizacaoTipo(""); setFiscalizacaoPara("");
    setTipoDocAdm("");
    setAtoNumero(""); setAtoAssunto(""); setAtoTipo("");
    setEntradaTitulo(""); setEntradaCategoria("");
    setRequerido(""); setProcessoJudNum(""); setTipoJustica(""); setNomeParteAutora(""); setNumPasta("");
    setEmenta(""); setTipoMateria(""); setDocOrigem(""); setDocOrigemNum("");
    setParecerTitulo(""); setParecerTipo("");
    setShowParaSuggestions(false); setShowCuidadosSuggestions(false);
    setContratadoContratante("");
    setSecoes({ prazo: false, anexos: false, assinaturas: false });
    setPrazoTitulo(""); setPrazoData(""); setPrazoHorario("");
    setAssinaturaType("eletronica"); setSequencial(false);
    setInternos([]); setExternos([]); setAssinaturas([]); setArquivos([]);
  };

  const addChip = (
    val: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
    clear: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = val.trim();
    if (trimmed) { set((p) => [...p, trimmed]); clear(""); }
  };

  const confirmarEndereco = () => {
    if (enderecoCompleto.trim()) {
      const q = numeroRef.trim() ? `${enderecoCompleto}, ${numeroRef}` : enderecoCompleto;
      setEnderecoConfirmado(encodeURIComponent(q));
    }
  };

  return {
    mode, setMode,
    tipoDoc, setTipoDoc,
    assunto, setAssunto,
    urgente, setUrgente,
    paraChips, setParaChips,
    paraInput, setParaInput,
    showCC, setShowCC,
    ccChips, setCcChips,
    ccInput, setCcInput,
    showCcSuggestions, setShowCcSuggestions,
    ccListaSelecionada, setCcListaSelecionada,
    showCuidados, setShowCuidados,
    cuidadosChips, setCuidadosChips,
    cuidadosInput, setCuidadosInput,
    titulo, setTitulo,
    tipoDocumento, setTipoDocumento,
    tituloReuniao, setTituloReuniao,
    dataReuniao, setDataReuniao,
    horaReuniao, setHoraReuniao,
    participantes, setParticipantes,
    objetivos, setObjetivos,
    topicos, setTopicos,
    autoArquivamento, setAutoArquivamento,
    acompanhaFisico, setAcompanhaFisico,
    caraterInformativo, setCaraterInformativo,
    setorChips, setSetorChips,
    setorPickerOpen, setSetorPickerOpen,
    setorSearch, setSetorSearch,
    alvaraTipo, setAlvaraTipo,
    requerente, setRequerente,
    emitirEm, setEmitirEm,
    processoSelecionado, setProcessoSelecionado,
    identificacao, setIdentificacao,
    solicitante, setSolicitante,
    assuntoValue, setAssuntoValue,
    assuntoSearch, setAssuntoSearch,
    showAssuntoDrop, setShowAssuntoDrop,
    paraSetorOuv, setParaSetorOuv,
    prioridade, setPrioridade,
    atendPrioritario, setAtendPrioritario,
    dataOcorrencia, setDataOcorrencia,
    horaOcorrencia, setHoraOcorrencia,
    enderecoCompleto, setEnderecoCompleto,
    numeroRef, setNumeroRef,
    enderecoConfirmado, setEnderecoConfirmado,
    patrimonio, setPatrimonio,
    sessaoNumero, setSessaoNumero,
    sessaoAno, setSessaoAno,
    sessaoTipo, setSessaoTipo,
    publicarCentral, setPublicarCentral,
    dataSessao, setDataSessao,
    horaSessao, setHoraSessao,
    assuntoProtocolo, setAssuntoProtocolo,
    paraSetorProtocolo, setParaSetorProtocolo,
    entradaTipo, setEntradaTipo,
    fiscalizado, setFiscalizado,
    fiscalizacaoTipo, setFiscalizacaoTipo,
    fiscalizacaoPara, setFiscalizacaoPara,
    tipoDocAdm, setTipoDocAdm,
    atoNumero, setAtoNumero,
    atoAno, setAtoAno,
    atoAssunto, setAtoAssunto,
    atoTipo, setAtoTipo,
    entradaTitulo, setEntradaTitulo,
    entradaCategoria, setEntradaCategoria,
    entradaData, setEntradaData,
    entradaHora, setEntradaHora,
    requerido, setRequerido,
    processoJudNum, setProcessoJudNum,
    tipoJustica, setTipoJustica,
    nomeParteAutora, setNomeParteAutora,
    numPasta, setNumPasta,
    ementa, setEmenta,
    tipoMateria, setTipoMateria,
    docOrigem, setDocOrigem,
    docOrigemNum, setDocOrigemNum,
    parecerTitulo, setParecerTitulo,
    parecerTipo, setParecerTipo,
    showParaSuggestions, setShowParaSuggestions,
    showCuidadosSuggestions, setShowCuidadosSuggestions,
    contratadoContratante, setContratadoContratante,
    secoes, setSecoes, toggleSecao,
    prazoTitulo, setPrazoTitulo,
    prazoData, setPrazoData,
    prazoHorario, setPrazoHorario,
    assinaturaType, setAssinaturaType,
    sequencial, setSequencial,
    internos, setInternos,
    externos, setExternos,
    assinaturas, setAssinaturas,
    arquivos, setArquivos,
    addChip,
    confirmarEndereco,
    resetForm,
  };
}
