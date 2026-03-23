import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import QasActionsMenu from './QasActionsMenu.vue'

const defaultList = {
  edit: { label: 'Editar', icon: 'sym_r_edit', action: vi.fn() }
}

const multiList = {
  view: { label: 'Ver', icon: 'sym_r_visibility', action: vi.fn() },
  edit: { label: 'Editar', icon: 'sym_r_edit', action: vi.fn() },
  share: { label: 'Compartilhar', icon: 'sym_r_share', action: vi.fn() }
}

describe('QasActionsMenu', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com uma lista', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('não deve renderizar quando a lista está vazia', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: {} }
      })

      expect(wrapper.find('[data-cy="actions-menu"]').exists()).toBeFalsy()
    })
  })

  describe('atributo data-cy', () => {
    it('deve ter o atributo data-cy="actions-menu" quando há itens na lista', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList }
      })

      expect(wrapper.find('[data-cy="actions-menu"]').exists()).toBeTruthy()
    })
  })

  describe('prop list', () => {
    it('deve renderizar QasBtnDropdown quando há itens na lista', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList }
      })

      expect(wrapper.findComponent({ name: 'QasBtnDropdown' }).exists()).toBeTruthy()
    })

    it('deve renderizar QasBtnDropdown com lista de 3 itens', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: multiList }
      })

      expect(wrapper.findComponent({ name: 'QasBtnDropdown' }).exists()).toBeTruthy()
    })
  })

  describe('prop disable', () => {
    it('deve passar disable=true para QasBtnDropdown', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList, disable: true }
      })

      const stub = wrapper.findComponent({ name: 'QasBtnDropdown' })
      expect(stub.props('disable')).toBe(true)
    })

    it('deve passar disable=false para QasBtnDropdown quando prop não está definida', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList }
      })

      const stub = wrapper.findComponent({ name: 'QasBtnDropdown' })
      expect(stub.props('disable')).toBeFalsy()
    })
  })

  describe('prop skeleton', () => {
    it('deve passar skeleton=true para QasBtnDropdown', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList, skeleton: true }
      })

      const stub = wrapper.findComponent({ name: 'QasBtnDropdown' })
      expect(stub.props('skeleton')).toBe(true)
    })

    it('deve passar skeleton=false para QasBtnDropdown por padrão', () => {
      const wrapper = mountComponent(QasActionsMenu, {
        props: { list: defaultList }
      })

      const stub = wrapper.findComponent({ name: 'QasBtnDropdown' })
      expect(stub.props('skeleton')).toBeFalsy()
    })
  })
})
