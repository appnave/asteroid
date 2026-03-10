# Convenções CSS/SCSS do Asteroid

## Nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Classes de componente | BEM-like com `qas-` | `qas-form-view__btn`, `qas-btn--primary` |
| Variáveis CSS custom do asteroid | `--qas-<nome>` | `--qas-background-color` |
| Variáveis Sass | `$<nome>` | `$primary`, `$generic-border-radius` |
| Mixins Sass | `set-<ação>` | `@include set-brand()`, `@include set-typography()` |

## Estrutura CSS

```
ui/src/css/
├── base/           # Reset, font-face, animações de loading do ícone
├── variables/      # Design tokens: typography, spacing, shadow, button, scrollbar, separator
├── mixins/         # Sass mixins: set-brand, set-button, set-typography, set-error-message
├── components/     # Overrides de estilo por componente (button, editor, field, etc.)
├── plugins/        # Estilos de plugins
└── utils/          # Classes utilitárias (background, border, border-radius, container, fonts, etc.)
```

## Variáveis Principais

```scss
// Cores
$primary: #0f53af;
$secondary: #1565C0;
$tertiary: #c7ceff;
$dark: #212121;

// CSS Custom Properties
--qas-background-color: rgba(15, 83, 175, 0.03);
--qas-border-grey: #{$grey-4};
--qas-generic-border-radius: 4px;
--qas-generic-transition: 300ms;
```

## Spacing Scale (base 16px)

| Token | Valor |
|-------|-------|
| none | 0 |
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24 |
| xl | 32px |
| 2xl | 40px |
| 3xl | 48px |
| 4xl | 56px |
| 5xl | 64px |

## Typography

Mapa Sass para h1-h6, subtitles, body — cada entrada com: `size`, `line-height`, `letter-spacing`, `weight`.

## Regras

- Sempre que possível utilizar as classes prontas do [quasar](../../../../node_modules/quasar/dist/quasar.prod.css) e criar custom somente se necessário.
/Users/douglascalora/Projetos/nave/asteroid/node_modules/quasar/dist/quasar.prod.css
- Sempre usar prefixo `qas-` para classes de componentes Asteroid.
- Usar BEM-like: `qas-componente`, `qas-componente__elemento`, `qas-componente--modificador`.
- Variáveis CSS custom devem seguir `--qas-<nome>`.
- Estilos de componentes ficam no próprio `.vue` com `<style lang="scss">` (sem scoped, com prefixo `qas-`).
- Classes utilitárias globais ficam em `ui/src/css/utils/`.
