# Asteroid — Regras de Código

Estas regras são **sempre carregadas** e devem ser seguidas em todo código do projeto.

## Idioma

- **Código:** Inglês (variáveis, funções, componentes, nomes de arquivo).
- **Documentação (YML, Markdown, CHANGELOG):** Português brasileiro (pt-BR).
- **Formatação padrão:** pt-BR (datas dd/MM/yyyy, moeda BRL, separador decimal vírgula).

## Nomenclatura

### Componentes
- Nome: `Qas` + PascalCase → `QasFormView`
- Pasta: kebab-case → `form-view/`
- Sub-componentes privados: `Pv` + PascalCase → `PvTableGeneratorTd`
- Template: kebab-case → `<qas-form-view>`

### Composables
- Arquivo: `use-<nome>.js` (kebab-case)
- Export: `use<Nome>` (camelCase)

### Helpers
- Arquivo: kebab-case → `is-empty.js`
- Export: camelCase → `isEmpty`

### Mixins (legado)
- Export: `<nome>Mixin` → `viewMixin`
- Props internas: prefixo `mx_` → `mx_isFetching`

### CSS
- Classes: BEM-like com `qas-` → `qas-btn--primary`
- Variáveis CSS: `--qas-<nome>`
- Variáveis Sass: `$<nome>`

### Enums
- Arquivo: PascalCase → `Align.js`
- Export: Objeto PascalCase → `Align`

## Convenções de Código

### Vue
- **Novos componentes:** Sempre usar Composition API com `<script setup>`.
- **Componentes existentes (Options API):** Manter, a menos que haja migração planejada.
- **Dentro do `ui/`:** Imports de `Qas*` são explícitos (sem auto-import).
- **Componentes Quasar (`q-*`):** Usados diretamente (auto-importados).

### API
- **Nunca chamar APIs diretamente.** Sempre usar `@bildvitta/store-adapter` (`getAction`, `getState`).
- Request: camelCase → snake_case (automático via `decamelizeKeys`).
- Response: snake_case → camelCase (automático via `camelizeKeys`).

### Testes
- `data-cy` obrigatório em elementos interagíveis para E2E.
- Adicione ou atualize testes unitários para código alterado.

### Debug
- Usar módulo `debug` com namespace `asteroid-ui:qas-<nome>`.

## Restrições

- **Não** registrar componentes globalmente dentro do `ui/`. Usar import local.
- **Não** usar `this.$axios` ou instanciar Axios diretamente. Usar store-adapter.
- **Não** usar registro de estado global sem padrão singleton documentado.
- **Não** esquecer o arquivo `.yml` de documentação ao criar novo componente.
- **Não** commitar sem rodar `npm run lint` e `npm run test`.

## Git Flow

| Branch | Release | Tag NPM |
|--------|---------|---------|
| `main` | Stable (ex: 3.20.0) | `latest` |
| `develop` | Beta (ex: 3.20.0-beta.1) | `beta` |
| `feature/*` | Alpha (ex: 3.20.0-alpha.1) | `alpha` |
