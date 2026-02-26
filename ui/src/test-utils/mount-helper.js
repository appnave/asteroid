import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Valores padrão de provide para os testes
 */
export const defaultProvide = {
  isBox: false,
  isDialog: false,
  isHeader: false,
  isTableGenerator: false,
  isFormGenerator: false,
  isExpansionItem: false,
  isListView: false,
  axios: vi.fn(),
  qas: {},
  btnPropsDefaults: {},
  stepper: {}
}

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
        ...defaultProvide,
        ...customProvide
      },
      stubs: {
        ...customStubs
      }
    }
  })
}
