import { computed, inject, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * Histórico de navegação utilizado para controlar o histórico de rotas quando em um overlay.
 * Obs: Esse histórico é resetado sempre que o overlay é fechado ou expandido para tela cheia.
 * Obs2: Esse histórico não é persistido, ou seja, ao recarregar a página ele é perdido.
 * Obs3: Esse histórico é compartilhado entre todas as instâncias que utilizam o useOverlayNavigation,
 * por isso declara fora da função.
 */
const historyRoute = ref({
  history: [],
  nextStack: [],
  currentIndex: -1
})

const canLeaveOverlay = ref(true)

/**
 * Definição de callbacks locais para esta instância.
 * Obs: são arrays para permitir múltiplos callbacks, ex se você usa "onCloseOverlay" em 2 componentes diferentes,
 * ambos serão executados.
 */
const callbackFunctions = {
  onCloseOverlay: [],
  onExpandOverlay: [],
  onHideOverlay: [],
  onBackgroundChange: [],
  onOverlayChange: []
}

/**
 * Composable para gerenciar navegação em overlays, sempre que for lidar com overlays utilize esse composable.
 */
export default function useOverlayNavigation () {
  // composables
  const route = useRoute()
  const router = useRouter()

  /**
   * Retorna "true" quando for chamado em uma pagina que está sendo exibida em um overlay.
   */
  const isOverlay = inject('isOverlay', false)

  // computeds
  /**
   * Rota que está sendo exibida embaixo do overlay.
   */
  const backgroundRoute = computed(() => route.meta.backgroundRoute || {})

  /**
   * Retorna "true" quando a rota atual está em um overlay, não necessariamente sendo o overlay ou background.
   */
  const hasOverlay = computed(() => route?.query?.overlay === 'true')

  /**
   * Retorna "true" quando for chamado em uma pagina que está sendo exibida abaixo de um overlay.
   * Esta propriedade só funciona quando o componente pai não é um overlay.
   */
  const isBackgroundOverlay = computed(() => !isOverlay && hasOverlay.value)

  /**
   * Computada para ser utilizada tanto no background quanto no overlay, substituindo o uso padrão do "route".
   */
  const defaultRoute = computed(() => {
    return isBackgroundOverlay.value ? backgroundRoute.value : route
  })

  /**
   * Indica se existe uma rota anterior no histórico de navegação.
   */
  const hasPreviousRoute = computed(() => historyRoute.value.currentIndex > 0)

  /**
   * Indica se existe uma rota posterior no histórico de navegação.
   */
  const hasNextRoute = computed(() => historyRoute.value.currentIndex < historyRoute.value.history.length - 1)

  // functions
  /**
   * Retorna a rota normalizada para ser usada com overlay.
   * Obs: Sempre utilize essa função para navegar entre rotas que precisam do overlay.
   *
   * @param {import('vue-router').RouteLocationNormalized} externalRoute
   * @param {boolean=true} useOverlay
   *
   * @example
   * ```js
   * const { getOverlayRoute } = useOverlayNavigation()
   *
   * const route = getOverlayRoute({ name: 'MyRoute' }) // { name: 'MyRoute', query: { overlay: true, backgroundOverlay: 'ROTA_ATUAL_CODIFICADA' } }
   *
   * router.push(route)
   * ```
   *
   * @return {import('vue-router').RouteLocationNormalized}
   */
  function getOverlayRoute (externalRoute) {
    return {
      ...externalRoute,
      query: {
        ...externalRoute.query,
        overlay: true,
        ...(!isOverlay && { backgroundOverlay: encodeURIComponent(route.fullPath) }),
        ...(route.query.backgroundOverlay && { backgroundOverlay: route.query.backgroundOverlay })
      }
    }
  }

  function getNormalizedRoute (routePayload) {
    return isOverlay ? getOverlayRoute(routePayload) : routePayload
  }

  /**
   *
   * Função para fechar o overlay, removendo as queries e redirecionando para a rota de background.
   */
  function closeOverlay () {
    if (!hasOverlay.value) return

    // callbacks
    execCallbackFunctions('onCloseOverlay')
    execCallbackFunctions('onHideOverlay')

    const query = { ...route.query }

    delete query.overlay
    delete query.backgroundOverlay

    router.push({ path: backgroundRoute.value.fullPath, query: { ...backgroundRoute.value.query } })

    resetHistory()
  }

  /**
   * Função para expandir o overlay para tela cheia, removendo as queries e redirecionando para a rota atual.
   * Obs: Essa função não funciona se o componente atual não estiver em um overlay.
   */
  async function expandOverlay () {
    if (!hasOverlay.value) return

    // callbacks
    execCallbackFunctions('onExpandOverlay')
    execCallbackFunctions('onHideOverlay')

    const query = { ...route.query }

    delete query.overlay
    delete query.backgroundOverlay

    await router.push({ ...route, query })

    resetHistory()
  }

  /**
   * Adiciona uma rota ao histórico de navegação.
   *
   * @param {import('vue-router').RouteLocationNormalized} to
   * @param {import('vue-router').RouteLocationNormalized} from
   */
  function addRouteToHistory (to, from) {
    if (to.fullPath === from.fullPath || to.query.overlay !== 'true') return

    const currentRoute = {
      name: to.name,
      params: to.params,
      fullPath: to.fullPath,
      path: to.path,
      query: to.query
    }

    // Se estamos navegando para uma rota que já existe no histórico
    const existsInHistoryList = historyRoute.value.history.findIndex(item => item.fullPath === to.fullPath)

    if (existsInHistoryList !== -1) {
      // Se a rota existe no histórico, apenas atualize o currentIndex
      historyRoute.value.currentIndex = existsInHistoryList
      return
    }

    // Verifica se estamos navegando "para frente" (clicando em uma rota do nextStack)
    const isNavigatingForward = (
      historyRoute.value.currentIndex < historyRoute.value.history.length - 1 &&
      historyRoute.value.history[historyRoute.value.currentIndex + 1]?.fullPath === to.fullPath
    )

    if (isNavigatingForward) {
      // Se estamos navegando para frente, apenas avance o índice
      historyRoute.value.currentIndex++
      return
    }

    // Se chegamos aqui, é uma nova navegação, então remove todas as rotas "futuras" (simula o comportamento do browser)
    if (historyRoute.value.currentIndex < historyRoute.value.history.length - 1) {
      historyRoute.value.history.splice(historyRoute.value.currentIndex + 1)
    }

    // Adiciona a nova rota ao histórico
    historyRoute.value.history.push(currentRoute)
    historyRoute.value.currentIndex = historyRoute.value.history.length - 1
  }

  /**
   * Reseta o histórico de navegação.
   */
  function resetHistory () {
    historyRoute.value.currentIndex = -1
    historyRoute.value.nextStack = []
    historyRoute.value.history = []
  }

  /**
   * Navega para a rota anterior no histórico de navegação, se não houver rota anterior, a função não faz nada.
   */
  function goBack () {
    if (!hasPreviousRoute.value) return

    historyRoute.value.currentIndex--
    const targetRoute = historyRoute.value.history[historyRoute.value.currentIndex]

    if (targetRoute) {
      router.push(targetRoute)
    }
  }

  /**
   * Navega para a próxima rota no histórico de navegação, se não houver próxima rota, a função não faz nada.
   */
  function goForward () {
    if (!hasNextRoute.value) return

    historyRoute.value.currentIndex++
    const targetRoute = historyRoute.value.history[historyRoute.value.currentIndex]

    if (targetRoute) {
      router.push(targetRoute)
    }
  }

  /**
   * Define se o overlay pode ser fechado, ampliado ou ter navegação.
   * @param {boolean} value
   */
  function toggleCanLeaveOverlay (value) {
    canLeaveOverlay.value = value
  }

  // callbacks
  /**
   * @private
   * @param {string} callbackName - Nome do callback a ser executado.
   */
  function execCallbackFunctions (callbackName, payload) {
    callbackFunctions[callbackName].forEach(fn => fn(payload))
  }

  /**
   * Função para disparar mudanças no background componente.
   *
   * @param {*} payload - Qualquer tipo de dado que será passado para o callback registrado.
   * @see {onBackgroundChange}
   * @example
   * ```js
   * const { triggerBackgroundChange } = useOverlayNavigation()
   *
   * // Disparar a mudança
   * triggerBackgroundChange({ someData: 123 })
   * ```
   */
  function triggerBackgroundChange (payload) {
    execCallbackFunctions('onBackgroundChange', payload)
  }

  /**
   * Dispara mudanças no overlay componente.
   * @param {*} payload
   * @see {onOverlayChange}
   * @example
   * ```js
   * const { triggerOverlayChange } = useOverlayNavigation()
   *
   * // Disparar a mudança
   * triggerOverlayChange({ someData: 123 })
   * ```
   */
  function triggerOverlayChange (payload) {
    execCallbackFunctions('onOverlayChange', payload)
  }

  /**
   * callback para quando ter alguma mudança no background componente, executado logo após a função
   * "triggerBackgroundChange" ser executada.
   *
   * @param {Function} callback
   * @see {triggerBackgroundChange}
   * @example
   * ```js
   * const { onBackgroundChange } = useOverlayNavigation()
   *
   * onBackgroundChange((payload) => {
   *  // Lógica a ser executada quando o background sofrer alguma mudança
   * })
   * ```
   */
  function onBackgroundChange (callback) {
    callbackFunctions.onBackgroundChange.push(callback)
  }

  /**
   * callback para quando ter alguma mudança no overlay componente, executado logo após a função
   * "triggerOverlayChange" ser executada.
   *
   * @param {Function} callback
   * @see {triggerOverlayChange}
   * @example
   * ```js
   * const { onOverlayChange } = useOverlayNavigation()
   *
   * onOverlayChange((payload) => {
   *  // Lógica a ser executada quando o overlay sofrer alguma mudança
   * })
   * ```
   */
  function onOverlayChange (callback) {
    callbackFunctions.onOverlayChange.push(callback)
  }

  /**
   * callback para quando o overlay for fechado (exceto ao expandir para tela cheia).
   *
   * @param {Function} callback
   * @example
   * ```js
   * const { onCloseOverlay } = useOverlayNavigation()
   *
   * onCloseOverlay(() => {
   *  // Lógica a ser executada quando o overlay for fechado
   * })
   * ```
   */
  function onCloseOverlay (callback) {
    callbackFunctions.onCloseOverlay.push(callback)
  }

  /**
   * callback para quando o overlay for expandido para tela cheia (exceto ao fechar).
   *
   * @param {Function} callback
   * @example
   * ```js
   * const { onExpandOverlay } = useOverlayNavigation()
   *
   * onExpandOverlay(() => {
   *  // Lógica a ser executada quando o overlay for expandido para tela cheia
   * })
   * ```
   */
  function onExpandOverlay (callback) {
    callbackFunctions.onExpandOverlay.push(callback)
  }

  /**
   * callback para quando o overlay for ocultado, esta função é chamada tanto ao fechar o overlay
   * quanto ao expandir para tela cheia.
   *
   * @param {Function} callback
   * @example
   * ```js
   * const { onHideOverlay } = useOverlayNavigation()
   *
   * onHideOverlay(() => {
   *   // Lógica a ser executada quando o overlay for ocultado
   * })
   * ```
   */
  function onHideOverlay (callback) {
    callbackFunctions.onHideOverlay.push(callback)
  }

  return {
    // consts (inject)
    isOverlay,

    // refs
    historyRoute,
    canLeaveOverlay,

    // computeds
    backgroundRoute,
    hasNextRoute,
    hasPreviousRoute,
    isBackgroundOverlay,
    route: defaultRoute, // feito dessa forma para ser usado como o padrão "route" que não tem ".value"

    // functions
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

    // callbacks functions
    onBackgroundChange,
    onOverlayChange,
    onCloseOverlay,
    onExpandOverlay,
    onHideOverlay
  }
}
