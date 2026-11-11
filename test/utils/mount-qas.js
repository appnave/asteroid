import { mount, flushPromises } from '@vue/test-utils'
import * as QuasarExports from 'quasar'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'

import Screen from '../../ui/src/plugins/screen/Screen.js'

const { Quasar } = QuasarExports

// O jsdom não tem ResizeObserver (usado por componentes como o QasTableGenerator)
globalThis.ResizeObserver ||= class ResizeObserver {
  observe () {}
  unobserve () {}
  disconnect () {}
}

const EmptyPage = { template: '<div />' }

/**
 * Nos apps o Quasar registra seus componentes (q-icon, q-btn...) automaticamente, nos testes é preciso registrar.
 */
export const quasarComponents = Object.fromEntries(
  Object.entries(QuasarExports).filter(([name, value]) => /^Q[A-Z]/.test(name) && value?.name)
)

/**
 * Diretivas do Quasar (v-close-popup, v-ripple...), registradas pelo nome que usam no template.
 */
export const quasarDirectives = Object.fromEntries(
  ['ClosePopup', 'Intersection', 'Mutation', 'Ripple', 'Scroll', 'ScrollFire', 'TouchHold', 'TouchPan', 'TouchRepeat', 'TouchSwipe']
    .map(name => QuasarExports[name])
    .filter(directive => directive?.name)
    .map(directive => [directive.name, directive])
)

/**
 * Router em memória com as rotas de erro para onde os componentes de view redirecionam.
 */
export function createTestRouter (routes = []) {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Home', component: EmptyPage },
      { path: '/forbidden', name: 'Forbidden', component: EmptyPage },
      { path: '/not-found', name: 'NotFound', component: EmptyPage },
      { path: '/server-error', name: 'ServerError', component: EmptyPage },
      ...routes
    ]
  })
}

/**
 * Axios falso, cada método é um "vi.fn" que delega para o "handler". Também pode ser chamado como função,
 * igual ao axios: "axios({ method, url, data })".
 *
 * @param {function({ method, url, data, config }): object|Promise<object>} handler - retorna a resposta (ex: { data: {} })
 * ou lança um erro no formato do axios (ex: { response: { status: 404 } }).
 */
export function createAxiosMock (handler = () => ({ data: {} })) {
  const request = method => vi.fn(async (url, ...args) => {
    const hasBody = ['post', 'put', 'patch'].includes(method)

    return handler({
      method,
      url,
      data: hasBody ? args[0] : undefined,
      config: (hasBody ? args[1] : args[0]) || {}
    })
  })

  const axios = vi.fn(async (config = {}) => handler({
    method: config.method || 'get',
    url: config.url,
    data: config.data,
    config
  }))

  return Object.assign(axios, {
    get: request('get'),
    post: request('post'),
    put: request('put'),
    patch: request('patch'),
    delete: request('delete')
  })
}

/**
 * Monta um componente do asteroid com o ambiente de uma aplicação: Quasar, router, axios, "$piniaStore" e "$qas".
 *
 * @example
 * const { wrapper, axios, router, qas } = await mountQas(QasListView, {
 *   props: { entity: 'users', useStore: false },
 *   route: '/?page=2',
 *   axios: createAxiosMock(() => ({ data: { results: [], count: 0 } }))
 * })
 */
export async function mountQas (component, {
  props = {},
  slots = {},
  attrs = {},
  provide = {},
  stubs = {},
  route = '/',
  routes = [],
  axios = createAxiosMock(),
  piniaStore = {}
} = {}) {
  const router = createTestRouter(routes)

  await router.push(route)
  await router.isReady()

  const qas = {
    error: vi.fn(),
    success: vi.fn(),
    delete: vi.fn(),
    dialog: vi.fn(),
    screen: Screen()
  }

  // mesmo formato do "qas" fornecido pelo vue-plugin do asteroid, usando o "$piniaStore" falso
  const injectedQas = {
    delete: qas.delete,
    getAction: ({ entity, key, payload }) => piniaStore[entity]?.[key]?.(payload),
    getGetter: ({ entity, key }) => piniaStore[entity]?.[key]
  }

  const wrapper = mount(component, {
    props,
    slots,
    attrs,
    global: {
      plugins: [Quasar, router],
      components: quasarComponents,
      directives: quasarDirectives,
      stubs,
      provide: { axios, qas: injectedQas, ...provide },
      mocks: {
        $axios: axios,
        $qas: qas,
        $piniaStore: piniaStore
      }
    }
  })

  await flushPromises()

  return { wrapper, router, axios, qas }
}
