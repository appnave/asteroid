import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils/mount-helper'
import { getAction, getState } from '@bildvitta/store-adapter'
import { useRouter, useRoute } from 'vue-router'
import QasListView from './QasListView.vue'

const defaultEntity = 'users'
const defaultUrl = '/api/users'
const mockResults = [{ id: 1, name: 'João' }, { id: 2, name: 'Maria' }]

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasListView, {
    props: {
      entity: defaultEntity,
      url: defaultUrl,
      ...props
    },
    ...mountOptions
  })
}

describe('QasListView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAction.mockResolvedValue({ data: { results: mockResults, fields: {}, metadata: {}, errors: {}, count: 2 } })
    getState.mockImplementation(payload => {
      if (payload && payload.key === 'list') return mockResults
      if (payload && payload.key === 'totalPages') return 3
      return null
    })
    useRoute.mockReturnValue({
      name: 'users-list',
      params: {},
      query: {},
      meta: {},
      path: '/users'
    })
    useRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      currentRoute: { value: { name: 'users-list', params: {}, query: {}, meta: {}, path: '/users' } }
    })
  })

  describe('renderização básica', () => {
    it('renderiza corretamente com props mínimas', () => {
      const wrapper = factory()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('lifecycle created — fetch', () => {
    it('chama getAction fetchList no created', async () => {
      factory()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ entity: defaultEntity, key: 'fetchList' })
      )
    })

    it('getState key=list alimenta resultsModel', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.resultsModel).toEqual(mockResults)
    })

    it('getState key=totalPages controla paginação', async () => {
      const wrapper = factory({ usePagination: true })
      await flushPromises()
      expect(wrapper.vm.totalPages).toBe(3)
    })

    it('emite fetch-success após fetch bem-sucedido', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('fetch-success')).toBeTruthy()
    })

    it('emite fetch-start ao iniciar o fetch', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('fetch-start')).toBeTruthy()
    })

    it('emite fetch-error quando getAction falha', async () => {
      getAction.mockRejectedValueOnce(new Error('fetch error'))
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('fetch-error')).toBeTruthy()
    })
  })

  describe('paginação', () => {
    it('hasPages é true quando totalPages > 1 e usePagination=true', async () => {
      const wrapper = factory({ usePagination: true })
      await flushPromises()
      expect(wrapper.vm.hasPages).toBe(true)
    })

    it('hasPages é false quando usePagination=false', async () => {
      const wrapper = factory({ usePagination: false })
      await flushPromises()
      expect(wrapper.vm.hasPages).toBe(false)
    })

    it('hasPages é false quando totalPages <= 1', async () => {
      getState.mockImplementation(payload => {
        if (payload && payload.key === 'list') return mockResults
        if (payload && payload.key === 'totalPages') return 1
        return null
      })
      const wrapper = factory({ usePagination: true })
      await flushPromises()
      expect(wrapper.vm.hasPages).toBe(false)
    })

    it('changePage chama router.push com query page', async () => {
      const pushMock = vi.fn()
      const wrapper = factory({ usePagination: true }, {
        global: {
          mocks: {
            $router: { push: pushMock, replace: vi.fn() },
            $route: { name: 'home', params: {}, query: {}, meta: {}, path: '/' }
          }
        }
      })
      await flushPromises()
      wrapper.vm.page = 2
      await wrapper.vm.changePage()
      expect(pushMock).toHaveBeenCalledWith(expect.objectContaining({ query: expect.objectContaining({ page: 2 }) }))
    })
  })

  describe('filtros', () => {
    it('useFilter=true renderiza QasFilters', async () => {
      const wrapper = factory({ useFilter: true })
      await flushPromises()
      expect(wrapper.findComponent({ name: 'QasFilters' }).exists()).toBe(true)
    })

    it('useFilter=false não renderiza QasFilters', async () => {
      const wrapper = factory({ useFilter: false })
      await flushPromises()
      expect(wrapper.findComponent({ name: 'QasFilters' }).exists()).toBe(false)
    })
  })

  describe('resultados vazios', () => {
    it('QasEmptyResultText visível quando results = []', async () => {
      getState.mockImplementation(payload => {
        if (payload && payload.key === 'list') return []
        if (payload && payload.key === 'totalPages') return 0
        return null
      })
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.findComponent({ name: 'QasEmptyResultText' }).exists()).toBe(true)
    })

    it('hasResults é false quando resultsModel está vazio', async () => {
      getState.mockImplementation(payload => {
        if (payload && payload.key === 'list') return []
        return null
      })
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.hasResults).toBe(false)
    })
  })

  describe('eventos window delete-success', () => {
    it('registra listener delete-success quando mounted com useAutoRefetchOnDelete=true', () => {
      const addEventSpy = vi.spyOn(window, 'addEventListener')
      factory({ useAutoRefetchOnDelete: true })
      expect(addEventSpy).toHaveBeenCalledWith('delete-success', expect.any(Function))
      addEventSpy.mockRestore()
    })

    it('useAutoRefetchOnDelete=true re-chama fetchList ao receber delete-success', async () => {
      factory({ useAutoRefetchOnDelete: true })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValue({ data: { results: mockResults, fields: {}, metadata: {}, errors: {}, count: 2 } })
      window.dispatchEvent(new CustomEvent('delete-success', { detail: { entity: defaultEntity } }))
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ entity: defaultEntity, key: 'fetchList' })
      )
    })

    it('não registra listener delete-success quando hasDeleteEventListener=false', () => {
      const addEventSpy = vi.spyOn(window, 'addEventListener')
      factory({ useAutoRefetchOnDelete: false, useAutoHandleOnDelete: false })
      expect(addEventSpy).not.toHaveBeenCalledWith('delete-success', expect.any(Function))
      addEventSpy.mockRestore()
    })
  })

  describe('provide', () => {
    it('provide isListView = true', () => {
      const wrapper = factory()
      expect(wrapper.vm.$.provides).toMatchObject({ isListView: true })
    })

    it('provide isFetchListSucceeded começa como false e vai para true após fetch', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.isFetchListSucceeded).toBe(true)
    })
  })

  describe('slots', () => {
    it('slot header renderiza conteúdo customizado quando fornecido', async () => {
      const wrapper = factory({}, { slots: { header: '<div data-cy="list-header">header</div>' } })
      await flushPromises()
      expect(wrapper.find('[data-cy="list-header"]').exists()).toBe(true)
    })

    it('slot fetch-error exibido quando mx_hasFetchError=true e sem resultados', async () => {
      // Precisa de lista vazia para showResults=false aparecer o slot fetch-error
      getState.mockImplementation(() => null)
      const wrapper = factory({ useFilter: false }, {
        slots: { 'fetch-error': '<div data-cy="fetch-error-slot">erro</div>' }
      })
      await flushPromises()
      wrapper.vm.mx_hasFetchError = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-cy="fetch-error-slot"]').exists()).toBe(true)
    })
  })

  describe('useStore=false', () => {
    it('usa this.$axios.get diretamente quando useStore=false', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { results: mockResults, fields: {}, metadata: {}, errors: {}, count: 2 } })
      factory({ useStore: false, useFilter: false }, {
        global: {
          mocks: {
            $axios: { get: axiosGetMock }
          }
        }
      })
      await flushPromises()
      expect(axiosGetMock).toHaveBeenCalled()
      // Verifica que fetchList foi via axios, não via getAction com key fetchList
      const fetchListCalls = getAction.mock.calls.filter(args => args[0]?.key === 'fetchList')
      expect(fetchListCalls).toHaveLength(0)
    })

    it('resultsList é populado via setResults quando useStore=false', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { results: [{ id: 3, name: 'Pedro' }], fields: {}, metadata: {}, count: 1 } })
      const wrapper = factory({ useStore: false }, {
        global: {
          mocks: {
            $axios: { get: axiosGetMock }
          }
        }
      })
      await flushPromises()
      expect(wrapper.vm.resultsList).toEqual([{ id: 3, name: 'Pedro' }])
    })
  })

  describe('beforeFetch', () => {
    it('beforeFetch é chamado antes do fetchList', async () => {
      const beforeFetch = vi.fn(({ resolve }) => resolve())
      factory({ beforeFetch })
      await flushPromises()
      expect(beforeFetch).toHaveBeenCalled()
    })
  })
})
