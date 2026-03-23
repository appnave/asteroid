import { vi } from 'vitest'

/**
 * Cria um stub de rota para testes
 *
 * @returns {object} Objeto de rota mockado
 */
export function createRouteStub () {
  return {
    name: 'home',
    params: {},
    query: {},
    meta: {},
    path: '/'
  }
}

/**
 * Cria um stub de router para testes
 *
 * @returns {object} Objeto de router mockado
 */
export function createRouterStub () {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: { value: createRouteStub() }
  }
}

/**
 * Cria um stub de ação do store-adapter
 *
 * @param {*} resolveValue - Valor que a promise resolve
 * @returns {Function} Mock de vi.fn()
 */
export function createStoreActionStub (resolveValue = { data: {} }) {
  return vi.fn(() => Promise.resolve(resolveValue))
}

/**
 * Cria um stub de axios
 *
 * @param {*} resolveValue - Valor que a promise resolve
 * @returns {Function} Mock de vi.fn()
 */
export function createAxiosStub (resolveValue = { data: {} }) {
  const stub = vi.fn(() => Promise.resolve(resolveValue))
  stub.get = vi.fn(() => Promise.resolve(resolveValue))
  stub.post = vi.fn(() => Promise.resolve(resolveValue))
  stub.put = vi.fn(() => Promise.resolve(resolveValue))
  stub.patch = vi.fn(() => Promise.resolve(resolveValue))
  stub.delete = vi.fn(() => Promise.resolve(resolveValue))
  return stub
}

/**
 * Gera um objeto de fields no formato esperado pelo QasFormGenerator/QasFormView
 *
 * @param {string[]} keys - Lista de chaves dos campos
 * @param {object} overrides - Sobrescreve atributos padrão para cada campo
 * @returns {object} Objeto de fields
 */
export function createFieldsStub (keys = [], overrides = {}) {
  return keys.reduce((acc, key) => {
    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      type: 'text',
      component: 'QasInput',
      ...overrides[key]
    }
    return acc
  }, {})
}

/**
 * Configura mocks do store-adapter para getAction e getState.
 * Deve ser chamado após importar getAction e getState do módulo mockado.
 *
 * @param {object} options
 * @param {import('vitest').MockInstance} options.getAction - Mock de getAction importado no teste
 * @param {import('vitest').MockInstance} options.getState - Mock de getState importado no teste
 * @param {Array} options.list - Lista de resultados retornada por getState(entity/list)
 * @param {number} options.totalPages - Total de páginas retornado por getState(entity/totalPages)
 * @param {object} options.result - Resultado individual retornado por fetchSingle
 */
export function createStoreAdapterMock ({ getAction, getState, list = [], totalPages = 1, result = {} } = {}) {
  if (getAction) {
    getAction.mockResolvedValue({ data: { results: list, result, fields: {}, metadata: {} } })
  }
  if (getState) {
    getState.mockImplementation(key => {
      if (key.endsWith('/list')) return list
      if (key.endsWith('/totalPages')) return totalPages
      return null
    })
  }
}

/**
 * Cria um mock de axios com resposta configurável
 *
 * @param {object} options
 * @param {*} options.data - Dados retornados na resposta
 * @param {number} options.status - HTTP status code
 * @returns {object} Objeto axios mockado
 */
export function createAxiosMock ({ data = {}, status = 200 } = {}) {
  const response = { data, status }
  return {
    get: vi.fn(() => Promise.resolve(response)),
    post: vi.fn(() => Promise.resolve(response)),
    put: vi.fn(() => Promise.resolve(response)),
    patch: vi.fn(() => Promise.resolve(response)),
    delete: vi.fn(() => Promise.resolve(response))
  }
}

/**
 * Cria um mock de route/router configurável
 *
 * @param {object} options
 * @param {object} options.params - Parâmetros de rota
 * @param {object} options.query - Query string da rota
 * @returns {{ route: object, router: object }}
 */
export function createRouterMock ({ params = {}, query = {} } = {}) {
  const route = {
    name: 'home',
    params,
    query,
    meta: {},
    path: '/'
  }
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: { value: route }
  }
  return { route, router }
}
