# Aragorn Report — Avaliação de Prontidão para Handoff

**Data:** 2026-05-09
**Build:** verde — `✓ built in 1.17s`, zero erros TypeScript

---

## Checklist de Entrada

| Item | Status |
|------|--------|
| `npm run build` sem erros | OK |
| `package-lock.json` existe | OK |
| `.npmrc` commitado com token via variável | OK |
| `.env.example` atualizado | OK |
| `.env` no `.gitignore` | OK |
| Token FA Pro nunca em claro | OK |
| `data-theme="1doc"` no documentElement | OK |
| `src/modules/novo-documento/index.ts` como ponto de entrada | OK |
| Tipos exportados (`NovoDocumentoModalProps`, etc.) | OK |
| Relatórios anteriores (Tyrion, Thanos, Arya) lidos e considerados | OK |

---

## ✅ Pronto para handoff

### Estrutura modular
O módulo `src/modules/novo-documento/` está completo: 39 arquivos, context + hook + fields por tipo + seções colapsáveis. `index.ts` re-exporta o default e os tipos necessários para integração com backend. Adicionar um novo tipo de documento exige criar `XxxFields.tsx`, importar no modal e adicionar um `case` no switch — três movimentos.

### Build e tipagem
`tsc -b && vite build` passou sem erros em todas as iterações (Tyrion -> Thanos) e confirmado agora em 1.17s.

### Compatibilidade retroativa
`src/components/modals/NovoDocumentoModal.tsx` mantido como re-export — importadores existentes não precisam mudar.

### Segurança (Arya confirmou)
- FA_TOKEN nunca em claro — `.npmrc` usa `${FA_TOKEN}`.
- `dangerouslySetInnerHTML` — zero ocorrências no projeto.
- Dados dos mocks — apenas nomes fictícios, zero CPF/email real/senha.
- `console.log` — zero em `src/`.
- Iframe de endereço (OuvidoriaFields) — `encodeURIComponent()` aplicado.
- Zero CVEs críticos nas dependências.

### Deploy
`vercel.json` correto: `buildCommand`, `outputDirectory`, headers de segurança (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy). `installCommand` com `--legacy-peer-deps` presente.

### Ambiente
`npm install && npm run dev` sobe sem intervenção manual desde que `FA_TOKEN` esteja definido no ambiente (instruído em `.env.example`).

---

## ⚠️ Resolver antes de entregar

### 1. Botões do footer sem handler (blocker funcional)
Os três botões do footer do modal não têm `onClick`:

```tsx
<button className="ndm-btn-discard">Descartar rascunho</button>
<button className="ndm-btn-save">Salvar rascunho e fechar</button>
<button className="ndm-btn-post">{footerLabel}</button>  // "Postar" / "Emitir" / "Registrar" etc.
```

Clicar em "Postar", "Emitir", "Registrar", "Protocolar" ou qualquer variante do footerLabel é um no-op silencioso. Zero feedback ao usuário. O time tech precisará conectar esses botões à API e definir o contrato de submissão.

**Impacto:** alto — é a ação principal de todo o fluxo.

### 2. Validação de campos obrigatórios ausente (blocker funcional)
Campos marcados com `*` (ex.: "Tipo de documento*", "Assunto*" em vários fields, campos de Setor) não têm validação implementada. Não há lógica de `isValid`, mensagens de erro, nem bloqueio do botão de envio.

O que acontece hoje: o botão de envio está sempre habilitado, independentemente do estado dos campos.

**Impacto:** alto — qualquer submissão futura chegará ao backend com dados incompletos se a validação não for adicionada.

### 3. Busca global no Header é decorativa (`readOnly`)

```tsx
<input className="onb-header__search-input" type="text" placeholder="Buscar" readOnly />
```

O campo está explicitamente `readOnly`. O usuário vê uma caixa de busca, mas não consegue digitar.

### 4. `vercel.json` usa `installCommand` (desvio do padrão documentado)
O padrão do projeto especifica que `vercel.json` não deve usar `installCommand`, preferindo deixar o `.npmrc` resolver o install. O arquivo atual tem `"installCommand": "npm install --legacy-peer-deps"`. Isso pode mascarar erros de peer deps em vez de corrigi-los. Baixo risco imediato, mas desvio documentado.

### 5. CSP ausente nos headers do Vercel
`vercel.json` define X-Content-Type-Options, X-Frame-Options, Referrer-Policy e Permissions-Policy — mas não define `Content-Security-Policy`. Para protótipo, aceitável. Para produção, é um médio OWASP A05.

### 6. iframe sem `sandbox` em OuvidoriaFields
O iframe do Google Maps não tem atributo `sandbox`. Adicionar `sandbox="allow-scripts allow-same-origin"` — correção de 30 segundos.

---

## 📋 Informar o time tech (não são blockers, mas o time precisa saber)

### Mocks que precisam ser substituídos por API

| Constante | Arquivo | O que é |
|-----------|---------|---------|
| `MOCK_SETORES` | `constants.ts` | Lista de setores para picker — virá de API de organograma |
| `MOCK_PESSOAS` | `constants.ts` | Lista de pessoas para campos "Para", "CC", "Aos cuidados" — virá de API de usuários |
| `MOCK_LISTAS_ENVIO` | `constants.ts` | Listas de envio para assinaturas — virá de API de grupos |
| `MOCK_EMPRESAS` | `constants.ts` | Empresas/contratados para Documentos — virá de API de cadastro |
| `PROCESSOS_POR_CATEGORIA` | `constants.ts` | Processos vinculáveis ao Alvará — virá de API de processos |

Os outros arrays de constantes (TIPOS_DOC, ALVARA_TIPOS, etc.) são de domínio fixo e podem continuar hardcoded ou vir de um endpoint de configuração.

### Dados da Central de Ações (CentralDeAcoes.tsx) são 100% mock
- `COUNTERS` (44 não lidos, 24 assinaturas, 12 fila, 40 prazos) — hardcoded.
- `LISTS` (memorandos, assinaturas, fila, prazos) — hardcoded com datas fixas de agosto/2025.
- `CIRCULARES` — hardcoded.
- KPIs (Eficiência 22,31%, Engajamento 22,31%, Qualidade 08) — hardcoded.

Toda a tela principal do produto é visual. O time tech precisará conectar cada seção a endpoints distintos.

### EditorBlock usa contentEditable, não estado React
O conteúdo do editor de texto vive no DOM (`contentEditable`), não no React state. Na hora de submissão, o backend precisará ler o innerHTML do elemento ou o hook precisará ser atualizado para capturar o conteúdo via `ref.current.innerHTML`.

### Toolbar do EditorBlock é decorativa
B, I, U, S, align-left, align-center, align-justify, lista UL/OL — todos os botões da toolbar não têm `onClick`. São visuais.

### Drag-and-drop na tabela de assinaturas sequenciais é visual
O ícone `fa-grip-dots-vertical` aparece mas não tem handler. A ordenação drag-and-drop não está implementada.

### Ofício Manual não tem fields próprios
Cai no `default: return <MemorandoFields />`. O time tech precisa confirmar se isso é intencional ou se `OficioManualFields` deve ser criado.

### 7 páginas são PlaceholderPage
Atividades, Documentos, Assinaturas, Comunicação, Integrações, Relatórios, Configurações — todas retornam "Esta seção está em desenvolvimento." Apenas a Central de Ações e o NovoDocumentoModal foram implementados.

### Sidebar não existe
O layout atual (Header + Subheader + conteúdo) não tem sidebar. O CLAUDE.md documenta um padrão de sidebar 48px/248px que não foi implementado neste projeto.

### Fechamento de dropdowns ao clicar fora não funciona
Documentado por Thanos: `AssuntoSearchField`, `SetorPickerField`, `CcPanel` e `CuidadosPanel` não fecham ao clicar fora. Os refs foram removidos por serem fantasmas. O comportamento pertence ao time tech implementar.

### Botões de Inbox e Listar no Header são no-op
Os itens do dropdown "Listar" e as opções de "Inbox" não têm navegação conectada — são `div` sem `onClick`.

### Bundle de 14.6 MB (4.8 MB gzip)
FontAwesome Pro `all.min.js` é o responsável. Em produção real, importar apenas os ícones usados via tree-shaking. Decisão arquitetural para o time tech.

---

## 📊 Estimativa: 35% pronto

**O que está 100% pronto:**
- Estrutura modular do NovoDocumentoModal (arquitetura, tipagem, build)
- UI/UX de todos os 20 tipos de documento
- Layout geral (Header + Subheader)
- Infraestrutura de deploy (vercel.json, .npmrc, .env.example)

**O que está 0% pronto (mock ou não implementado):**
- Integração com qualquer API
- Validação de formulários
- Ações reais dos botões (Postar, Emitir, Registrar, etc.)
- Central de Ações com dados reais
- 7 páginas secundárias
- Sidebar
- Busca global

---

## Mensagem para Hermione

Hermione, o que você recebe está estruturalmente sólido e arquiteturalmente limpo — Tyrion e Thanos fizeram trabalho real. Build verde, tipos limpos, módulo extensível, sem código morto relevante, sem token exposto.

Mas o projeto é um protótipo de alta fidelidade, não um produto funcional. Cada ação principal (Postar, Emitir, Registrar) é um botão mudo. Cada lista é hardcoded. Cada campo obrigatório aceita envio vazio. A busca global não aceita digitação.

Meu conselho: antes de integrar qualquer API, adicione validação de formulário e conecte os handlers dos botões do footer do modal — são a fundação de todo o restante. Depois, substitua os mocks por chamadas reais na seguinte ordem de prioridade: (1) MOCK_PESSOAS e MOCK_SETORES, que alimentam os campos mais usados; (2) dados da Central de Ações; (3) os demais.

Os dois itens de segurança pendentes (iframe sandbox e CSP) são rápidos — resolva antes de ir para produção.

O terreno está preparado. O que falta é a guerra real.

---

**Aragorn libera a estrutura. Segura a entrega ao usuário final.**
