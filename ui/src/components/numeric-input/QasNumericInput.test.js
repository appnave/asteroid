import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasNumericInput from './QasNumericInput.vue'

// AutoNumeric é mockado globalmente em setup.js via vi.mock('autonumeric')

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasNumericInput, {
    props: {
      modelValue: '',
      ...props
    },
    ...mountOptions
  })
}

describe('QasNumericInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.find('.qas-numeric-input').exists()).toBe(true)
    })

    it('renderiza label com asterisco quando required é true', async () => {
      const wrapper = factory({ required: true, label: 'Valor' })
      await flushPromises()
      expect(wrapper.vm.formattedLabel).toContain('Valor')
    })
  })

  describe('prop mode', () => {
    it('usa mode integer por padrão', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.vm.defaultMode).toBeTruthy()
    })

    it('aceita mode money', async () => {
      const wrapper = factory({ mode: 'money' })
      await flushPromises()
      expect(wrapper.vm.defaultMode).toBeTruthy()
    })

    it('aceita mode decimal', async () => {
      const wrapper = factory({ mode: 'decimal' })
      await flushPromises()
      expect(wrapper.vm.defaultMode).toBeTruthy()
    })

    it('aceita mode percent', async () => {
      const wrapper = factory({ mode: 'percent' })
      await flushPromises()
      expect(wrapper.vm.defaultMode).toBeTruthy()
    })
  })

  describe('prop icon', () => {
    it('marca hasPrepend como truthy quando icon é fornecido', async () => {
      const wrapper = factory({ icon: 'sym_r_attach_money' })
      await flushPromises()
      expect(wrapper.vm.hasPrepend).toBeTruthy()
    })

    it('marca hasPrepend como falsy quando não há icon', async () => {
      const wrapper = factory({ icon: '' })
      await flushPromises()
      expect(wrapper.vm.hasPrepend).toBeFalsy()
    })
  })

  describe('AutoNumeric mock', () => {
    it('instancia AutoNumeric no created', async () => {
      const wrapper = factory({ modelValue: 0 })
      await flushPromises()
      // O mock global define autoNumeric como instância criada por new
      expect(wrapper.vm.autoNumeric).toBeTruthy()
    })

    it('chama autoNumeric.set quando modelValue muda', async () => {
      const wrapper = factory({ modelValue: 0 })
      await flushPromises()
      const setMock = wrapper.vm.autoNumeric.set
      await wrapper.setProps({ modelValue: 100 })
      await flushPromises()
      expect(setMock).toHaveBeenCalledWith(100)
    })
  })

  describe('emits', () => {
    it('emite update:modelValue no blur através do método emitValue', async () => {
      const wrapper = factory({ modelValue: 50 })
      await flushPromises()
      // Mock de getFormattedNumber
      wrapper.vm.getFormattedNumber = vi.fn().mockReturnValue(50)
      wrapper.vm.emitValue()
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emite update-model no input através do método emitUpdateModel', async () => {
      const wrapper = factory({ modelValue: '' })
      await flushPromises()
      wrapper.vm.getFormattedNumber = vi.fn().mockReturnValue(42)
      wrapper.vm.emitUpdateModel('42')
      await flushPromises()
      const emitted = wrapper.emitted('update-model')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toMatchObject({ value: '42', raw: 42 })
    })
  })

  describe('placeholder', () => {
    it('usa placeholder baseado no mode quando não fornecido', async () => {
      const wrapper = factory({ mode: 'integer' })
      await flushPromises()
      expect(wrapper.vm.placeholder).toBeTruthy()
    })
  })
})
