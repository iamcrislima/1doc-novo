# Thanos Report

## O que foi eliminado
- `src/components/layout/Sidebar.tsx`: não importado em lugar nenhum. Dead code puro.
- `src/components/layout/Sidebar.css`: arquivo de estilo do componente eliminado acima.
- 3 `useState` separados (`prazoAberto`, `anexosAberto`, `assinaturasAberto`) → unificados em 1 objeto `secoes` + função `toggleSecao`. Menos ruído, mesmo comportamento.

## O que foi mantido (e por quê)
- `NovoDocumentoModal.tsx` como arquivo flat (~440 linhas): serve a um propósito único e complexo. Quebrar em sub-componentes não reduziria a complexidade real — apenas a espalharia.
- `key={i}` nos maps de arquivos/assinaturas: dados são locais e sem reordenação. Aceitável enquanto não vier de API.
- `dangerouslySetInnerHTML` no NavIcon (Header.tsx): necessário para FA Pro JS renderizar os SVGs corretamente.

## Redução
- Antes: ~456 linhas no modal + 88 linhas Sidebar + 2 arquivos CSS extras
- Depois: ~442 linhas no modal, Sidebar e seu CSS removidos
- Redução total: ~100 linhas / ~18% do que foi tocado

## Mensagem para Arya
Projeto é UI pura — sem backend, sem autenticação, sem chamadas de API.
Pontos de atenção:
1. `.npmrc` commitado com token FontAwesome Pro hardcoded.
2. `dangerouslySetInnerHTML` presente em Header.tsx (NavIcon) e no editor do modal.
3. Sem variáveis de ambiente expostas (nenhum `VITE_*`).
4. Sem `localStorage`, sem tokens de sessão, sem rotas protegidas.
