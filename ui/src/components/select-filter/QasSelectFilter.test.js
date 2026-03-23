import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSelectFilter from './QasSelectFilter.vue'

vi.mock('../../composables/use-default-filters', () => ({
  default: vi.fn(() => ({
    setFilterQuery: vi.fn(),
    triggerDefaultFiltersChange: vi.fn(),
    filterQuery: { value: {} }
  }))
}))

const mockRouter = { push: vi.fn() }
const mockRoute = { query: {} }

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRouter: vi.fn(() => mockRouter),
    useRoute: vi.fn(() => mockRoute)
  }
})

const defaultOptions = [
  { label: 'Empresa A', value: 'company-a' },
  { label: 'Empresa B', value: 'company-b' }
]

describe('QasSelectFilter', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.query = {}
    wrapper = mountComponent(QasSelectFilter, {
      props: {
        options: defaultOptions
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasSelect', () => {
      const select = wrapper.findComponent({ name: 'QasSelect' })
      expect(select.exists()).toBe(true)
    })

    it('passa as options para QasSelect', () => {
      const select = wrapper.findComponent({ name: 'QasSelect' })
      expect(select.props('options')).toEqual(defaultOptions)
    })
  })

  describe('Props', () => {
    it('label tem default "Selecione uma empresa vinculada"', () => {
      expect(QasSelectFilter.props?.label?.default).toContain('empresa')
    })

    it('name tem default "company"', () => {
      expect(QasSelectFilter.props?.name?.default).toBe('company')
    })

    it('options tem default array vazio', () => {
      const def = QasSelectFilter.props?.options?.default()
      expect(def).toEqual([])
    })
  })

  describe('Métodos', () => {
    it('onUpdateModel faz push na rota com o novo valor', () => {
      wrapper.vm.onUpdateModel('company-a')
      expect(mockRouter.push).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            company: 'company-a'
          })
        })
      )
    })

    it('getNormalizedQuery retorna undefined quando query é falsy', () => {
      expect(wrapper.vm.getNormalizedQuery(null)).toBeUndefined()
      expect(wrapper.vm.getNormalizedQuery('')).toBeUndefined()
    })

    it('getNormalizedQuery retorna array quando multiple é true', () => {
      const w = mountComponent(QasSelectFilter, {
        props: { options: defaultOptions, multiple: true }
      })
      const result = w.vm.getNormalizedQuery('company-a')
      expect(Array.isArray(result)).toBe(true)
      expect(result).toContain('company-a')
    })

    it('getNormalizedQuery retorna array quando query já é array e multiple é true', () => {
      const w = mountComponent(QasSelectFilter, {
        props: { options: defaultOptions, multiple: true }
      })
      const result = w.vm.getNormalizedQuery(['company-a', 'company-b'])
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
    })

    it('getNormalizedQuery retorna string quando multiple é false', () => {
      const result = wrapper.vm.getNormalizedQuery('company-a')
      expect(result).toBe('company-a')
    })
  })
})
