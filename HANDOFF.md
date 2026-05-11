# HANDOFF — 1doc-novo
> Data: 2026-05-09
> Stack: React 19 + Vite + TypeScript + CSS puro (variáveis CSS próprias)

---

## O que é esse projeto

Protótipo funcional de front-end do sistema 1Doc — plataforma de gestão documental para órgãos públicos. O foco atual é o fluxo de criação de documentos: um modal multifuncional que suporta 20 tipos de documento distintos, cada um com formulário e validação de campos obrigatórios próprios. Não há back-end integrado; todos os dados são mock local.

---

## Como rodar localmente

1. `npm install`
2. Copiar `.env.example` para `.env` e preencher `FA_TOKEN` com o token FontAwesome Pro (obtenha em https://fontawesome.com/account)
3. `npm run dev` → http://localhost:5176

> **Nota:** a porta 5176 está configurada em `.claude/launch.json`. Se o arquivo não existir no ambiente de outro desenvolvedor, o Vite usará a porta padrão (5173). Para build de produção: `npm run build`.

---

## Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| FA_TOKEN | Token FontAwesome Pro para instalação via npm | Sim |

O `.npmrc` comprometido no repositório usa `${FA_TOKEN}` — o token **nunca** vai em claro em nenhum arquivo commitado. Em CI/CD (Vercel, GitHub Actions), adicionar `FA_TOKEN` como secret na plataforma.

---

## Estrutura do projeto

```
1doc-novo/
├── public/                            # assets estáticos
├── src/
│   ├── main.tsx                       # entry point — imports: index.css → FA JS → App
│   ├── App.tsx                        # roteamento react-router-dom v7 + estado do modal
│   ├── index.css                      # variáveis CSS globais (cores, sombras, tipografia, layout)
│   ├── App.css                        # layout raiz (app-root, app-main, app-content)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx             # header fixo 56px — busca global, menu "Listar", avatar
│   │   │   ├── Header.css
│   │   │   ├── Subheader.tsx          # breadcrumb clicável
│   │   │   └── Subheader.css
│   │   └── modals/
│   │       └── NovoDocumentoModal.tsx # re-export de compatibilidade → src/modules/novo-documento
│   ├── pages/
│   │   └── CentralDeAcoes.tsx         # única página implementada (home / dashboard)
│   └── modules/
│       └── novo-documento/            # MÓDULO PRINCIPAL — ver seção abaixo
├── .env.example                       # template de variáveis (sem valores reais — commitar)
├── .npmrc                             # registro FontAwesome Pro via ${FA_TOKEN} — commitar
├── vercel.json                        # buildCommand + outputDirectory + headers de segurança
├── vite.config.ts
├── tsconfig.json                      # noUnusedLocals: false, noUnusedParameters: false
└── package.json
```

### Módulo novo-documento (`src/modules/novo-documento/`)

```
index.ts                               # re-export público — única superfície de contato
types.ts                               # ModalMode, NovoDocumentoModalProps, AssinaturaRow, etc.
constants.ts                           # TIPOS_DOC (20 tipos), mocks e arrays de opções com TODOs
context.tsx                            # NovoDocumentoProvider + useNovoDocumentoCtx
hooks/
  useNovoDocumentoForm.ts              # todos os 55+ useState + resetForm() + addChip() + confirmarEndereco()
components/
  SimpleSelect.tsx                     # dropdown pesquisável reutilizável (usado globalmente no modal)
  EditorBlock.tsx                      # editor rich text via contentEditable
  CcPanel.tsx                          # painel CC (oculto por padrão, progressivo)
  CuidadosPanel.tsx                    # painel Aos cuidados (oculto por padrão, progressivo)
  AssuntoSearchField.tsx               # busca de assunto com dropdown e sugestões
  SetorPickerField.tsx                 # picker de setores com busca e chips
  PrazoSection.tsx                     # seção colapsável de prazo
  AnexosSection.tsx                    # seção colapsável de anexos
  AssinaturasSection.tsx               # seção colapsável de assinaturas
fields/                                # um arquivo por tipo de documento (17 arquivos)
  MemorandoFields.tsx                  # Memorando, Ofício, Ofício Manual (default)
  DocumentoFields.tsx
  AtaFields.tsx
  CircularFields.tsx
  CicloVidaFields.tsx
  AlvaraFields.tsx
  OuvidoriaFields.tsx                  # inclui iframe Google Maps com sandbox
  ChamadoTecnicoFields.tsx
  SessaoPlenariaFields.tsx
  ProtocoloFields.tsx                  # compartilhado com Análise de Projeto
  FiscalizacaoFields.tsx
  ParecerFields.tsx
  ProcAdminFields.tsx
  AtoOficialFields.tsx
  EntradaDadosFields.tsx
  ProcessoJudicialFields.tsx
  MateriaLegislativaFields.tsx
NovoDocumentoModal.tsx                 # orquestrador lean (196 linhas) — validação + toast + footer
NovoDocumentoModal.css                 # estilos do modal
```

---

## Arquitetura de módulos

O projeto usa **arquitetura modular baseada em domínio**: `src/modules/novo-documento/` é o primeiro módulo. O próximo planejado é `src/modules/administrativo/`.

**Regra de ouro:** importar módulos sempre via `index.ts`, nunca diretamente de arquivos internos.

**Para adicionar um novo módulo (ex: `administrativo`):**
1. Criar `src/modules/administrativo/` com a mesma estrutura interna
2. Expor apenas o componente principal e tipos públicos via `index.ts`
3. Importar no `App.tsx` a partir do `index.ts` do módulo

**Para adicionar um novo tipo de documento ao módulo `novo-documento`:**
1. Criar `src/modules/novo-documento/fields/NovoTipoFields.tsx`
2. Adicionar estados necessários em `hooks/useNovoDocumentoForm.ts` (e incluir no `resetForm()`)
3. Adicionar o nome do tipo ao array `TIPOS_DOC` em `constants.ts`
4. Adicionar `case "Novo Tipo": return <NovoTipoFields />;` no switch `getTypeFields()` de `NovoDocumentoModal.tsx`
5. Adicionar validação dos campos obrigatórios em `validate()` em `NovoDocumentoModal.tsx`

---

## O que está implementado

- ✅ **Modal "Criar Novo Documento"** — 20 tipos de documento, cada um com formulário próprio. Modos: normal (780px), expandido (1120px), tela cheia (100vw/vh), minimizado (pill flutuante)
- ✅ **Validação por tipo de documento** — todos os 20 tipos têm regras de campos obrigatórios em `validate()` (NovoDocumentoModal.tsx:95)
- ✅ **Toast de feedback** — sucesso (verde) e erro (vermelho), exibido dentro do modal por 3,5s
- ✅ **Footer com ações reais** — "Descartar rascunho" chama `resetForm()` e fecha; "Salvar rascunho e fechar" exibe toast; botão de ação principal (label dinâmico: Postar/Emitir/Registrar/etc.) valida e exibe toast de sucesso ou erro
- ✅ **`resetForm()`** — reseta todos os 55+ estados ao valor inicial; chamado no discard e após submit bem-sucedido
- ✅ **SimpleSelect** — dropdown pesquisável com busca interna, reutilizável em qualquer formulário
- ✅ **EditorBlock** — área de rich text via `contentEditable` (conteúdo vive no DOM, não no React state)
- ✅ **Seções colapsáveis** — Prazo, Anexos, Assinaturas (estado em objeto único `secoes` com `toggleSecao()`)
- ✅ **SetorPickerField** — picker de setores com busca e chips múltiplos
- ✅ **CcPanel / CuidadosPanel** — campos progressivos (ocultos por padrão; exibidos ao clicar "+ CC" / "+ Aos cuidados")
- ✅ **AssuntoSearchField** — busca de assunto com dropdown e sugestões via context
- ✅ **OuvidoriaFields** — iframe Google Maps com `sandbox="allow-scripts allow-same-origin"` e `encodeURIComponent()` no endereço
- ✅ **Header fixo** — busca global funcional (sem `readOnly`), menu "Listar" com 14 tipos de documento, avatar com menu de usuário
- ✅ **Subheader** — breadcrumb clicável com key semântica
- ✅ **Roteamento** — react-router-dom v7 com BrowserRouter; 8 rotas (1 implementada, 7 são `<PlaceholderPage />`)
- ✅ **CSS com variáveis** — 100% via CSS custom properties em `index.css`; zero hexcodes inline no código de produção
- ✅ **Headers de segurança** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` em `vercel.json`
- ✅ **Build limpo** — `tsc --noEmit` e `npm run build` passam sem erros (built in ~1.25s)

---

## O que ainda é mock (pendências de integração)

- 🟡 **MOCK_SETORES** (`constants.ts:17`) — endpoint esperado: `GET /api/setores` — lista de setores do órgão autenticado
- 🟡 **MOCK_PESSOAS** (`constants.ts:26`) — endpoint esperado: `GET /api/usuarios` — usuários do órgão com nome e matrícula
- 🟡 **MOCK_LISTAS_ENVIO** (`constants.ts:33`) — endpoint esperado: `GET /api/listas-envio` — listas de distribuição do órgão
- 🟡 **PROCESSOS_POR_CATEGORIA** (`constants.ts:51`) — endpoint esperado: `GET /api/processos?categoria=X` — processos vinculáveis ao alvará
- 🟡 **Salvar rascunho** (`NovoDocumentoModal.tsx:176`) — endpoint esperado: `POST /api/documentos/rascunho`
- 🟡 **Criar documento** (`NovoDocumentoModal.tsx:187`) — endpoint esperado: `POST /api/documentos`
- 🟡 **CentralDeAcoes.tsx** — dados de atividades, métricas e comunicados são mocks locais
- 🟡 **Autenticação** — não implementada; não há sessão, login ou token de usuário no front-end
- 🟡 **Páginas secundárias** — Atividades, Documentos, Assinaturas, Comunicação, Integrações, Relatórios, Configurações são `<PlaceholderPage />`

---

## Decisões técnicas tomadas

- **CSS puro com variáveis** — o projeto não usa componentes React do 1DS; usa variáveis CSS inspiradas no 1DS + CSS próprio. Motivo: controle total sobre o layout do modal complexo.
- **react-router-dom v7** — `App.tsx` usa `BrowserRouter` + `Routes`. Decisão arquitetural já tomada; migrar só se houver razão de produto.
- **Context + Hook por módulo** — estado do modal vive em `useNovoDocumentoForm` e é distribuído via `NovoDocumentoProvider` (React Context API). Elimina prop drilling em 33 arquivos de fields/components.
- **EditorBlock via contentEditable** — o conteúdo do corpo do documento não é gerenciado pelo React. O texto vive no DOM. Decisão intencional para evitar re-renders durante digitação; perda de conteúdo ao trocar tipo de documento é um trade-off aceito.
- **re-export de compatibilidade** — `src/components/modals/NovoDocumentoModal.tsx` é um re-export puro que aponta para `src/modules/novo-documento`. Mantém o import em `App.tsx` inalterado após a modularização.
- **FontAwesome Pro via JS** (`all.min.js`) — ícones injetados como SVG pelo FA JS Kit. Os `<i>` são usados diretamente nos componentes; funcionam porque não há manipulação React sobre os SVGs injetados. Em produção, avaliar tree-shaking por ícone para reduzir bundle.
- **Dependências com `^`** — versões não fixadas. Em produção, garantir `package-lock.json` commitado e usar `npm ci` no CI/CD.
- **`installCommand: "npm install --legacy-peer-deps"`** em `vercel.json` — necessário para resolver conflitos de peer deps do FA Pro e das versões RC/canary das dependências React 19.

---

## O que o time tech precisa fazer primeiro

1. **Autenticação** — não existe nenhum mecanismo de login, sessão ou token. Definir estratégia (JWT, OAuth, gov.br) antes de qualquer integração de API.
2. **Integrar os 4 endpoints de dados dinâmicos** — setores, usuários, listas de envio e processos por categoria alimentam os autocompletes do modal; são os mocks mais críticos para a experiência.
3. **Integrar `POST /api/documentos`** — o payload deve ser montado a partir dos estados retornados por `useNovoDocumentoForm`. A função `validate()` já está implementada; o submit real substitui o toast fake.
4. **Integrar `POST /api/documentos/rascunho`** — UX já implementada (toast + fechar); falta apenas o POST.
5. **Implementar as 7 páginas placeholder** — Atividades, Documentos, Assinaturas, Comunicação, Integrações, Relatórios, Configurações.
6. **Adicionar CSP (Content Security Policy)** ao `vercel.json` — ainda ausente. Definir política antes de ir para produção.
7. **Adicionar HSTS** — `Strict-Transport-Security` ausente no `vercel.json`. Adicionar quando o domínio de produção estiver definido.
8. **Fixar versões de dependências** em `package.json` e commitar `package-lock.json` para builds reproduzíveis.

---

## Limitações conhecidas

- ⚠️ **Fechamento de dropdown por click-outside não funciona** — `CcPanel`, `CuidadosPanel`, `AssuntoSearchField` e `SetorPickerField` não fecham ao clicar fora. O hook `useDropdownClose` foi removido por estar inoperante (refs estavam desconectados do DOM). Reimplementar com refs locais em cada subcomponente.
- ⚠️ **EditorBlock sem persistência** — ao trocar o tipo de documento e voltar, o conteúdo digitado no corpo é perdido (vive no DOM via `contentEditable`, não no estado React). Decisão intencional; documentar para o produto.
- ⚠️ **CentralDeAcoes com duplicatas nos mocks** — documentadas por Tyrion; não foram corrigidas pois são mocks. Verificar ao integrar dados reais.
- ⚠️ **Sem tratamento de erro de rede** — `handleSubmit` e `handleSaveRascunho` exibem toast de sucesso incondicionalmente. Ao integrar APIs reais, adicionar tratamento de erro HTTP e estados de loading.
- ⚠️ **Sem paginação** — nenhuma listagem tem paginação implementada. Considerar ao implementar as páginas de listagem.
- ⚠️ **Bundle size** — `all.min.js` do FontAwesome Pro importa todos os ícones. Em produção, avaliar tree-shaking ou imports individuais.
- ⚠️ **Sem testes automatizados** — zero cobertura de testes. Implementar antes de integração com API.

---

## Segurança

**Revisão realizada por Arya (relatório completo em `.claude/tmp/arya.md`).**

**Corrigido / já estava correto:**
- Headers de segurança adicionados ao `vercel.json`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restritivo (camera, microphone, geolocation bloqueados)
- Iframe do Google Maps em `OuvidoriaFields.tsx` com `sandbox="allow-scripts allow-same-origin"` + `encodeURIComponent()` no endereço
- Token FontAwesome: `.npmrc` usa `${FA_TOKEN}` — token nunca em claro em arquivo commitado; `.env` está no `.gitignore`
- Zero ocorrências de `dangerouslySetInnerHTML` em `src/`
- Zero `console.log` em `src/`
- Dados sensíveis nos mocks: apenas nomes fictícios (zero CPF real, e-mail real, senha)
- Zero CVEs críticos ou altos nas dependências principais (verificado em 2026-05-09)

**Pendente (risco médio):**
- CSP (Content Security Policy) — ausente; implementar antes de produção
- HSTS — ausente; adicionar quando domínio de produção estiver definido
- Dependências com `^` — fixar versões para builds reproduzíveis

---

## Contato

Dúvidas sobre decisões de produto/design: a confirmar
Dúvidas sobre decisões técnicas de front-end: Cristianderson Lima (emaildoandersonalves@gmail.com)

---

*Gerado pela pipeline Sauron — Tyrion · Thanos · Arya · Aragorn · Hermione*
