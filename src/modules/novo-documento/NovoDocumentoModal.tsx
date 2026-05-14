import { useEffect, useRef, useState } from "react";
import "./NovoDocumentoModal.css";
import { useNovoDocumentoForm } from "./hooks/useNovoDocumentoForm";
import { NovoDocumentoProvider } from "./context";
import { SimpleSelect } from "./components/SimpleSelect";
import { MemorandoFields } from "./fields/MemorandoFields";
import { DocumentoFields } from "./fields/DocumentoFields";
import { AtaFields } from "./fields/AtaFields";
import { CircularFields } from "./fields/CircularFields";
import { CicloVidaFields } from "./fields/CicloVidaFields";
import { AlvaraFields } from "./fields/AlvaraFields";
import { OuvidoriaFields } from "./fields/OuvidoriaFields";
import { ChamadoTecnicoFields } from "./fields/ChamadoTecnicoFields";
import { SessaoPlenariaFields } from "./fields/SessaoPlenariaFields";
import { ProtocoloFields } from "./fields/ProtocoloFields";
import { FiscalizacaoFields } from "./fields/FiscalizacaoFields";
import { ParecerFields } from "./fields/ParecerFields";
import { ProcAdminFields } from "./fields/ProcAdminFields";
import { AtoOficialFields } from "./fields/AtoOficialFields";
import { EntradaDadosFields } from "./fields/EntradaDadosFields";
import { ProcessoJudicialFields } from "./fields/ProcessoJudicialFields";
import { MateriaLegislativaFields } from "./fields/MateriaLegislativaFields";
import { TIPOS_DOC } from "./constants";
import type { NovoDocumentoModalProps } from "./types";

const TIPOS_COM_SIGILO = ["Proc. Administrativo", "Protocolo"];

export default function NovoDocumentoModal({ open, onClose }: NovoDocumentoModalProps) {
  const form = useNovoDocumentoForm();
  const {
    mode, setMode,
    tipoDoc, setTipoDoc,
    urgente, setUrgente,
    setShowCC, setShowCuidados, setShowParaSuggestions,
    resetForm,
    // campos para validação
    paraChips, assunto, titulo, tipoDocumento,
    tituloReuniao, setorChips, alvaraTipo, requerente,
    solicitante, assuntoValue, paraSetorOuv, sessaoTipo,
    assuntoProtocolo, paraSetorProtocolo, fiscalizado,
    fiscalizacaoTipo, fiscalizacaoPara, parecerTitulo, parecerTipo,
    tipoDocAdm, atoAssunto, atoTipo, entradaTitulo, entradaCategoria,
    processoJudNum, tipoJustica, ementa, tipoMateria,
  } = form;

  // ── Toast ─────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Modal de sucesso pós-submit ────────────────────────────
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Confirmação de descarte ────────────────────────────────
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const prevMode = useRef(mode);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) { setMode("normal"); return; }
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode !== "minimized") onCloseRef.current();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, mode, setMode]);

  const handleMinimize = () => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode("minimized");
  };

  const handleSetMode = (m: typeof mode) => {
    if (mode !== "minimized") prevMode.current = mode;
    setMode(m);
  };

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

  // ── Validação por tipo ────────────────────────────────────
  const validate = (): string[] => {
    const erros: string[] = [];
    const req = (cond: boolean, msg: string) => { if (!cond) erros.push(msg); };
    switch (tipoDoc) {
      case "Memorando": case "Ofício": case "Ofício Manual": case "Ciclo de vida":
        req(paraChips.length > 0, "Informe ao menos um destinatário em 'Para'");
        req(!!assunto.trim(), "O campo 'Assunto' é obrigatório");
        break;
      case "Documento":
        req(!!titulo.trim(), "O campo 'Título' é obrigatório");
        req(!!tipoDocumento.trim(), "Selecione o 'Tipo' do documento");
        break;
      case "Ata":
        req(!!tituloReuniao.trim(), "O campo 'Título da reunião' é obrigatório");
        req(setorChips.length > 0, "Selecione ao menos um 'Destinatário'");
        break;
      case "Circular":
        req(!!assunto.trim(), "O campo 'Assunto' é obrigatório");
        req(setorChips.length > 0, "Selecione ao menos um setor em 'Para'");
        break;
      case "Alvará":
        req(!!alvaraTipo.trim(), "Selecione o 'Tipo' do alvará");
        req(!!requerente.trim(), "O campo 'Requerente' é obrigatório");
        break;
      case "Ouvidoria":
        req(!!solicitante.trim(), "O campo 'Solicitante' é obrigatório");
        req(!!assuntoValue.trim(), "Selecione o 'Assunto'");
        req(!!paraSetorOuv.trim(), "Selecione o setor em 'Para'");
        break;
      case "Chamado técnico":
        req(!!solicitante.trim(), "O campo 'Solicitante' é obrigatório");
        req(!!assuntoValue.trim(), "Selecione o 'Assunto'");
        break;
      case "Sessão Plenária":
        req(!!sessaoTipo.trim(), "Selecione o 'Tipo' da sessão");
        break;
      case "Protocolo": case "Análise de Projeto":
        req(!!solicitante.trim(), "O campo 'Solicitante' é obrigatório");
        req(!!assuntoProtocolo.trim(), "Selecione o 'Assunto'");
        req(!!paraSetorProtocolo.trim(), "Selecione o setor em 'Para'");
        break;
      case "Fiscalização":
        req(!!fiscalizado.trim(), "O campo 'Fiscalizado' é obrigatório");
        req(!!fiscalizacaoTipo.trim(), "Selecione o 'Tipo'");
        req(!!fiscalizacaoPara.trim(), "Selecione o setor em 'Para'");
        break;
      case "Parecer":
        req(!!parecerTitulo.trim(), "O campo 'Título' é obrigatório");
        req(!!parecerTipo.trim(), "Selecione o 'Tipo' do parecer");
        break;
      case "Proc. Administrativo":
        req(!!assunto.trim(), "O campo 'Assunto' é obrigatório");
        req(!!tipoDocAdm.trim(), "Selecione o 'Tipo'");
        break;
      case "Ato oficial":
        req(!!atoAssunto.trim(), "O campo 'Assunto' é obrigatório");
        req(!!atoTipo.trim(), "Selecione o 'Tipo'");
        break;
      case "Entrada de dados":
        req(!!entradaTitulo.trim(), "O campo 'Título' é obrigatório");
        req(!!entradaCategoria.trim(), "Selecione a 'Categoria'");
        break;
      case "Processo judicial":
        req(!!processoJudNum.trim(), "O campo 'Nº do Processo' é obrigatório");
        req(!!tipoJustica.trim(), "Selecione o 'Tipo de Justiça'");
        break;
      case "Matéria Legislativa":
        req(!!ementa.trim(), "O campo 'Ementa' é obrigatório");
        req(!!tipoMateria.trim(), "Selecione o 'Tipo de Matéria'");
        break;
    }
    return erros;
  };

  // ── Footer handlers ───────────────────────────────────────
  const handleDiscard = () => setShowDiscardConfirm(true);

  const handleDiscardConfirmed = () => {
    setShowDiscardConfirm(false);
    resetForm();
    onClose();
  };

  const handleSaveRascunho = () => {
    // TODO: integrar com API de rascunhos — POST /api/documentos/rascunho
    showToast("Rascunho salvo com sucesso!");
    setTimeout(() => onClose(), 500);
  };

  const handleSubmit = () => {
    const erros = validate();
    if (erros.length > 0) {
      showToast(erros[0], "error");
      return;
    }
    // TODO: integrar com API de criação — POST /api/documentos
    setShowSuccess(true);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    resetForm();
    onClose();
  };

  const handleSuccessGoToDoc = () => {
    setShowSuccess(false);
    resetForm();
    onClose();
    // TODO: navegar para o documento criado — onNavigate("inbox") ou rota específica
  };

  const getTypeFields = () => {
    switch (tipoDoc) {
      case "Documento": return <DocumentoFields />;
      case "Ata": return <AtaFields />;
      case "Circular": return <CircularFields />;
      case "Ciclo de vida": return <CicloVidaFields />;
      case "Alvará": return <AlvaraFields />;
      case "Ouvidoria": return <OuvidoriaFields />;
      case "Chamado técnico": return <ChamadoTecnicoFields />;
      case "Sessão Plenária": return <SessaoPlenariaFields />;
      case "Parecer": return <ParecerFields />;
      case "Protocolo":
      case "Análise de Projeto": return <ProtocoloFields />;
      case "Proc. Administrativo": return <ProcAdminFields />;
      case "Ato oficial": return <AtoOficialFields />;
      case "Entrada de dados": return <EntradaDadosFields />;
      case "Processo judicial": return <ProcessoJudicialFields />;
      case "Matéria Legislativa": return <MateriaLegislativaFields />;
      case "Fiscalização": return <FiscalizacaoFields />;
      default: return <MemorandoFields />;
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

  return (
    <>
    <NovoDocumentoProvider value={form}>
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
            <button
              className={`ndm-ctrl-btn ${mode === "normal" ? "active" : ""}`}
              title="Modo normal"
              onClick={() => handleSetMode("normal")}
            >
              <i className="fa-regular fa-window-restore" />
            </button>
            <button
              className={`ndm-ctrl-btn ${mode === "expanded" ? "active" : ""}`}
              title="Expandir"
              onClick={() => handleSetMode("expanded")}
            >
              <i className="fa-regular fa-arrows-maximize" />
            </button>
            <button
              className={`ndm-ctrl-btn ${mode === "fullscreen" ? "active" : ""}`}
              title="Tela cheia"
              onClick={() => handleSetMode("fullscreen")}
            >
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className="ndm-label" style={{ margin: 0 }}>Tipo de documento*</label>
              {TIPOS_COM_SIGILO.includes(tipoDoc) && form.sigiloso && (
                <span className="ndm-tipo-sigilo-tag">
                  <i className="fa-regular fa-lock" style={{ fontSize: 9 }} />
                  SIGILOSO
                </span>
              )}
            </div>
            <SimpleSelect
              value={tipoDoc}
              onChange={(v) => {
                setTipoDoc(v);
                setShowCC(false);
                setShowCuidados(false);
                setShowParaSuggestions(false);
                if (!TIPOS_COM_SIGILO.includes(v)) form.setSigiloso(false);
              }}
              options={TIPOS_DOC}
              placeholder="Selecione o tipo de documento..."
            />
          </div>

          <div key={tipoDoc} className="ndm-fields-wrapper">
            {getTypeFields()}
          </div>
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`ndm-toast ndm-toast--${toast.type}`}>
            <i className={`fa-regular ${toast.type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`} />
            {toast.msg}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="ndm-footer">
          <label className="ndm-footer-left">
            <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} />
            Urgente
          </label>
          <div className="ndm-footer-right">
            <button className="ndm-btn-discard" onClick={handleDiscard}>
              <i className="fa-regular fa-trash-can" /> Descartar rascunho
            </button>
            <button className="ndm-btn-save" onClick={handleSaveRascunho}>
              <i className="fa-regular fa-floppy-disk" /> Salvar rascunho e fechar
            </button>
            <button className="ndm-btn-post" onClick={handleSubmit}>{footerLabel}</button>
          </div>
        </div>

      </div>

    </NovoDocumentoProvider>

      {/* ── Modal de confirmação de descarte ── */}
      {showDiscardConfirm && (
        <>
          <div className="ndm-success-overlay" onClick={() => setShowDiscardConfirm(false)} />
          <div className="ndm-success-modal">
            <div className="ndm-discard-icon">
              <i className="fa-regular fa-trash-can" />
            </div>
            <h3 className="ndm-success-title">Descartar rascunho?</h3>
            <p className="ndm-success-desc">
              Todo o conteúdo preenchido será perdido e não poderá ser recuperado.
              Tem certeza que deseja descartar este rascunho?
            </p>
            <div className="ndm-success-actions">
              <button className="ndm-success-btn-secondary" onClick={() => setShowDiscardConfirm(false)}>
                Cancelar
              </button>
              <button className="ndm-discard-btn-confirm" onClick={handleDiscardConfirmed}>
                <i className="fa-regular fa-trash-can" /> Descartar
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Modal de sucesso (fora do ndm-modal para evitar containing-block de transform) ── */}
      {showSuccess && (
        <>
          <div className="ndm-success-overlay" />
          <div className="ndm-success-modal">
            <div className="ndm-success-icon">
              <i className="fa-regular fa-circle-check" />
            </div>
            <h3 className="ndm-success-title">Documento criado com sucesso!</h3>
            <p className="ndm-success-desc">
              Seu documento foi criado e já está disponível na sua{" "}
              <strong>Caixa de Entrada</strong>. Você pode acessá-lo a qualquer
              momento para acompanhar o andamento.
            </p>
            <div className="ndm-success-actions">
              <button className="ndm-success-btn-secondary" onClick={handleSuccessOk}>
                OK
              </button>
              <button className="ndm-success-btn-primary" onClick={handleSuccessGoToDoc}>
                <i className="fa-regular fa-inbox" /> Ir para documento
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

