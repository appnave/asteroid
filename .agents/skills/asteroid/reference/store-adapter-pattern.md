# Store-Adapter Pattern

Toda comunicação com API no Asteroid é feita via `@bildvitta/store-adapter`. **Nunca chamar APIs diretamente com Axios.**

## Uso Básico

```js
import { getAction, getState } from '@bildvitta/store-adapter'

// Fetch (lista)
getAction.call(this, { entity: this.entity, action: 'fetchList', payload })

// Fetch (registro único)
getAction.call(this, { entity: this.entity, action: 'fetchSingle', id })

// State (lista)
getState.call(this, { entity: this.entity, key: 'list' })

// State (registro único)
getState.call(this, { entity: this.entity, key: 'single' })
```

## Actions Disponíveis

| Action | Descrição |
|--------|-----------|
| `fetchSingle` | Buscar registro único |
| `fetchList` | Buscar lista com paginação |
| `create` | Criar registro |
| `update` | Atualizar parcialmente (PATCH) |
| `replace` | Substituir completamente (PUT) |
| `destroy` | Excluir registro |

## Como Funciona

```
Componente Vue
  │
  ├── getAction({ entity, action, payload })
  │   └── Store Module → Axios → API REST
  │       ├── Request: camelCase → snake_case (decamelizeKeys)
  │       └── Response: snake_case → camelCase (camelizeKeys)
  │
  └── getState({ entity, key })
      └── Reactive state do store
```

## Regras

- **Sempre usar `getAction` e `getState`** — nunca instanciar Axios diretamente.
- A `entity` é o nome do recurso no backend (ex: `'users'`, `'products'`).
- O store-adapter é agnóstico de Vuex/Pinia — abstraí o state management.
- Componentes como `QasFormView`, `QasListView` e `QasTableGenerator` usam store-adapter internamente via prop `entity`.
