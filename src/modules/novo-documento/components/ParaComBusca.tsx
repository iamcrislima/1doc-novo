import { useNovoDocumentoCtx } from "../context";
import { MOCK_SETORES, MOCK_PESSOAS_SETORES } from "../constants";
import { CcPanel } from "./CcPanel";
import { CuidadosPanel } from "./CuidadosPanel";

interface Props {
  label?: string;
}

export function ParaComBusca({ label = "Para*" }: Props) {
  const {
    paraChips, setParaChips,
    paraInput, setParaInput,
    showParaSuggestions, setShowParaSuggestions,
    showCC, setShowCC,
    showCuidados, setShowCuidados,
    setCuidadosChips, setCuidadosInput,
    addChip,
  } = useNovoDocumentoCtx();

  const query = paraInput.trim().toLowerCase();

  const filteredSetores = query.length > 0
    ? MOCK_SETORES.filter(s => s.toLowerCase().includes(query) && !paraChips.includes(s))
    : [];

  const filteredPessoas = query.length > 0
    ? Object.entries(MOCK_PESSOAS_SETORES).filter(([nome]) => nome.toLowerCase().includes(query))
    : [];

  const hasSuggestions = filteredSetores.length > 0 || filteredPessoas.length > 0;

  const handleSelectSetor = (setor: string) => {
    setParaChips(p => [...p, setor]);
    setParaInput("");
    setShowParaSuggestions(false);
  };

  const handleSelectPessoaSetor = (pessoa: string, setor: string) => {
    if (!paraChips.includes(setor)) setParaChips(p => [...p, setor]);
    setParaInput("");
    setShowParaSuggestions(false);
    setShowCuidados(true);
    setCuidadosChips([pessoa]);
    setCuidadosInput("");
  };

  return (
    <>
      <div className="ndm-field">
        <label className="ndm-label">{label}</label>
        <div className="ndm-setor-picker">
          <div className="ndm-para-row">
            {paraChips.map((chip, i) => (
              <span key={`para-${i}-${chip}`} className="ndm-chip">
                <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
                {chip}
                <button className="ndm-chip-remove" onClick={() => setParaChips(p => p.filter((_, idx) => idx !== i))}>×</button>
              </span>
            ))}
            <input
              className="ndm-para-input"
              placeholder={paraChips.length === 0 ? "Pesquisar setor ou pessoa..." : ""}
              value={paraInput}
              onChange={e => { setParaInput(e.target.value); setShowParaSuggestions(e.target.value.trim().length > 0); }}
              onBlur={() => setTimeout(() => setShowParaSuggestions(false), 150)}
              onKeyDown={e => { if (e.key === "Enter") { addChip(paraInput, setParaChips, setParaInput); setShowParaSuggestions(false); } }}
            />
            {!showCC && <button className="ndm-action-btn" onClick={() => setShowCC(true)}>+ CC</button>}
            {!showCuidados && <button className="ndm-action-btn" onClick={() => setShowCuidados(true)}>Aos cuidados</button>}
          </div>

          {showParaSuggestions && hasSuggestions && (
            <div className="ndm-setor-drop">
              {filteredSetores.length > 0 && (
                <>
                  {filteredPessoas.length > 0 && <div className="ndm-drop-group-label">Setores</div>}
                  {filteredSetores.map(s => (
                    <button key={s} className="ndm-setor-item" onClick={() => handleSelectSetor(s)}>
                      <i className="fa-regular fa-building" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                      {s}
                    </button>
                  ))}
                </>
              )}
              {filteredPessoas.length > 0 && (
                <>
                  <div className="ndm-drop-group-label">Pessoas — clique no setor para selecionar e adicionar aos cuidados</div>
                  {filteredPessoas.map(([nome, setores]) => (
                    <div key={nome} className="ndm-pessoa-item">
                      <div className="ndm-pessoa-info">
                        <i className="fa-regular fa-user" style={{ fontSize: 12, color: "var(--primary-pure)" }} />
                        <span className="ndm-pessoa-nome">{nome}</span>
                      </div>
                      <div className="ndm-pessoa-setores">
                        {setores.map(setor => (
                          <button key={setor} className="ndm-pessoa-setor-badge" onClick={() => handleSelectPessoaSetor(nome, setor)}>
                            <i className="fa-regular fa-building" style={{ fontSize: 10 }} />
                            {setor}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <CcPanel />
      <CuidadosPanel />
    </>
  );
}
