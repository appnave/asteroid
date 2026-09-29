# Asteroid — Visão Geral do Projeto

## O que é

Asteroid é um **Design System** criado pela **Bild & Vitta** (grupo de inovação), implementado como uma [Quasar App Extension](https://quasar.dev/app-extensions/introduction) para Vue 3. Ele fornece coleções de componentes, plugins, estilos, composables e utilitários voltados para construção rápida e padronizada de aplicações web, especialmente CRUDs integrados com uma [API REST padrão](http://github.com/bildvitta/api).

- **NPM (UI):** `@bildvitta/quasar-ui-asteroid`
- **NPM (App Extension):** `@bildvitta/quasar-app-extension-asteroid`
- **Versão atual:** 3.x (semver com beta/alpha)
- **Licença:** MIT
- **Documentação pública:** https://asteroid-v3.vercel.app/
- **Repositório:** https://github.com/bildvitta/asteroid

## Estrutura do Monorepo

```
asteroid/
├── ui/                  # Pacote principal — componentes, helpers, composables, plugins, CSS
├── app-extension/       # Configuração da Quasar App Extension — boots, templates, config
├── docs/                # Aplicação Quasar para documentação (PWA, Markdown pages)
├── build/               # Scripts de build, release e publicação NPM
├── eslint/              # Plugin ESLint customizado para Asteroid (eslint-plugin-asteroid)
├── ai-context/          # Contextos para agentes de IA
├── CHANGELOG.md         # Changelog unificado (formato Keep a Changelog, pt-BR)
├── vitest.config.ts     # Configuração de testes unitários
└── package.json         # Root — scripts de setup, lint e build
```

## Pacotes NPM publicados

| Pacote | Diretório | Registry |
|--------|-----------|----------|
| `@bildvitta/quasar-ui-asteroid` | `ui/` | NPM público |
| `@bildvitta/quasar-app-extension-asteroid` | `app-extension/` | NPM público |

## Tecnologias Principais

| Tecnologia | Uso |
|---|---|
| **Vue 3** | Framework reativo (Options API + Composition API) |
| **Quasar Framework v2** | Framework base (componentes, plugins, CLI, build) |
| **Rollup** | Build da lib (`ui/`) |
| **Vitest + jsdom** | Testes unitários |
| **SCSS/Sass** | Estilização com variáveis css, mixins e utilitários |
| **@bildvitta/store-adapter** | Abstração de state management (Vuex/Pinia agnóstico) |
| **Axios** | HTTP client com transformers camelCase/snake_case |
| **date-fns** | Manipulação de datas (locale pt-BR) |
| **unplugin-vue-components** | Auto-import de componentes (Vite) |

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `BUCKET_URL` | Endereço de hospedagem de arquivos |
| `SERVER_BASE_URL` | URL base do servidor/API |
| `DEBUGGING` | Habilita loggers dos componentes via `debug` |
| `MAPS_API_KEY` | Chave do Google Maps |
| `ABLY_KEY` | Chave do Ably (notificações real-time) |
| `ME_VERSION` | Versão do endpoint `/me` |

## Scripts Principais (root)

```bash
npm run setup          # Instala dependências em todos os módulos
npm run build          # Builda a lib (ui/) e prepara release
npm run test           # Roda testes unitários via Vitest
npm run lint           # Lint com ESLint em todos os arquivos .js/.vue
```

## Relação entre Módulos

```
┌─────────────────────────────────────────────────────┐
│                    Aplicação Host                     │
│  (Quasar App que instala o Asteroid)                │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         app-extension (boot, config)             │ │
│  │  ┌──────────────────────────────────────────┐   │ │
│  │  │         ui (componentes, helpers,         │   │ │
│  │  │         composables, plugins, CSS)       │   │ │
│  │  └──────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

docs/ → Consome ui/ diretamente para documentação
build/ → Scripts para publicar ui/ e app-extension/ no NPM
eslint/ → Plugin separado para lint de componentes Asteroid
```

A `app-extension` registra os boots, CSS, plugins do Quasar e configura aliases. Ela depende do `ui` como dependência NPM. O `ui` é o pacote core que contém toda a lógica de componentes e pode ser usado independentemente.

## Idioma

- **Código:** Inglês (nomes de variáveis, funções, componentes)
- **Documentação (YML, Markdown, CHANGELOG):** **Português brasileiro (pt-BR)**
- **Formatação padrão:** pt-BR (datas dd/MM/yyyy, moeda BRL, separador decimal vírgula)

## Git Flow

| Branch | Tipo de release | Tag NPM |
|--------|----------------|---------|
| `main` | Stable (ex: 3.20.0) | `latest` |
| `develop` | Beta (ex: 3.20.0-beta.1) | `beta` |
| `feature/*` | Alpha (ex: 3.20.0-alpha.1) | `alpha` |
