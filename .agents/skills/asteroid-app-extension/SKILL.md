# Módulo App Extension (`app-extension/`)

O pacote `@bildvitta/quasar-app-extension-asteroid` é a **Quasar App Extension** que integra o Asteroid em qualquer projeto Quasar. Ao instalar via `quasar ext add @bildvitta/asteroid`, ele configura automaticamente boots, aliases, plugins, CSS, e transpilações necessárias.

## Estrutura

```
app-extension/
├── package.json
└── src/
    ├── index.js             # Entry — configuração do Quasar (Index API)
    ├── install.js           # Instalação — copia templates para o projeto (Install API)
    ├── prompts.js           # Prompts interativos na instalação (vazio)
    ├── uninstall.js         # Desinstalação (vazio)
    ├── index.scss           # Import do CSS do ui
    ├── boot/                # Arquivos de boot do Quasar
    ├── defaults/            # Configuração padrão do Asteroid
    ├── helpers/             # Helpers da app-extension
    └── templates/           # Arquivos copiados para o projeto host
        ├── css/
        │   └── quasar.variables.scss   # Variáveis SCSS padrão
        └── js/
            └── asteroid.config.js      # Config padrão do Asteroid
```

## Entry Point (`index.js`)

### O que faz:
1. Valida compatibilidade com Quasar v2 e date-fns v2
2. Valida existência do `asteroid.config.js` no projeto host
3. Importa e lê as configurações do `asteroid.config.js`
4. Configura aliases de import:
   - `asteroid` → `@bildvitta/quasar-ui-asteroid/src/asteroid.js`
   - `asteroid-config` → Config padrão do Asteroid
   - `asteroid-config-app` → Config do projeto host
   - `vue-router` → Resolve local
   - `quasar` → Resolve local
5. Registra `unplugin-vue-components` para auto-import dos componentes `Qas*`
6. Chama `extendQuasar()` que configura:
   - **Boots:** api, overlay-navigation, debug, error-pages, font-face, register, loading, query-cache, store-adapter, before-each (+ notifications se habilitado)
   - **CSS:** index.scss do app-extension
   - **Plugins Quasar:** Dialog, Loading, Notify
   - **Animações:** slideInDown, rubberBand, fadeIn
   - **Extras:** material-symbols-rounded (icon set)
   - **Lang:** pt-BR
   - **Transpilação:** (Webpack only) adiciona regexes para transpile

### Suporte a bundlers:
- **Vite** (`@quasar/app-vite >= v2`): `extendViteConf` + `optimizeDeps.include`
- **Webpack** (`@quasar/app >= v3 || v4`): `extendWebpack` + `transpileDependencies`

## Boot Files

Todos em `app-extension/src/boot/`. Registrados automaticamente pelo `index.js`.

### `api.js` — Configuração Axios
- Define `baseURL` via `process.env.SERVER_BASE_URL`
- Define `timeout` via `asteroidConfig.api.serverTimeout`
- **Transformers de request:** `decamelizeKeys` (camelCase → snake_case) — exceto `FormData`
- **Transformers de response:** `camelizeKeys` (snake_case → camelCase)
- Faz `app.provide('axios', api)` para uso via Composition API

### `before-each.js` — Router Guards
- Registra `router.beforeEach` que:
  - Adiciona rota ao histórico via `useHistory().addRoute()`
  - Executa `setDefaultFiltersBeforeEach()` para persistência de filtros

### `debug.js` — Debug Logger
- Se `process.env.DEBUGGING` é truthy, habilita namespace `asteroid-*:*` no módulo `debug`

### `error-pages.js` — Páginas de Erro
- Adiciona rotas de erro ao Vue Router:
  - `/forbidden` (403) → `Forbidden.vue`
  - `/server-error` (500) → `ServerError.vue`
  - `/not-found` (404) → `NotFound.vue`
- Componentes importados do pacote `ui/src/pages/`

### `font-face.js` — Carregamento de Fontes
- Usa `FontFaceObserver` para detectar carregamento da fonte `Material Symbols Rounded`
- Adiciona classe `icons-is-loading` no body enquanto carrega (exibe loader animado)
- Opcionalmente aguarda autenticação do usuário via `postMessage` (`waitForUserAuthenticate`)

### `loading.js` — Loading Padrão
- Configura `QSpinnerTail` como spinner padrão do Quasar Loading
- Fundo branco, cor primary, mensagem "Carregando..."

### `notifications.js` — Notificações Real-Time
- **Condicional:** Só é adicionado se `asteroidConfig.framework.featureToggle.useNotifications === true`
- Usa `Laravel Echo` + `Pusher` para WebSocket
- `BroadcastChannel` para comunicação entre abas
- **Leader Election:** Apenas a aba "líder" mantém conexão WebSocket; outras abas recebem via `BroadcastChannel`

### `overlay-navigation.js` — Navegação em Overlay
- Intercepta rotas com `meta.useOverlay`
- Resolve componentes de foreground (dialog/drawer) e background
- Suporta `?overlay=true` query param

### `query-cache.js` — Cache de Query Params
- Salva query params de rotas de listagem
- Restaura ao retornar para a mesma rota sem queries
- Exclui `page` e params configurados

### `register.js` — Registro do Plugin Vue
- `app.use({ install })` — instala o plugin Vue do Asteroid

### `store-adapter.js` — State Management
- `app.use(InitializeGlobalStores)` — inicializa o `@bildvitta/store-adapter`

## Configuração (`asteroid.config.js`)

Arquivo que o projeto host deve criar na raiz. O default:

```js
export default {
  api: {
    serverTimeout: 10000     // Timeout de requisições (ms)
  },
  framework: {
    fonts: {
      observer: {
        waitForUserAuthenticate: true  // Esperar autenticação para carregar fontes
      }
    },
    featureToggle: {
      useNotifications: false  // Habilitar sistema de notificações
    }
  }
}
```

O merge é feito no `defaults/default-asteroid-config.js`:
```js
export default {
  ...defaultAsteroidConfig,   // Config padrão do Asteroid
  ...asteroidConfigApp         // Config do projeto host (sobrescreve)
}
```

## Instalação (`install.js`)

Ao rodar `quasar ext add`, copia para o projeto host:
1. `src/css/quasar.variables.scss` — variáveis SCSS do Quasar
2. `asteroid.config.js` — arquivo de configuração raiz

## Helpers

### `asteroid-config-handler.js`
- `validate()` — Verifica se `asteroid.config.js` existe no projeto host
- `getAsteroidConfigPath()` — Retorna path absoluto do config

### `laravel-echo.js`
- `setLaravelEcho(userToken)` — Inicializa conexão Laravel Echo com Pusher
- `setLaravelEchoListener({ user, channel })` — Escuta canal de notificações do usuário

### `notifications-channels.js`
- `setNotificationsChannelListener()` — Escuta `BroadcastChannel` para notificações cross-tab
- `setNotificationsUtilsChannel()` — Canal de utilidades para notificações

### `on-leader-election-channel.js`
- Implementa leader election entre abas do navegador
- Apenas a aba líder mantém a conexão WebSocket
e
