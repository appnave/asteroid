# Asteroid — AGENTS.md

## Regras globais
- Responda sempre em **pt-BR**.
- Use **JavaScript** (nunca TypeScript) e **SCSS** (nunca CSS puro).
- Código em inglês; documentação (YML, MD, CHANGELOG) em pt-BR.
- Caso exista algum conflito de skills/rules no arquivo `.agents/` considere sempre as skills/rules do `asteroid` como prioridade e sobrescreva as demais.

## Padrões de código
- Dentro de `ui/`: imports de `Qas*` sempre **explícitos** (sem auto-import).

## Nomenclatura
| Tipo | Convenção |
|------|-----------|
| Componente público | `QasFormView` → arquivo `form-view/QasFormView.vue` |
| Sub-componente privado | Prefixo `Pv` — ex: `PvTableGeneratorTd.vue` |
| Composable | `useForm` → arquivo `use-form.js` |
| Helper | `isEmpty` → arquivo `is-empty.js` |
| Enum | PascalCase — ex: `Align.js` |
| CSS classes/vars | `.qas-btn--primary`, `--qas-*`, `$var` |

## Restrições
- Não criar componente sem arquivo `.yml` de documentação de API.
- Não criar componente sem arquivo `.test.js` de teste.
- Novo componente exige export em `ui/src/asteroid.js` via `defineAsyncComponent`.
- Não usar stubs em testes.
