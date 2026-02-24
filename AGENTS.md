# Asteroid — AGENTS.md

## Visão Geral

Asteroid é um **Design System** criado pela **Bild & Vitta**, implementado como uma Quasar App Extension para Vue 3. Monorepo com pacotes `ui/`, `app-extension/`, `docs/`, `build/` e `eslint/`.

- **NPM (UI):** `@bildvitta/quasar-ui-asteroid`
- **NPM (App Extension):** `@bildvitta/quasar-app-extension-asteroid`
- **Versão atual:** 3.x (semver com beta/alpha)
- **Documentação:** https://asteroid-v3.vercel.app/
- **Repositório:** https://github.com/bildvitta/asteroid

## Dev environment tips

- Rode `npm run setup` na raiz para instalar dependências de todos os módulos (`ui/`, `app-extension/`, `docs/`).
- Para instalar dependências de um módulo específico: `cd <modulo> && npm i && cd ..`
- O `ui/` é linkado localmente via `"file:ui"` no `package.json` root e no `docs/`.
- O `eslint/` é linkado localmente via `"file:eslint"`.
- O `docs/` consome `ui/` diretamente (`"file:../ui"`), sem precisar publicar no NPM.
- Use `cd docs && npm run dev:pwa` para rodar a documentação local.
- O alias `asteroid` aponta para `ui/src/asteroid.js` — configurado tanto no `vitest.config.ts` quanto no `app-extension/src/index.js`.
- Componentes Quasar (`q-*`) são auto-importados. Componentes Asteroid (`Qas*`) são importados explicitamente dentro do `ui/`, mas auto-importados nos projetos host via `unplugin-vue-components`.

## Testing instructions

- Testes unitários usam **Vitest + jsdom + @vue/test-utils**.
- Config em `vitest.config.ts` na raiz do monorepo.
- Rode `npm run test` na raiz para executar todos os testes.
- Para rodar um teste específico: `npx vitest run -t "<test name>"`.
- Testes cobrem helpers e componentes simples em `ui/src/helpers/` e `ui/src/components/`.
- Inclua alias `asteroid`, `asteroid-config`, `quasar` no vitest config ao adicionar novos testes.
- Adicione ou atualize testes para qualquer código alterado.

## Lint instructions

- Rode `npm run lint` na raiz para lint em todos os `.js` e `.vue`.
- O ESLint usa `eslint-plugin-asteroid` (local em `eslint/`) para validação de props de componentes `Qas*`.
- Após mover arquivos ou alterar imports, rode lint para garantir que tudo passa.

## Release instructions

- O processo de release é executado via `npm run build` na raiz (CLI interativa em `build/build.js`).
- Branches determinam o tipo de release:
  - `main` → stable (ex: `3.20.0`, tag `latest`)
  - `develop` → beta (ex: `3.20.0-beta.1`, tag `beta`)
  - `feature/*` → alpha (ex: `3.20.0-alpha.1`, tag `alpha`)
- O CHANGELOG.md precisa ter seção `## Não publicado` para releases non-alpha.
- O script faz bump de versão em todos os `package.json`, publica `ui/` e `app-extension/` no NPM, atualiza o changelog, faz commit/tag/push, cria GitHub Release, e notifica Discord.
- Variáveis de ambiente para release: `GITHUB_TOKEN`, `DISCORD_WEBHOOK_CHANGELOG`, `DISCORD_ROLE_ID`.

## PR instructions

- Sempre rode `npm run lint` e `npm run test` antes de commitar.
- Atualize o CHANGELOG.md na seção `## Não publicado` com as mudanças.
- Formato do changelog: `- \`QasComponente\`: Descrição da mudança.`
- Seções do changelog: **Adicionado**, **Modificado**, **Corrigido**, **Removido**.
- Todas as descrições em português brasileiro.

## Estrutura do Monorepo

```
asteroid/
├── ui/                  # Pacote core — componentes, helpers, composables, plugins, CSS
├── app-extension/       # Quasar App Extension — boots, templates, config
├── docs/                # Aplicação Quasar para documentação (PWA)
├── build/               # Scripts de build, release e publicação NPM
├── eslint/              # Plugin ESLint customizado (eslint-plugin-asteroid)
├── .ai-context/         # Documentação detalhada para contexto de IA
├── CHANGELOG.md         # Changelog unificado (Keep a Changelog, pt-BR)
├── vitest.config.ts     # Config de testes unitários
└── package.json         # Root — scripts de setup, lint e build
```

## Decisões de design

### Options API vs Composition API
- A maioria dos componentes existentes usa **Options API** (legado).
- Novos componentes devem usar **Composition API** com `<script setup>`.
- Migração gradual está em andamento.

### Store-Adapter
- Toda comunicação com API é feita via `@bildvitta/store-adapter`, nunca diretamente com Axios.
- O store-adapter abstrai Vuex/Pinia, tornando o state management agnóstico.

### Auto-import de componentes
- Projetos host usam `unplugin-vue-components` para auto-import de `Qas*`.
- Dentro do `ui/`, imports são sempre explícitos.

### Transformação de dados API
- Request: `camelCase` → `snake_case` (via `decamelizeKeys`, exceto `FormData`).
- Response: `snake_case` → `camelCase` (via `camelizeKeys`).

### Idioma
- **Código:** Inglês.
- **Documentação (YML, Markdown, CHANGELOG):** Português brasileiro (pt-BR).
- **Formatação:** pt-BR (datas dd/MM/yyyy, moeda BRL, separador decimal vírgula).
