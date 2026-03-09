# Implementation Plan: Dark Mode v1

**Branch**: `feature/dark-mode-v1` | **Date**: 09/03/2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification de `/specs/001-dark-mode-v1/spec.md`

---

## Summary

Adicionar suporte completo a dark mode no Asteroid Design System, utilizando `$q.dark` do Quasar como base. A implementação inclui: CSS custom properties semânticas em `ui/src/index.scss` com redefinição em `.body--dark`, composables `useDarkMode` e `useThemeColor` para gerenciamento de tema e resolução de cores, boot file na app-extension para inicialização sem FOUT, toggle no `QasAppBar` controlável via prop e config global, auditoria e adaptação dos 87 componentes existentes, e atualização da documentação.

---

## Technical Context

**Language/Version**: JavaScript (ES2020+), Vue 3 (Composition API para código novo)
**Primary Dependencies**: Quasar Framework v2.18.1, Vue 3, SCSS/Sass
**Storage**: `localStorage` (client-side, key `qas-theme-preference`)
**Testing**: Vitest + jsdom
**Target Platform**: Web (browsers modernos, Quasar SPA/PWA)
**Project Type**: Design System Library (monorepo com ui/, app-extension/, docs/)
**Performance Goals**: Troca de tema instantânea, zero FOUT (NFR-001)
**Constraints**: Sem aumento significativo de bundle size (NFR-002). Zero regressão visual no modo light (FR-012).
**Scale/Scope**: 87 componentes para auditar, ~7 novos arquivos, ~15 arquivos modificados

---

## Constitution Check

*GATE: Deve passar antes do Phase 0. Re-verificado após Phase 1.*

| Princípio | Status | Detalhes |
|---|---|---|
| **I. Design System First** | ✅ PASS | Dark mode é feature do design system, aplicada globalmente a todos componentes. Token de cores centralizado em `index.scss`. |
| **II. Monorepo Modular** | ✅ PASS | Mudanças respeita fronteiras: `ui/` (core), `app-extension/` (boot + config), `docs/` (documentação). |
| **III. API-Driven** | ✅ PASS | Config via `asteroid.config.js` com default sensato (`useDarkMode: false`). |
| **IV. Quasar Integration** | ✅ PASS | Usa API nativa `$q.dark` do Quasar. Classes `.body--dark`/`.body--light` do Quasar. |
| **V. Composition API** | ✅ PASS | Novos composables (`useDarkMode`, `useThemeColor`) em Composition API. |
| **VI. Versionamento Semântico** | ✅ PASS | Feature nova = minor version bump. CHANGELOG em pt-BR. |
| **VII. Documentação** | ✅ PASS | Plano inclui atualização de YML, docs e exemplos. |

**Princípios invioláveis verificados**:
- ✅ Prefixo `Qas*` mantido
- ✅ Compatível com Quasar v2 e Vue 3
- ✅ Transformação camelCase ↔ snake_case não afetada
- ✅ SemVer com pre-release (alpha na branch feature/*)
- ✅ Documentação obrigatória planejada

**Re-verificação pós-Phase 1**: ✅ PASS — Design respeita todos os princípios. Nenhuma violação detectada.

---

## Open Questions — Decisões

Todas as Open Questions da spec foram resolvidas durante o Phase 0 (research). Detalhes completos em [research.md](research.md).

| OQ | Decisão | Resumo |
|---|---|---|
| **OQ-001** | Opção B — Mapeamento interno automático | Composable `useThemeColor` resolve cores via `DARK_COLOR_MAP`. Zero breaking change. |
| **OQ-002** | Override via `.body--dark` | Classes como `text-grey-10` são redefinidas globalmente em `.body--dark`. Zero mudança em templates. |
| **OQ-003** | Sim, 3 mudanças pontuais | Boot file `dark-mode.js`, config `useDarkMode` no `default-asteroid-config.js`, registro em `index.js`. |
| **OQ-004** | Ambos, com hierarquia | Config global `featureToggle.useDarkMode` + prop local `use-dark-mode` no QasAppBar. Prop > config. |

---

## Project Structure

### Documentação (esta feature)

```text
specs/001-dark-mode-v1/
├── plan.md                          # Este arquivo
├── spec.md                          # Especificação da feature
├── research.md                      # Phase 0 — pesquisa e decisões
├── data-model.md                    # Phase 1 — modelo de dados
├── quickstart.md                    # Phase 1 — guia rápido de uso
├── contracts/
│   └── dark-mode-api.md             # Phase 1 — contratos de API
└── tasks.md                         # Phase 2 — tarefas (gerado pelo /speckit.tasks)
```

### Código-fonte (mudanças no repositório)

```text
ui/src/
├── index.scss                       # MODIFICADO — CSS custom properties dark + overrides .body--dark
├── asteroid.js                      # MODIFICADO — export dos novos composables
├── composables/
│   ├── index.js                     # MODIFICADO — export useDarkMode, useThemeColor
│   ├── use-dark-mode.js             # NOVO — composable de gerenciamento de tema
│   └── use-theme-color.js           # NOVO — composable de resolução de cores
├── enums/
│   └── DarkColorMap.js              # NOVO — mapa de cores light → dark
├── components/
│   └── app-bar/
│       ├── QasAppBar.vue            # MODIFICADO — toggle de dark mode + prop use-dark-mode
│       └── QasAppBar.yml            # MODIFICADO — documentação da nova prop
│   └── [~87 componentes]            # AUDITADOS — adaptação conforme categoria A/B/C
└── helpers/
    └── colors.js                    # POSSIVELMENTE MODIFICADO — helpers adicionais se necessário

app-extension/src/
├── index.js                         # MODIFICADO — registro do boot dark-mode
├── boot/
│   └── dark-mode.js                 # NOVO — inicialização do dark mode no boot
└── defaults/
    └── default-asteroid-config.js   # MODIFICADO — useDarkMode no featureToggle

docs/src/
├── pages/                           # MODIFICADO — páginas de documentação dark mode
├── examples/                        # NOVO — exemplos de dark mode
└── assets/
    └── menu.js                      # MODIFICADO — entrada no menu
```

**Decisão de estrutura**: Monorepo existente mantido. Mudanças distribuídas entre módulos `ui/`, `app-extension/` e `docs/` conforme suas responsabilidades isoladas (Princípio II da constitution).

---

## Estratégia de Implementação

### Fase 1 — Infraestrutura (core)

1. **CSS custom properties** em `ui/src/index.scss`:
   - Novas variáveis semânticas em `:root` (light).
   - Redefinição de todas em `.body--dark`.
   - Overrides de classes Quasar (`text-grey-10`, `bg-white`, etc.) em `.body--dark`.

2. **Enum `DarkColorMap.js`** em `ui/src/enums/`:
   - Mapa `Object.freeze` de cores light → dark.

3. **Composable `useThemeColor`** em `ui/src/composables/`:
   - Recebe cor, retorna computed com resolução dark.
   - Usa `$q.dark.isActive` e `DarkColorMap`.

4. **Composable `useDarkMode`** em `ui/src/composables/`:
   - Gerencia estado do tema.
   - Persistência em localStorage.
   - Integração com `$q.dark`.

5. **Boot file `dark-mode.js`** em `app-extension/src/boot/`:
   - Inicialização do tema antes do mount.
   - Respeita `featureToggle.useDarkMode`.

6. **Config global** em `default-asteroid-config.js`:
   - `useDarkMode: false` em `featureToggle`.

### Fase 2 — Toggle no QasAppBar

7. **Modificar `QasAppBar.vue`**:
   - Adicionar prop `use-dark-mode` (Boolean, default undefined).
   - Renderizar toggle (ícone sol/lua) no canto superior direito.
   - Hierarquia: prop > config global.

8. **Atualizar `QasAppBar.yml`**:
   - Documentar nova prop, comportamento e exemplos.

### Fase 3 — Auditoria de componentes

Auditar todos os 87 componentes em 3 categorias:

**Categoria A — CSS only (~40 componentes)**
Componentes que usam apenas classes utilitárias e variáveis CSS. O override global em `.body--dark` resolve automaticamente. Apenas verificação visual necessária.

**Categoria B — Composable (~30 componentes)**
Componentes que passam cores via props para sub-componentes Quasar. Precisam usar `useThemeColor` para resolver a cor dinâmica.

Exemplos: QasAppBar, QasDialog, QasSearchInput, QasCard, QasExpansionItem, QasAlert, QasListItems, QasGalleryCard, QasPageHeader.

**Categoria C — Estilos scoped (~17 componentes)**
Componentes com estilos SCSS scoped que referenciam cores hardcoded. Precisam de override `.body--dark` no scoped style ou migração para CSS custom properties.

Exemplos: QasTooltip, QasPdfViewer, QasDebugger, QasResizer.

### Fase 4 — Documentação

9. **Atualizar `/docs`**:
   - Página de documentação do dark mode (conceitos, uso, variáveis).
   - Exemplos interativos.
   - Entrada no menu em `docs/src/assets/menu.js`.

10. **Atualizar CHANGELOG.md**:
    - Seção "Adicionado" com todas as mudanças em `ui/` e `app-extension/`.

### Fase 5 — Testes

11. **Testes unitários**:
    - `useDarkMode` — toggle, persistência, fallbacks.
    - `useThemeColor` — resolução de cores.
    - `DarkColorMap` — integridade do mapa.
    - `QasAppBar` — toggle renderizado/oculto conforme prop e config.

---

## Auditoria de Componentes — Lista Completa

### Componentes com cores hardcoded identificadas (prioridade de adaptação)

| # | Componente | Cores usadas | Categoria |
|---|---|---|---|
| 1 | QasAppBar | `color="grey-10"`, `text-grey-10`, `bg-white` | B |
| 2 | QasAppMenu | `color="grey-10"`, `text-grey-10`, `text-grey-8` | B |
| 3 | QasDialog | `color="grey-10"`, `text-grey-8` | B |
| 4 | QasSearchInput | `color="grey-10"`, `text-grey-10`, `text-grey-8` | B |
| 5 | QasCard | `color="grey-10"`, `text-grey-10`, `text-grey-8`, `expand-icon-class="text-grey-10"` | B |
| 6 | QasPageHeader | `separator-color="grey-8"`, `text-grey-8`, `text-grey-10` | B |
| 7 | QasExpansionItem | `color="grey-10"` | B |
| 8 | QasAlert | `color="grey-10"`, `text-grey-8` | B |
| 9 | QasGalleryCard | `text-grey-10`, `text-grey-6`, `bg-grey-2`, `bg-grey-4` | B/C |
| 10 | QasHeader | `text-grey-8` | A |
| 11 | QasTabsGenerator | `text-grey-8` | A |
| 12 | QasTimeline | `text-grey-8` | A |
| 13 | QasSelectListDialog | `text-grey-8`, `text-grey-10` | A |
| 14 | QasEmptyResultText | `text-grey-8` | A |
| 15 | QasTooltip | `text-grey-10`, `bg-grey-10` | C |
| 16 | QasAppUser | `text-grey-10` | A |
| 17 | QasPdfViewer | `color="grey"`, `text-grey-10`, `bg-grey-4` | C |
| 18 | QasResizer | `color="grey-7"`, `spinner-color="grey-7"`, `bg-grey-2` | C |
| 19 | QasSelect | `text-grey` | A |
| 20 | QasListView | `text-grey` | A |
| 21 | QasFormView | `text-grey` | A |
| 22 | QasDrawer | `text-grey` | A |
| 23 | QasFilters | `text-grey` | A |
| 24 | QasSearchBox | `color="grey"` | B |
| 25 | QasReportsFilters | `color="grey"` | B |
| 26 | QasSingleView | `color="grey"` | B |
| 27 | QasSelectList | `color="grey-10"` | B |
| 28 | QasListItems | `color="grey-10"` | B |
| 29 | QasBoardGenerator | `color="grey-4"` | B |
| 30 | QasDebugger | `bg-grey-3` | C |

**Componentes restantes (~57)**: Sem cores hardcoded identificadas — verificação visual necessária para confirmar que respondem corretamente ao dark mode via override global.

---

## Plano de Atualização da Documentação

### Novos artefatos em `/docs`

1. **Página conceitual**: `docs/src/pages/dark-mode.md`
   - O que é o dark mode no Asteroid.
   - Como habilitar (config global + prop).
   - Variáveis CSS semânticas disponíveis.
   - Boas práticas para consumidores.

2. **Exemplos interativos**: `docs/src/examples/DarkMode/`
   - Toggle entre temas.
   - Demonstração de variáveis CSS.
   - Uso programático com `useDarkMode`.

3. **Entrada no menu**: `docs/src/assets/menu.js`
   - Seção "Recursos" ou similar com link para dark mode.

### Atualizações existentes

4. **QasAppBar**: Atualizar página com nova prop `use-dark-mode`.
5. **Composables**: Página de documentação de `useDarkMode` e `useThemeColor`.

---

## Plano de Atualização do CHANGELOG.md

Formato: Keep a Changelog em pt-BR (conforme constitution).

```markdown
## [Não publicado]

### Adicionado
- `ui/`: Suporte a dark mode via CSS custom properties em `index.scss`.
- `ui/`: Novo composable `useDarkMode` para gerenciamento de tema com persistência em localStorage.
- `ui/`: Novo composable `useThemeColor` para resolução automática de cores no dark mode.
- `ui/`: Novo enum `DarkColorMap` com mapeamento de cores light → dark.
- `ui/`: Prop `use-dark-mode` no `QasAppBar` para controle do toggle de tema.
- `app-extension/`: Boot file `dark-mode.js` para inicialização do tema sem FOUT.
- `app-extension/`: Configuração `featureToggle.useDarkMode` no `asteroid.config.js`.

### Modificado
- `ui/`: 87 componentes auditados e adaptados para suportar dark mode.
- `ui/`: Overrides de classes utilitárias do Quasar em `.body--dark`.
- `docs/`: Documentação atualizada com guia de dark mode, exemplos e API dos novos composables.
```

---

## Complexity Tracking

> Nenhuma violação da constitution detectada. Tabela vazia = sem justificativas necessárias.

| Violação | Motivo | Alternativa rejeitada |
|----------|--------|----------------------|
| — | — | — |
