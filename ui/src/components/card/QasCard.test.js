import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasCard from './QasCard.vue'

const cardStubs = {
  QasActionsMenu: { template: '<div class="qas-actions-menu-stub" />' },
  QasCheckbox: { template: '<div class="qas-checkbox-stub" />' }
}

function mountCard (options = {}) {
  const { global: globalOpts = {}, ...rest } = options

  return mountComponent(QasCard, {
    ...rest,
    global: {
      ...globalOpts,
      stubs: {
        ...cardStubs,
        ...(globalOpts.stubs || {})
      }
    }
  })
}

describe('QasCard', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountCard()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-card"', () => {
      const wrapper = mountCard()

      expect(wrapper.classes()).toContain('qas-card')
    })

    it('não deve renderizar o header quando title não é fornecido', () => {
      const wrapper = mountCard()

      expect(wrapper.find('header').exists()).toBeFalsy()
    })
  })

  describe('prop title', () => {
    it('deve renderizar o header quando title é fornecido', () => {
      const wrapper = mountCard({ props: { title: 'Meu Card' } })

      expect(wrapper.find('header').exists()).toBeTruthy()
    })

    it('deve exibir o texto do title no header', () => {
      const wrapper = mountCard({ props: { title: 'Nome do Card' } })

      expect(wrapper.find('header').text()).toContain('Nome do Card')
    })
  })

  describe('prop skeleton', () => {
    it('não deve exibir skeleton por padrão', () => {
      const wrapper = mountCard()

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeFalsy()
    })

    it('deve exibir skeleton quando skeleton é true', () => {
      const wrapper = mountCard({
        props: { skeleton: true, title: 'Card' }
      })

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeTruthy()
    })
  })

  describe('prop actionsMenuProps', () => {
    it('não deve renderizar QasActionsMenu por padrão', () => {
      const wrapper = mountCard({ props: { title: 'Card' } })

      expect(wrapper.find('.qas-actions-menu-stub').exists()).toBeFalsy()
    })

    it('deve renderizar QasActionsMenu quando actionsMenuProps tem propriedades', () => {
      const wrapper = mountCard({
        props: {
          title: 'Card',
          actionsMenuProps: { list: [{ label: 'Editar' }] }
        }
      })

      expect(wrapper.find('.qas-actions-menu-stub').exists()).toBeTruthy()
    })
  })

  describe('prop useSelection', () => {
    it('não deve exibir o checkbox por padrão', () => {
      const wrapper = mountCard({ props: { title: 'Card' } })

      expect(wrapper.find('.qas-checkbox-stub').exists()).toBeFalsy()
    })

    it('deve exibir o checkbox quando useSelection é true', () => {
      const wrapper = mountCard({
        props: { title: 'Card', useSelection: true }
      })

      expect(wrapper.find('.qas-checkbox-stub').exists()).toBeTruthy()
    })

    it('não deve exibir o checkbox quando skeleton é true (exibe skeleton no lugar)', () => {
      const wrapper = mountCard({
        props: { title: 'Card', useSelection: true, skeleton: true }
      })

      expect(wrapper.find('.qas-checkbox-stub').exists()).toBeFalsy()
    })
  })

  describe('prop route', () => {
    it('não deve renderizar router-link quando route está vazio', () => {
      const wrapper = mountCard({ props: { title: 'Card' } })

      expect(wrapper.find('router-link').exists()).toBeFalsy()
      expect(wrapper.find('h5').exists()).toBeTruthy()
    })

    it('deve renderizar router-link quando route tem propriedades', () => {
      const wrapper = mountCard({
        props: {
          title: 'Card',
          route: { name: 'detail', params: { id: 1 } }
        }
      })

      expect(wrapper.find('router-link').exists()).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot default', () => {
      const wrapper = mountCard({
        slots: { default: '<div class="slot-content">conteúdo do card</div>' }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
    })
  })

  describe('slot title', () => {
    it('deve renderizar o slot title quando fornecido', () => {
      const wrapper = mountCard({
        props: { title: 'Título padrão' },
        slots: { title: '<span class="custom-title">Título Customizado</span>' }
      })

      expect(wrapper.find('.custom-title').exists()).toBeTruthy()
      expect(wrapper.find('.custom-title').text()).toBe('Título Customizado')
    })
  })

  describe('slot header', () => {
    it('deve renderizar o slot header quando fornecido', () => {
      const wrapper = mountCard({
        slots: { header: '<div class="custom-header">Header customizado</div>' }
      })

      expect(wrapper.find('.custom-header').exists()).toBeTruthy()
    })
  })

  describe('inject isBox', () => {
    it('deve renderizar corretamente quando isBox é true', () => {
      const wrapper = mountCard({
        props: { title: 'Card' },
        global: {
          provide: { isBox: true },
          stubs: cardStubs
        }
      })

      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('inject isDialog', () => {
    it('deve renderizar corretamente quando isDialog é true', () => {
      const wrapper = mountCard({
        props: { title: 'Card' },
        global: {
          provide: { isDialog: true },
          stubs: cardStubs
        }
      })

      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
