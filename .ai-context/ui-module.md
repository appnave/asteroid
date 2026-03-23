# Módulo UI (`ui/`)

O pacote `@bildvitta/quasar-ui-asteroid` é o coração do Asteroid. Contém todos os componentes, helpers, composables, plugins, mixins, diretivas e estilos do Design System.

## Estrutura de Diretórios

```
ui/
├── package.json           # Pacote NPM público
├── rollup.config.js       # Build config (ESM, CJS, UMD)
├── postcss.config.js      # PostCSS com autoprefixer
└── src/
    ├── asteroid.js         # Entry point principal — re-exporta tudo
    ├── vue-plugin.js       # Plugin Vue (install function) — registra componentes, plugins, diretivas
    ├── index.esm.js        # Entry ESM para Rollup
    ├── index.cjs.js        # Entry CJS para Rollup
    ├── index.umd.js        # Entry UMD para Rollup
    ├── index.scss          # Estilos globais — variáveis, base, mixins, utils
    ├── components/         # 70+ componentes Vue
    ├── composables/        # Composables Vue (useForm, useHistory, etc.)
    ├── helpers/            # Funções utilitárias (filters, rules, isEmpty, etc.)
    ├── mixins/             # Mixins Vue (Options API — legado, em migração)
    ├── plugins/            # Plugins globais (Delete, Dialog, Notify, Screen)
    ├── directives/         # Diretivas Vue (ex: v-test)
    ├── enums/              # Enumerações (Align, Spacing, Status)
    ├── shared/             # Configurações compartilhadas (badge, date, fuse, notify)
    ├── css/                # SCSS — arquitetura CSS completa
    ├── pages/              # Páginas de erro (404, 403, 500, 401)
    └── assets/             # SVGs, sons de notificação
```

## Entry Point (`asteroid.js`)

Arquivo principal que exporta tudo usando `defineAsyncComponent` para lazy loading:

```js
export * from './helpers'
export * from './mixins'
export * from './vue-plugin'
export * from './composables'
export * from './plugins'

// Componentes como async
export const QasBtn = defineAsyncComponent(() => import('./components/btn/QasBtn.vue'))
// ... 70+ componentes
```

## Vue Plugin (`vue-plugin.js`)

O `install()` registra:
- `$qas` no `globalProperties` com `delete`, `dialog`, `error`, `screen`, `success`
- `provide('qas', { delete, getAction, getGetter })` para Composition API
- Diretiva `v-test` para seletores de teste

## Categorias de Componentes

| Categoria | Componentes |
|-----------|-------------|
| **Layout** | `QasLayout`, `QasAppBar`, `QasAppMenu`, `QasAppUser`, `QasContainer`, `QasDrawer` |
| **Formulários** | `QasInput`, `QasSelect`, `QasCheckbox`, `QasRadio`, `QasToggle`, `QasNumericInput`, `QasPasswordInput`, `QasDateTimeInput`, `QasField`, `QasFormGenerator`, `QasFormView`, `QasNestedFields`, `QasOptionGroup` |
| **Tabelas/Listas** | `QasTableGenerator`, `QasListView`, `QasListItems`, `QasGridGenerator`, `QasGridItem`, `QasPagination`, `QasInfiniteScroll` |
| **Navegação** | `QasDialogRouter`, `QasTabsGenerator`, `QasStepper`, `QasStepperFormView` |
| **Feedback** | `QasAlert`, `QasDialog`, `QasDelete`, `QasSkeleton`, `QasEmptyResultText`, `QasErrorMessage`, `QasStatus`, `QasBadge`, `QasTip`, `QasTooltip` |
| **Mídia** | `QasAvatar`, `QasGallery`, `QasGalleryCard`, `QasCardImage`, `QasUploader`, `QasSignaturePad`, `QasSignatureUploader`, `QasPdfViewer`, `QasMap`, `QasChartView` |
| **Ações** | `QasBtn`, `QasBtnDropdown`, `QasActions`, `QasActionsMenu`, `QasCopy`, `QasDelete`, `QasWhatsappLink` |
| **Dados** | `QasBoardGenerator`, `QasTreeGenerator`, `QasTransfer`, `QasSortable`, `QasSelectList`, `QasSelectListDialog`, `QasSearchBox`, `QasSearchInput`, `QasReportsFilters`, `QasFilters` |
| **Display** | `QasCard`, `QasBox`, `QasLabel`, `QasBreakline`, `QasHeader`, `QasPageHeader`, `QasProfile`, `QasTimeline`, `QasTextTruncate`, `QasExpansionItem`, `QasWelcome`, `QasResizer`, `QasGrabbable`, `QasToggleVisibility` |
| **Páginas** | `NotFound` (404), `Forbidden` (403), `ServerError` (500), `Unauthorized` (401) |

## Componentes-Chave (Core)

### `QasFormView`
Componente de formulário completo integrado com store-adapter. Usa `entity` prop para CRUD automático. Modos: `create`, `replace`, `update`. Suporta `beforeSubmit`, `beforeFetch`, validação automática.

### `QasListView`
Listagem paginada com fetch automático via store-adapter. Suporta filtros, busca, ordenação, paginação.

### `QasTableGenerator`
Tabela dinâmica que gera colunas automaticamente a partir dos `fields` retornados pela API.

### `QasFormGenerator`
Gera formulários dinamicamente a partir de uma estrutura de `fields`.

## Composables

| Composable | Arquivo | Descrição |
|------------|---------|-----------|
| `useForm` | `use-form.js` | Determina modo do formulário (create/replace/update) a partir da rota |
| `useHistory` | `use-history.js` | Rastreia histórico de navegação (singleton reativo) |
| `useScreen` | `use-screen.js` | Utilitários de tamanho de tela |
| `useNotifications` | `use-notifications.js` | Sistema de notificações browser com som |
| `useQueryCache` | `use-query-cache.js` | Cache de query params por rota |
| `useDefaultFilters` | `use-default-filters.js` | Filtros padrão para listagens |
| `useContext` | `use-context.js` | Contexto compartilhado |
| `useOverlayNavigation` | `use-overlay-navigation.js` | Navegação em overlay/dialog |

**Padrão:** Alguns composables usam **estado singleton** no nível do módulo (ex: `useHistory` usa `reactive()` fora da função).

## Helpers

| Helper | Descrição |
|--------|-----------|
| `filters.js` | Formatação: `date()`, `money()`, `percent()`, `decimal()`, `asset()` — locale pt-BR |
| `rules.js` | Validações: `required()` — retorna true ou mensagem de erro (padrão Quasar) |
| `isEmpty` | Verifica se valor é vazio (null, undefined, '', [], {}) |
| `isLocalDevelopment` | Detecta ambiente local |
| `handleProcess` | Wrapper seguro para `process.env` |
| `promiseHandler` | Handler genérico de promises |
| `copyToClipboard` | Copia texto para clipboard |
| `downloadFile` | Download de arquivos |
| `filterObject` | Filtra propriedades de objetos |
| `constructObject` | Constrói objetos a partir de paths |
| `camelizeFieldsName` | Converte nomes de fields para camelCase |
| `setScrollGradient` | Adiciona gradiente de scroll |
| `setScrollOnGrab` | Scroll via drag |
| `images.js` | Utilitários de imagem |
| `colors.js` | Utilitários de cor |

## Mixins (Legado — em migração para Composition API)

| Mixin | Descrição |
|-------|-----------|
| `viewMixin` | Base para componentes de view — entity, fields, errors, fetching |
| `formMixin` | Lógica de formulário — submit, validate, errors |
| `generatorMixin` | Base para geradores (form, table, grid) |
| `contextMixin` | Contexto compartilhado entre componentes |
| `searchFilterMixin` | Lógica de busca e filtro |
| `deleteMixin` | Lógica de exclusão |
| `passwordMixin` | Lógica de campos de senha |

**Prefixo de propriedades:** `mx_` (ex: `mx_isFetching`, `mx_setFields()`).

## Plugins

| Plugin | Descrição |
|--------|-----------|
| `Delete` | Dialog de confirmação de exclusão |
| `Dialog` | Dialog genérico com confirm/cancel |
| `NotifyError` | Notificação de erro (toast) |
| `NotifySuccess` | Notificação de sucesso (toast) |
| `Screen` | Utilitários de breakpoint de tela |

Acessíveis via `this.$qas.delete()`, `this.$qas.dialog()`, `this.$qas.error()`, `this.$qas.success()`.

## Arquitetura CSS

```
css/
├── base/           # Reset, font-face, animações de loading do ícone
├── variables/      # Design tokens: typography, spacing, shadow, button, scrollbar, separator
├── mixins/         # Sass mixins: set-brand, set-button, set-typography, set-error-message
├── components/     # Overrides de estilo por componente (button, editor, field, etc.)
├── plugins/        # Estilos de plugins
└── utils/          # Classes utilitárias (background, border, border-radius, container, fonts, etc.)
```

### Variáveis CSS principais
```scss
$primary: #0f53af;
$secondary: #1565C0;
$tertiary: #c7ceff;
$dark: #212121;
--qas-background-color: rgba(15, 83, 175, 0.03);
--qas-border-grey: #{$grey-4};
--qas-generic-border-radius: 4px;
--qas-generic-transition: 300ms;
```

### Spacing Scale (base 16px)
none(0), 2xs(4), xs(8), sm(12), md(16), lg(24), xl(32), 2xl(40), 3xl(48), 4xl(56), 5xl(64)

### Typography
Mapa Sass para h1-h6, subtitles, body — cada entrada com: `size`, `line-height`, `letter-spacing`, `weight`.

## Build (Rollup)

Gera 3 formatos:
- **ESM** (`dist/asteroid.esm.js` + `.min.js`)
- **CJS** (`dist/asteroid.cjs.js` + `.min.js`)
- **UMD** (`dist/asteroid.umd.js` + `.min.js`)

Plugins: `rollup-plugin-vue`, `rollup-plugin-scss`, `@rollup/plugin-json`, `@rollup/plugin-url`, `terser`.
