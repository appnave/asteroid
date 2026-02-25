import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasToggle from './QasToggle.vue'

describe('QasToggle', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasToggle)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar um q-toggle', () => {
      const wrapper = mountComponent(QasToggle)

      expect(wrapper.find('q-toggle').exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-toggle" no q-toggle', () => {
      const wrapper = mountComponent(QasToggle)

      expect(wrapper.find('q-toggle').classes()).toContain('qas-toggle')
    })
  })

  describe('prop title', () => {
    it('não deve renderizar o título quando não é passado', () => {
      const wrapper = mountComponent(QasToggle)

      expect(wrapper.find('span').exists()).toBeFalsy()
    })

    it('deve renderizar o título quando fornecido', () => {
      const wrapper = mountComponent(QasToggle, {
        props: { title: 'Ativar notificações' }
      })

      expect(wrapper.find('span').text()).toBe('Ativar notificações')
    })

    it('deve ter classe "text-caption" no título', () => {
      const wrapper = mountComponent(QasToggle, {
        props: { title: 'Título' }
      })

      expect(wrapper.find('span').classes()).toContain('text-caption')
    })
  })

  describe('atributos passados via v-bind', () => {
    it('deve passar atributos ao q-toggle via attrs', () => {
      const wrapper = mountComponent(QasToggle, {
        attrs: { label: 'Ativo', modelValue: true }
      })

      expect(wrapper.find('q-toggle').attributes('label')).toBe('Ativo')
    })
  })
})
