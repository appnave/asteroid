import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'

// QRadio e QOptionGroup do Quasar precisam do plugin instalado - fazemos mock
vi.mock('quasar', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    QRadio: {
      name: 'QRadio',
      template: '<div class="q-radio-stub"><slot /></div>',
      props: ['modelValue', 'val', 'label', 'dense', 'disable']
    },
    QOptionGroup: {
      name: 'QOptionGroup',
      template: '<div class="q-option-group-stub"><slot /></div>',
      props: ['modelValue', 'options', 'type', 'inline', 'dense', 'disable', 'class']
    }
  }
})

import QasRadio from './QasRadio.vue'

describe('QasRadio', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasRadio)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-radio"', () => {
      const wrapper = mountComponent(QasRadio)

      expect(wrapper.classes()).toContain('qas-radio')
    })
  })

  describe('modo QRadio (sem options)', () => {
    it('deve renderizar q-radio quando não há options', () => {
      const wrapper = mountComponent(QasRadio)

      expect(wrapper.find('.q-radio-stub').exists()).toBeTruthy()
      expect(wrapper.find('.q-option-group-stub').exists()).toBeFalsy()
    })

    it('não deve exibir a label quando sem options (label fica vazia)', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { label: 'Opção' }
      })

      // sem options, não exibe qas-label
      expect(wrapper.find('.qas-label-stub').exists()).toBeFalsy()
    })
  })

  describe('modo QOptionGroup (com options)', () => {
    const options = [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' }
    ]

    it('deve renderizar q-option-group quando options são fornecidas', () => {
      const wrapper = mountComponent(QasRadio, {
        attrs: { options }
      })

      expect(wrapper.find('.q-option-group-stub').exists()).toBeTruthy()
      expect(wrapper.find('.q-radio-stub').exists()).toBeFalsy()
    })

    it('deve exibir a label quando há options e label fornecida', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { label: 'Escolha:' },
        attrs: { options }
      })

      expect(wrapper.find('.qas-label-stub').exists()).toBeTruthy()
    })

    it('não deve exibir a label quando há options mas sem label', () => {
      const wrapper = mountComponent(QasRadio, {
        attrs: { options }
      })

      expect(wrapper.find('.qas-label-stub').exists()).toBeFalsy()
    })
  })

  describe('prop error e errorMessage', () => {
    it('deve renderizar qas-error-message quando errorMessage é fornecida', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { errorMessage: 'Campo inválido', error: true }
      })

      expect(wrapper.find('.qas-error-message-stub').exists()).toBeTruthy()
    })

    it('não deve renderizar qas-error-message quando errorMessage está vazia', () => {
      const wrapper = mountComponent(QasRadio)

      expect(wrapper.find('.qas-error-message-stub').exists()).toBeFalsy()
    })
  })
})
