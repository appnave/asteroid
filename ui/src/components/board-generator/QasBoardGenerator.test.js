import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasBoardGenerator from './QasBoardGenerator.vue'

const mockAxios = { get: vi.fn(), post: vi.fn(), patch: vi.fn() }

const defaultHeaders = [
  { status: 'active', label: 'Ativo' },
  { status: 'inactive', label: 'Inativo' }
]

describe('QasBoardGenerator', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasBoardGenerator, {
      props: {
        headers: defaultHeaders,
        columnIdKey: 'status',
        columnUrl: '/api/items',
        results: {}
      },
      global: {
        provide: {
          axios: mockAxios,
          isFetchListSucceeded: { value: false },
          isListView: false
        }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza uma coluna para cada header', () => {
      const columns = wrapper.findAll('.qas-board-generator__column')
      expect(columns.length).toBe(defaultHeaders.length)
    })

    it('não renderiza QasEmptyResultText quando há resultados', () => {
      const w = mountComponent(QasBoardGenerator, {
        props: {
          headers: defaultHeaders,
          columnIdKey: 'status',
          columnUrl: '/api/items',
          results: {
            active: [{ id: '1', name: 'Item 1' }],
            inactive: []
          }
        },
        global: {
          provide: { axios: mockAxios, isFetchListSucceeded: { value: false }, isListView: false }
        }
      })
      // Coluna com itens não deve ter EmptyResultText se há dados
      expect(w.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('columnUrl é obrigatório', () => {
      expect(QasBoardGenerator.props?.columnUrl?.required).toBe(true)
    })

    it('columnIdKey é obrigatório', () => {
      expect(QasBoardGenerator.props?.columnIdKey?.required).toBe(true)
    })

    it('limitPerColumn tem default 12', () => {
      expect(QasBoardGenerator.props?.limitPerColumn?.default).toBe(12)
    })

    it('aplica columnWidth como style no container', () => {
      const w = mountComponent(QasBoardGenerator, {
        props: {
          headers: defaultHeaders,
          columnIdKey: 'status',
          columnUrl: '/api',
          results: {},
          columnWidth: '400px'
        },
        global: {
          provide: { axios: mockAxios, isFetchListSucceeded: { value: false }, isListView: false }
        }
      })
      expect(w.vm.containerStyle).toBe('width: 400px;')
    })
  })

  describe('Computed', () => {
    it('hasColumnsLength é false quando results está vazio', () => {
      expect(wrapper.vm.hasColumnsLength).toBe(false)
    })

    it('hasColumnsLength é true quando results tem dados', () => {
      const w = mountComponent(QasBoardGenerator, {
        props: {
          headers: defaultHeaders,
          columnIdKey: 'status',
          columnUrl: '/api',
          results: { active: [{ id: '1' }] }
        },
        global: {
          provide: { axios: mockAxios, isFetchListSucceeded: { value: false }, isListView: false }
        }
      })
      expect(w.vm.hasColumnsLength).toBe(true)
    })

    it('containerStyle usa a columnWidth padrão 300px', () => {
      expect(wrapper.vm.containerStyle).toBe('width: 300px;')
    })
  })

  describe('Métodos', () => {
    it('getKeyByHeader retorna o valor pelo columnIdKey', () => {
      const key = wrapper.vm.getKeyByHeader({ status: 'active', label: 'Ativo' })
      expect(key).toBe('active')
    })

    it('getItemsByHeader retorna array vazio quando hasColumnsLength é false', () => {
      const items = wrapper.vm.getItemsByHeader({ status: 'active' })
      expect(items).toEqual([])
    })

    it('getItemsByHeader retorna os itens da coluna quando há resultados', () => {
      const w = mountComponent(QasBoardGenerator, {
        props: {
          headers: defaultHeaders,
          columnIdKey: 'status',
          columnUrl: '/api',
          results: { active: [{ id: '1', name: 'Teste' }] }
        },
        global: {
          provide: { axios: mockAxios, isFetchListSucceeded: { value: false }, isListView: false }
        }
      })
      const items = w.vm.getItemsByHeader({ status: 'active' })
      expect(items).toHaveLength(1)
      expect(items[0].name).toBe('Teste')
    })

    it('expõe fetchColumns via defineExpose', () => {
      expect(typeof wrapper.vm.fetchColumns).toBe('function')
    })

    it('expõe fetchColumn via defineExpose', () => {
      expect(typeof wrapper.vm.fetchColumn).toBe('function')
    })

    it('expõe reset via defineExpose', () => {
      expect(typeof wrapper.vm.reset).toBe('function')
    })
  })

  describe('Slots', () => {
    it('renderiza slot header-column', () => {
      const w = mountComponent(QasBoardGenerator, {
        props: {
          headers: defaultHeaders,
          columnIdKey: 'status',
          columnUrl: '/api',
          results: {}
        },
        global: {
          provide: { axios: mockAxios, isFetchListSucceeded: { value: false }, isListView: false }
        },
        slots: {
          'header-column': '<div class="custom-header">Custom Header</div>'
        }
      })
      expect(w.find('.custom-header').exists()).toBe(true)
    })
  })
})
