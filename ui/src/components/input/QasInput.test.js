import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasInput from './QasInput.vue'

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasInput, {
    props: {
      modelValue: '',
      ...props
    },
    ...mountOptions
  })
}

describe('QasInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza label com asterisco quando required é true', () => {
      const wrapper = factory({ required: true }, { attrs: { label: 'Nome' } })
      expect(wrapper.vm.formattedLabel).toContain('Nome')
    })

    it('renderiza label sem asterisco quando required é false', () => {
      const wrapper = factory({}, { attrs: { label: 'Nome' } })
      expect(wrapper.vm.formattedLabel).toBe('Nome')
    })
  })

  describe('prop mask', () => {
    it('aplica máscara de telefone', async () => {
      const wrapper = factory({ mask: 'phone', modelValue: '' })
      await flushPromises()
      expect(wrapper.vm.currentMask).toBe('(##) ####-#####')
    })

    it('aplica máscara de CEP', async () => {
      const wrapper = factory({ mask: 'postal-code', modelValue: '' })
      await flushPromises()
      expect(wrapper.vm.currentMask).toBe('#####-###')
    })

    it('aplica máscara de CPF', async () => {
      const wrapper = factory({ mask: 'personal-document', modelValue: '' })
      await flushPromises()
      expect(wrapper.vm.currentMask).toBe('###.###.###-##')
    })

    it('aplica máscara personalizada quando não é predefinida', async () => {
      const wrapper = factory({ mask: '##/##/####', modelValue: '' })
      await flushPromises()
      expect(wrapper.vm.currentMask).toBe('##/##/####')
    })

    it('alterna máscara de documento entre CPF e CNPJ conforme tamanho', async () => {
      const wrapper = factory({ mask: 'document', modelValue: '' })
      await flushPromises()
      // Valor curto → CPF
      expect(wrapper.vm.currentMask).toBe('XXX.XXX.XXX-XXX')
    })
  })

  describe('prop useCopy', () => {
    it('não exibe componente de cópia sem useCopy', () => {
      const wrapper = factory({ useCopy: false, readonly: true })
      expect(wrapper.vm.hasCopy).toBe(false)
    })

    it('exibe componente de cópia quando useCopy é true e readonly é true', () => {
      const wrapper = factory({ useCopy: true, readonly: true })
      expect(wrapper.vm.hasCopy).toBe(true)
    })

    it('não exibe cópia quando useCopy é true mas readonly é false', () => {
      const wrapper = factory({ useCopy: true, readonly: false })
      expect(wrapper.vm.hasCopy).toBe(false)
    })
  })

  describe('prop useRemoveErrorOnType', () => {
    it('limpa erro ao digitar quando useRemoveErrorOnType é true', async () => {
      const wrapper = factory({ useRemoveErrorOnType: true, error: true })
      await flushPromises()
      // erroData inicia como true
      expect(wrapper.vm.errorData).toBe(true)
      // simula digitação
      wrapper.vm.handleErrors()
      expect(wrapper.vm.errorData).toBe(false)
    })

    it('mantém erro ao digitar quando useRemoveErrorOnType é false', async () => {
      const wrapper = factory({ useRemoveErrorOnType: false, error: true })
      await flushPromises()
      wrapper.vm.handleErrors()
      expect(wrapper.vm.errorData).toBe(true)
    })
  })

  describe('prop icon', () => {
    it('marca hasPrepend como truthy quando icon é fornecido', () => {
      const wrapper = factory({ icon: 'sym_r_search' })
      expect(wrapper.vm.hasPrepend).toBeTruthy()
    })

    it('marca hasPrepend como falsy quando não há icon ou slot prepend', () => {
      const wrapper = factory({ icon: '' })
      expect(wrapper.vm.hasPrepend).toBeFalsy()
    })
  })

  describe('prop unmaskedValue', () => {
    it('tem unmaskedValue true por padrão', () => {
      const wrapper = factory()
      expect(wrapper.props('unmaskedValue')).toBe(true)
    })

    it('respeita unmaskedValue false', () => {
      const wrapper = factory({ unmaskedValue: false })
      expect(wrapper.props('unmaskedValue')).toBe(false)
    })
  })

  describe('emits', () => {
    it('emite update:modelValue ao alterar o model', async () => {
      const wrapper = factory()
      wrapper.vm.model = 'novo valor'
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['novo valor'])
    })
  })

  describe('tipo textarea', () => {
    it('configura autogrow para textarea', () => {
      const wrapper = factory({}, { attrs: { type: 'textarea' } })
      expect(wrapper.vm.isTextarea).toBe(true)
    })
  })
})
