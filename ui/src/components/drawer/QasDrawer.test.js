import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDrawer from './QasDrawer.vue'

describe('QasDrawer', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o QasDialog interno', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.findComponent({ name: 'QasDialog' }).exists()).toBeTruthy()
    })
  })

  describe('atributos data-cy', () => {
    it('deve ter o atributo data-cy="drawer-title"', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.find('[data-cy="drawer-title"]').exists()).toBeTruthy()
    })

    it('deve ter o atributo data-cy="drawer-close-btn"', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.find('[data-cy="drawer-close-btn"]').exists()).toBeTruthy()
    })

    it('deve ter o atributo data-cy="drawer-default"', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.find('[data-cy="drawer-default"]').exists()).toBeTruthy()
    })
  })

  describe('prop title', () => {
    it('deve exibir o título quando title é fornecido', () => {
      const wrapper = mountComponent(QasDrawer, {
        props: { title: 'Meu Drawer' }
      })

      expect(wrapper.find('[data-cy="drawer-title"]').text()).toContain('Meu Drawer')
    })

    it('não deve exibir o h3 quando title está vazio', () => {
      const wrapper = mountComponent(QasDrawer, {
        props: { title: '' }
      })

      expect(wrapper.find('h3').exists()).toBeFalsy()
    })

    it('deve exibir o título dentro de um h3', () => {
      const wrapper = mountComponent(QasDrawer, {
        props: { title: 'Título Teste' }
      })

      expect(wrapper.find('h3').text()).toBe('Título Teste')
    })
  })

  describe('prop loading', () => {
    it('deve renderizar a seção de loading quando loading é true', () => {
      const wrapper = mountComponent(QasDrawer, {
        props: { loading: true }
      })

      expect(wrapper.find('.qas-drawer__loading').exists()).toBeTruthy()
    })

    it('não deve renderizar a seção de loading por padrão', () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      expect(wrapper.find('.qas-drawer__loading').exists()).toBeFalsy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot padrão dentro de data-cy="drawer-default"', () => {
      const wrapper = mountComponent(QasDrawer, {
        slots: { default: '<p class="conteudo-slot">Conteúdo do drawer</p>' }
      })

      const container = wrapper.find('[data-cy="drawer-default"]')
      expect(container.find('.conteudo-slot').exists()).toBeTruthy()
      expect(container.find('.conteudo-slot').text()).toBe('Conteúdo do drawer')
    })
  })

  describe('botão fechar', () => {
    it('deve emitir update:modelValue com false ao clicar no botão fechar', async () => {
      const wrapper = mountComponent(QasDrawer, {
      })

      const closeBtn = wrapper.find('[data-cy="drawer-close-btn"]')
      await closeBtn.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    })
  })
})
