import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils/mount-helper'
import { useRoute } from 'vue-router'
import QasSingleView from './QasSingleView.vue'

const defaultEntity = 'users'
const defaultUrl = '/api/users'

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasSingleView, {
    props: {
      entity: defaultEntity,
      url: defaultUrl,
      ...props
    },
    ...mountOptions
  })
}

describe('QasSingleView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRoute.mockReturnValue({
      name: 'users-show',
      params: { id: '10' },
      query: {},
      meta: {},
      path: '/users/10'
    })
  })

  describe('renderização básica', () => {
    it('renderiza corretamente com props mínimas', () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {}, errors: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({})),
        getState: vi.fn().mockReturnValue(null)
      }
      const wrapper = factory({}, { global: { provide: { qas: qasProvide } } })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('expose', () => {
    it('expõe fetchSingle acessível via wrapper.vm', () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({}))
      }
      const wrapper = factory({}, { global: { provide: { qas: qasProvide } } })
      expect(typeof wrapper.vm.fetchSingle).toBe('function')
    })

    it('expõe fetchHandler acessível via wrapper.vm', () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({}))
      }
      const wrapper = factory({}, { global: { provide: { qas: qasProvide } } })
      expect(typeof wrapper.vm.fetchHandler).toBe('function')
    })
  })

  describe('lifecycle created', () => {
    it('chama qas.getAction com fetchSingle ao ser criado', async () => {
      const getActionMock = vi.fn().mockResolvedValue({ data: { result: { id: 10 }, fields: {}, metadata: {}, errors: {} } })
      factory({ useStore: true }, {
        global: {
          provide: {
            qas: {
              getAction: getActionMock,
              getGetter: vi.fn().mockReturnValue(() => ({ id: 10 }))
            }
          }
        }
      })
      await flushPromises()
      expect(getActionMock).toHaveBeenCalledWith(
        expect.objectContaining({ entity: defaultEntity, key: 'fetchSingle' })
      )
    })

    it('usa route.params.id no payload de fetchSingle', async () => {
      const getActionMock = vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {} } })
      factory({ useStore: true }, {
        global: {
          provide: {
            qas: {
              getAction: getActionMock,
              getGetter: vi.fn().mockReturnValue(() => ({}))
            }
          }
        }
      })
      await flushPromises()
      expect(getActionMock).toHaveBeenCalledWith(
        expect.objectContaining({ payload: expect.objectContaining({ id: '10' }) })
      )
    })

    it('usa customId quando fornecido ao invés de route.params.id', async () => {
      const getActionMock = vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {} } })
      factory({ useStore: true, customId: 'custom-99' }, {
        global: {
          provide: {
            qas: {
              getAction: getActionMock,
              getGetter: vi.fn().mockReturnValue(() => ({}))
            }
          }
        }
      })
      await flushPromises()
      expect(getActionMock).toHaveBeenCalledWith(
        expect.objectContaining({ payload: expect.objectContaining({ id: 'custom-99' }) })
      )
    })

    it('emite fetch-success após fetch bem-sucedido', async () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 }, fields: {}, metadata: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({ id: 10 }))
      }
      const wrapper = factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
      await flushPromises()
      expect(wrapper.emitted('fetch-success')).toBeTruthy()
    })

    it('emite fetch-error quando fetch falha', async () => {
      const qasProvide = {
        getAction: vi.fn().mockRejectedValue({ response: { status: 404, data: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({}))
      }
      const wrapper = factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
      await flushPromises()
      expect(wrapper.emitted('fetch-error')).toBeTruthy()
    })
  })

  describe('emits de model', () => {
    it('emite update:result com dados do resultado após fetch bem-sucedido', async () => {
      // useStore=false usa viewState.result (não getGetter), então podemos validar que result muda
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { result: { id: 10, name: 'João' }, fields: {}, metadata: {} } })
      const wrapper = factory({ useStore: false }, {
        global: {
          provide: {
            axios: { get: axiosGetMock },
            qas: { getAction: vi.fn(), getGetter: vi.fn().mockReturnValue(() => ({})) }
          }
        }
      })
      await flushPromises()
      expect(wrapper.emitted('update:result')).toBeTruthy()
    })
  })

  describe('useStore=false', () => {
    it('usa axios.get diretamente quando useStore=false', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { result: { id: 10 }, fields: {}, metadata: {} } })
      factory({ useStore: false }, {
        global: {
          provide: {
            axios: { get: axiosGetMock },
            qas: { getAction: vi.fn(), getGetter: vi.fn().mockReturnValue(() => ({})) }
          }
        }
      })
      await flushPromises()
      expect(axiosGetMock).toHaveBeenCalled()
    })

    it('usa url customizada para busca quando useStore=false', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { result: {}, fields: {}, metadata: {} } })
      factory({ useStore: false, url: '/api/custom' }, {
        global: {
          provide: {
            axios: { get: axiosGetMock },
            qas: { getAction: vi.fn(), getGetter: vi.fn().mockReturnValue(() => ({})) }
          }
        }
      })
      await flushPromises()
      expect(axiosGetMock).toHaveBeenCalledWith(expect.stringContaining('/api/custom'), expect.anything())
    })
  })

  describe('slots', () => {
    it('slot default é renderizado quando há resultado', async () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 }, fields: {}, metadata: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({ id: 10 }))
      }
      const wrapper = factory({ useStore: true }, {
        global: { provide: { qas: qasProvide } },
        slots: { default: '<div data-cy="single-content">conteúdo</div>' }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="single-content"]').exists()).toBe(true)
    })

    it('slot header renderiza conteúdo customizado', async () => {
      const qasProvide = {
        getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 }, fields: {}, metadata: {} } }),
        getGetter: vi.fn().mockReturnValue(() => ({ id: 10 }))
      }
      const wrapper = factory({ useStore: true }, {
        global: { provide: { qas: qasProvide } },
        slots: { header: '<div data-cy="custom-header">header</div>' }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="custom-header"]').exists()).toBe(true)
    })

    it('slot fetch-error exibido quando fetch falha com status não mapeado', async () => {
      // Rejeita com erro sem response (ou status não mapeado) para não redirecionar
      const qasProvide = {
        getAction: vi.fn().mockRejectedValue({ response: null }),
        getGetter: vi.fn().mockReturnValue(() => ({}))
      }
      const wrapper = factory({ useStore: true }, {
        global: { provide: { qas: qasProvide } },
        slots: { 'fetch-error': '<div data-cy="fetch-error-single">erro</div>' }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="fetch-error-single"]').exists()).toBe(true)
    })
  })
})
