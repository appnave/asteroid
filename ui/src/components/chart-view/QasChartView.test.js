import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasChartView from './QasChartView.vue'

const mockQas = {
  getGetter: vi.fn(() => ({})),
  getAction: vi.fn(() => Promise.resolve()),
  error: vi.fn()
}

describe('QasChartView', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasChartView, {
      props: { entity: 'sales', url: '/api/sales' },
      global: {
        provide: { qas: mockQas }
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
      expect(QasChartView.props?.entity?.required).toBe(true)
    })

    it('type default é "bar"', () => {
      expect(wrapper.props('type')).toBe('bar')
    })

    it('height default é "380px"', () => {
      expect(wrapper.props('height')).toBe('380px')
    })

    it('useBox default é true', () => {
      expect(wrapper.props('useBox')).toBe(true)
    })

    it('maxDoughnutSlices default é 15', () => {
      expect(wrapper.props('maxDoughnutSlices')).toBe(15)
    })

    it('urlQueryList default inclui "company"', () => {
      expect(wrapper.props('urlQueryList')).toContain('company')
    })
  })

  describe('Computed', () => {
    it('chartType retorna "BarChart" para type bar', () => {
      expect(wrapper.vm.chartType).toBe('BarChart')
    })

    it('chartType retorna "DoughnutChart" para type doughnut', async () => {
      await wrapper.setProps({ type: 'doughnut' })
      expect(wrapper.vm.chartType).toBe('DoughnutChart')
    })

    it('chartType retorna "LineChart" para type line', async () => {
      await wrapper.setProps({ type: 'line' })
      expect(wrapper.vm.chartType).toBe('LineChart')
    })

    it('isBar é true quando type é bar', () => {
      expect(wrapper.vm.isBar).toBe(true)
    })

    it('isDoughnut é false quando type é bar', () => {
      expect(wrapper.vm.isDoughnut).toBe(false)
    })

    it('showChart é false quando ainda não buscou dados', () => {
      // isFetched começa false
      expect(wrapper.vm.showChart).toBe(false)
    })

    it('hasHeader é false quando title e subtitle são vazios', () => {
      expect(wrapper.vm.hasHeader).toBe(false)
    })

    it('hasHeader é truthy quando title é passado', async () => {
      await wrapper.setProps({ title: 'Vendas' })
      expect(wrapper.vm.hasHeader).toBeTruthy()
    })
  })

  describe('Estado inicial', () => {
    it('isFetching começa false', () => {
      expect(wrapper.vm.isFetching).toBe(false)
    })

    it('data começa como array vazio', () => {
      expect(wrapper.vm.data).toEqual([])
    })
  })
})
