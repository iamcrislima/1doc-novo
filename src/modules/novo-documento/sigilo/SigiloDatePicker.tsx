import { useEffect, useRef, useState } from "react";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

interface Props {
  value: string;      // YYYY-MM-DD
  onChange: (v: string) => void;
  min?: string;       // YYYY-MM-DD
}

export function SigiloDatePicker({ value, onChange, min }: Props) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(value);
  const [viewYear, setViewYear] = useState(() => {
    const d = value ? new Date(value + "T12:00:00") : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = value ? new Date(value + "T12:00:00") : new Date();
    return d.getMonth();
  });
  const [dropStyle, setDropStyle] = useState<React.CSSProperties>({});
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      // close if click outside
      const cal = document.getElementById("ndm-cal-portal");
      if (!inputRef.current?.contains(e.target as Node) && !cal?.contains(e.target as Node)) {
        setOpen(false);
        setTemp(value);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, value]);

  const handleOpen = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 296),
      zIndex: 9999,
    });
    const d = value ? new Date(value + "T12:00:00") : new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setTemp(value);
    setOpen(true);
  };

  // build grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  type Cell = { day: number; month: "prev" | "cur" | "next" };
  const cells: Cell[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, month: "prev" });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, month: "cur" });
  const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= rem; i++) cells.push({ day: i, month: "next" });

  const today = new Date();
  const minDate = min ? new Date(min + "T00:00:00") : null;

  const cellDate = (cell: Cell) => {
    let y = viewYear, m = viewMonth;
    if (cell.month === "prev") { m--; if (m < 0) { m = 11; y--; } }
    if (cell.month === "next") { m++; if (m > 11) { m = 0; y++; } }
    return new Date(y, m, cell.day);
  };

  const isoOf = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const prevM = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); } else setViewMonth(m => m-1); };
  const nextM = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); } else setViewMonth(m => m+1); };

  const displayValue = value
    ? new Date(value + "T12:00:00").toLocaleDateString("pt-BR")
    : "";

  return (
    <>
      <div
        ref={inputRef}
        className={`ndm-datepicker-input${open ? " ndm-datepicker-input--open" : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && handleOpen()}
      >
        <i className="fa-regular fa-calendar" style={{ color: open ? "#0058db" : "#aaa", fontSize: 13 }} />
        <span style={{ flex: 1, color: value ? "#222" : "#aaa", fontSize: 13, fontFamily: "Open Sans, sans-serif" }}>
          {displayValue || "Selecione a data..."}
        </span>
        {value && (
          <button
            className="ndm-datepicker-clear"
            onClick={e => { e.stopPropagation(); onChange(""); setTemp(""); setOpen(false); }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div id="ndm-cal-portal" className="ndm-datepicker-calendar" style={dropStyle}>
          {/* Header */}
          <div className="ndm-cal-header">
            <button className="ndm-cal-nav" onClick={prevM}><i className="fa-regular fa-chevron-left" /></button>
            <span className="ndm-cal-title">{MESES[viewMonth]} {viewYear}</span>
            <button className="ndm-cal-nav" onClick={nextM}><i className="fa-regular fa-chevron-right" /></button>
          </div>

          {/* Grid */}
          <div className="ndm-cal-grid">
            {DIAS.map(d => <div key={d} className="ndm-cal-day-header">{d}</div>)}
            {cells.map((cell, i) => {
              const d = cellDate(cell);
              const iso = isoOf(d);
              const selected = temp === iso;
              const isToday = isoOf(today) === iso;
              const disabled = !!minDate && d < minDate;
              return (
                <button
                  key={i}
                  className={[
                    "ndm-cal-day",
                    selected ? "ndm-cal-day--selected" : "",
                    isToday && !selected ? "ndm-cal-day--today" : "",
                    cell.month !== "cur" ? "ndm-cal-day--outside" : "",
                    disabled ? "ndm-cal-day--disabled" : "",
                  ].filter(Boolean).join(" ")}
                  disabled={disabled}
                  onClick={() => !disabled && setTemp(iso)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="ndm-cal-footer">
            <button className="ndm-cal-btn-cancel" onClick={() => { setOpen(false); setTemp(value); }}>Cancelar</button>
            <button className="ndm-cal-btn-apply" disabled={!temp} onClick={() => { onChange(temp); setOpen(false); }}>Aplicar</button>
          </div>
        </div>
      )}
    </>
  );
}
