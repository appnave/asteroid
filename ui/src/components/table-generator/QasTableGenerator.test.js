import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasTableGenerator from './QasTableGenerator.vue'

const defaultFields = {
  name: { name: 'name', label: 'Nome', type: 'text' },
  email: { name: 'email', label: 'E-mail', type: 'email' }
}

const defaultResults = [
  { name: 'João', email: 'joao@test.com' },
  { name: 'Maria', email: 'maria@test.com' }
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasTableGenerator, {
    props: {
      fields: defaultFields,
      results: defaultResults,
      ...props
    },
    ...mountOptions
  })
}

describe('QasTableGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-table-generator').exists()).toBe(true)
    })

    it('renderiza QasBox por padrão (useBox true)', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-box').exists()).toBe(true)
    })

    it('não renderiza QasBox quando useBox é false', () => {
      const wrapper = factory({ useBox: false })
      expect(wrapper.find('.qas-box').exists()).toBe(false)
    })

    it('hasResults é true quando há resultados', () => {
      const wrapper = factory()
      expect(wrapper.vm.hasResults).toBe(true)
    })

    it('hasResults é false quando não há resultados', () => {
      const wrapper = factory({ results: [] })
      expect(wrapper.vm.hasResults).toBe(false)
    })
  })

  describe('prop skeleton', () => {
    it('normalizedResults retorna fake rows no skeleton mode', () => {
      const wrapper = factory({
        skeleton: true,
        columns: ['name', 'email']
      })
      expect(wrapper.vm.normalizedResults.length).toBe(24)
    })
  })

  describe('prop useSelection', () => {
    it('configura selection como multiple quando useSelection é true', () => {
      const wrapper = factory({ useSelection: true })
      expect(wrapper.vm.attributes.selection).toBe('multiple')
    })

    it('não define selection quando useSelection é false', () => {
      const wrapper = factory({ useSelection: false })
      expect(wrapper.vm.attributes.selection).toBeUndefined()
    })
  })

  describe('prop useVirtualScroll', () => {
    it('usa virtualScroll quando useVirtualScroll é true', () => {
      const wrapper = factory({ useVirtualScroll: true })
      expect(wrapper.vm.attributes.virtualScroll).toBe(true)
    })
  })

  describe('colunas', () => {
    it('gera colunas automaticamente a partir dos fields quando columns está vazio', () => {
      const wrapper = factory()
      const cols = wrapper.vm.columnsByFields
      expect(cols.length).toBe(2)
      expect(cols.map(c => c.name)).toContain('name')
      expect(cols.map(c => c.name)).toContain('email')
    })
  })

  describe('emit update:selected', () => {
    it('emite update:selected ao alterar modelo de seleção', async () => {
      const wrapper = factory({ useSelection: true, selected: [] })
      wrapper.vm.selectedModel = [defaultResults[0]]
      await flushPromises()
      expect(wrapper.emitted('update:selected')).toBeTruthy()
    })
  })

  describe('slot parent-header', () => {
    it('renderiza slot parent-header', () => {
      const wrapper = factory({}, {
        slots: {
          'parent-header': '<h2 data-cy="custom-header">Header</h2>'
        }
      })
      expect(wrapper.find('[data-cy="custom-header"]').exists()).toBe(true)
    })
  })
})
