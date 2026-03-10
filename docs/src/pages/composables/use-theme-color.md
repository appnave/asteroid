---
title: useThemeColor
---

Composable para resolução dinâmica de cores baseado no tema atual (light/dark).

```js
import { useThemeColor } from 'asteroid'

// recebe uma cor Quasar e retorna a cor correspondente ao tema atual.
const color = useThemeColor('grey-10')

color.value // 'grey-10' no light, 'grey-2' no dark
```

## Mapa de cores

O composable usa internamente o `DarkColorMap` para resolver as cores:

| Cor Light | Cor Dark |
|-----------|----------|
| `grey-10` | `grey-2` |
| `grey-8` | `grey-4` |
| `grey-7` | `grey-4` |
| `grey-6` | `grey-5` |
| `grey-4` | `grey-7` |
| `grey-3` | `grey-8` |
| `grey-2` | `grey-9` |
| `grey` | `grey-5` |
| `white` | `dark` |

Cores que não estão no mapa são retornadas sem alteração.

## Uso com props de componentes Quasar

```html
<template>
  <q-btn :color="buttonColor" label="Ação" />
  <q-spinner :color="spinnerColor" />
</template>

<script setup>
import { useThemeColor } from 'asteroid'

const buttonColor = useThemeColor('grey-10')
const spinnerColor = useThemeColor('grey')
</script>
```

## Aceitando Refs

O composable aceita tanto strings quanto `Ref<string>`, sendo reativo a mudanças:

```js
import { ref } from 'vue'
import { useThemeColor } from 'asteroid'

const dynamicColor = ref('grey-10')
const resolved = useThemeColor(dynamicColor)

// Se dynamicColor mudar para 'grey-8', resolved se atualiza automaticamente.
dynamicColor.value = 'grey-8'
resolved.value // 'grey-4' no dark
```

## Quando usar

- **Use `useThemeColor`** para props de cor passadas dinamicamente a sub-componentes (ex: `<q-btn :color="...">`)
- **Use CSS custom properties** (`--qas-*`) para estilos em CSS/SCSS
- **Confie no override global** para classes utilitárias como `.text-grey-10`, `.bg-white`, etc.
