---
title: useDefaultFilters
---

Composable para recuperar filtros defaults.

```js
import { useDefaultFilters, setDefaultFiltersBeforeEnter } from 'asteroid'
```

O composable `useDefaultFilters` é utilizado no componente `QasSelectFilter` e na função `setDefaultFiltersBeforeEnter`.

### Função `setDefaultFiltersBeforeEnter`

Ao entrar em uma tela onde é necessário adicionar uma query na URL antes da tela ser carregada, utilize a função `setDefaultFiltersBeforeEnter`. Esta função recupera valores de filtros padrão do `localStorage` (chave `defaultFilters`) caso a URL não contenha o filtro previamente selecionado.

Obs: a função fica dentro do arquivo do composable `useDefaultFilters`.

**Definição**
```js
setDefaultFiltersBeforeEnter(to, from, queryList = ['company'])

to // rota de destino
from // rota de origem
queryList // chaves que será recuperadas dentro de 'defaultFilter' no localStorage (por padrão company incluído).

// retorno: rota com os filtros aplicados (redireciona) ou true (segue a navegação).
```

#### Como Utilizar
É recomendado adicionar a função `setDefaultFiltersBeforeEnter` no callback `beforeEnter` da definição de rota.

**Em arquivo de definição de rota (RECOMENDADO)**
```js
// users.js
import { setDefaultFiltersBeforeEnter } from 'asteroid'

export default [
  {
    name: 'UsersList',
    path: '/users',
    component: () => import('pages/users/UsersList.vue'),
    beforeEnter: setDefaultFiltersBeforeEnter
  }
]
```

**Passando o `queryList`**
```js
// users.js
import { setDefaultFiltersBeforeEnter } from 'asteroid'

export default [
  {
    name: 'UsersList',
    path: '/users',
    component: () => import('pages/users/UsersList.vue'),
    beforeEnter: (to, from) => setDefaultFiltersBeforeEnter(to, from, ['company', 'properties'])
  }
]
```

### useDefaultFilters
Composable utilizado para controle interno, e no componente `QasSelectFilter`, utilize somente se necessário.

```js
import { useDefaultFilters } from 'asteroid'

const {
  filterQuery,
  hasFilterQuery,
  getDefaultFiltersFromStorage,
  onDefaultFiltersChange,
  removeOnDefaultFiltersChange,
  setFilterQuery,
  triggerDefaultFiltersChange
} = useDefaultFilters()
```
