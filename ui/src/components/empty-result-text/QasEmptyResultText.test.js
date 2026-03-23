import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasEmptyResultText from './QasEmptyResultText.vue'

describe('QasEmptyResultText', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasEmptyResultText)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter classes de tipografia padrão', () => {
      const wrapper = mountComponent(QasEmptyResultText)

      expect(wrapper.classes()).toContain('text-body1')
      expect(wrapper.classes()).toContain('text-grey-8')
    })
  })

  describe('prop text', () => {
    it('deve usar o texto padrão quando nenhum texto é passado', () => {
      const wrapper = mountComponent(QasEmptyResultText)

      expect(wrapper.text()).toBe('Não há itens para serem exibidos.')
    })

    it('deve renderizar o texto customizado', () => {
      const wrapper = mountComponent(QasEmptyResultText, {
        props: { text: 'Nenhum resultado encontrado.' }
      })

      expect(wrapper.text()).toBe('Nenhum resultado encontrado.')
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot quando fornecido', () => {
      const wrapper = mountComponent(QasEmptyResultText, {
        slots: { default: '<span class="custom">Slot customizado</span>' }
      })

      expect(wrapper.find('.custom').exists()).toBeTruthy()
      expect(wrapper.find('.custom').text()).toBe('Slot customizado')
    })

    it('deve usar o slot em vez da prop text quando slot é fornecido', () => {
      const wrapper = mountComponent(QasEmptyResultText, {
        props: { text: 'Texto da prop' },
        slots: { default: 'Texto do slot' }
      })

      expect(wrapper.text()).toBe('Texto do slot')
    })
  })
})
