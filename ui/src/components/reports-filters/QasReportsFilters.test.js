import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasReportsFilters from './QasReportsFilters.vue'

vi.mock('../../composables', async importOriginal => {
  const actual = await importOriginal()
  return { ...actual, useContext: vi.fn(() => ({ context: { value: {} } })) }
})

const mockQas = {
  getGetter: vi.fn(() => ({})),
  getAction: vi.fn(() => Promise.resolve())
}

describe('QasReportsFilters', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasReportsFilters, {
      props: {
        entity: 'reports',
        url: '/api/reports'
      },
      global: {
        provide: {
          qas: mockQas
        }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('entity é obrigatório', () => {
      expect(QasReportsFilters.props?.entity?.required).toBe(true)
    })

    it('url é obrigatório', () => {
      expect(QasReportsFilters.props?.url?.required).toBe(true)
    })

    it('useDefaultFilters tem default true', () => {
      expect(QasReportsFilters.props?.useDefaultFilters?.default).toBe(true)
    })
  })

  describe('Estado inicial', () => {
    it('isFetchingFilters começa false', () => {
      expect(wrapper.vm.isFetchingFilters).toBe(false)
    })

    it('hasInitialFilter começa false', () => {
      expect(wrapper.vm.hasInitialFilter).toBe(false)
    })
  })

  describe('Computed', () => {
    it('filtersFields usa qas.getGetter', () => {
      const fields = wrapper.vm.filtersFields
      expect(mockQas.getGetter).toHaveBeenCalledWith(expect.objectContaining({
        entity: 'reports',
        key: 'filters'
      }))
      expect(typeof fields).toBe('object')
    })

    it('isDisabledButton é true quando filtersFields está vazio', () => {
      mockQas.getGetter.mockReturnValue({})
      expect(wrapper.vm.isDisabledButton).toBe(true)
    })
  })
})
