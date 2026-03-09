# Tasks: Dark Mode v1

**Input**: Design documents de `/specs/001-dark-mode-v1/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/dark-mode-api.md ✅, quickstart.md ✅

**Testes**: Não incluídos — conforme solicitação explícita do usuário.

**Organização**: Tasks agrupadas por user story (US-001, US-002) para implementação e validação independente. Fase de auditoria agrupada por categoria (A, B, C) conforme research.md.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story associada (US1 = US-001, US2 = US-002)
- Caminhos exatos dos arquivos incluídos nas descrições

---

## Phase 1: Setup

**Propósito**: Preparação inicial do projeto e verificação de estrutura

- [ ] T001 Verificar que a branch `feature/dark-mode-v1` está atualizada com a `main` e sem conflitos

---

## Phase 2: Foundational (Blocking Prerequisites)

**Propósito**: Infraestrutura core do dark mode — CSS custom properties, composables, enum, boot file e config global. DEVE ser completada antes de qualquer user story.

**⚠️ CRÍTICO**: Nenhuma task de user story pode começar antes desta fase estar completa.

- [ ] T002 [P] Criar enum `DarkColorMap` com mapeamento light → dark em `ui/src/enums/DarkColorMap.js`
- [ ] T003 [P] Adicionar CSS custom properties semânticas em `:root` (light) e overrides em `.body--dark` em `ui/src/index.scss`
- [ ] T004 [P] Criar composable `useDarkMode` com toggle, persistência localStorage e integração `$q.dark` em `ui/src/composables/use-dark-mode.js`
- [ ] T005 Criar composable `useThemeColor` com resolução de cor via `DarkColorMap` e `$q.dark.isActive` em `ui/src/composables/use-theme-color.js`
- [ ] T006 Exportar `useDarkMode` e `useThemeColor` em `ui/src/composables/index.js`
- [ ] T007 Exportar novos composables em `ui/src/asteroid.js`
- [ ] T008 [P] Adicionar `useDarkMode: false` em `framework.featureToggle` em `app-extension/src/defaults/default-asteroid-config.js`
- [ ] T009 [P] Criar boot file `dark-mode.js` com inicialização do tema antes do mount em `app-extension/src/boot/dark-mode.js`
- [ ] T010 Registrar boot `dark-mode` na lista de boots em `app-extension/src/index.js`

**Checkpoint**: Infraestrutura completa — composables exportados, CSS custom properties ativas, boot file registrado, config global disponível.

---

## Phase 3: US-001 — Toggle de Tema pelo Usuário (Priority: P1) 🎯 MVP

**Goal**: Usuário pode alternar entre modo light e dark com 1 clique no `QasAppBar`. Todos os componentes respondem corretamente ao tema selecionado.

**Teste independente**: Habilitar `featureToggle.useDarkMode: true`, verificar que o toggle aparece no `QasAppBar`, clicar e confirmar que toda a UI muda para dark mode. Recarregar a página e confirmar que a preferência persistiu.

### Toggle no QasAppBar

- [ ] T011 [US1] Adicionar prop `use-dark-mode` (Boolean, default undefined) e renderizar toggle (ícone sol/lua) com `useDarkMode().toggle()` em `ui/src/components/app-bar/QasAppBar.vue`
- [ ] T012 [US1] Documentar nova prop `use-dark-mode` com descrição e exemplos em `ui/src/components/app-bar/QasAppBar.yml`

### Auditoria de Componentes — Categoria A (CSS only, ~11 listados + ~46 restantes)

> Componentes que usam apenas classes utilitárias. O override global em `.body--dark` (T003) resolve automaticamente. Necessária apenas verificação visual.

- [ ] T013 [P] [US1] Auditar e verificar dark mode nos componentes Categoria A: `QasHeader`, `QasTabsGenerator`, `QasTimeline`, `QasSelectListDialog`, `QasEmptyResultText`, `QasAppUser` em `ui/src/components/`
- [ ] T014 [P] [US1] Auditar e verificar dark mode nos componentes Categoria A: `QasSelect`, `QasListView`, `QasFormView`, `QasDrawer`, `QasFilters` em `ui/src/components/`
- [ ] T015 [P] [US1] Auditar os ~46 componentes restantes sem cores hardcoded identificadas para verificação visual de dark mode em `ui/src/components/`

### Auditoria de Componentes — Categoria B (useThemeColor, ~15 listados)

> Componentes que passam cores via props para sub-componentes Quasar. Precisam usar `useThemeColor` para resolver cor dinâmica no dark mode.

- [ ] T016 [P] [US1] Adaptar `QasAppMenu` com `useThemeColor` para cores `grey-10`, `grey-8` em `ui/src/components/app-menu/QasAppMenu.vue`
- [ ] T017 [P] [US1] Adaptar `QasDialog` com `useThemeColor` para cores `grey-10`, `grey-8` em `ui/src/components/dialog/QasDialog.vue`
- [ ] T018 [P] [US1] Adaptar `QasSearchInput` com `useThemeColor` para cores `grey-10`, `grey-8` em `ui/src/components/search-input/QasSearchInput.vue`
- [ ] T019 [P] [US1] Adaptar `QasCard` com `useThemeColor` para cores `grey-10`, `grey-8` e `expand-icon-class` em `ui/src/components/card/QasCard.vue`
- [ ] T020 [P] [US1] Adaptar `QasPageHeader` com `useThemeColor` para `separator-color` e textos em `ui/src/components/page-header/QasPageHeader.vue`
- [ ] T021 [P] [US1] Adaptar `QasExpansionItem` com `useThemeColor` para cor `grey-10` em `ui/src/components/expansion-item/QasExpansionItem.vue`
- [ ] T022 [P] [US1] Adaptar `QasAlert` com `useThemeColor` para cores `grey-10`, `grey-8` em `ui/src/components/alert/QasAlert.vue`
- [ ] T023 [P] [US1] Adaptar `QasGalleryCard` com `useThemeColor` para cores `grey-10`, `grey-6` e backgrounds em `ui/src/components/gallery-card/QasGalleryCard.vue`
- [ ] T024 [P] [US1] Adaptar `QasSearchBox` com `useThemeColor` para cor `grey` em `ui/src/components/search-box/QasSearchBox.vue`
- [ ] T025 [P] [US1] Adaptar `QasReportsFilters` com `useThemeColor` para cor `grey` em `ui/src/components/reports-filters/QasReportsFilters.vue`
- [ ] T026 [P] [US1] Adaptar `QasSingleView` com `useThemeColor` para cor `grey` em `ui/src/components/single-view/QasSingleView.vue`
- [ ] T027 [P] [US1] Adaptar `QasSelectList` com `useThemeColor` para cor `grey-10` em `ui/src/components/select-list/QasSelectList.vue`
- [ ] T028 [P] [US1] Adaptar `QasListItems` com `useThemeColor` para cor `grey-10` em `ui/src/components/list-items/QasListItems.vue`
- [ ] T029 [P] [US1] Adaptar `QasBoardGenerator` com `useThemeColor` para cor `grey-4` em `ui/src/components/board-generator/QasBoardGenerator.vue`

### Auditoria de Componentes — Categoria C (estilos scoped, ~4 listados)

> Componentes com estilos SCSS scoped que referenciam cores hardcoded. Precisam de override `.body--dark` no scoped style ou migração para CSS custom properties.

- [ ] T030 [P] [US1] Adaptar `QasTooltip` com override `.body--dark` no scoped style para `text-grey-10` e `bg-grey-10` em `ui/src/components/tooltip/QasTooltip.vue`
- [ ] T031 [P] [US1] Adaptar `QasPdfViewer` com override `.body--dark` no scoped style para `grey`, `grey-10`, `grey-4` em `ui/src/components/pdf-viewer/QasPdfViewer.vue`
- [ ] T032 [P] [US1] Adaptar `QasDebugger` com override `.body--dark` no scoped style para `bg-grey-3` em `ui/src/components/debugger/QasDebugger.vue`
- [ ] T033 [P] [US1] Adaptar `QasResizer` com override `.body--dark` no scoped style para `grey-7`, `bg-grey-2` em `ui/src/components/resizer/QasResizer.vue`

**Checkpoint**: US-001 completa — toggle funcional no QasAppBar, todos os 87 componentes auditados e adaptados. Dark mode visualmente correto em toda a aplicação.

---

## Phase 4: US-002 — Suporte ao Modo Dark para Desenvolvedores (Priority: P2)

**Goal**: Desenvolvedores têm documentação completa, exemplos interativos e API documentada para trabalhar com dark mode nas suas aplicações.

**Teste independente**: Desenvolvedor consegue seguir a documentação para habilitar dark mode, usar `useDarkMode` e `useThemeColor` programaticamente, e aplicar CSS custom properties nos seus componentes.

- [ ] T034 [P] [US2] Criar página de documentação conceitual do dark mode (variáveis CSS, como habilitar, boas práticas) em `docs/src/pages/dark-mode.md`
- [ ] T035 [P] [US2] Criar exemplos interativos de dark mode (toggle, variáveis CSS, uso programático) em `docs/src/examples/DarkMode/`
- [ ] T036 [US2] Adicionar entrada "Dark Mode" no menu de navegação da documentação em `docs/src/assets/menu.js`
- [ ] T037 [P] [US2] Criar documentação do composable `useDarkMode` (API, exemplos, edge cases) em `docs/src/pages/`
- [ ] T038 [P] [US2] Criar documentação do composable `useThemeColor` (API, exemplos, mapa de cores) em `docs/src/pages/`

**Checkpoint**: US-002 completa — documentação publicada, exemplos interativos funcionais, API dos composables documentada.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Propósito**: Finalização, validação e registro das mudanças

- [ ] T039 Atualizar `CHANGELOG.md` com todas as mudanças de dark mode em `ui/` e `app-extension/`
- [ ] T040 Validar cenários do `quickstart.md` contra a implementação real em `specs/001-dark-mode-v1/quickstart.md`
- [ ] T041 Revisão visual final — verificar zero regressão no modo light (FR-012) em todos os componentes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente
- **Foundational (Phase 2)**: Depende da Phase 1 — **BLOQUEIA** todas as user stories
- **US-001 (Phase 3)**: Depende da Phase 2 completa
- **US-002 (Phase 4)**: Depende da Phase 2 completa (pode rodar em paralelo com Phase 3)
- **Polish (Phase 5)**: Depende de Phase 3 e Phase 4 completas

### User Story Dependencies

- **US-001 (P1)**: Pode iniciar após Phase 2. Sem dependência de US-002.
- **US-002 (P2)**: Pode iniciar após Phase 2. Independente de US-001 (mas a documentação é mais útil com US-001 completa).

### Dentro de cada Phase

**Phase 2 — Foundational**:
- T002 (DarkColorMap), T003 (CSS), T004 (useDarkMode), T008 (config), T009 (boot) → todos [P], podem rodar em paralelo
- T005 (useThemeColor) → depende de T002 (DarkColorMap)
- T006 (export composables/index.js) → depende de T004 e T005
- T007 (export asteroid.js) → depende de T006
- T010 (registrar boot) → depende de T009

**Phase 3 — US-001**:
- T011 (QasAppBar toggle) e T012 (QasAppBar.yml) → sequenciais
- T013-T015 (Categoria A) → todas [P] entre si
- T016-T029 (Categoria B) → todas [P] entre si (arquivos diferentes)
- T030-T033 (Categoria C) → todas [P] entre si (arquivos diferentes)
- Categorias A, B e C podem rodar em paralelo entre si

**Phase 4 — US-002**:
- T034, T035, T037, T038 → todas [P] entre si
- T036 (menu) → após T034 (página criada)

### Parallel Opportunities

- **Phase 2**: 5 tasks paralelas (T002, T003, T004, T008, T009)
- **Phase 3**: Até 21 tasks paralelas (todas as auditorias por categoria)
- **Phase 4**: Até 4 tasks paralelas (T034, T035, T037, T038)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Lançar em paralelo (sem dependências entre si):
T002: Criar DarkColorMap em ui/src/enums/DarkColorMap.js
T003: CSS custom properties em ui/src/index.scss
T004: useDarkMode em ui/src/composables/use-dark-mode.js
T008: Config useDarkMode em app-extension/src/defaults/default-asteroid-config.js
T009: Boot dark-mode.js em app-extension/src/boot/dark-mode.js

# Após T002 completar:
T005: useThemeColor em ui/src/composables/use-theme-color.js

# Após T004 e T005 completarem:
T006: Export em ui/src/composables/index.js

# Após T006 completar:
T007: Export em ui/src/asteroid.js

# Após T009 completar:
T010: Registrar boot em app-extension/src/index.js
```

## Parallel Example: Phase 3 — Auditoria Categoria B

```bash
# Todas podem rodar em paralelo (arquivos diferentes):
T016: QasAppMenu + useThemeColor
T017: QasDialog + useThemeColor
T018: QasSearchInput + useThemeColor
T019: QasCard + useThemeColor
T020: QasPageHeader + useThemeColor
T021: QasExpansionItem + useThemeColor
T022: QasAlert + useThemeColor
T023: QasGalleryCard + useThemeColor
T024: QasSearchBox + useThemeColor
T025: QasReportsFilters + useThemeColor
T026: QasSingleView + useThemeColor
T027: QasSelectList + useThemeColor
T028: QasListItems + useThemeColor
T029: QasBoardGenerator + useThemeColor
```

---

## Implementation Strategy

### MVP First (US-001 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia tudo)
3. Completar Phase 3: US-001 (toggle + auditoria)
4. **PARAR E VALIDAR**: Testar toggle no QasAppBar, verificar todos os componentes em dark mode
5. Deploy/demo se pronto

### Entrega Incremental

1. Setup + Foundational → Infraestrutura pronta
2. US-001 → Toggle funcional + componentes adaptados → Deploy/Demo (MVP!)
3. US-002 → Documentação completa → Deploy/Demo
4. Polish → CHANGELOG, validação final → Release

### Estratégia de Paralelismo

Com múltiplos desenvolvedores após Phase 2:

1. Equipe completa Setup + Foundational juntos
2. Após Foundational:
   - **Dev A**: QasAppBar toggle (T011-T012) + Categoria C (T030-T033)
   - **Dev B**: Categoria B — grupo 1 (T016-T022)
   - **Dev C**: Categoria B — grupo 2 (T023-T029) + Categoria A (T013-T015)
   - **Dev D**: US-002 — Documentação (T034-T038)
3. Stories completam e integram independentemente

---

## Resumo

| Métrica | Valor |
|---|---|
| **Total de tasks** | 41 |
| **Tasks Phase 1 (Setup)** | 1 |
| **Tasks Phase 2 (Foundational)** | 9 |
| **Tasks Phase 3 — US-001** | 23 |
| **Tasks Phase 4 — US-002** | 5 |
| **Tasks Phase 5 (Polish)** | 3 |
| **Tasks paralelizáveis [P]** | 30 |
| **MVP scope** | Phase 1 + 2 + 3 (33 tasks) |
