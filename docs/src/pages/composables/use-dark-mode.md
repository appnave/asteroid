---
title: useDarkMode
---

Composable para gerenciamento do dark mode na aplicação.

:::info
##### Pré-requisito

O dark mode deve estar habilitado no `asteroid.config.js`:

```js
framework: {
  featureToggle: {
    useDarkMode: true
  }
}
```
:::

```js
import { useDarkMode } from 'asteroid'

const {
  // computed
  isDark,

  // functions
  toggle,
  setTheme,
  initialize,
  getStoredTheme
} = useDarkMode()

// retorna se o dark mode está ativo (reativo).
isDark.value // true | false

// alterna entre light e dark.
toggle()

// define um tema específico ('light' ou 'dark').
setTheme('dark')

// inicializa o tema a partir do localStorage (usado internamente pelo boot file).
initialize()

// retorna o tema salvo no localStorage ('light' ou 'dark').
getStoredTheme() // 'light' | 'dark'
```

## Persistência

A preferência é salva no `localStorage` com a chave `qas-theme-preference`:

```json
{
  "theme": "dark",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

## Uso no template

```html
<template>
  <qas-btn
    :icon="isDark ? 'sym_r_dark_mode' : 'sym_r_light_mode'"
    @click="toggle"
  />

  <span>Tema: {{ isDark ? 'Escuro' : 'Claro' }}</span>
</template>

<script setup>
import { useDarkMode } from 'asteroid'

const { isDark, toggle } = useDarkMode()
</script>
```

## Toggle no QasAppBar

O `QasAppBar` já integra o `useDarkMode` quando habilitado via config global ou prop `use-dark-mode`:

```html
<!-- O toggle aparece automaticamente se useDarkMode está habilitado no config -->
<qas-app-bar title="Minha App" />

<!-- Controle manual via prop -->
<qas-app-bar title="Minha App" use-dark-mode />
```
