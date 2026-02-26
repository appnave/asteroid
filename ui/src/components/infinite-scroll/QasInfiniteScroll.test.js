import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import QasInfiniteScroll from './QasInfiniteScroll.vue'

const stopMock = vi.fn()
const resumeMock = vi.fn()
const resetMock = vi.fn()

const QInfiniteScrollStub = {
  name: 'QInfiniteScroll',
  template: '<div class="q-infinite-scroll-stub"><slot /><slot name="loading" /></div>',
  emits: ['load'],
  methods: {
    stop: stopMock,
    resume: resumeMock,
    reset: resetMock
  }
}

const QasEmptyResultTextStub = {
  template: '<div class="qas-empty-result-text-stub" />'
}

function createWrapper (props = {}, options = {}) {
  const { global: globalOptions = {}, ...restOptions } = options

  return mountComponent(QasInfiniteScroll, {
    props: { url: '/api/items', ...props },
    ...restOptions,
    global: {
      stubs: {
        QInfiniteScroll: QInfiniteScrollStub,
        QasEmptyResultText: QasEmptyResultTextStub,
        ...globalOptions.stubs
      },
      ...globalOptions
    }
  })
}

describe('QasInfiniteScroll', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com a prop url obrigatória', () => {
      const wrapper = createWrapper()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-infinite-scroll" no elemento raiz', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('qas-infinite-scroll')
    })

    it('deve renderizar o q-infinite-scroll interno', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.q-infinite-scroll-stub').exists()).toBeTruthy()
    })
  })

  describe('prop maxHeight', () => {
    it('deve aplicar max-height no estilo do container quando maxHeight é definido', () => {
      const wrapper = createWrapper({ maxHeight: '400px' })

      expect(wrapper.attributes('style')).toContain('max-height: 400px')
    })

    it('não deve aplicar estilo de max-height quando maxHeight não é definido', () => {
      const wrapper = createWrapper()

      expect(wrapper.attributes('style') || '').not.toContain('max-height')
    })
  })

  describe('métodos expostos', () => {
    it('deve expor o método refresh()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.refresh).toBe('function')
    })

    it('deve expor o método remove()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.remove).toBe('function')
    })

    it('deve expor o método fetchList()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.fetchList).toBe('function')
    })
  })

  describe('método remove()', () => {
    it('deve executar remove() sem erros', () => {
      const list = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const wrapper = createWrapper({ list })

      expect(() => wrapper.vm.remove(0)).not.toThrow()
    })

    it('deve remover o item do array ao chamar remove()', () => {
      // defineModel usa a referência do prop diretamente, então splice muta o array original
      const list = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const wrapper = createWrapper({ list })

      wrapper.vm.remove(0)

      expect(list).toHaveLength(2)
    })
  })

  describe('método fetchList()', () => {
    it('deve chamar axios.get com a url e parâmetros corretos', async () => {
      const mockAxios = {
        get: vi.fn(() => Promise.resolve({
          data: { results: [{ id: 1 }], count: 1, fields: {} }
        }))
      }

      const wrapper = mountComponent(QasInfiniteScroll, {
        props: { url: '/api/items', limitPerPage: 5 },
        global: {
          stubs: {
            QInfiniteScroll: QInfiniteScrollStub,
            QasEmptyResultText: QasEmptyResultTextStub
          },
          provide: {
            axios: mockAxios
          }
        }
      })

      await wrapper.vm.fetchList()

      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/items',
        expect.objectContaining({
          params: expect.objectContaining({ limit: 5 })
        })
      )
    })

    it('deve emitir "fetch-success" após busca bem-sucedida', async () => {
      const mockAxios = {
        get: vi.fn(() => Promise.resolve({
          data: { results: [{ id: 1 }], count: 1, fields: {} }
        }))
      }

      const wrapper = mountComponent(QasInfiniteScroll, {
        props: { url: '/api/items' },
        global: {
          stubs: {
            QInfiniteScroll: QInfiniteScrollStub,
            QasEmptyResultText: QasEmptyResultTextStub
          },
          provide: {
            axios: mockAxios
          }
        }
      })

      await wrapper.vm.fetchList()

      expect(wrapper.emitted('fetch-success')).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot dentro do q-infinite-scroll', () => {
      const wrapper = createWrapper({}, {
        slots: { default: '<span class="slot-content">Meu conteúdo</span>' }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
      expect(wrapper.find('.slot-content').text()).toBe('Meu conteúdo')
    })
  })
})
