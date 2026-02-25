import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'

// vi.mock('../btn/QasBtn.vue', () => ({
//   default: {
//     name: 'QasBtn',
//     template: '<button class="qas-btn-stub"><slot /></button>',
//     props: ['icon', 'flat', 'round', 'dense', 'color', 'label']
//   }
// }))

// vi.mock('../box/QasBox.vue', () => ({
//   default: {
//     name: 'QasBox',
//     template: '<div class="qas-box-stub"><slot /></div>',
//     props: ['outlined', 'unelevated', 'useSpacing']
//   }
// }))

import QasAlert from './QasAlert.vue'

describe('QasAlert', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-alert"', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('.qas-alert').exists()).toBeTruthy()
    })

    it('deve renderizar o slot default', () => {
      const wrapper = mountComponent(QasAlert, {
        slots: { default: 'Mensagem de alerta' }
      })
      expect(wrapper.text()).toContain('Mensagem de alerta')
    })

    it('deve renderizar um q-icon', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })
  })

  describe('prop text', () => {
    it('deve renderizar o texto passado via prop', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { text: 'Texto do alerta' }
      })
      expect(wrapper.text()).toContain('Texto do alerta')
    })
  })

  describe('prop status', () => {
    it('deve usar status "info" por padrão com ícone correto', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_info')
    })

    it('deve usar ícone correto para status "error"', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { status: 'error' }
      })
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_error')
    })

    it('deve usar ícone correto para status "success"', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { status: 'success' }
      })
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_check_circle')
    })
  })

  describe('prop useCloseButton', () => {
    it('não deve mostrar botão de fechar por padrão', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('.qas-btn-stub').exists()).toBeFalsy()
    })

    it('deve mostrar botão de fechar quando useCloseButton é true', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { useCloseButton: true }
      })
      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('visibilidade via modelValue', () => {
    it('deve exibir o alerta quando modelValue é true', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.qas-alert').exists()).toBeTruthy()
    })

    it('não deve exibir o alerta quando modelValue é false', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { modelValue: false }
      })
      expect(wrapper.find('.qas-alert').exists()).toBeFalsy()
    })
  })
})
