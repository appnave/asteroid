import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasPasswordInput from './QasPasswordInput.vue'

describe('QasPasswordInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasPasswordInput, {
      props: { modelValue: '' }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasInput', () => {
      const input = wrapper.findComponent({ name: 'QasInput' })
      expect(input.exists()).toBe(true)
    })

    it('não exibe QasPasswordStrengthChecker quando model está vazio', () => {
      const checker = wrapper.findComponent({ name: 'QasPasswordStrengthChecker' })
      expect(checker.exists()).toBe(false)
    })

    it('exibe QasPasswordStrengthChecker quando model não está vazio', () => {
      const w = mountComponent(QasPasswordInput, {
        props: { modelValue: 'senha123' }
      })
      const checker = w.findComponent({ name: 'QasPasswordStrengthChecker' })
      expect(checker.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('useStrengthChecker tem default true', () => {
      expect(QasPasswordInput.props?.useStrengthChecker?.default).toBe(true)
    })

    it('useStrengthChecker false oculta o checker mesmo com senha preenchida', () => {
      const w = mountComponent(QasPasswordInput, {
        props: { modelValue: 'senha123', useStrengthChecker: false }
      })
      const checker = w.findComponent({ name: 'QasPasswordStrengthChecker' })
      expect(checker.exists()).toBe(false)
    })
  })

  describe('Data', () => {
    it('toggleType começa como true (tipo senha)', () => {
      expect(wrapper.vm.toggleType).toBe(true)
    })
  })

  describe('Computed', () => {
    it('type é "password" quando toggleType é true', () => {
      expect(wrapper.vm.type).toBe('password')
    })

    it('type é "text" quando toggleType é false', () => {
      wrapper.vm.toggleType = false
      expect(wrapper.vm.type).toBe('text')
    })

    it('icon é sym_r_visibility quando toggleType é true', () => {
      expect(wrapper.vm.icon).toBe('sym_r_visibility')
    })

    it('icon é sym_r_visibility_off quando toggleType é false', () => {
      wrapper.vm.toggleType = false
      expect(wrapper.vm.icon).toBe('sym_r_visibility_off')
    })

    it('isButtonDisabled é true quando model está vazio', () => {
      expect(wrapper.vm.isButtonDisabled).toBe(true)
    })

    it('isButtonDisabled é false quando model tem texto', () => {
      const w = mountComponent(QasPasswordInput, {
        props: { modelValue: 'abc' }
      })
      expect(w.vm.isButtonDisabled).toBe(false)
    })

    it('hasStrengthChecker é false quando model está vazio', () => {
      expect(wrapper.vm.hasStrengthChecker).toBe(false)
    })

    it('hasStrengthChecker é true quando model não está vazio e useStrengthChecker é true', () => {
      const w = mountComponent(QasPasswordInput, {
        props: { modelValue: 'senha123', useStrengthChecker: true }
      })
      expect(w.vm.hasStrengthChecker).toBe(true)
    })

    it('model emite update:modelValue ao setar', () => {
      wrapper.vm.model = 'nova senha'
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('nova senha')
    })
  })

  describe('Métodos', () => {
    it('toggle inverte toggleType', () => {
      expect(wrapper.vm.toggleType).toBe(true)
      wrapper.vm.toggle()
      expect(wrapper.vm.toggleType).toBe(false)
      wrapper.vm.toggle()
      expect(wrapper.vm.toggleType).toBe(true)
    })

    it('updateCurrentLevel emite update:currentLevel', () => {
      wrapper.vm.updateCurrentLevel(3)
      expect(wrapper.emitted('update:currentLevel')).toBeTruthy()
      expect(wrapper.emitted('update:currentLevel')[0][0]).toBe(3)
    })
  })
})
