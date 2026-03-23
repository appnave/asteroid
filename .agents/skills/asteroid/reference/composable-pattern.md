# Padrão de Composables no Asteroid

## Nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivo | `use-<nome>.js` (kebab-case) | `use-form.js` |
| Export | `use<Nome>` (camelCase) | `useForm` |
| Composables privados | Em pasta `private/` | `composables/private/use-internal.js` |

## Localização

- **Composables globais:** `ui/src/composables/use-<nome>.js`
- **Composables de componente:** `ui/src/components/<nome>/composables/use-<nome>.js`

## Exemplo

```js
// ui/src/composables/use-screen.js
import { computed } from 'vue'
import { Screen } from 'quasar'

export function useScreen () {
  const isSmallScreen = computed(() => Screen.lt.md)
  const isMediumScreen = computed(() => Screen.lt.lg)

  return {
    isSmallScreen,
    isMediumScreen
  }
}
```

## Padrões

- **Estado singleton:** Alguns composables usam `reactive()` fora da função para compartilhar estado entre instâncias (ex: `useHistory` mantém histórico global).
- **Retorno:** Sempre retornar objeto com propriedades nomeadas (não tuple).
- **Reatividade:** Retornar `ref` ou `computed` — nunca valores plain.
- **Side effects:** Documentar claramente se o composable tem side effects (ex: `useHistory().addRoute()` modifica estado global).

## Composables Existentes

| Composable | Descrição |
|------------|-----------|
| `useForm` | Determina modo do formulário (create/replace/update) a partir da rota |
| `useHistory` | Rastreia histórico de navegação (singleton reativo) |
| `useScreen` | Utilitários de tamanho de tela |
| `useNotifications` | Sistema de notificações browser com som |
| `useQueryCache` | Cache de query params por rota |
| `useDefaultFilters` | Filtros padrão para listagens |
| `useContext` | Contexto compartilhado |
| `useOverlayNavigation` | Navegação em overlay/dialog |
