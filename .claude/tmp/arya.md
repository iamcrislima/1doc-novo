# Arya Report

## Vulnerabilidades encontradas

MEDIO — Headers de seguranca ausentes no Vercel → vercel.json nao define CSP, X-Frame-Options, X-Content-Type-Options nem HSTS → adicionar bloco "headers" no vercel.json → [OWASP: A05]

MEDIO — iframe do Google Maps sem atributo sandbox → OuvidoriaFields.tsx:123 → endereço sanitizado via encodeURIComponent (correto), mas iframe sem sandbox → adicionar sandbox="allow-scripts allow-same-origin" → [OWASP: A05]

BAIXO — Dependencias com ranges ^ em vez de versoes fixas → package.json — fixar versoes em producao ou usar npm ci com package-lock.json commitado

BAIXO — 57 i className fa-* diretos → risco zero no estado atual (todos hardcoded). Risco futuro se nomes vierem de API dinamica.

## CVEs identificados

react@19.2.5 — sem CVEs criticos conhecidos
vite@8.0.10 — versao recente, limpa
react-router-dom@7.14.2 — limpa
@fortawesome/fontawesome-pro@7.2.0 — nao indexado em bancos CVE publicos
typescript@6.0.2 — limpa

## Areas limpas

FA_TOKEN — .npmrc usa ${FA_TOKEN}. Token nao hardcoded. .env no .gitignore. .env.example sem valor real.
dangerouslySetInnerHTML — zero ocorrencias no projeto.
Variaveis de ambiente — zero VITE_* no codigo.
localStorage / sessionStorage — zero usos.
Dados sensiveis nos mocks — apenas nomes ficticios. Zero CPF, email real, senha.
console.log — zero em src/.
Iframe endereco — encodeURIComponent() aplicado antes de montar URL.

## Mensagem para Aragorn

Zero criticos ou altos. Dois medios (headers Vercel + iframe sandbox) — ambos corrigiveis em minutos. Dois baixos de baixo risco real. Projeto e prototipo frontend sem backend real. Superficie de ataque minima.
