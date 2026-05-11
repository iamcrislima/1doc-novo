import { useState } from 'react';

const TIPOS_ORG = ['Prefeitura', 'Câmara Municipal', 'Tribunal de Contas', 'Secretaria', 'Autarquia', 'Fundação', 'Empresa Pública', 'Outro'];
const PORTES    = ['Até 5 pessoas', 'De 6 a 20 pessoas', 'De 21 a 50 pessoas', 'De 51 a 100 pessoas', 'Mais de 100 pessoas'];
const FONTES    = ['Arial', 'Times New Roman', 'Calibri', 'Verdana', 'Garamond'];
const CIDADES   = ['Curitiba', 'Moacirlândia', 'Fortaleza', 'São Paulo', 'Rio de Janeiro', 'Brasília'];

interface OrgForm {
  nome: string; nomeExibicao: string; telefone: string; tipo: string;
  cidade: string; porte: string; endereco: string; fonte: string;
}

/* estilos base (Figma: h-[44px], border #a3a3a3, rounded-[8px], p-[8px]) */
const inp: React.CSSProperties = {
  width: '100%', height: 44,
  border: '1px solid #a3a3a3', borderRadius: 8,
  padding: '0 8px', fontSize: 14, fontFamily: 'Open Sans, sans-serif',
  color: '#333', outline: 'none', boxSizing: 'border-box', background: 'white',
  appearance: 'none',
};

const sel: React.CSSProperties = {
  ...inp,
  paddingRight: 32,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 6px center',
  cursor: 'pointer',
};

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 14, fontWeight: 400,
  color: '#333', marginBottom: 6,
  fontFamily: 'Open Sans, sans-serif',
};

/* campo helper */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 0 calc(50% - 8px)', minWidth: 240 }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

export default function IdentidadeSection() {
  const [form, setForm] = useState<OrgForm>({
    nome: 'Prefeitura de Moacirlândia', nomeExibicao: 'Prefs de Moacirlândia',
    telefone: '+55 (41) 99999.5522', tipo: 'Prefeitura',
    cidade: 'Curitiba', porte: 'Até 5 pessoas',
    endereco: 'Rua Moacir da Silva, 222', fonte: 'Arial',
  });

  const set = (k: keyof OrgForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      {/* Campos (flex-wrap, 2 por linha, Endereço full-width) */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 16,
        paddingBottom: 16,
        borderBottom: '1px solid #ebebeb',
      }}>
        <Field label="Nome da organização">
          <input style={inp} value={form.nome} onChange={set('nome')} />
        </Field>
        <Field label="Nome de exibição">
          <input style={inp} value={form.nomeExibicao} onChange={set('nomeExibicao')} />
        </Field>
        <Field label="Telefone">
          <input style={inp} value={form.telefone} onChange={set('telefone')} placeholder="+55 (00) 00000.0000" />
        </Field>
        <Field label="Tipo">
          <select style={sel} value={form.tipo} onChange={set('tipo')}>
            {TIPOS_ORG.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Cidade">
          <select style={sel} value={form.cidade} onChange={set('cidade')}>
            <option value="">- selecione -</option>
            {CIDADES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Porte">
          <select style={sel} value={form.porte} onChange={set('porte')}>
            {PORTES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>

        {/* Endereço: full width */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ ...lbl, color: '#565656' }}>Endereço</label>
          <textarea
            style={{
              ...inp, height: 80, padding: 12, resize: 'vertical',
              lineHeight: 1.5,
            }}
            value={form.endereco}
            onChange={set('endereco')}
          />
        </div>
      </div>

      {/* Logos + Fonte */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 16 }}>
        {/* Logo upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ ...lbl, marginBottom: 0 }}>Logo para documentos</span>
          <button style={{
            height: 44, padding: '0 16px', border: 'none', borderRadius: 8,
            background: '#0058db', color: 'white',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Open Sans, sans-serif', width: 151,
          }}>
            Escolher logo
          </button>
          <span style={{ fontSize: 12, color: '#7d7d7d' }}>png 200 x 70</span>
        </div>

        {/* Logo atual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ ...lbl, marginBottom: 0 }}>Logo para documentos</span>
          <div style={{ height: 68, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: '#0058db', letterSpacing: '-1px', fontFamily: 'Open Sans, sans-serif' }}>
              1Doc
            </span>
          </div>
        </div>

        {/* Fonte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 220 }}>
          <label style={lbl}>Fonte para impressão</label>
          <select style={sel} value={form.fonte} onChange={set('fonte')}>
            {FONTES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
