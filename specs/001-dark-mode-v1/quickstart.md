# Quickstart — Dark Mode v1

## Habilitando Dark Mode no projeto

### 1. Configuração global (asteroid.config.js)

```javascript
// asteroid.config.js
export default {
  framework: {
    featureToggle: {
      useDarkMode: true // Habilita dark mode globalmente
    }
  }
}
```

Isso faz com que:
- O boot file inicialize o dark mode na carga da aplicação.
- O toggle de dark mode apareça no `QasAppBar` por padrão.
- A preferência do usuário seja persistida em `localStorage`.

### 2. Toggle no QasAppBar

```vue
<template>
  <!-- O toggle aparece automaticamente quando useDarkMode está habilitado -->
  <qas-app-bar
    :app-user-props="userProps"
    title="Meu App"
  />
</template>
```

Para desabilitar o toggle em uma tela específica:

```vue
<template>
  <qas-app-bar
    :app-user-props="userProps"
    :use-dark-mode="false"
    title="Meu App"
  />
</template>
```

### 3. Usando dark mode programaticamente

```javascript
import { useDarkMode } from 'asteroid'

export default {
  setup () {
    const { isDark, toggle, setTheme } = useDarkMode()

    return { isDark, toggle, setTheme }
  }
}
```

### 4. Resolvendo cores no dark mode

Para componentes customizados que precisam de cores temáticas:

```javascript
import { useThemeColor } from 'asteroid'

export default {
  setup () {
    const resolvedColor = useThemeColor('grey-10')
    // retorna 'grey-10' no light, 'grey-2' no dark

    return { resolvedColor }
  }
}
```

### 5. Usando CSS custom properties

Nos seus estilos SCSS, prefira as variáveis semânticas:

```scss
.meu-componente {
  color: var(--qas-text-primary);           // grey-10 no light, grey-2 no dark
  background: var(--qas-surface-color);     // white no light, #1D1D1D no dark
  border-color: var(--qas-border-grey);     // grey-4 no light, grey-7 no dark
}
```

## Resumo das variáveis CSS disponíveis

| Variável | Descrição |
|---|---|
| `--qas-text-primary` | Cor de texto principal (títulos) |
| `--qas-text-secondary` | Cor de texto secundário (corpo) |
| `--qas-text-disabled` | Cor de texto desabilitado |
| `--qas-surface-color` | Background de superfícies |
| `--qas-surface-variant` | Background secundário |
| `--qas-background-color` | Background global da aplicação |
| `--qas-border-grey` | Cor de bordas |
