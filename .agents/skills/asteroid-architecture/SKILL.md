# Arquitetura do Asteroid

## Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                      APLICAÇÃO HOST (Quasar App)                  │
│                                                                    │
│  asteroid.config.js ─────────────────────────────────────────┐   │
│                                                                │   │
│  ┌────────────────────────────────────────────────────────┐   │   │
│  │           APP-EXTENSION (Quasar Boot Layer)             │   │   │
│  │                                                          │   │   │
│  │  ┌── Boots ──────────────────────────────────────────┐  │   │   │
│  │  │ api.js        → Axios config (camelCase/snake)    │  │   │   │
│  │  │ register.js   → Instala Vue Plugin do Asteroid    │  │   │   │
│  │  │ store-adapter → Inicializa state management       │  │   │   │
│  │  │ error-pages   → Rotas de erro (403/404/500)       │  │   │   │
│  │  │ font-face     → Carregamento de fontes            │  │   │   │
│  │  │ loading       → Config do Quasar Loading          │  │   │   │
│  │  │ debug         → Debug logger                       │  │   │   │
│  │  │ before-each   → Router guards                      │  │   │   │
│  │  │ query-cache   → Cache de query params              │  │   │   │
│  │  │ overlay-nav   → Navegação em overlay               │  │   │   │
│  │  │ notifications → WebSocket real-time (opcional)     │  │◄──┘   │
│  │  └───────────────────────────────────────────────────┘  │       │
│  │                                                          │       │
│  │  ┌── Aliases ────────────────────────────────────────┐  │       │
│  │  │ asteroid → @bildvitta/quasar-ui-asteroid          │  │       │
│  │  │ asteroid-config → default config                   │  │       │
│  │  │ asteroid-config-app → app config                   │  │       │
│  │  └───────────────────────────────────────────────────┘  │       │
│  │                                                          │       │
│  │  ┌── Auto-Import ────────────────────────────────────┐  │       │
│  │  │ unplugin-vue-components → Qas* auto-resolve       │  │       │
│  │  └───────────────────────────────────────────────────┘  │       │
│  └────────────────────────────────────────────────────────┘       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐       │
│  │                    UI (Core Package)                     │       │
│  │                                                          │       │
│  │  ┌── Components (85+) ──────────────────────────────┐  │       │
│  │  │ QasFormView ──┐                                    │  │       │
│  │  │ QasListView ──┤── View Components                  │  │       │
│  │  │ QasSingleView ┘   (entity-based, store-adapter)   │  │       │
│  │  │                                                    │  │       │
│  │  │ QasFormGenerator ─┐                                │  │       │
│  │  │ QasTableGenerator─┤── Generator Components         │  │       │
│  │  │ QasGridGenerator ─┤   (campo-driven, dinâmicos)   │  │       │
│  │  │ QasTreeGenerator ─┘                                │  │       │
│  │  │                                                    │  │       │
│  │  │ QasBtn, QasInput, QasSelect... ── UI primitivos   │  │       │
│  │  │ QasLayout, QasAppBar, QasAppMenu ── Layout        │  │       │
│  │  │ QasDialog, QasAlert, QasDelete ──── Feedback      │  │       │
│  │  └────────────────────────────────────────────────────┘  │       │
│  │                                                          │       │
│  │  ┌── Composables ──────────────────────────────────┐    │       │
│  │  │ useForm, useHistory, useScreen, useNotifications │    │       │
│  │  │ useQueryCache, useDefaultFilters, useContext     │    │       │
│  │  └─────────────────────────────────────────────────┘    │       │
│  │                                                          │       │
│  │  ┌── Helpers + Plugins + Mixins + CSS ─────────────┐   │       │
│  │  │ filters, rules, isEmpty, promiseHandler          │   │       │
│  │  │ Delete, Dialog, NotifyError, NotifySuccess       │   │       │
│  │  │ viewMixin, formMixin, generatorMixin             │   │       │
│  │  │ Variáveis, mixins SCSS, utilities                │   │       │
│  │  └─────────────────────────────────────────────────┘   │       │
│  └────────────────────────────────────────────────────────┘       │
│                                                                    │
│  ┌────────────────────────────────────────────────────────┐       │
│  │              STORE ADAPTER (Abstração)                   │       │
│  │  getAction({ entity, action }) ──► Store Module          │       │
│  │  getState({ entity, key }) ──────► Reactive State        │       │
│  │  Actions: fetchList, fetchSingle, create, update,        │       │
│  │           replace, destroy                                │       │
│  └────────────────────────────────────────────────────────┘       │
│                              │                                     │
│                              ▼                                     │
│  ┌────────────────────────────────────────────────────────┐       │
│  │                  API REST (Backend)                       │       │
│  │  Axios → decamelizeKeys → API → camelizeKeys → Vue      │       │
│  └────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados (CRUD)

### Listagem (QasListView + QasTableGenerator)

```
QasListView
  │
  ├── mount/route-change
  │   └── getAction({ entity, action: 'fetchList', payload: { filters, page } })
  │       └── Store Module → Axios → API REST
  │           └── Response → camelizeKeys → Store State
  │
  ├── getState({ entity, key: 'list' })
  │   └── Reactive list data
  │
  └── Template
      └── QasTableGenerator
          ├── Gera colunas a partir de fields
          ├── Renderiza linhas reativas
          └── Slots: actions, custom columns
```

### Formulário (QasFormView + QasFormGenerator)

```
QasFormView
  │
  ├── mount (se edit/view mode)
  │   └── getAction({ entity, action: 'fetchSingle', id })
  │       └── Store → Axios → API → Store State
  │
  ├── QasFormGenerator
  │   ├── Gera campos a partir de fields
  │   ├── Renderiza QasInput, QasSelect, QasCheckbox, etc.
  │   └── v-model bidirecional com fields
  │
  └── submit
      ├── Validação (Quasar form validation)
      ├── beforeSubmit hook
      └── getAction({ entity, action: 'create'|'update'|'replace', payload })
          └── Store → Axios (decamelizeKeys) → API
```

### Exclusão (QasDelete)

```
QasDelete
  │
  ├── Confirmation dialog ($qas.delete)
  └── getAction({ entity, action: 'destroy', id })
      └── Store → Axios → API
```

## Fluxo de Notificações Real-Time

```
┌────────────────────────────────────────────────────┐
│                  Navegador (Multi-tab)               │
│                                                      │
│  Tab 1 (Leader) ◄──── Leader Election Protocol       │
│  │                                                   │
│  ├── Laravel Echo ◄── WebSocket ◄── Pusher Server   │
│  │   └── Recebe notificação                          │
│  │       └── BroadcastChannel.postMessage()          │
│  │                        │                          │
│  │                        ▼                          │
│  ├── Tab 2 ◄── BroadcastChannel listener             │
│  ├── Tab 3 ◄── BroadcastChannel listener             │
│  └── Tab 4 ◄── BroadcastChannel listener             │
│                                                      │
│  Todas as tabs recebem e exibem:                     │
│  - Toast notification (Quasar Notify)                │
│  - Badge no QasAppUser                               │
│  - Som de notificação                                │
└────────────────────────────────────────────────────┘
```

## Fluxo de Navegação em Overlay

```
Rota com meta.useOverlay = true
  │
  ├── overlay-navigation boot intercepta
  │
  ├── Resolve BACKGROUND component
  │   ├── query.background → componente especificado
  │   ├── meta.background → componente do meta da rota
  │   └── parent route → componente da rota pai (fallback)
  │
  ├── Resolve FOREGROUND component
  │   └── Componente da rota atual (dialog/drawer)
  │
  └── Renderiza ambos simultaneamente
      ├── Background: componente da página anterior (frozen state)
      └── Foreground: dialog/drawer sobreposto
```

## Transformação de Dados (API ↔ Frontend)

```
Frontend (camelCase)          API (snake_case)
─────────────────────         ─────────────────
firstName         ──────►     first_name
lastName          ──────►     last_name
createdAt         ──────►     created_at

first_name        ◄──────    first_name
last_name         ◄──────    last_name
created_at        ◄──────    created_at

Exceção: keys com números (ex: "field1") não são convertidas
```

## Configuração Hierárquica

```
asteroid-config (default do Asteroid)
         │
         ▼
    { ...default }
         │
         ▼
asteroid-config-app (asteroid.config.js do projeto host)
         │
         ▼
    { ...default, ...app }  ← App sobrescreve defaults
         │
         ▼
    Usado por boots e componentes via import 'asteroid-config'
```

## Integração com Quasar

### Plugins Quasar obrigatórios (registrados automaticamente)
- `Dialog` — Diálogos modais
- `Loading` — Overlay de carregamento
- `Notify` — Notificações toast

### Icon Set
- `material-symbols-rounded` (default, registrado automaticamente)

### Animações
- `slideInDown`, `rubberBand`, `fadeIn` (do Animate.css, via Quasar)

### Lang
- `pt-BR` (registrado automaticamente)

## Ciclo de Vida do Componente na Aplicação Host

```
1. quasar ext add @appnave/asteroid
   └── install.js copia templates (asteroid.config.js, quasar.variables.scss)

2. quasar dev / quasar build
   └── index.js da app-extension:
       ├── Valida asteroid.config.js
       ├── Configura aliases
       ├── Registra boots
       ├── Configura unplugin-vue-components
       └── Estende Quasar config

3. Runtime:
   ├── Boots executam em sequência
   ├── Vue Plugin instalado (register.js)
   ├── Store Adapter inicializado
   ├── Axios configurado
   ├── Router guards ativos
   └── Componentes disponíveis globalmente via auto-import
```

## Store-Adapter Pattern

```js
// NUNCA chamar APIs diretamente. Sempre via store-adapter:
import { getAction, getState } from '@bildvitta/store-adapter'

// Fetch
getAction.call(this, { entity: this.entity, action: 'fetchList', payload })

// State
getState.call(this, { entity: this.entity, key: 'list' })
```

### Actions disponíveis:
- `fetchSingle` — Buscar registro único
- `fetchList` — Buscar lista
- `create` — Criar registro
- `update` — Atualizar parcialmente
- `replace` — Substituir completamente
- `destroy` — Excluir registro
