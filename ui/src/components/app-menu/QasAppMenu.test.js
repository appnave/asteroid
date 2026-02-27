import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasAppMenu from './QasAppMenu.vue'

// Mock composables internos do app-menu
vi.mock('./composables/use-app-menu-dropdown', () => ({
  default: vi.fn(() => ({
    appMenuDropdownProps: {},
    showAppMenuDropdown: false
  }))
}))

// Mocka helpers; setScrollGradient retorna um initializeScrollGradient que aceita null sem lançar
const mockInitializeScrollGradient = vi.fn()

vi.mock('../../helpers', () => ({
  handleProcess: vi.fn(fn => { try { return fn() } catch { return undefined } }),
  setScrollGradient: vi.fn(() => ({
    initializeScrollGradient: mockInitializeScrollGradient
  })),
  filterListByHandle: vi.fn(list => list.filter(i => i.handle).map(i => i.item))
}))

const mockQas = {
  getGetter: vi.fn(() => ({})),
  getAction: vi.fn(() => Promise.resolve()),
  error: vi.fn()
}

const defaultProps = {
  appUserProps: { name: 'Douglas' },
  brand: '/logo.svg',
  miniBrand: '/logo-mini.svg'
}

// Stub do q-drawer que renderiza o slot diretamente (sem portal/teleport)
const QDrawerStub = {
  name: 'QDrawer',
  template: '<div class="q-drawer-stub"><slot /></div>',
  props: ['modelValue', 'behavior', 'mini', 'miniWidth', 'width', 'showIfAbove']
}

describe('QasAppMenu', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasAppMenu, {
      props: defaultProps,
      global: {
        provide: { qas: mockQas },
        stubs: { QDrawer: QDrawerStub }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('contém a classe qas-app-menu', () => {
      expect(wrapper.find('.qas-app-menu').exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('brand é obrigatório', () => {
      expect(QasAppMenu.props?.brand?.required).toBe(true)
    })

    it('miniBrand é obrigatório', () => {
      expect(QasAppMenu.props?.miniBrand?.required).toBe(true)
    })

    it('appUserProps é obrigatório', () => {
      expect(QasAppMenu.props?.appUserProps?.required).toBe(true)
    })

    it('items default é array vazio', () => {
      const def = QasAppMenu.props?.items?.default()
      expect(def).toEqual([])
    })

    it('useHomeItem default é true', () => {
      expect(QasAppMenu.props?.useHomeItem?.default).toBe(true)
    })

    it('modelValue default é true', () => {
      expect(QasAppMenu.props?.modelValue?.default).toBe(true)
    })
  })

  describe('Computed', () => {
    it('normalizedItems inclui item Início quando useHomeItem é true', () => {
      expect(wrapper.vm.normalizedItems[0]?.label).toBe('Início')
    })

    it('normalizedItems não inclui Início quando useHomeItem é false', () => {
      const w = mountComponent(QasAppMenu, {
        props: { ...defaultProps, useHomeItem: false, items: [{ label: 'Relatórios', to: '/reports' }] },
        global: { provide: { qas: mockQas }, stubs: { QDrawer: QDrawerStub } }
      })
      expect(w.vm.normalizedItems.find(i => i.label === 'Início')).toBeUndefined()
    })

    it('normalizedItems inclui itens passados via props.items', () => {
      const w = mountComponent(QasAppMenu, {
        props: {
          ...defaultProps,
          items: [{ label: 'Clientes', to: '/clients', icon: 'sym_r_people' }]
        },
        global: { provide: { qas: mockQas }, stubs: { QDrawer: QDrawerStub } }
      })
      const labels = w.vm.normalizedItems.map(i => i.label)
      expect(labels).toContain('Clientes')
    })

    it('model retorna o valor de modelValue', () => {
      expect(wrapper.vm.model).toBe(true)
    })
  })

  describe('Emits', () => {
    it('emite update:modelValue ao fechar o drawer via closeDrawer', () => {
      wrapper.vm.closeDrawer()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe(false)
    })
  })
})
