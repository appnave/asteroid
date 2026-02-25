---
name: plano-de-teste
description: Plano detalhado para criação de testes unitários para todos os componentes públicos `Qas*` do Asteroid, seguindo uma abordagem incremental em 4 fases: (0) infraestrutura compartilhada de testes, (1) componentes simples, (2) componentes médios, (3) componentes complexos. Cada fase tem foco específico e critérios de teste abrangentes.
---
# Plano: Testes Unitários para Todos os Componentes Asteroid

**TL;DR** — Criar testes unitários abrangentes para os ~83 componentes públicos `Qas*`, seguindo uma abordagem incremental em 4 fases: (0) infraestrutura compartilhada de testes, (1) ~19 componentes simples, (2) ~27 componentes médios, (3) ~30+ componentes complexos. A infraestrutura inclui setup file global, mocks reutilizáveis para `vue-router`, `store-adapter`, `quasar` APIs e um helper `mountWithDefaults()` que configura `provide`/`global` automaticamente. Os 3 testes existentes (`QasAlert`, `QasAvatar`, `QasStatus`) serão expandidos para o nível abrangente. Cada teste cobre: renderização, todas as props, slots, eventos, estados condicionais, edge cases e atributos `data-cy`.
- valide retorno de funções, computed, watchs, comportamento de dados reativos, hooks.
---

## Fase 0 — Infraestrutura Compartilhada

**1.** Criar `ui/src/test-utils/setup.js` como `setupFiles` global:
   - Mock de `vue-router`: exportar `useRouter` e `useRoute` como `vi.fn()` retornando objetos reativos (`push`, `replace`, `currentRoute`, `params`, `query`)
   - Mock de `@bildvitta/store-adapter`: exportar `getAction` e `getState` como `vi.fn()`
   - Mock de APIs Quasar: `LocalStorage`, `SessionStorage`, `Notify`, `Screen`, `Platform`, `copyToClipboard`
   - Stub global de `onBeforeRouteLeave` como no-op

**2.** Criar `ui/src/test-utils/mount-helper.js`:
   - Exportar `mountComponent(component, options)` que faz merge de:
     - `global.provide` padrão: `{ isBox: false, isDialog: false, isHeader: false, isTableGenerator: false, isFormGenerator: false, isExpansionItem: false, isListView: false, axios: vi.fn(), qas: {}, btnPropsDefaults: {}, stepper: {} }`
     - `global.stubs` padrão para componentes `Qas*` internos que não devemos montar recursivamente (ex: `QasSkeleton`, `QasTooltip`)
     - Permite override por teste via spread do `options`

**3.** Criar `ui/src/test-utils/index.js` re-exportando tudo:
   - `mountComponent`, constantes de mock, factories de dados

**4.** Atualizar `vitest.config.js`:
   - Adicionar `setupFiles: ['./ui/src/test-utils/setup.js']`
   - **Corrigir** alias `vue-router`: trocar `vue-loader` por mock ou path real
   - Adicionar alias `@test-utils` → `ui/src/test-utils/`

**5.** Criar `ui/src/test-utils/factories.js`:
   - Factory functions para dados comuns: `createRouteStub()`, `createStoreActionStub()`, `createAxiosStub()`

---

## Fase 1 — Componentes Simples (~19 componentes)

Para cada componente, criar arquivo `<Nome>.test.js` na mesma pasta. Nível de cobertura abrangente:

| # | Componente | O que testar |
|---|-----------|-------------|
| 1 | `QasStatus` | Expandir teste existente: prop `color`, `label`, `textColor`, sem props, renderização condicional |
| 2 | `QasBreakline` | Props `split`, `tag`, `text`, slot default, computed `lines`, tags HTML variadas |
| 3 | `QasTooltip` | Prop `text`, delegação para `QasBreakline`, `q-tooltip` presente |
| 4 | `QasBadge` | Props `color`, `label`, `removable`, `multiLine`, `tabindex`, emit `remove`, `QChip`/`QBadge` rendering |
| 5 | `QasBox` | Props `outlined`, `unelevated`, `skeleton`, `spacingX/Y`, `useSpacing`, provide `isBox`, slot default |
| 6 | `QasContainer` | Prop `containerClass`, slots, classes CSS condicionais |
| 7 | `QasLabel` | Props `color`, `count`, `label`, `margin`, `required`, `typography`, helper `addCounterSuffix`, `getRequiredLabel` |
| 8 | `QasErrorMessage` | Prop `message`, renderização condicional quando vazio |
| 9 | `QasEmptyResultText` | Props de texto, slot, renderização condicional |
| 10 | `QasSkeleton` | Props de tipo/tamanho, classes geradas |
| 11 | `QasField` | Props de campo, slots label/default/hint |
| 12 | `QasTip` | Props `icon`, `description`, renderização |
| 13 | `QasDebugger` | Props, renderização JSON/dados debug |
| 14 | `QasPagination` | Props `modelValue`, `max`, emit `update:modelValue`, navegação |
| 15 | `QasRadio` | Props `options`, `modelValue`, emit `update:modelValue` |
| 16 | `QasToggle` | Props `modelValue`, `label`, emit toggle |
| 17 | `QasCheckbox` | Props `modelValue`, `label`, emit toggle |
| 18 | `QasWhatsappLink` | Props `phone`, `text`, link gerado correto, target `_blank` |
| 19 | `QasAvatar` | Expandir teste existente: adicionar testes de acessibilidade, `data-cy` |

**Padrão de teste por componente (simples):**
- `describe('Qas<Nome>')` com sub-grupos:
  - `describe('renderização básica')` — monta sem props, checa `exists()`, classes root
  - `describe('prop <nome>')` — para cada prop: valor default, valor customizado, edge case
  - `describe('slots')` — slot default, slots nomeados
  - `describe('eventos')` — emits verificados
  - `describe('acessibilidade')` — aria attributes, `data-cy` presentes

---

## Fase 2 — Componentes Médios (~27 componentes)

Mesma estrutura, com complexidade adicional de `inject`, composables e interações:

| # | Componente | Dependências a mockar | Foco especial |
|---|-----------|----------------------|---------------|
| 1 | `QasAlert` | Expandir: `useRouter` mock | Props `type`, `closable`, `actions`, slot, emit `close`, variantes de tipo |
| 2 | `QasBtn` | `inject('btnPropsDefaults')`, `inject('isBox')`, `inject('isHeader')`, `useScreen()` | Variantes primary/secondary/tertiary, tooltip, skeleton, disabled, loading |
| 3 | `QasBtnDropdown` | `inject` similar ao QasBtn | Props de dropdown, slots, eventos |
| 4 | `QasCard` | `inject('isBox')`, `inject('isDialog')` | Props, `defineModel('selected')`, slots header/default/actions, `QasActionsMenu` delegação |
| 5 | `QasCardImage` | — | Props `src`, `alt`, fallback, aspectRatio |
| 6 | `QasCopy` | `copyToClipboard` mock | Props `text`, loading state, sucesso/erro do copy |
| 7 | `QasExpansionItem` | `provide('isExpansionItem')` | Props, expand/collapse, slot default/header |
| 8 | `QasActions` | `inject` context pai | Props de ações, slots, disable states |
| 9 | `QasActionsMenu` | — | Props `actions`, renderização dinâmica por tipo |
| 10 | `QasHeader` | `provide('isHeader')` | Props `title`, slots, breadcrumb |
| 11 | `QasPageHeader` | `useRouter` mock | Props, slots, navegação back |
| 12 | `QasGalleryCard` | — | Props `image`, eventos click, hover |
| 13 | `QasDate` | — | Props de data, formatação pt-BR, integração q-date |
| 14 | `QasDateTimeInput` | — | Props, validação, formatação |
| 15 | `QasGridItem` | `inject` contexto grid | Props span, offset, responsividade |
| 16 | `QasListItems` | — | Props `list`, renderização iterativa, slots |
| 17 | `QasTextTruncate` | — | Props `text`, `lines`, classes de truncamento |
| 18 | `QasDrawer` | — | Props `modelValue`, emit open/close, overlay |
| 19 | `QasDialog` | — | Props `modelValue`, emit update, slots |
| 20 | `QasDialogRouter` | `useRouter` mock | Props, navegação ao fechar |
| 21 | `QasToggleVisibility` | — | Props, toggle state, `data-cy` |
| 22 | `QasGrabbable` | — | Drag events, slots |
| 23 | `QasStepper` | `provide('stepper')` | Props `modelValue`, step navigation, slots |
| 24 | `QasInfiniteScroll` | — | Props, emit `load`, scroll simulation |
| 25 | `QasTimeline` | — | Props `items`, renderização, slots |
| 26 | `QasPasswordStrengthChecker` | — | Props `password`, computed score, critérios |
| 27 | `QasProfile` | — | Props `user`, imagem, initials |

---

## Fase 3 — Componentes Complexos (~30+ componentes)

Requerem mocks mais elaborados de `store-adapter`, `vue-router`, `axios`, e composables:

| # | Componente | Complexidade | Estratégia |
|---|-----------|-------------|-----------|
| 1 | `QasFormView` | Options API, store-adapter, router, mixins, 591 linhas | Mock completo de `getAction`, `onBeforeRouteLeave`, testar modos create/edit/replace, submit, cancel, validação |
| 2 | `QasTableGenerator` | Options API, 851 linhas, sub-comp `PvTableGeneratorTd` | Mock store, testar renderização de colunas, sorting, paginação, slots customizados |
| 3 | `QasListView` | Options API, store-adapter | Mock fetch, testar lista, loading, vazio, paginação, filtros |
| 4 | `QasSingleView` | Composition, inject axios/qas | Mock axios, testar loading, dados, erro |
| 5 | `QasFormGenerator` | Composition, complexo | Mock fields config, testar renderização dinâmica de campos |
| 6 | `QasGridGenerator` | Composition | Testar grid layout dinâmico |
| 7 | `QasSelect` | Options API, complexo | Mock opções, search, lazy-loading, múltipla seleção |
| 8 | `QasInput` | Options API | Testar tipos, masks, validação, formatação |
| 9 | `QasNumericInput` | Options API | Testar formatação numérica, limites, locale pt-BR |
| 10 | `QasPasswordInput` | Options API | Testar toggle visibility, strength checker |
| 11 | `QasNestedFields` | Options API | Testar campos dinâmicos add/remove |
| 12 | `QasFilters` | Options API, store-adapter | Mock filtros, aplicação e reset |
| 13 | `QasReportsFilters` | Composition, store-adapter | Mock store, filtros relatórios |
| 14 | `QasChartView` | Options API, store-adapter | Mock dados e renderização chart |
| 15 | `QasSortable` | Options API, store-adapter | Mock reordenação, drag-and-drop |
| 16 | `QasLayout` | Composition, 3 sub-comps Pv | Testar slots, notificações drawer, overlay |
| 17 | `QasAppMenu` | Composition, sub-comp Pv | Testar menu items, active state, dropdown |
| 18 | `QasAppBar` | Composition, router | Testar search, user menu, slots |
| 19 | `QasAppUser` | Composition, router | Testar dados do user, menu |
| 20 | `QasGallery` | Composition, 2 sub-comps Pv | Testar grid de imagens, carousel, delete |
| 21 | `QasUploader` | Options API, sub-comp Pv | Mock upload, progress, validação arquivo |
| 22 | `QasTransfer` | Options API | Testar transferência entre listas |
| 23 | `QasWelcome` | Options API, sub-comp Pv | Testar atalhos, animação |
| 24 | `QasTreeGenerator` | Options API | Testar árvore, expand/collapse, seleção |
| 25 | `QasBoardGenerator` | Composition | Testar colunas dinâmicas, drag-and-drop |
| 26 | `QasSelectList` | Options API, sub-comp Pv | Testar lista com seleção, search |
| 27 | `QasSelectListDialog` | Composition | Testar dialog + select list |
| 28 | `QasSelectFilter` | Composition, router | Testar filtros com vue-router query |
| 29 | `QasSearchBox` | Options API | Testar busca, debounce, resultados |
| 30 | `QasSearchInput` | Options API | Testar input de busca, clear, debounce |
| 31 | `QasOptionGroup` | Options API | Testar group de opções, seleção |
| 32 | `QasPdfViewer` | Composition | Testar carregamento PDF, paginação |
| 33 | `QasStepperFormView` | Composition | Testar stepper + form, navegação steps |
| 34 | `QasTabsGenerator` | Composition, router | Testar tabs dinâmicas, router-tabs |
| 35 | `QasMap` | Composition | Testar props de mapa (sem renderização real) |
| 36 | `QasSignaturePad` | Options API | Testar canvas, clear, save |
| 37 | `QasSignatureUploader` | Options API | Testar upload de assinatura |
| 38 | `QasResizer` | Options API | Testar resize handler, dimensões |
| 39 | `QasLazyLoadingComponents` | Composition | Testar carregamento lazy, placeholder |

---

## Verificação

- **Rodar todos os testes:** `npm run test` na raiz
- **Cobertura:** Adicionar script `"test:coverage": "vitest run --coverage"` ao `package.json` e verificar que atinge >80% dos componentes públicos
- **Lint:** `npm run lint` para garantir que os arquivos de teste passam no ESLint
- **CI:** Cada fase pode ser mergeada separadamente — testes não devem quebrar o build
- **Teste incremental por fase:** `npx vitest run ui/src/components/<componente>/` para validar componente individual

---

## Decisões

- **Incremental por fases:** Fase 0 (infra) → Fase 1 (simples) → Fase 2 (médios) → Fase 3 (complexos) — cada fase pode ser um PR separado
- **Apenas `Qas*` públicos:** Sub-componentes `Pv*` são cobertos indiretamente via teste do componente pai
- **Cobertura abrangente:** Todas as props, slots, eventos, estados condicionais, edge cases e `data-cy`
- **Descrições em pt-BR:** Alinhado com o padrão do teste mais completo existente (`QasAvatar`)
- **Corrigir alias `vue-router`:** O alias atual aponta para `vue-loader` — será corrigido na Fase 0
- **Sem snapshot tests:** Somente testes comportamentais (conforme skill `vue-testing-best-practices`)
- **`mountComponent` helper:** Centraliza `provide` defaults para evitar repetição em cada teste
# Plano: Testes Unitários para Todos os Componentes Asteroid

**TL;DR** — Criar testes unitários abrangentes para os ~83 componentes públicos `Qas*`, seguindo uma abordagem incremental em 4 fases: (0) infraestrutura compartilhada de testes, (1) ~19 componentes simples, (2) ~27 componentes médios, (3) ~30+ componentes complexos. A infraestrutura inclui setup file global, mocks reutilizáveis para `vue-router`, `store-adapter`, `quasar` APIs e um helper `mountWithDefaults()` que configura `provide`/`global` automaticamente. Os 3 testes existentes (`QasAlert`, `QasAvatar`, `QasStatus`) serão expandidos para o nível abrangente. Cada teste cobre: renderização, todas as props, slots, eventos, estados condicionais, edge cases e atributos `data-cy`.

---

## Fase 0 — Infraestrutura Compartilhada

**1.** Criar `ui/src/test-utils/setup.js` como `setupFiles` global:
   - Mock de `vue-router`: exportar `useRouter` e `useRoute` como `vi.fn()` retornando objetos reativos (`push`, `replace`, `currentRoute`, `params`, `query`)
   - Mock de `@bildvitta/store-adapter`: exportar `getAction` e `getState` como `vi.fn()`
   - Mock de APIs Quasar: `LocalStorage`, `SessionStorage`, `Notify`, `Screen`, `Platform`, `copyToClipboard`
   - Stub global de `onBeforeRouteLeave` como no-op

**2.** Criar `ui/src/test-utils/mount-helper.js`:
   - Exportar `mountComponent(component, options)` que faz merge de:
     - `global.provide` padrão: `{ isBox: false, isDialog: false, isHeader: false, isTableGenerator: false, isFormGenerator: false, isExpansionItem: false, isListView: false, axios: vi.fn(), qas: {}, btnPropsDefaults: {}, stepper: {} }`
     - `global.stubs` padrão para componentes `Qas*` internos que não devemos montar recursivamente (ex: `QasSkeleton`, `QasTooltip`)
     - Permite override por teste via spread do `options`

**3.** Criar `ui/src/test-utils/index.js` re-exportando tudo:
   - `mountComponent`, constantes de mock, factories de dados

**4.** Atualizar `vitest.config.js`:
   - Adicionar `setupFiles: ['./ui/src/test-utils/setup.js']`
   - **Corrigir** alias `vue-router`: trocar `vue-loader` por mock ou path real
   - Adicionar alias `@test-utils` → `ui/src/test-utils/`

**5.** Criar `ui/src/test-utils/factories.js`:
   - Factory functions para dados comuns: `createRouteStub()`, `createStoreActionStub()`, `createAxiosStub()`

---

## Fase 1 — Componentes Simples (~19 componentes)

Para cada componente, criar arquivo `<Nome>.test.js` na mesma pasta. Nível de cobertura abrangente:

| # | Componente | O que testar |
|---|-----------|-------------|
| 1 | `QasStatus` | Expandir teste existente: prop `color`, `label`, `textColor`, sem props, renderização condicional |
| 2 | `QasBreakline` | Props `split`, `tag`, `text`, slot default, computed `lines`, tags HTML variadas |
| 3 | `QasTooltip` | Prop `text`, delegação para `QasBreakline`, `q-tooltip` presente |
| 4 | `QasBadge` | Props `color`, `label`, `removable`, `multiLine`, `tabindex`, emit `remove`, `QChip`/`QBadge` rendering |
| 5 | `QasBox` | Props `outlined`, `unelevated`, `skeleton`, `spacingX/Y`, `useSpacing`, provide `isBox`, slot default |
| 6 | `QasContainer` | Prop `containerClass`, slots, classes CSS condicionais |
| 7 | `QasLabel` | Props `color`, `count`, `label`, `margin`, `required`, `typography`, helper `addCounterSuffix`, `getRequiredLabel` |
| 8 | `QasErrorMessage` | Prop `message`, renderização condicional quando vazio |
| 9 | `QasEmptyResultText` | Props de texto, slot, renderização condicional |
| 10 | `QasSkeleton` | Props de tipo/tamanho, classes geradas |
| 11 | `QasField` | Props de campo, slots label/default/hint |
| 12 | `QasTip` | Props `icon`, `description`, renderização |
| 13 | `QasDebugger` | Props, renderização JSON/dados debug |
| 14 | `QasPagination` | Props `modelValue`, `max`, emit `update:modelValue`, navegação |
| 15 | `QasRadio` | Props `options`, `modelValue`, emit `update:modelValue` |
| 16 | `QasToggle` | Props `modelValue`, `label`, emit toggle |
| 17 | `QasCheckbox` | Props `modelValue`, `label`, emit toggle |
| 18 | `QasWhatsappLink` | Props `phone`, `text`, link gerado correto, target `_blank` |
| 19 | `QasAvatar` | Expandir teste existente: adicionar testes de acessibilidade, `data-cy` |

**Padrão de teste por componente (simples):**
- `describe('Qas<Nome>')` com sub-grupos:
  - `describe('renderização básica')` — monta sem props, checa `exists()`, classes root
  - `describe('prop <nome>')` — para cada prop: valor default, valor customizado, edge case
  - `describe('slots')` — slot default, slots nomeados
  - `describe('eventos')` — emits verificados
  - `describe('acessibilidade')` — aria attributes, `data-cy` presentes

---

## Fase 2 — Componentes Médios (~27 componentes)

Mesma estrutura, com complexidade adicional de `inject`, composables e interações:

| # | Componente | Dependências a mockar | Foco especial |
|---|-----------|----------------------|---------------|
| 1 | `QasAlert` | Expandir: `useRouter` mock | Props `type`, `closable`, `actions`, slot, emit `close`, variantes de tipo |
| 2 | `QasBtn` | `inject('btnPropsDefaults')`, `inject('isBox')`, `inject('isHeader')`, `useScreen()` | Variantes primary/secondary/tertiary, tooltip, skeleton, disabled, loading |
| 3 | `QasBtnDropdown` | `inject` similar ao QasBtn | Props de dropdown, slots, eventos |
| 4 | `QasCard` | `inject('isBox')`, `inject('isDialog')` | Props, `defineModel('selected')`, slots header/default/actions, `QasActionsMenu` delegação |
| 5 | `QasCardImage` | — | Props `src`, `alt`, fallback, aspectRatio |
| 6 | `QasCopy` | `copyToClipboard` mock | Props `text`, loading state, sucesso/erro do copy |
| 7 | `QasExpansionItem` | `provide('isExpansionItem')` | Props, expand/collapse, slot default/header |
| 8 | `QasActions` | `inject` context pai | Props de ações, slots, disable states |
| 9 | `QasActionsMenu` | — | Props `actions`, renderização dinâmica por tipo |
| 10 | `QasHeader` | `provide('isHeader')` | Props `title`, slots, breadcrumb |
| 11 | `QasPageHeader` | `useRouter` mock | Props, slots, navegação back |
| 12 | `QasGalleryCard` | — | Props `image`, eventos click, hover |
| 13 | `QasDate` | — | Props de data, formatação pt-BR, integração q-date |
| 14 | `QasDateTimeInput` | — | Props, validação, formatação |
| 15 | `QasGridItem` | `inject` contexto grid | Props span, offset, responsividade |
| 16 | `QasListItems` | — | Props `list`, renderização iterativa, slots |
| 17 | `QasTextTruncate` | — | Props `text`, `lines`, classes de truncamento |
| 18 | `QasDrawer` | — | Props `modelValue`, emit open/close, overlay |
| 19 | `QasDialog` | — | Props `modelValue`, emit update, slots |
| 20 | `QasDialogRouter` | `useRouter` mock | Props, navegação ao fechar |
| 21 | `QasToggleVisibility` | — | Props, toggle state, `data-cy` |
| 22 | `QasGrabbable` | — | Drag events, slots |
| 23 | `QasStepper` | `provide('stepper')` | Props `modelValue`, step navigation, slots |
| 24 | `QasInfiniteScroll` | — | Props, emit `load`, scroll simulation |
| 25 | `QasTimeline` | — | Props `items`, renderização, slots |
| 26 | `QasPasswordStrengthChecker` | — | Props `password`, computed score, critérios |
| 27 | `QasProfile` | — | Props `user`, imagem, initials |

---

## Fase 3 — Componentes Complexos (~30+ componentes)

Requerem mocks mais elaborados de `store-adapter`, `vue-router`, `axios`, e composables:

| # | Componente | Complexidade | Estratégia |
|---|-----------|-------------|-----------|
| 1 | `QasFormView` | Options API, store-adapter, router, mixins, 591 linhas | Mock completo de `getAction`, `onBeforeRouteLeave`, testar modos create/edit/replace, submit, cancel, validação |
| 2 | `QasTableGenerator` | Options API, 851 linhas, sub-comp `PvTableGeneratorTd` | Mock store, testar renderização de colunas, sorting, paginação, slots customizados |
| 3 | `QasListView` | Options API, store-adapter | Mock fetch, testar lista, loading, vazio, paginação, filtros |
| 4 | `QasSingleView` | Composition, inject axios/qas | Mock axios, testar loading, dados, erro |
| 5 | `QasFormGenerator` | Composition, complexo | Mock fields config, testar renderização dinâmica de campos |
| 6 | `QasGridGenerator` | Composition | Testar grid layout dinâmico |
| 7 | `QasSelect` | Options API, complexo | Mock opções, search, lazy-loading, múltipla seleção |
| 8 | `QasInput` | Options API | Testar tipos, masks, validação, formatação |
| 9 | `QasNumericInput` | Options API | Testar formatação numérica, limites, locale pt-BR |
| 10 | `QasPasswordInput` | Options API | Testar toggle visibility, strength checker |
| 11 | `QasNestedFields` | Options API | Testar campos dinâmicos add/remove |
| 12 | `QasFilters` | Options API, store-adapter | Mock filtros, aplicação e reset |
| 13 | `QasReportsFilters` | Composition, store-adapter | Mock store, filtros relatórios |
| 14 | `QasChartView` | Options API, store-adapter | Mock dados e renderização chart |
| 15 | `QasSortable` | Options API, store-adapter | Mock reordenação, drag-and-drop |
| 16 | `QasLayout` | Composition, 3 sub-comps Pv | Testar slots, notificações drawer, overlay |
| 17 | `QasAppMenu` | Composition, sub-comp Pv | Testar menu items, active state, dropdown |
| 18 | `QasAppBar` | Composition, router | Testar search, user menu, slots |
| 19 | `QasAppUser` | Composition, router | Testar dados do user, menu |
| 20 | `QasGallery` | Composition, 2 sub-comps Pv | Testar grid de imagens, carousel, delete |
| 21 | `QasUploader` | Options API, sub-comp Pv | Mock upload, progress, validação arquivo |
| 22 | `QasTransfer` | Options API | Testar transferência entre listas |
| 23 | `QasWelcome` | Options API, sub-comp Pv | Testar atalhos, animação |
| 24 | `QasTreeGenerator` | Options API | Testar árvore, expand/collapse, seleção |
| 25 | `QasBoardGenerator` | Composition | Testar colunas dinâmicas, drag-and-drop |
| 26 | `QasSelectList` | Options API, sub-comp Pv | Testar lista com seleção, search |
| 27 | `QasSelectListDialog` | Composition | Testar dialog + select list |
| 28 | `QasSelectFilter` | Composition, router | Testar filtros com vue-router query |
| 29 | `QasSearchBox` | Options API | Testar busca, debounce, resultados |
| 30 | `QasSearchInput` | Options API | Testar input de busca, clear, debounce |
| 31 | `QasOptionGroup` | Options API | Testar group de opções, seleção |
| 32 | `QasPdfViewer` | Composition | Testar carregamento PDF, paginação |
| 33 | `QasStepperFormView` | Composition | Testar stepper + form, navegação steps |
| 34 | `QasTabsGenerator` | Composition, router | Testar tabs dinâmicas, router-tabs |
| 35 | `QasMap` | Composition | Testar props de mapa (sem renderização real) |
| 36 | `QasSignaturePad` | Options API | Testar canvas, clear, save |
| 37 | `QasSignatureUploader` | Options API | Testar upload de assinatura |
| 38 | `QasResizer` | Options API | Testar resize handler, dimensões |
| 39 | `QasLazyLoadingComponents` | Composition | Testar carregamento lazy, placeholder |

---

## Verificação

- **Rodar todos os testes:** `npm run test` na raiz
- **Cobertura:** Adicionar script `"test:coverage": "vitest run --coverage"` ao `package.json` e verificar que atinge >80% dos componentes públicos
- **Lint:** `npm run lint` para garantir que os arquivos de teste passam no ESLint
- **CI:** Cada fase pode ser mergeada separadamente — testes não devem quebrar o build
- **Teste incremental por fase:** `npx vitest run ui/src/components/<componente>/` para validar componente individual

---

## Decisões

- **Incremental por fases:** Fase 0 (infra) → Fase 1 (simples) → Fase 2 (médios) → Fase 3 (complexos) — cada fase pode ser um PR separado
- **Apenas `Qas*` públicos:** Sub-componentes `Pv*` são cobertos indiretamente via teste do componente pai
- **Cobertura abrangente:** Todas as props, slots, eventos, estados condicionais, edge cases e `data-cy`
- **Descrições em pt-BR:** Alinhado com o padrão do teste mais completo existente (`QasAvatar`)
- **Corrigir alias `vue-router`:** O alias atual aponta para `vue-loader` — será corrigido na Fase 0
- **Sem snapshot tests:** Somente testes comportamentais (conforme skill `vue-testing-best-practices`)
- **`mountComponent` helper:** Centraliza `provide` defaults para evitar repetição em cada teste
