import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'

import QasRadio from './QasRadio.vue'

describe('QasRadio', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasRadio, { props: { modelValue: null, val: 'test' } })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-radio"', () => {
      const wrapper = mountComponent(QasRadio, { props: { modelValue: null, val: 'test' } })

      expect(wrapper.classes()).toContain('qas-radio')
    })
  })

  describe('modo QRadio (sem options)', () => {
    it('deve renderizar q-radio quando não há options', () => {
      const wrapper = mountComponent(QasRadio, { props: { modelValue: null, val: 'test' } })

      expect(wrapper.findComponent({ name: 'QRadio' }).exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: 'QOptionGroup' }).exists()).toBeFalsy()
    })

    it('não deve exibir a label quando sem options (label fica vazia)', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { modelValue: null, val: 'test', label: 'Opção' }
      })

      // sem options, não exibe qas-label
      expect(wrapper.findComponent({ name: 'QasLabel' }).exists()).toBeFalsy()
    })
  })

  describe('modo QOptionGroup (com options)', () => {
    const options = [
      { label: 'Sim', value: 'sim' },
      { label: 'Não', value: 'nao' }
    ]

    it('deve renderizar q-option-group quando options são fornecidas', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { modelValue: null, val: 'test', options }
      })

      expect(wrapper.findComponent({ name: 'QOptionGroup' }).exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: 'QRadio' }).exists()).toBeFalsy()
    })

    it('deve exibir a label quando há options e label fornecida', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { modelValue: null, val: 'test', label: 'Escolha:', options }
      })

      expect(wrapper.findComponent({ name: 'QasLabel' }).exists()).toBeTruthy()
    })

    it('não deve exibir a label quando há options mas sem label', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { modelValue: null, val: 'test', options }
      })

      expect(wrapper.findComponent({ name: 'QasLabel' }).exists()).toBeFalsy()
    })
  })

  describe('prop error e errorMessage', () => {
    it('deve renderizar qas-error-message quando errorMessage é fornecida', () => {
      const wrapper = mountComponent(QasRadio, {
        props: { modelValue: null, val: 'test', errorMessage: 'Campo inválido', error: true }
      })

      expect(wrapper.findComponent({ name: 'QasErrorMessage' }).exists()).toBeTruthy()
    })

    it('não deve renderizar qas-error-message quando errorMessage está vazia', () => {
      const wrapper = mountComponent(QasRadio, { props: { modelValue: null, val: 'test' } })

      expect(wrapper.findComponent({ name: 'QasErrorMessage' }).exists()).toBeFalsy()
    })
  })
})
