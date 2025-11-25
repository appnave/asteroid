import useOverlayNavigation from '@bildvitta/quasar-ui-asteroid/src/composables/use-overlay-navigation.js'

/**
 * @param {import('vue-router').Router} router
 */
export default async function ({ router }) {
  router.beforeEach((to, from, next) => onBeforeEach(to, from, next, router))
}

/**
 * @param {import('vue-router').RouteLocationNormalized} to
 * @param {import('vue-router').RouteLocationNormalized} from
 * @param {Function} next
 * @param {import('vue-router').Router} router
 */
async function onBeforeEach (to, from, next, router) {
  const useOverlay = to.matched.some(item => item.meta.useOverlay)

  if (!useOverlay) return next()

  const { addRouteToHistory } = useOverlayNavigation()

  addRouteToHistory(to, from)

  /**
   * Se houver mais de 2 níveis de rota, isto significa que esta rota tem 2 componentes pais, (sendo o primeiro o Root),
   * nestes cenários, o componente overlay precisa ser o segundo componente pai, para renderizar de forma completa.
   * Vamos supor o seguinte cenário: tenho uma lista de contatos, ao clicar em um contato, abro o overlay com o
   * detalhe do contato, porém o detalhe do contato também possui um layout com rotas filhas, como "Resumo", neste
   * cenário, o overlay precisa ser o componente pai do "detalhe" e não somente o resumo.
   *
   * @example
   * [
   *  {
   *    "path": "/"
   *  },
   *  {
   *    "path": "/customers/:id" -> componente que precisa ser o overlay
   *  },
   *  {
   *    "path": "/customers/:id/summary"
   *  }
   * ]
   */
  const matchedIndex = to.matched.length > 1 ? 1 : 0

  const { overlay, default: defaultComponent } = to.matched[matchedIndex]?.components || {}

  const overlayComponent = await getResolvedComponent(overlay || defaultComponent)

  // "overlay" vem como string na query da URL.
  if (to.query.overlay === 'true') {
    const backgroundResult = await getBackgroundComponent()

    if (backgroundResult) {
      const { component: backgroundComponent, resolvedRoute } = backgroundResult

      const { name, params = {}, fullPath, path, query = {} } = resolvedRoute || {}

      to.meta.backgroundRoute = { name, params, fullPath, path, query }

      to.matched[matchedIndex].components = {
        default: backgroundComponent,
        overlay: overlayComponent
      }
    }
  } else {
    to.matched[matchedIndex].components = {
      default: overlayComponent
    }
  }

  next()

  // functions
  function getComponentByRoute (route) {
    const lastIndex = route.matched.length - 1
    const matched = route.matched[lastIndex]

    /**
     * Busca o componente da rota. Pode vir em dois formatos:
     *
     * 1. `.components.default` - Quando:
     *  - A rota usa named views (múltiplos componentes)
     *  - A rota foi processada pelo overlay (criamos a estrutura { default, overlay })
     *  - Exemplo: { components: { default: MainComponent, sidebar: SidebarComponent } }
     *
     * 2. `.component` (sem 's') - Quando:
     *  - A rota tem um único componente simples
     *  - Lazy loading: component: () => import('./Component.vue')
     *  - Exemplo: { component: LoginComponent }
     */
    const component = matched?.components?.default || matched?.component

    return getResolvedComponent(component)
  }

  /**
   * Resolve um componente Vue, seja ele estático ou lazy-loaded.
   *
   * Componentes podem vir de duas formas:
   * 1. **Estático**: Já importado - `LoginComponent`
   * 2. **Lazy**: Função que retorna import - `() => import('./Login.vue')`
   *
   * Esta função garante que ambos os casos sejam tratados e retornem
   * o componente pronto para uso.
   *
   * @param {Object|Function} component - O componente a ser resolvido
   * @returns {Promise<Object>} Uma Promise que resolve com o componente Vue
   */
  function getResolvedComponent (component) {
    return new Promise((resolve, reject) => {
      if (typeof component === 'function') {
        component().then(module => resolve(module.default)).catch(error => reject(error))
      } else {
        resolve(component)
      }
    })
  }

  async function getBackgroundComponent () {
    const backgroundPath = to.query.backgroundOverlay

    if (backgroundPath) {
      try {
        /**
         * A url pode vir com query, ex: "/customers?tab=info", então precisamos separar a query para repassar depois.
         *
         * @example
         * const normalizedURL = decodeURIComponent(backgroundPath) // "/customers?tab=info"
         * const queryString = normalizedURL.split('?')[1] // "tab=info"
         * const queryParams = normalizedURL ? new URLSearchParams(queryString) : {} // URLSearchParams { tab: 'info' }
         */
        const normalizedURL = decodeURIComponent(backgroundPath)
        const queryString = normalizedURL.split('?')[1]
        const queryParams = normalizedURL ? new URLSearchParams(queryString) : {}

        const queryObject = {}

        queryParams.forEach((value, key) => {
          queryObject[key] = value
        })

        const resolvedRoute = router.resolve(normalizedURL)

        const component = await getComponentByRoute(resolvedRoute)

        if (component) {
          return {
            component,
            resolvedRoute: {
              ...resolvedRoute,
              query: queryObject,
              params: resolvedRoute.params
            }
          }
        }
      } catch {
        return null
      }
    }

    // 2. Fallback: meta da rota atual
    const backgroundOverlayName = to.meta?.backgroundOverlayName

    if (backgroundOverlayName) {
      try {
        const resolvedRoute = router.resolve({ name: backgroundOverlayName })

        const component = await getComponentByRoute(resolvedRoute)

        return {
          component,
          resolvedRoute: {
            ...resolvedRoute,
            query: to.query,
            params: {
              ...to.params,
              ...resolvedRoute.params
            }
          }
        }
      } catch {
        return null
      }
    }

    /**
     * 3. Fallback automático: rota base
     *
     * Tenta usar a rota "pai" como background quando não há outras opções.
     *
     * Pega o primeiro segmento da URL para criar uma rota base.
     * Por exemplo: se estou em "/customers/123/details", tenta usar "/customers"
     *
     * @example
     * // URL atual: "/customers/123/edit"
     * // Segments: ["customers", "123", "edit"]
     * // Base path: "/customers" (primeiro segmento)
     */
    const segments = to.path.split('/').filter(Boolean)

    if (segments.length >= 2) {
      const basePath = `/${segments[0]}`

      try {
        const resolvedRoute = router.resolve(basePath)
        const component = await getComponentByRoute(resolvedRoute)

        if (component) {
          return {
            component,
            resolvedRoute: {
              ...resolvedRoute,
              query: to.query,
              params: {
                ...to.params,
                ...resolvedRoute.params
              }
            }
          }
        }
      } catch {
        return null
      }
    }

    // 4. Fallback final
    if (!from.name) return { component: overlayComponent, resolvedRoute: to }

    return null
  }
}
