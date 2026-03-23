import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { ref } from 'vue'

/**
 * Cria os valores padrão de provide para os testes.
 * Usa uma função para garantir que cada teste receba instâncias novas de vi.fn()
 */
function createDefaultProvide () {
  return {
    isBox: false,
    isDialog: false,
    isHeader: false,
    isTableGenerator: false,
    isFormGenerator: false,
    isExpansionItem: false,
    isListView: false,
    axios: {
      get: vi.fn(() => Promise.resolve({ data: {} })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({ data: {} })),
      patch: vi.fn(() => Promise.resolve({ data: {} }))
    },
    qas: {
      getAction: vi.fn(() => Promise.resolve({ data: {} })),
      getGetter: vi.fn(() => ({})),
      getState: vi.fn(() => null)
    },
    isFetchListSucceeded: ref(false),
    btnPropsDefaults: {},
    stepper: {}
  }
}

/**
 * Valores padrão de provide para os testes (compatibilidade retroativa)
 */
export const defaultProvide = createDefaultProvide()

/**
 * Monta um componente com defaults de provide configurados
 *
 * @param {object} component - Componente Vue a montar
 * @param {object} options - Opções adicionais do mount (serão mescladas com os defaults)
 * @returns {import('@vue/test-utils').VueWrapper}
 */
export function mountComponent (component, options = {}) {
  const {
    global: globalOptions = {},
    ...restOptions
  } = options

  const {
    provide: customProvide = {},
    stubs: customStubs = {},
    ...restGlobal
  } = globalOptions

  return mount(component, {
    ...restOptions,
    global: {
      ...restGlobal,
      provide: {
        ...createDefaultProvide(),
        ...customProvide
      },
      stubs: {
        ...customStubs
      }
    }
  })
}
