import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNovoDocumentoCtx } from "../context";
import { MOCK_PESSOAS_SETORES, MOCK_SETORES } from "../constants";
import { JUSTIFICATIVAS_SIGILO } from "./constants";
import { SigiloDatePicker } from "./SigiloDatePicker";
import "./sigilo.css";

function iniciais(nome: string) {
  const p = nome.trim().split(" ").filter(Boolean);
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

const CORES = ["#0058db","#0f6b3e","#6b0ac9","#c06800","#c0182d","#1351b4","#0891b2"];
function corAvatar(nome: string) {
  let h = 0;
  for (const c of nome) h = (h << 5) - h + c.charCodeAt(0);
  return CORES[Math.abs(h) % CORES.length];
}

function abrevSetor(nome: string) {
  return nome.split(" ")
    .filter(w => !["de","da","do","dos","das","e","a","o"].includes(w.toLowerCase()))
    .map(w => w[0]).join("").toUpperCase().slice(0, 5);
}

function JustificativaSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});

  const filtered = JUSTIFICATIVAS_SIGILO.filter(j =>
    search.trim() === "" || j.label.toLowerCase().includes(search.toLowerCase())
  );

  const openDrop = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropStyle({ position: "fixed", top: rect.bottom + 2, left: rect.left, width: rect.width, zIndex: 9999 });
    }
    setSearch("");
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const drop = document.getElementById("ndm-justif-drop");
      if (!triggerRef.current?.contains(e.target as Node) && !drop?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = JUSTIFICATIVAS_SIGILO.find(j => j.value === value);

  return (
    <div ref={triggerRef} className="ndm-select-custom" onClick={openDrop} style={{ cursor: "pointer" }}>
      <input
        className="ndm-para-input"
        readOnly
        placeholder="Selecione a justificativa..."
        value={selected ? selected.label : ""}
        style={{ cursor: "pointer", pointerEvents: "none" }}
      />
      <i className="fa-regular fa-chevron-down" style={{ fontSize: 11, color: "#aaa", pointerEvents: "none" }} />
      {open && createPortal(
        <div id="ndm-justif-drop" className="ndm-setor-drop" style={dropStyle}>
          <div style={{ padding: "6px 8px 4px" }}>
            <input
              className="ndm-para-input"
              placeholder="Pesquisar..."
              value={search}
              autoFocus
              onClick={e => e.stopPropagation()}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 12 }}
            />
          </div>
          {filtered.map(j => (
            <button
              key={j.value}
              className={`ndm-setor-item${j.value === value ? " ndm-setor-item--selected" : ""}`}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onChange(j.value); setOpen(false); }}
            >
              {j.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "10px 12px", fontSize: 13, color: "#aaa" }}>Nenhum resultado</div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function SetorMultiPicker({ label, obrigatorio = false, chips, onAdd, onRemove, placeholder }: {
  label: string; obrigatorio?: boolean;
  chips: string[]; onAdd: (s: string) => void;
  onRemove: (i: number) => void; placeholder: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});

  const filtered = MOCK_SETORES.filter(s =>
    !chips.includes(s) &&
    (input.trim() === "" || s.toLowerCase().includes(input.toLowerCase()))
  );

  const openDrop = () => {
    if (rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      setDropStyle({ position: "fixed", top: rect.bottom + 2, left: rect.left, width: rect.width, zIndex: 9999 });
    }
    setOpen(true);
  };

  return (
    <div className="ndm-field" style={{ margin: 0 }}>
      <label className="ndm-label">{label}{obrigatorio ? "*" : ""}</label>
      <div className="ndm-setor-picker">
        <div ref={rowRef} className="ndm-para-row">
          {chips.map((s, i) => (
            <span key={i} className="ndm-chip">
              <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
              {s}
              <button className="ndm-chip-remove" onClick={() => onRemove(i)}>×</button>
            </span>
          ))}
          <input
            className="ndm-para-input"
            placeholder={chips.length === 0 ? placeholder : ""}
            value={input}
            onChange={e => { setInput(e.target.value); openDrop(); }}
            onFocus={openDrop}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
        </div>
        {open && filtered.length > 0 && createPortal(
          <div className="ndm-setor-drop" style={dropStyle}>
            {filtered.map(s => (
              <button key={s} className="ndm-setor-item"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onAdd(s); setInput(""); setOpen(false); }}
              >
                <i className="fa-regular fa-building" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                {s}
              </button>
            ))}
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

export function SigiloPanel() {
  const {
    sigiloso, setSigiloso,
    sigilosoPessoas, setSigilosoPessoas,
    sigilosoJustificativa, setSigilosoJustificativa,
    sigilosoPrazo, setSigilosoPrazo,
    sigilosoSetorTermino, setSigilosoSetorTermino,
    sigilosoSetorSucessor, setSigilosoSetorSucessor,
  } = useNovoDocumentoCtx();

  const pessoaRowRef = useRef<HTMLDivElement>(null);
  const [pessoaInput, setPessoaInput] = useState("");
  const [showPessoaDrop, setShowPessoaDrop] = useState(false);
  const [pessoaDropStyle, setPessoaDropStyle] = useState<React.CSSProperties>({});

  const query = pessoaInput.trim().toLowerCase();
  const filteredPessoas = query.length > 0
    ? Object.entries(MOCK_PESSOAS_SETORES).filter(([nome]) =>
        nome.toLowerCase().includes(query) && !sigilosoPessoas.some(p => p.nome === nome)
      )
    : [];

  const openPessoaDrop = () => {
    if (pessoaRowRef.current) {
      const rect = pessoaRowRef.current.getBoundingClientRect();
      setPessoaDropStyle({ position: "fixed", top: rect.bottom + 2, left: rect.left, width: rect.width, zIndex: 9999 });
    }
    if (pessoaInput.trim().length > 0) setShowPessoaDrop(true);
  };

  const addPessoa = (nome: string, setor: string) => {
    setSigilosoPessoas(prev => [...prev, { nome, setor }]);
    setPessoaInput("");
    setShowPessoaDrop(false);
  };

  return (
    <div className={`ndm-sigilo-wrap${sigiloso ? " ndm-sigilo-wrap--open" : ""}`}>
      <button type="button" className="ndm-sigilo-toggle" onClick={() => setSigiloso(!sigiloso)}>
        <span className={`ndm-sigilo-icon${sigiloso ? " ndm-sigilo-icon--active" : ""}`}>
          <i className={`fa-regular ${sigiloso ? "fa-lock" : "fa-lock-open"}`} />
        </span>
        <span className="ndm-sigilo-toggle-label">Processo sigiloso</span>
        <span className={`ndm-sigilo-switch${sigiloso ? " ndm-sigilo-switch--on" : ""}`}>
          <span className="ndm-sigilo-switch-thumb" />
        </span>
      </button>

      {sigiloso && (
        <div className="ndm-sigilo-body">
          <div className="ndm-sigilo-banner">
            <span className="ndm-sigilo-banner-tag">SIGILOSO</span>
            Documento sigiloso — Permite acesso somente das pessoas atribuídas.
          </div>

          {/* Para pessoas */}
          <div className="ndm-field" style={{ margin: 0 }}>
            <label className="ndm-label">Para*</label>
            <div className="ndm-setor-picker">
              <div ref={pessoaRowRef} className="ndm-para-row ndm-para-row--pessoas">
                {sigilosoPessoas.map((p, i) => {
                  const cor = corAvatar(p.nome);
                  return (
                    <span key={i} className="ndm-chip ndm-chip--pessoa" style={{ borderColor: cor + "44", background: cor + "0d" }}>
                      <span className="ndm-chip-avatar" style={{ background: cor }}>{iniciais(p.nome)}</span>
                      <span className="ndm-chip-pessoa-nome">{p.nome}</span>
                      <span className="ndm-chip-setor-abrev" style={{ background: cor + "22", color: cor }}>{abrevSetor(p.setor)}</span>
                      <button className="ndm-chip-remove" style={{ color: "#999" }}
                        onClick={() => setSigilosoPessoas(prev => prev.filter((_, idx) => idx !== i))}>×</button>
                    </span>
                  );
                })}
                <input
                  className="ndm-para-input"
                  placeholder={sigilosoPessoas.length === 0 ? "Adicionar pessoa..." : ""}
                  value={pessoaInput}
                  onChange={e => {
                    setPessoaInput(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      openPessoaDrop();
                      setShowPessoaDrop(true);
                    } else {
                      setShowPessoaDrop(false);
                    }
                  }}
                  onFocus={openPessoaDrop}
                  onBlur={() => setTimeout(() => setShowPessoaDrop(false), 150)}
                />
              </div>
              {showPessoaDrop && filteredPessoas.length > 0 && createPortal(
                <div className="ndm-setor-drop" style={pessoaDropStyle}>
                  <div className="ndm-drop-group-label">Clique no setor para adicionar a pessoa</div>
                  {filteredPessoas.map(([nome, setores]) => (
                    <div key={nome} className="ndm-pessoa-item">
                      <div className="ndm-pessoa-info">
                        <span className="ndm-pessoa-avatar-sm" style={{ background: corAvatar(nome) }}>{iniciais(nome)}</span>
                        <span className="ndm-pessoa-nome">{nome}</span>
                      </div>
                      <div className="ndm-pessoa-setores">
                        {setores.map(setor => (
                          <button key={setor} className="ndm-pessoa-setor-badge"
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => addPessoa(nome, setor)}
                          >
                            <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
                            {setor}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* Justificativa legal */}
          <div className="ndm-field" style={{ margin: 0 }}>
            <label className="ndm-label">Justificativa legal*</label>
            <JustificativaSelect value={sigilosoJustificativa} onChange={setSigilosoJustificativa} />
          </div>

          {/* Prazo */}
          <div className="ndm-field" style={{ margin: 0 }}>
            <label className="ndm-label">Prazo de sigilo*</label>
            <SigiloDatePicker
              value={sigilosoPrazo}
              onChange={setSigilosoPrazo}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <SetorMultiPicker
            label="Setor que receberá ao término do prazo"
            obrigatorio
            chips={sigilosoSetorTermino}
            onAdd={s => setSigilosoSetorTermino(p => [...p, s])}
            onRemove={i => setSigilosoSetorTermino(p => p.filter((_, idx) => idx !== i))}
            placeholder="Selecione o setor..."
          />

          <SetorMultiPicker
            label="Qual setor recebe, caso o responsável perca acesso?"
            chips={sigilosoSetorSucessor}
            onAdd={s => setSigilosoSetorSucessor(p => [...p, s])}
            onRemove={i => setSigilosoSetorSucessor(p => p.filter((_, idx) => idx !== i))}
            placeholder="Selecione o setor sucessor..."
          />
        </div>
      )}
    </div>
  );
}
