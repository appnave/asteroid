import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasTransfer from './QasTransfer.vue'

const defaultOptions = [
  { label: 'Opção 1', value: 'opt1' },
  { label: 'Opção 2', value: 'opt2' },
  { label: 'Opção 3', value: 'opt3' }
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasTransfer, {
    props: {
      label: 'Disponíveis',
      options: defaultOptions,
      modelValue: [],
      ...props
    },
    ...mountOptions
  })
}

describe('QasTransfer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-transfer').exists()).toBe(true)
    })

    it('exibe lista de opções disponíveis', () => {
      const wrapper = factory()
      expect(wrapper.vm.optionsList.length).toBe(3)
    })
  })

  describe('seleção de itens', () => {
    it('adiciona item à fila ao clicar onSelectQueue', () => {
      const wrapper = factory()
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      expect(wrapper.vm.firstQueue.length).toBe(1)
    })

    it('remove item da fila se já estiver selecionado', () => {
      const wrapper = factory()
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      expect(wrapper.vm.firstQueue.length).toBe(0)
    })
  })

  describe('mover itens', () => {
    it('move itens da lista de disponíveis para a lista de selecionadas ao confirmar', async () => {
      const wrapper = factory()
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      wrapper.vm.setSelectedFromClick(true)
      await flushPromises()
      expect(wrapper.vm.selectedList.length).toBe(1)
      expect(wrapper.vm.optionsList.length).toBe(2)
    })

    it('emite update:modelValue ao confirmar seleção', async () => {
      const wrapper = factory()
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      wrapper.vm.setSelectedFromClick(true)
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('move itens de volta para disponíveis ao remover', async () => {
      const wrapper = factory({ modelValue: [defaultOptions[0]] })
      await flushPromises()
      wrapper.vm.onSelectQueue(defaultOptions[0], false)
      wrapper.vm.setSelectedFromClick(false)
      await flushPromises()
      expect(wrapper.vm.optionsList.length).toBe(3)
    })
  })

  describe('prop modelValue inicial', () => {
    it('inicializa selectedList com os valores do modelValue', async () => {
      const wrapper = factory({ modelValue: [defaultOptions[0]] })
      await flushPromises()
      expect(wrapper.vm.selectedList.length).toBe(1)
      expect(wrapper.vm.selectedList[0].value).toBe('opt1')
    })

    it('remove do optionsList os itens já selecionados', async () => {
      const wrapper = factory({ modelValue: [defaultOptions[0]] })
      await flushPromises()
      expect(wrapper.vm.optionsList.length).toBe(2)
    })
  })

  describe('prop emitValue', () => {
    it('emite apenas valores quando emitValue é true', async () => {
      const wrapper = factory({ emitValue: true })
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      wrapper.vm.setSelectedFromClick(true)
      await flushPromises()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[emitted.length - 1][0]).toEqual(['opt1'])
    })

    it('emite objetos quando emitValue é false', async () => {
      const wrapper = factory({ emitValue: false })
      wrapper.vm.onSelectQueue(defaultOptions[0], true)
      wrapper.vm.setSelectedFromClick(true)
      await flushPromises()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      const lastEmit = emitted[emitted.length - 1][0]
      expect(lastEmit[0]).toMatchObject({ label: 'Opção 1', value: 'opt1' })
    })
  })
})
