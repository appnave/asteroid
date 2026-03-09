# Asteroid Constitution

## Core Principles

### I. Design System First
Todo recurso (componente, composable, helper, plugin) é construído como parte de um Design System coeso e reutilizável. Componentes devem ser autocontidos, documentáveis via YML, e registráveis automaticamente com o prefixo `Qas*`. Nenhum componente deve existir sem propósito claro dentro do sistema — toda adição deve servir a padronização e consistência visual/funcional das aplicações consumidoras.

### II. Monorepo Modular
O projeto é organizado como monorepo com módulos independentes e responsabilidades bem definidas:
- `ui/` — Pacote core com componentes, helpers, composables, plugins, mixins e CSS.
- `app-extension/` — Integração com Quasar Framework via boots, aliases, config e auto-import.
- `docs/` — Aplicação Quasar PWA para documentação pública.
- `build/` — Scripts de build, release e publicação NPM.
- `eslint/` — Plugin ESLint customizado para validação de componentes Asteroid.

Cada módulo deve ser mantido com sua responsabilidade isolada. O `ui/` é independente; o `app-extension/` depende do `ui/` como pacote NPM.

### III. API-Driven & Convention over Configuration
Componentes de view (`QasFormView`, `QasListView`, `QasSingleView`) e generators (`QasFormGenerator`, `QasTableGenerator`, `QasGridGenerator`, `QasTreeGenerator`) operam de forma dirigida pela API REST: recebem uma `entity`, fazem CRUD automático via `store-adapter`, e geram UI dinamicamente a partir dos `fields` retornados pelo backend. A transformação camelCase ↔ snake_case é automática via Axios transformers. O `asteroid.config.js` centraliza configuração no projeto host com valores defaults sensatos.

### IV. Quasar Framework Integration
O Asteroid é construído como Quasar App Extension e depende profundamente do ecossistema Quasar v2: plugins (`Dialog`, `Loading`, `Notify`), build system (Vite e Webpack), boot files, icon set (`material-symbols-rounded`), locale (`pt-BR`), e validação de formulários. Toda extensão deve respeitar as APIs e convenções do Quasar.

### V. Migração Gradual para Composition API
O projeto coexiste entre Options API (mixins legados com prefixo `mx_`) e Composition API (composables modernos). Novos recursos devem ser implementados em Composition API. Mixins existentes estão em processo de migração. O `vue-plugin.js` registra tanto `globalProperties` quanto `provide/inject` para suportar ambos os paradigmas.

### VI. Versionamento Semântico com Pre-releases
Releases seguem SemVer estrito com canais de pre-release baseados em branch:
- `main` → release estável (NPM latest)
- `develop` → beta (NPM tag beta)
- `feature/*` → alpha (NPM tag alpha)

O CHANGELOG.md segue formato Keep a Changelog em pt-BR com seções: Adicionado, Modificado, Corrigido, Removido. A seção "Não publicado" é obrigatória para releases não-alpha e é substituída automaticamente pelo script de build.

### VII. Documentação como Cidadão de Primeira Classe
Todo componente deve ter: arquivo YML de API (`QasNome.yml`), página Markdown em `docs/`, exemplos interativos em `docs/src/examples/`, e entrada no menu lateral. A documentação é consumida como PWA pública e serve como fonte de verdade para a API dos componentes, alimentando também o ESLint plugin e o autocomplete de editores.

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| **Vue 3** | Framework reativo (Options API + Composition API em migração) |
| **Quasar Framework v2** | Framework base — componentes, plugins, CLI, build |
| **Rollup** | Build da lib `ui/` em 3 formatos (ESM, CJS, UMD) |
| **Vitest + jsdom** | Testes unitários |
| **SCSS/Sass** | Estilização com variáveis CSS, mixins e classes utilitárias |
| **@bildvitta/store-adapter** | Abstração de state management (Vuex/Pinia agnóstico) |
| **Axios** | HTTP client com transformers camelCase/snake_case |
| **date-fns** | Manipulação de datas (locale pt-BR) |
| **unplugin-vue-components** | Auto-import de componentes `Qas*` |
| **ESLint (plugin customizado)** | Validação de props em componentes Asteroid |
| **Laravel Echo + Pusher** | Notificações real-time via WebSocket (opcional) |
| **markdown-it + highlight.js** | Processamento de Markdown para documentação |

## Workflow de Desenvolvimento

### Adição de Componente
1. Criar componente em `ui/src/components/<nome>/Qas<Nome>.vue`
2. Criar arquivo de API `Qas<Nome>.yml` na mesma pasta
3. Exportar como `defineAsyncComponent` em `ui/src/asteroid.js`
4. Criar página Markdown em `docs/src/pages/components/<nome>.md`
5. Criar exemplos em `docs/src/examples/Qas<Nome>/`
6. Adicionar entrada no menu em `docs/src/assets/menu.js`
7. Validar com `npm run lint` e `npm run test`

### Processo de Release
1. Validação de branch (main/develop/feature/*)
2. Bump de versão em todos os `package.json`
3. Lint e validação do CHANGELOG.md
4. Publicação `ui/` e `app-extension/` no NPM com tag apropriada
5. Atualização do CHANGELOG.md (substituição do "Não publicado")
6. Commit, tag e push via git
7. Criação de GitHub Release (API ou browser)
8. Notificação no Discord via webhook

### Convenções de Código
- Componentes usam prefixo `Qas` (ex: `QasBtn`, `QasFormView`)
- Propriedades de mixins usam prefixo `mx_` (ex: `mx_isFetching`)
- CSS segue arquitetura organizada: `base/`, `variables/`, `mixins/`, `components/`, `plugins/`, `utils/`
- Design tokens definidos via variáveis SCSS e CSS custom properties
- Locale padrão: pt-BR (datas, moedas, mensagens)

## Governance

Esta constituição define os princípios fundamentais do projeto Asteroid. Todas as contribuições, revisões de código e decisões arquiteturais devem estar em conformidade com estes princípios. Alterações na constituição requerem documentação explícita, justificativa e atualização dos arquivos de contexto em `.ai-context/`.

Princípios invioláveis:
- Prefixo `Qas*` para todos os componentes públicos
- Compatibilidade com Quasar v2 e Vue 3
- Transformação automática camelCase ↔ snake_case na camada de API
- Versionamento semântico com canais de pre-release
- Documentação obrigatória para componentes públicos

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09
