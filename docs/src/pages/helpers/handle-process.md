---
title: handleProcess
---

Função para recuperar uma env via `import.meta.env` e retornar um valor default caso ela não exista.

```js
import { handleProcess } from 'asteroid'

const myEnv = handleProcess(() => import.meta.env.MY_ENV, 'meu-valor-default')
// retorna o valor de "import.meta.env.MY_ENV" caso exista senão retorna "meu-valor-default".
```
