---
title: useQueryCache
---

Composable para manipular a persistência de query através da `SessionStorage`.

```js
import { useQueryCache } from 'asteroid'

const {
  addOne,
  addMany,
  findOne,
  findAll,
  clearOne,
  clearAll
} = useQueryCache()

const filters = { search: 'Jhon Snow', isActive: true } // representação do objeto de filtros que será repassado para addMany()

addOne('UsersList', { label: 'isActive', value: true }) // adiciona um novo filtro ao cache
addMany('UsersList', filters) // adiciona vários filtros sobreescrevendo os existentes
findOne('UsersList', 'isActive') // busca o filtro com base na chave
findAll('UsersList') // busca todos os filtros da entidade
clearOne('UsersList', 'isActive') // remove um filtro da entidade com base na chave
clearAll('UsersList', { exclude: ['search'] }) // remove todos os filtros da entidade, menos os passados para a chave exclude, que é opcional
```
