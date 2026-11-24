---
title: useScreen
---

Composable para validação de tamanho de telas e plataforma mobile.

```js
import { useScreen } from 'asteroid'
import { toRefs } from 'vue'

const screen = useScreen()

screen.isSmall // até 599px
screen.isMedium // de 600 até 1023px
screen.isLarge // Maior que 1023px
screen.isXLarge // Maior que 1439px
screen.is2XLarge // Maior que 1919px
screen.untilMedium // de 0 até 599px
screen.untilLarge // de 0 até 1023px
screen.untilXLarge // de 0 até 1439px
screen.until2XLarge // de 0 até 1919px
screen.isMobile // Plataforma

// ou

const {
  isSmall,
  isMedium,
  isLarge,
  isXLarge,
  is2XLarge,
  untilMedium,
  untilLarge,
  untilXLarge,
  until2XLarge,
  isMobile
} = toRefs(useScreen())
```
