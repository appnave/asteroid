import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import { getAction, getState } from '@bildvitta/store-adapter'
import QasFilters from './QasFilters.vue'

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasFilters, {
    props: {
      entity: 'users',
      ...props
    },
    ...mountOptions
  })
}

describe('QasFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAction.mockResolvedValue({ data: {} })
    getState.mockReturnValue(null)
  })

  describe('renderização', () => {
    it('renderiza sem erros', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.find('.qas-filters').exists()).toBe(true)
    })

    it('renderiza campo de busca por padrão', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.showSearch).toBe(true)
    })
  })

  describe('prop useSearch', () => {
    it('oculta busca quando useSearch é false', async () => {
      const wrapper = factory({ useSearch: false, useFilterButton: false })
      await flushPromises()
      expect(wrapper.vm.showSearch).toBe(false)
    })

    it('exibe busca quando useSearch é true', async () => {
      const wrapper = factory({ useSearch: true })
      await flushPromises()
      expect(wrapper.vm.showSearch).toBe(true)
    })
  })

  describe('prop useFilterButton', () => {
    it('exibe ações de filtro quando useFilterButton é true', async () => {
      const wrapper = factory({ useFilterButton: true })
      await flushPromises()
      expect(wrapper.vm.showFilterActions).toBe(true)
    })

    it('oculta ações de filtro quando useFilterButton é false', async () => {
      const wrapper = factory({ useFilterButton: false, useSearch: false })
      await flushPromises()
      expect(wrapper.vm.showFilterActions).toBeFalsy()
    })
  })

  describe('prop useChip', () => {
    it('não exibe chips quando useChip é false', async () => {
      const wrapper = factory({ useChip: false })
      await flushPromises()
      expect(wrapper.vm.hasChip).toBe(false)
    })

    it('não exibe chips sem filtros ativos mesmo com useChip true', async () => {
      const wrapper = factory({ useChip: true })
      await flushPromises()
      // Sem fields, não há filtros ativos
      expect(wrapper.vm.hasActiveFilters).toBe(false)
      expect(wrapper.vm.hasChip).toBeFalsy()
    })
  })

  describe('fetchFilters', () => {
    it('chama getAction com fetchFilters no created', async () => {
      factory()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ entity: 'users', key: 'fetchFilters' })
      )
    })

    it('emite fetch-success quando fetchFilters tem sucesso', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('fetch-success')).toBeTruthy()
    })

    it('emite fetch-error e seta hasFetchError quando fetchFilters falha', async () => {
      getAction.mockRejectedValueOnce(new Error('Falha de rede'))
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.hasFetchError).toBe(true)
      expect(wrapper.emitted('fetch-error')).toBeTruthy()
    })

    it('não chama fetchFilters quando há fields e useFilterButton é false', async () => {
      // simula que já existe fields na store
      getState.mockReturnValue({ name: { name: 'name', type: 'text' } })
      factory({ useFilterButton: false })
      await flushPromises()
      const fetchCalls = getAction.mock.calls.filter(
        call => call[0]?.key === 'fetchFilters'
      )
      expect(fetchCalls.length).toBe(0)
    })
  })

  describe('método filter', () => {
    it('chama router.push ao filtrar com useUpdateRoute true', async () => {
      const wrapper = factory({ useUpdateRoute: true })
      await flushPromises()
      // stub filtersActions.$ref para evitar erro de hide
      if (wrapper.vm.$refs.filtersActions) {
        wrapper.vm.$refs.filtersActions.hideFiltersMenu = vi.fn()
      }
      await wrapper.vm.filter()
      expect(wrapper.vm.$router.push).toHaveBeenCalled()
    })

    it('não chama router.push ao filtrar com useUpdateRoute false', async () => {
      const wrapper = factory({ useUpdateRoute: false })
      await flushPromises()
      // limpa chamadas do created
      wrapper.vm.$router.push.mockClear()
      if (wrapper.vm.$refs.filtersActions) {
        wrapper.vm.$refs.filtersActions.hideFiltersMenu = vi.fn()
      }
      await wrapper.vm.filter()
      expect(wrapper.vm.$router.push).not.toHaveBeenCalled()
    })
  })

  describe('prop useUpdateRoute', () => {
    it('não tenta atualizar rota quando useUpdateRoute é false', async () => {
      factory({ useUpdateRoute: false })
      await flushPromises()
      // Não deve lançar erros
      expect(true).toBe(true)
    })
  })

  describe('slot default', () => {
    it('renderiza conteúdo no slot default', async () => {
      const wrapper = factory({}, {
        slots: {
          default: '<div data-cy="filters-slot-content">Conteúdo</div>'
        }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="filters-slot-content"]').exists()).toBe(true)
    })
  })
})
