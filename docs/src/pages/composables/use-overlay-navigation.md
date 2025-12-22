---
title: useOverlayNavigation
---

Composable para gerenciar navegação em overlays e controlar o histórico de rotas.

```js
import { useOverlayNavigation } from 'asteroid'

const {
  // constantes (inject)
  isOverlay,

  // refs
  historyRoute,
  canLeaveOverlay,

  // computadas
  backgroundRoute,
  hasNextRoute,
  hasPreviousRoute,
  isBackgroundOverlay,
  route,

  // funções
  addRouteToHistory,
  closeOverlay,
  expandOverlay,
  getOverlayRoute,
  goBack,
  goForward,
  triggerBackgroundChange,
  triggerOverlayChange,
  getNormalizedRoute,
  toggleCanLeaveOverlay,

  // callbacks
  onBackgroundChange,
  onOverlayChange,
  onCloseOverlay,
  onExpandOverlay,
  onHideOverlay
} = useOverlayNavigation()
```

## Constantes (inject)

### `isOverlay`
Retorna `true` quando chamado em uma página que está sendo exibida em um overlay.

```js
isOverlay // true | false
```

## Refs

### `historyRoute`
Objeto que contém o histórico de navegação do overlay.

```js
historyRoute.value // { history: [], nextStack: [], currentIndex: -1 }
```

### `canLeaveOverlay`
Controla se o overlay pode ser fechado, expandido ou ter navegação.

```js
canLeaveOverlay.value // true | false
```

## Computadas

### `backgroundRoute`
Rota que está sendo exibida embaixo do overlay.

```js
backgroundRoute.value // RouteLocationNormalized
```

### `hasNextRoute`
Indica se existe uma rota posterior no histórico de navegação.

```js
hasNextRoute.value // true | false
```

### `hasPreviousRoute`
Indica se existe uma rota anterior no histórico de navegação.

```js
hasPreviousRoute.value // true | false
```

### `isBackgroundOverlay`
Retorna `true` quando chamado em uma página que está sendo exibida abaixo de um overlay.

```js
isBackgroundOverlay.value // true | false
```

### `route`
Computada para ser utilizada em background em cenários onde precisa trabalhar com rotas, exemplo.
Tela de listagem que vai ser background e esta pegando a query "status" da rota, quando abrir uma tela em overlay, a query "status" vai deixar de existir porque ele muda na URL, pra isto use a computada "route", pois ela sempre vai conter as informações da rota de listagem, estamos em background ou não.

```js
route.value // RouteLocationNormalized (normalizada para overlay/background)
```

## Funções

### `addRouteToHistory(to, from)`
Adiciona uma rota ao histórico de navegação.

```js
addRouteToHistory(toRoute, fromRoute)
```

### `closeOverlay()`
Fecha o overlay, removendo as queries e redirecionando para a rota de background.

```js
closeOverlay()
```

### `expandOverlay()`
Expande o overlay para tela cheia, removendo as queries e redirecionando para a rota atual.

```js
expandOverlay()
```

### `getOverlayRoute(externalRoute)`
Retorna a rota normalizada para ser usada com overlay.

```js
const overlayRoute = getOverlayRoute({ name: 'MyRoute' })
// { name: 'MyRoute', query: { overlay: true, backgroundOverlay: 'ROTA_ATUAL_CODIFICADA' } }

router.push(overlayRoute)
```

### `getNormalizedRoute(routePayload)`
Retorna a rota normalizada baseada no contexto atual (overlay ou não). No cenário onde temos uma tab que ao clicar nela você muda a rota, se a tela que a tab esta sendo exibida esta dentro do overlay, ao clicar na tab, ele deve retornar a rota em overlay, se a tab estiver dentro da tab sem ser overlay, ao clicar na tab ela deve retornar a rota padrão sem overlay.

```js
const normalizedRoute = getNormalizedRoute({ name: 'MyRoute' })
```

### `goBack()`
Navega para a rota anterior no histórico de navegação.

```js
if (hasPreviousRoute.value) {
  goBack()
}
```

### `goForward()`
Navega para a próxima rota no histórico de navegação.

```js
if (hasNextRoute.value) {
  goForward()
}
```

### `toggleCanLeaveOverlay(value)`
Define se o overlay pode ser fechado, ampliado ou ter navegação.

```js
toggleCanLeaveOverlay(false) // bloqueia saída do overlay
toggleCanLeaveOverlay(true)  // permite saída do overlay
```

### `triggerBackgroundChange(payload)`
Dispara mudanças no componente de background.

```js
triggerBackgroundChange({ someData: 123 })
```

### `triggerOverlayChange(payload)`
Dispara mudanças no componente de overlay.

```js
triggerOverlayChange({ someData: 123 })
```

## Callbacks

### `onBackgroundChange(callback)`
Callback executado quando há mudança no componente de background.

```js
onBackgroundChange((payload) => {
  // Lógica executada quando o background sofrer alguma mudança
  console.log('Background changed:', payload)
})
```

### `onOverlayChange(callback)`
Callback executado quando há mudança no componente de overlay.

```js
onOverlayChange((payload) => {
  // Lógica executada quando o overlay sofrer alguma mudança
  console.log('Overlay changed:', payload)
})
```

### `onCloseOverlay(callback)`
Callback executado quando o overlay for fechado (exceto ao expandir para tela cheia).

```js
onCloseOverlay(() => {
  // Lógica executada quando o overlay for fechado
  console.log('Overlay foi fechado')
})
```

### `onExpandOverlay(callback)`
Callback executado quando o overlay for expandido para tela cheia (exceto ao fechar).

```js
onExpandOverlay(() => {
  // Lógica executada quando o overlay for expandido para tela cheia
  console.log('Overlay foi expandido')
})
```

### `onHideOverlay(callback)`
Callback executado quando o overlay for ocultado (tanto ao fechar quanto ao expandir).

```js
onHideOverlay(() => {
  // Lógica executada quando o overlay for ocultado
  console.log('Overlay foi ocultado')
})
```
