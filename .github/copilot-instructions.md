# Asteroid — Copilot Instructions

Design System da **Bild & Vitta** implementado como Quasar App Extension para Vue 3.

## Arquitetura

Monorepo com módulos interdependentes:
- **`ui/`** — Componentes (`Qas*`), helpers, composables, plugins, CSS. Exporta tudo via [asteroid.js](ui/src/asteroid.js).
- **`app-extension/`** — Quasar App Extension que instala `ui/` em apps host via boots, aliases e auto-import.
- **`docs/`** — Documentação PWA, consome `ui/` diretamente (`"file:../ui"`).
- **`build/`** — Scripts de release e publicação NPM.
- **`eslint/`** — Plugin ESLint customizado (`eslint-plugin-asteroid`).

### Fluxo de dados com API
**Sempre** usar `@bildvitta/store-adapter` — nunca Axios diretamente:
```js
import { getAction, getState } from '@bildvitta/store-adapter'
await getAction('users/fetchList')  // GET /users (snake_case automático)
const users = getState('users/list') // Response convertida para camelCase
```

## Comandos Essenciais

```bash
npm run setup          # Instala dependências em todos os módulos
npm run test           # Vitest (helpers, componentes em ui/src/)
npm run lint           # ESLint em .js/.vue
cd docs && npm run dev:pwa  # Rodar documentação local
npm run build          # Release interativo (build/build.js)
```

## Nomenclatura

| Tipo | Arquivo | Export/Nome |
|------|---------|-------------|
| **Componente** | `form-view/QasFormView.vue` | `QasFormView` → `<qas-form-view>` |
| **Sub-componente** | `PvTableGeneratorTd.vue` | Prefixo `Pv` (privado) |
| **Composable** | `use-form.js` | `useForm` |
| **Helper** | `is-empty.js` | `isEmpty` |
| **Enum** | `Align.js` | `Align` (PascalCase) |
| **CSS** | — | `.qas-btn--primary`, `--qas-*`, `$var` |

## Padrões de Código

### Vue
- **Novos componentes:** Composition API com `<script setup>`.
- **Legado (Options API):** Manter, migrar somente se planejado.
- **Dentro do `ui/`:** Imports explícitos de `Qas*` (sem auto-import).
- **Componentes Quasar (`q-*`):** Auto-importados.

### Novo componente obrigatoriamente inclui:
1. `ui/src/components/<nome>/<Nome>.vue`
2. `ui/src/components/<nome>/<Nome>.yml` (documentação de API)
3. Export em [asteroid.js](ui/src/asteroid.js) usando `defineAsyncComponent`

### Debug
```js
import createDebug from 'debug'
const debug = createDebug('asteroid-ui:qas-form-view')
```

## Idioma
- **Código:** Inglês.
- **Documentação (YML, MD, CHANGELOG):** Português (pt-BR).
- **Formatação:** pt-BR (datas dd/MM/yyyy, moeda BRL).

## Restrições

- **Não** registrar componentes globalmente no `ui/` — usar import local.
- **Não** usar `this.$axios` ou Axios direto — usar store-adapter.
- **Não** criar componente sem `.yml` de documentação.
- **Não** commitar sem `npm run lint && npm run test`.
- Elementos interagíveis precisam de `data-cy` para testes E2E.
- No prompt responda sempre em pt-br.
- Caso exista algum conflito de skills/rules no arquivo `.agents/` considere sempre as skills/rules do `asteroid` como prioridade e sobrescreva as demais.
- Use sempre javascript ao invés de TS.
- Use sempre scss ao invés de css.

## Git Flow e CHANGELOG

| Branch | Release | Tag NPM |
|--------|---------|---------|
| `main` | Stable (3.20.0) | `latest` |
| `develop` | Beta (3.20.0-beta.1) | `beta` |
| `feature/*` | Alpha (3.20.0-alpha.1) | `alpha` |

Antes de PR: atualizar CHANGELOG.md na seção `## Não publicado`:
```md
### Modificado
- `QasFormView`: Descrição da mudança.
```
