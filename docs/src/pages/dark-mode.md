---
title: Dark Mode
---

O Asteroid oferece suporte nativo a dark mode através de CSS custom properties, composables e integração com o `$q.dark` do Quasar.

## Habilitando o Dark Mode

Para habilitar o dark mode na aplicação, ative o feature toggle no `asteroid.config.js`:

```js
// asteroid.config.js
export default {
  framework: {
    featureToggle: {
      useDarkMode: true
    }
  }
}
```

Isso ativa automaticamente:
- O boot file que restaura a preferência do usuário ao carregar a página
- O botão de toggle no `QasAppBar` (se habilitado via prop ou config global)
- Os overrides de CSS para `.body--dark`

## Toggle no QasAppBar

O `QasAppBar` exibe um botão de alternância entre temas quando o dark mode está habilitado:

```html
<qas-app-bar title="Minha App" />
```

A visibilidade do toggle é controlada pelo `featureToggle.useDarkMode` do config global. Também é possível controlar via prop:

```html
<!-- Forçar exibição do toggle -->
<qas-app-bar title="Minha App" use-dark-mode />

<!-- Forçar ocultação do toggle -->
<qas-app-bar title="Minha App" :use-dark-mode="false" />
```

## CSS Custom Properties

O Asteroid define variáveis semânticas que se adaptam automaticamente ao tema:

| Variável | Light | Dark |
|----------|-------|------|
| `--qas-text-primary` | `grey-10` | `grey-2` |
| `--qas-text-secondary` | `grey-8` | `grey-4` |
| `--qas-text-disabled` | `grey-6` | `grey-5` |
| `--qas-surface-color` | `#FFFFFF` | `#1D1D1D` |
| `--qas-surface-variant` | `grey-2` | `grey-9` |
| `--qas-background-color` | `rgba(15, 83, 175, 0.03)` | `#121212` |
| `--qas-border-grey` | `grey-4` | `grey-7` |

### Usando nos seus estilos

```scss
.meu-componente {
  color: var(--qas-text-primary);
  background: var(--qas-surface-color);
  border: 1px solid var(--qas-border-grey);
}
```

## Overrides de Classes Utilitárias

O Asteroid sobrescreve automaticamente classes utilitárias do Quasar no dark mode:

| Classe Light | Cor no Dark |
|-------------|-------------|
| `.text-grey-10` | `grey-2` |
| `.text-grey-8` | `grey-4` |
| `.text-grey-6` | `grey-5` |
| `.text-grey` | `grey-5` |
| `.bg-white` | `#1D1D1D` |
| `.bg-grey-2` | `grey-9` |
| `.bg-grey-3` | `grey-8` |
| `.bg-grey-4` | `grey-7` |

Componentes que usam apenas essas classes utilitárias se adaptam automaticamente, sem necessidade de alterações.

## DarkColorMap

O enum `DarkColorMap` mapeia cores Quasar do tema light para o dark:

```js
import DarkColorMap from '@bildvitta/quasar-ui-asteroid/src/enums/DarkColorMap.js'

// Mapeamento completo
// 'grey-10' → 'grey-2'
// 'grey-8'  → 'grey-4'
// 'grey-7'  → 'grey-4'
// 'grey-6'  → 'grey-5'
// 'grey-4'  → 'grey-7'
// 'grey-3'  → 'grey-8'
// 'grey-2'  → 'grey-9'
// 'grey'    → 'grey-5'
// 'white'   → 'dark'
```

## Uso Programático

### Composables

O Asteroid fornece dois composables para trabalhar com dark mode:

- **`useDarkMode`**: Gerencia o tema (toggle, persistência, inicialização)
- **`useThemeColor`**: Resolve cores dinamicamente baseado no tema atual

```js
import { useDarkMode, useThemeColor } from 'asteroid'

// Toggle de tema
const { isDark, toggle, setTheme } = useDarkMode()

// Resolução de cor
const buttonColor = useThemeColor('grey-10')
// → 'grey-10' no light, 'grey-2' no dark
```

Consulte a documentação individual de cada composable para detalhes completos.

## Persistência

A preferência do usuário é salva no `localStorage` com a chave `qas-theme-preference`:

```json
{
  "theme": "dark",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

Ao recarregar a página, o boot file restaura automaticamente a preferência salva, evitando flash de tema incorreto (FOUT).

## Boas Práticas

1. **Prefira CSS custom properties** (`--qas-*`) para cores semânticas nos seus estilos
2. **Use `useThemeColor`** para props de cor passadas a componentes Quasar
3. **Não use cores hardcoded** em props — elas não se adaptam ao tema
4. **Teste ambos os temas** ao criar ou modificar componentes
5. **Use overrides `.body--dark`** em estilos scoped quando CSS custom properties não são suficientes

```scss
// ✅ Correto — se adapta automaticamente
.meu-texto {
  color: var(--qas-text-primary);
}

// ✅ Correto — override scoped para dark
.meu-componente {
  background: white;

  .body--dark & {
    background: #1D1D1D;
  }
}

// ❌ Evitar — não se adapta ao tema
.meu-texto {
  color: $grey-10;
}
```
