---
title: setScrollOnGrab
---

Função para setar scroll uma determinada área (elemento) ao "puxar/agarrar" com o mouse/touch.


:::info
- componente da prevent em toda tag `button`.
- caso queria dar prevent em custom elements, use o atributo `data-no-grab`.

```js
// Definição
setScrollOnGrab(
  element, // Elemento onde irá ocorrer o scroll
  { // Opções
    onMoveFn: ({ element, event }) => {},
    onGrabFn: ({ element, isGrabbing }) => {},
    onScrollFn: ({ element, event }) => {}
  }
)
```
