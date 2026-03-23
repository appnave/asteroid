import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasTip from './QasTip.vue'

describe('QasTip', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-tip"', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.classes()).toContain('qas-tip')
    })

    it('deve renderizar um q-icon', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })

    it('deve ter aria-hidden="false"', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').attributes('aria-hidden')).toBe('false')
    })
  })

  describe('prop icon', () => {
    it('deve usar "sym_r_help" como ícone padrão', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_help')
    })

    it('deve usar o ícone customizado', () => {
      const wrapper = mountComponent(QasTip, {
        props: { icon: 'sym_r_info' }
      })

      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_info')
    })
  })

  describe('prop text', () => {
    it('deve ter texto vazio por padrão', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').attributes('aria-label')).toBe('')
    })

    it('deve passar o texto como aria-label do q-icon', () => {
      const wrapper = mountComponent(QasTip, {
        props: { text: 'Dica de preenchimento' }
      })

      expect(wrapper.find('q-icon').attributes('aria-label')).toBe('Dica de preenchimento')
    })
  })

  describe('prop color', () => {
    it('deve usar "grey-8" como cor padrão', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').attributes('color')).toBe('grey-8')
    })

    it('deve aplicar cor customizada', () => {
      const wrapper = mountComponent(QasTip, {
        props: { color: 'primary' }
      })

      expect(wrapper.find('q-icon').attributes('color')).toBe('primary')
    })
  })

  describe('prop size', () => {
    it('deve usar "16px" como tamanho padrão', () => {
      const wrapper = mountComponent(QasTip)

      expect(wrapper.find('q-icon').attributes('size')).toBe('16px')
    })

    it('deve aplicar tamanho customizado', () => {
      const wrapper = mountComponent(QasTip, {
        props: { size: '24px' }
      })

      expect(wrapper.find('q-icon').attributes('size')).toBe('24px')
    })
  })
})
