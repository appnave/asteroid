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
