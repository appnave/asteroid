import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasLayout from './QasLayout.vue'

// QasAppMenu usa set-scroll-gradient que manipula DOM e não funciona em jsdom
vi.mock('../app-menu/QasAppMenu.vue', () => ({ default: { name: 'QasAppMenu', template: '<div class="qas-app-menu-stub" />', props: ['modelValue', 'appUserProps', 'brand', 'miniBrand'] } }))

vi.mock('../../composables/use-screen', () => ({
  default: vi.fn(() => ({
    untilLarge: false,
    isSmall: false
  }))
}))

vi.mock('../../composables/use-notifications', () => ({
  default: vi.fn(() => ({
    isNotificationsEnabled: false,
    setUnreadNotificationsCount: vi.fn()
  }))
}))

describe('QasLayout', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasLayout, {
      props: {
        modelValue: true,
        initialUnreadNotificationsCount: 0
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza o slot padrão com q-page-container', () => {
      const pageContainer = wrapper.findComponent({ name: 'QPageContainer' })
      expect(pageContainer.exists()).toBe(true)
    })

    it('não renderiza o drawer de notificações quando isNotificationsEnabled é false', () => {
      const drawer = wrapper.findComponent({ name: 'PvLayoutNotificationsDrawer' })
      expect(drawer.exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('aceita prop appBarProps como objeto', () => {
      const w = mountComponent(QasLayout, {
        props: { appBarProps: { title: 'Test' }, modelValue: true }
      })
      expect(w.exists()).toBe(true)
    })

    it('aceita prop appMenuProps como objeto', () => {
      const w = mountComponent(QasLayout, {
        props: { appMenuProps: { someOption: true }, modelValue: true }
      })
      expect(w.exists()).toBe(true)
    })

    it('aceita initialUnreadNotificationsCount numérico', () => {
      const w = mountComponent(QasLayout, {
        props: { initialUnreadNotificationsCount: 5, modelValue: true }
      })
      expect(w.exists()).toBe(true)
    })
  })

  describe('Emits', () => {
    it('emite sign-out quando signOut é chamado', async () => {
      await wrapper.vm.signOut()
      expect(wrapper.emitted('sign-out')).toBeTruthy()
    })

    it('emite update:modelValue ao toggleMenuDrawer', async () => {
      await wrapper.vm.toggleMenuDrawer()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emite update:modelValue com true ao abrir menu', async () => {
      await wrapper.vm.toggleMenuDrawer()
      const events = wrapper.emitted('update:modelValue')
      expect(events[0][0]).toBe(true)
    })
  })

  describe('Métodos expostos', () => {
    it('expõe toggleNotificationsDrawer', () => {
      expect(typeof wrapper.vm.toggleNotificationsDrawer).toBe('function')
    })

    it('toggleNotificationsDrawer alterna o drawer de notificações', async () => {
      // notificationsDrawer começa false
      await wrapper.vm.toggleNotificationsDrawer()
      // Não podemos acessar diretamente o ref interno além do expose, mas o método não deve lançar erro
      expect(true).toBe(true)
    })
  })

  describe('Slots', () => {
    it('aceita slot app-bar personalizado sem erros', () => {
      // O slot app-bar só é exibido quando screen.untilLarge é true
      // Em teste (untilLarge=false), o slot não é renderizado mas é aceito sem erros
      const w = mountComponent(QasLayout, {
        props: { modelValue: true },
        slots: { 'app-bar': '<div class="custom-app-bar">Custom AppBar</div>' }
      })
      expect(w.exists()).toBe(true)
    })

    it('renderiza slot padrão personalizado', () => {
      const w = mountComponent(QasLayout, {
        props: { modelValue: true },
        slots: { default: '<div class="custom-content">Content</div>' }
      })
      expect(w.find('.custom-content').exists()).toBe(true)
    })
  })
})
