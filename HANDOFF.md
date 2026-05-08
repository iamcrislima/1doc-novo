# HANDOFF — 1Doc Novo
> Data: 2026-05-08
> Stack: React 19 + Vite + TypeScript + CSS puro
> Porta: http://localhost:5176

---

## O que é esse projeto

Interface web do sistema 1Doc — plataforma de gestão documental. Esta entrega cobre a tela principal (Central de Ações) e o modal de criação de documentos, que é o componente central do produto. O projeto é UI pura: sem backend implementado, todos os dados são mock.

---

## Como rodar localmente

```bash
# 1. O .npmrc com token FontAwesome já está no repositório (veja seção de segurança abaixo)
npm install

# 2. Iniciar o servidor de desenvolvimento
npm run dev
# → http://localhost:5176

# 3. Build de produção
npm run build
```

Sem variáveis de ambiente necessárias neste momento.

---

## Estrutura do projeto

```
src/
  main.tsx                          # Entry point — importa FA Pro JS, seta data-theme="1doc"
  App.tsx                           # Roteamento + estado do modal
  App.css                           # Layout raiz (app-root, app-main, app-content)
  index.css                         # Reset global + variáveis CSS
  components/
    layout/
      Header.tsx / Header.css       # Cabeçalho fixo com nav, busca, usuário
      Subheader.tsx / Subheader.css # Breadcrumb + seletor de setor
    modals/
      NovoDocumentoModal.tsx        # ⭐ Componente principal — modal de criação de documento
      NovoDocumentoModal.css        # Estilos do modal
  pages/
    CentralDeAcoes.tsx / .css       # Dashboard principal (KPIs, listas, comunicados)
commands/                           # Skills de pipeline (Sauron, Tyrion, Thanos, Arya, Aragorn, Hermione)
```

---

## O que está implementado

- ✅ **Header** — Logo, nav (Novo, Inbox, Listar, Fila de Assinaturas), busca, notificações, menu do usuário com dropdowns
- ✅ **Subheader** — Breadcrumb clicável + seletor de setor com busca e filtro
- ✅ **Central de Ações** — KPIs de eficiência/engajamento/qualidade, 4 listas (não lidos, assinaturas solicitadas, fila, prazos), comunicados/circulares
- ✅ **Modal "Criar Novo Documento"** — 4 modos de visualização: Normal (780px), Expandido (1120px), Tela cheia (100vw/vh), Minimizado (pill bottom-right)
- ✅ **Modal — campos**: Tipo de documento (select), Para, Com cópia, Aos cuidados (inputs com chips), Assunto, Editor de descrição (contentEditable com toolbar)
- ✅ **Modal — seções colapsáveis**: Prazo/Atividade, Anexos (com upload e seleção de tipo), Assinaturas (eletrônica/ICP, ordem sequencial, tabela de assinantes)
- ✅ **Modal — footer**: Urgente (checkbox), Descartar rascunho, Salvar rascunho e fechar, Postar
- ✅ **Roteamento** — react-router-dom v7 com rotas placeholder para Atividades, Documentos, Assinaturas, Comunicação, Integrações, Relatórios, Configurações

---

## O que ainda é mock

- 🟡 **Central de Ações** (`CentralDeAcoes.tsx`) — KPIs, listas e comunicados são arrays hardcoded. Conectar às APIs de documentos, assinaturas e prazos.
- 🟡 **Subheader** (`Subheader.tsx`) — Lista de setores (`SETORES`) é hardcoded. Conectar à API de setores da organização.
- 🟡 **Header** (`Header.tsx`) — Items do menu "Listar" e menus do usuário são arrays estáticos. Badge "4" no Listar é fixo.
- 🟡 **Modal — Para/CC/Aos cuidados** — Inputs visuais sem busca real. Conectar à API de usuários/setores com autocomplete.
- 🟡 **Modal — Anexos** — Botão "Anexar arquivo" sem handler de upload. Conectar à API de armazenamento.
- 🟡 **Modal — Assinaturas** — Chips de usuários sem busca real. Tabela sequencial sem persistência.
- 🟡 **Modal — Postar / Salvar** — Botões sem ação implementada. Conectar às APIs de criação e rascunho de documentos.
- 🟡 **Páginas de rota** — Atividades, Documentos, Assinaturas, etc. mostram placeholder "Em desenvolvimento".

---

## Decisões técnicas tomadas

- **FontAwesome Pro via JS** (`all.min.js`) — importado no `main.tsx`. Substitui `<i>` tags por SVGs em runtime. Causa bundle de ~14.5 MB não minificado (4.7 MB gzip). Em produção, avaliar tree-shaking por ícone.
- **CSS puro** — zero Tailwind, zero MUI. Variáveis CSS customizadas (`--primary-pure`, `--text-secondary`, etc.). Alguns hexcodes ainda hardcoded no modal — candidatos a migrar para vars.
- **Modal flat** — `NovoDocumentoModal.tsx` é um único componente com estado centralizado (~440 linhas). Decisão deliberada: sub-componentes causaram bugs de renderização. Manter flat até ter dados reais.
- **`prevMode` como `useRef`** — não precisa disparar re-render, apenas guardar o modo anterior ao minimizar.
- **Seções do modal em objeto único** — `secoes: { prazo, anexos, assinaturas }` com `toggleSecao()`. Reduz boilerplate de 3 useState para 1.
- **Sidebar removida** — existia no código mas não era renderizada. Removida pela pipeline de qualidade.

---

## O que o time tech precisa fazer primeiro

1. **Reduzir bundle size** — Substituir `import '@fortawesome/fontawesome-pro/js/all.min.js'` por imports individuais dos ícones usados, ou usar a variante SVG core do FA Pro.
2. **Conectar "Para / CC / Aos cuidados"** — Implementar autocomplete com API de usuários/setores. O input já existe e aceita chips — falta a busca.
3. **Implementar "Postar" e "Salvar rascunho"** — Os botões existem com os estilos corretos. Falta o handler que chama a API de documentos.
4. **Conectar Central de Ações à API** — Substituir os arrays `COUNTERS`, `LISTS` e `CIRCULARES` por dados reais.
5. **Implementar as páginas de rota** — Atividades, Documentos, Assinaturas, etc. estão como placeholder.

---

## Segurança — riscos conhecidos

- ⚠️ **Token FontAwesome Pro no `.npmrc`** — `B298DC1B-8319-4D67-B499-0396EAD12862` está commitado por decisão do projeto (necessário para `npm install` em CI). Se o repositório for público, **rotacionar o token imediatamente** no portal FontAwesome e atualizar o `.npmrc`.
- ✅ Sem variáveis de ambiente sensíveis expostas no bundle
- ✅ Sem `localStorage` ou tokens de sessão
- ✅ Sem chamadas de API (sem risco de CORS ou autenticação fraca neste momento)

---

## Limitações conhecidas

- ⚠️ **Bundle size** — 14.5 MB não minificado por causa do FA Pro `all.min.js`. Ver "O que o time tech precisa fazer primeiro".
- ⚠️ **Editor de descrição** — usa `contentEditable` nativo, sem biblioteca de rich text. Funcional para MVP, mas para produção avaliar TipTap ou Quill.
- ⚠️ **Sem testes automatizados** — zero coverage. Para UI pura de aprovação, é aceitável. Para integração com API, implementar antes.
- ⚠️ **Sem autenticação** — projeto entregue sem fluxo de login. A ser implementado pelo time tech.

---

## Contato

Dúvidas sobre decisões de produto/design: a confirmar
Dúvidas sobre decisões técnicas desta entrega: a confirmar

---

*Gerado pela pipeline Sauron — Tyrion · Thanos · Arya · Aragorn · Hermione*
