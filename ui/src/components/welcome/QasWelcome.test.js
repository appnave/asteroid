import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasWelcome from './QasWelcome.vue'

const defaultShortcuts = [
  { label: 'Usuários', icon: 'sym_r_person', to: '/users' },
  { label: 'Config', icon: 'sym_r_settings', to: '/settings' }
]

describe('QasWelcome', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasWelcome, {
      props: {}
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('não renderiza atalhos quando shortcuts está vazio', () => {
      const shortcuts = wrapper.findAllComponents({ name: 'PvWelcomeShortcutCard' })
      expect(shortcuts.length).toBe(0)
    })

    it('renderiza atalhos quando shortcuts tem itens', () => {
      const w = mountComponent(QasWelcome, {
        props: { shortcuts: defaultShortcuts }
      })
      const shortcutCards = w.findAllComponents({ name: 'PvWelcomeShortcutCard' })
      expect(shortcutCards.length).toBe(defaultShortcuts.length)
    })

    it('não renderiza QasActionsMenu quando actionsMenuProps está vazio', () => {
      const menu = wrapper.findComponent({ name: 'QasActionsMenu' })
      expect(menu.exists()).toBe(false)
    })

    it('renderiza QasActionsMenu quando actionsMenuProps tem propriedades', () => {
      const w = mountComponent(QasWelcome, {
        props: { actionsMenuProps: { items: [{ label: 'Ação', onClick: vi.fn() }] } }
      })
      const menu = w.findComponent({ name: 'QasActionsMenu' })
      expect(menu.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('name tem default string vazia', () => {
      expect(QasWelcome.props?.name?.default).toBe('')
    })

    it('shortcuts tem default array vazio', () => {
      const def = QasWelcome.props?.shortcuts?.default()
      expect(def).toEqual([])
    })
  })

  describe('Computed', () => {
    it('firstName retorna o primeiro nome', () => {
      const w = mountComponent(QasWelcome, {
        props: { name: 'João Silva Santos' }
      })
      expect(w.vm.firstName).toBe('João')
    })

    it('firstName retorna string vazia quando name não definido', () => {
      expect(wrapper.vm.firstName).toBe('')
    })

    it('hasShortcuts é false quando shortcuts está vazio', () => {
      expect(wrapper.vm.hasShortcuts).toBe(false)
    })

    it('hasShortcuts é true quando shortcuts tem itens', () => {
      const w = mountComponent(QasWelcome, {
        props: { shortcuts: defaultShortcuts }
      })
      expect(w.vm.hasShortcuts).toBe(true)
    })

    it('hasActionsMenuProps é false quando actionsMenuProps está vazio', () => {
      expect(wrapper.vm.hasActionsMenuProps).toBe(false)
    })

    it('hasActionsMenuProps é true quando actionsMenuProps tem chaves', () => {
      const w = mountComponent(QasWelcome, {
        props: { actionsMenuProps: { items: [] } }
      })
      expect(w.vm.hasActionsMenuProps).toBe(true)
    })

    it('welcomeMessage retorna string não vazia', () => {
      const msg = wrapper.vm.welcomeMessage
      expect(['Bom dia', 'Boa tarde', 'Boa noite']).toContain(msg)
    })

    it('currentDay retorna string com o dia formatado', () => {
      expect(typeof wrapper.vm.currentDay).toBe('string')
      expect(wrapper.vm.currentDay.length).toBeGreaterThan(5)
    })
  })

  describe('Slots', () => {
    it('renderiza slot actions personalizado', () => {
      const w = mountComponent(QasWelcome, {
        props: {},
        slots: { actions: '<button class="custom-action">Ação</button>' }
      })
      expect(w.find('.custom-action').exists()).toBe(true)
    })

    it('renderiza slot after-greeting quando fornecido', () => {
      const w = mountComponent(QasWelcome, {
        props: {},
        slots: { 'after-greeting': '<div class="after-greeting-content">Content</div>' }
      })
      expect(w.find('.after-greeting-content').exists()).toBe(true)
    })
  })
})
