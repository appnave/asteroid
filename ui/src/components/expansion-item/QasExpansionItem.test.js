import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mountComponent } from '@test-utils'

import QasExpansionItem from './QasExpansionItem.vue'

describe('QasExpansionItem', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasExpansionItem, {
      })
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop label', () => {
    it('deve exibir o label passado como prop', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { label: 'Meu Título' }
      })
      expect(wrapper.text()).toContain('Meu Título')
    })
  })

  describe('prop disable', () => {
    it('deve adicionar classe qas-expansion-item--disabled quando disable é true', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { disable: true }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).toContain('qas-expansion-item--disabled')
    })

    it('deve adicionar classe qas-expansion-item--disabled-full quando disable é true', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { disable: true }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).toContain('qas-expansion-item--disabled-full')
    })

    it('não deve adicionar classe qas-expansion-item--disabled quando disable é false (padrão)', () => {
      const wrapper = mountComponent(QasExpansionItem, {
      })
      expect(wrapper.find('.qas-expansion-item').classes()).not.toContain('qas-expansion-item--disabled')
    })
  })

  describe('prop disableButton', () => {
    it('deve adicionar classe qas-expansion-item--disabled quando disableButton é true', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { disableButton: true }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).toContain('qas-expansion-item--disabled')
    })

    it('não deve adicionar classe qas-expansion-item--disabled-full quando apenas disableButton é true', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { disableButton: true }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).not.toContain('qas-expansion-item--disabled-full')
    })
  })

  describe('prop error', () => {
    it('deve adicionar classe qas-expansion-item--error quando error é true', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { error: true }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).toContain('qas-expansion-item--error')
    })

    it('não deve adicionar classe qas-expansion-item--error por padrão', () => {
      const wrapper = mountComponent(QasExpansionItem, {
      })
      expect(wrapper.find('.qas-expansion-item').classes()).not.toContain('qas-expansion-item--error')
    })
  })

  describe('prop errorMessage', () => {
    it('deve renderizar qas-error-message-stub quando errorMessage está definido', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { errorMessage: 'Campo obrigatório' }
      })
      expect(wrapper.findComponent({ name: 'QasErrorMessage' }).exists()).toBeTruthy()
    })

    it('deve adicionar classe qas-expansion-item--error quando errorMessage está definido', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { errorMessage: 'Campo obrigatório' }
      })
      expect(wrapper.find('.qas-expansion-item').classes()).toContain('qas-expansion-item--error')
    })

    it('não deve renderizar qas-error-message-stub quando errorMessage está vazio', () => {
      const wrapper = mountComponent(QasExpansionItem, {
      })
      expect(wrapper.findComponent({ name: 'QasErrorMessage' }).exists()).toBeFalsy()
    })
  })

  describe('prop badges', () => {
    it('deve renderizar badges quando badges é fornecido', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { badges: [{ label: 'A' }, { label: 'B' }] }
      })
      expect(wrapper.findAllComponents({ name: 'QasBadge' }).length).toBe(2)
    })

    it('não deve renderizar badges quando badges está vazio (padrão)', () => {
      const wrapper = mountComponent(QasExpansionItem, {
      })
      expect(wrapper.findAllComponents({ name: 'QasBadge' }).length).toBe(0)
    })
  })

  describe('prop modelValue', () => {
    it('deve passar modelValue true para q-expansion-item', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { modelValue: true }
      })
      const expansionItem = wrapper.findComponent({ name: 'QExpansionItem' })
      expect(expansionItem.exists()).toBeTruthy()
      expect(wrapper.vm.modelValue).toBe(true)
    })

    it('deve passar modelValue false para q-expansion-item', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { modelValue: false }
      })
      expect(wrapper.vm.modelValue).toBe(false)
    })
  })

  describe('slot header', () => {
    it('deve renderizar conteúdo do slot header customizado', () => {
      const wrapper = mountComponent(QasExpansionItem, {
        slots: { header: '<span class="custom-header">Cabeçalho personalizado</span>' }
      })
      expect(wrapper.find('.custom-header').exists()).toBeTruthy()
      expect(wrapper.text()).toContain('Cabeçalho personalizado')
    })
  })

  describe('slot content', () => {
    it('deve renderizar conteúdo do slot content quando o item está expandido', async () => {
      const wrapper = mountComponent(QasExpansionItem, {
        props: { modelValue: true },
        slots: { content: '<p class="custom-content">Conteúdo interno</p>' }
      })
      await wrapper.findComponent({ name: 'QExpansionItem' }).vm.$emit('show')
      await nextTick()
      expect(wrapper.find('.custom-content').exists()).toBeTruthy()
      expect(wrapper.text()).toContain('Conteúdo interno')
    })
  })
})
