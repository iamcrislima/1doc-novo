import { useState, useEffect, useRef } from "react";

interface SimpleSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

export function SimpleSelect({ value, onChange, options, placeholder }: SimpleSelectProps) {
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
        <i
          className="fa-regular fa-chevron-down"
          style={{
            fontSize: 11,
            color: open ? "var(--primary-pure)" : "var(--border-dark)",
            flexShrink: 0,
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </div>
      {open && (
        <div className="ndm-setor-drop">
          {filtered.length === 0
            ? (
              <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-tertiary)" }}>
                Nenhuma opção encontrada
              </div>
            )
            : filtered.map(o => (
              <button
                key={o}
                className={`ndm-setor-item${value === o ? " ndm-setor-item--active" : ""}`}
                onClick={() => { onChange(o); setOpen(false); }}
              >
                {value === o && (
                  <i
                    className="fa-regular fa-check"
                    style={{ fontSize: 11, color: "var(--primary-pure)", flexShrink: 0 }}
                  />
                )}
                {o}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
}
