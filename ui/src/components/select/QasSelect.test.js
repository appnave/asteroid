import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasSelect from './QasSelect.vue'

const defaultOptions = [
  { label: 'Opção 1', value: 'opt1' },
  { label: 'Opção 2', value: 'opt2' },
  { label: 'Opção 3', value: 'opt3' }
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasSelect, {
    props: {
      options: defaultOptions,
      modelValue: '',
      ...props
    },
    ...mountOptions
  })
}

describe('QasSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-select').exists()).toBe(true)
    })

    it('renderiza com label formatado quando required é true', () => {
      const wrapper = factory({ required: true, label: 'Campo' })
      const formattedLabel = wrapper.vm.formattedLabel
      expect(formattedLabel).toContain('Campo')
    })

    it('renderiza sem ícone por padrão', () => {
      const wrapper = factory({ icon: '' })
      expect(wrapper.vm.hasIcon).toBe(false)
    })

    it('renderiza com ícone quando icon é informado', () => {
      const wrapper = factory({ icon: 'sym_r_search' })
      expect(wrapper.vm.hasIcon).toBe(true)
    })
  })

  describe('prop required', () => {
    it('não adiciona clearable quando required é true', () => {
      const wrapper = factory({ required: true })
      expect(wrapper.vm.attributes.clearable).toBe(false)
    })

    it('adiciona clearable quando required é false', () => {
      const wrapper = factory({ required: false })
      expect(wrapper.vm.attributes.clearable).toBe(true)
    })
  })

  describe('prop multiple', () => {
    it('configura multiple corretamente', () => {
      const wrapper = factory({ multiple: true, modelValue: [] })
      expect(wrapper.vm.attributes.multiple).toBe(true)
    })

    it('não usa multiple por padrão', () => {
      const wrapper = factory()
      expect(wrapper.vm.attributes.multiple).toBe(false)
    })
  })

  describe('prop useAutoSelect', () => {
    it('auto-seleciona opção quando useAutoSelect é true e há apenas uma opção', async () => {
      const singleOption = [{ label: 'Única', value: 'only' }]
      const wrapper = factory({ useAutoSelect: true, options: singleOption, modelValue: '' })
      await flushPromises()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toBe('only')
    })

    it('não auto-seleciona quando há mais de uma opção', async () => {
      const emitSpy = vi.fn()
      factory(
        { useAutoSelect: true, options: defaultOptions, modelValue: '' },
        { props: { 'onUpdate:modelValue': emitSpy } }
      )
      await flushPromises()
      expect(emitSpy).not.toHaveBeenCalled()
    })
  })

  describe('prop noOptionLabel', () => {
    it('usa o noOptionLabel customizado', () => {
      const wrapper = factory({ noOptionLabel: 'Sem opções disponíveis' })
      expect(wrapper.vm.noOptionLabel).toBe('Sem opções disponíveis')
    })

    it('usa o noOptionLabel padrão', () => {
      const wrapper = factory()
      expect(wrapper.vm.noOptionLabel).toBe('Nenhum resultado foi encontrado.')
    })
  })

  describe('emits', () => {
    it('emite popup-show ao abrir o popup', async () => {
      const wrapper = factory()
      wrapper.vm.onPopupShow()
      await flushPromises()
      expect(wrapper.emitted('popup-show')).toBeTruthy()
    })

    it('emite popup-hide ao fechar o popup', async () => {
      const wrapper = factory()
      wrapper.vm.onPopupHide()
      await flushPromises()
      expect(wrapper.emitted('popup-hide')).toBeTruthy()
    })

    it('emite update:modelValue ao selecionar uma opção', async () => {
      const wrapper = factory()
      wrapper.vm.model = 'opt1'
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['opt1'])
    })
  })

  describe('updateUnsavedChangesCache via inject', () => {
    it('chama updateUnsavedChangesCache ao fazer auto-select quando disponível', async () => {
      const updateUnsavedChangesCache = vi.fn()
      const singleOption = [{ label: 'Única', value: 'only' }]
      factory(
        { useAutoSelect: true, options: singleOption, modelValue: '' },
        {
          global: {
            provide: {
              updateUnsavedChangesCache
            }
          }
        }
      )
      await flushPromises()
      expect(updateUnsavedChangesCache).toHaveBeenCalled()
    })
  })

  describe('hasFuse', () => {
    it('ativa Fuse quando há 10 ou mais opções', () => {
      const manyOptions = Array.from({ length: 10 }, (_, i) => ({ label: `Op ${i}`, value: `op${i}` }))
      const wrapper = factory({ options: manyOptions })
      expect(wrapper.vm.hasFuse).toBe(true)
    })

    it('não ativa Fuse quando há menos de 10 opções', () => {
      const wrapper = factory({ options: defaultOptions })
      expect(wrapper.vm.hasFuse).toBe(false)
    })

    it('não ativa Fuse quando useSearch é false', () => {
      const manyOptions = Array.from({ length: 10 }, (_, i) => ({ label: `Op ${i}`, value: `op${i}` }))
      const wrapper = factory({ options: manyOptions, useSearch: false })
      expect(wrapper.vm.hasFuse).toBe(false)
    })
  })
})
