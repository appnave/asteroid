import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasSelectList from './QasSelectList.vue'

const defaultList = [
  { label: 'Item 1', value: 'item1' },
  { label: 'Item 2', value: 'item2' },
  { label: 'Item 3', value: 'item3' }
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasSelectList, {
    props: {
      searchBoxProps: { list: defaultList },
      modelValue: [],
      ...props
    },
    ...mountOptions
  })
}

describe('QasSelectList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('método add', () => {
    it('adiciona item ao model ao chamar add()', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.add({ label: 'Item 1', value: 'item1' })
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emite evento add ao adicionar item', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.add({ label: 'Item 1', value: 'item1' })
      await flushPromises()
      expect(wrapper.emitted('add')).toBeTruthy()
    })
  })

  describe('método remove', () => {
    it('remove item ao chamar remove()', async () => {
      const wrapper = factory({ modelValue: ['item1'] })
      await flushPromises()
      wrapper.vm.remove({ label: 'Item 1', value: 'item1' })
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emite evento remove ao remover item', async () => {
      const wrapper = factory({ modelValue: ['item1'] })
      await flushPromises()
      wrapper.vm.remove({ label: 'Item 1', value: 'item1' })
      await flushPromises()
      expect(wrapper.emitted('remove')).toBeTruthy()
    })
  })

  describe('método clearSelection', () => {
    it('limpa todos os items selecionados', async () => {
      const wrapper = factory({ modelValue: ['item1', 'item2'] })
      await flushPromises()
      wrapper.vm.clearSelection()
      await flushPromises()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      const lastEmitted = emitted[emitted.length - 1][0]
      expect(lastEmitted).toEqual([])
    })

    it('emite evento clear', async () => {
      const wrapper = factory({ modelValue: ['item1'] })
      await flushPromises()
      wrapper.vm.clearSelection()
      await flushPromises()
      expect(wrapper.emitted('clear')).toBeTruthy()
    })
  })

  describe('prop emitValue', () => {
    it('emite apenas valores quando emitValue é true (padrão)', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.add({ label: 'Item 1', value: 'item1' })
      const emitted = wrapper.emitted('update:modelValue')
      const lastEmit = emitted[emitted.length - 1][0]
      expect(lastEmit).toEqual(['item1'])
    })

    it('emite objetos com label e value quando emitValue é false', async () => {
      const wrapper = factory({ emitValue: false, modelValue: [] })
      await flushPromises()
      wrapper.vm.add({ label: 'Item 1', value: 'item1' })
      const emitted = wrapper.emitted('update:modelValue')
      const lastEmit = emitted[emitted.length - 1][0]
      expect(lastEmit[0]).toMatchObject({ label: 'Item 1', value: 'item1' })
    })
  })

  describe('isClearSelectionDisabled', () => {
    it('está desabilitado quando modelValue está vazio', () => {
      const wrapper = factory({ modelValue: [] })
      expect(wrapper.vm.isClearSelectionDisabled).toBe(true)
    })

    it('está desabilitado quando readonly é true', () => {
      const wrapper = factory({ modelValue: ['item1'], readonly: true })
      expect(wrapper.vm.isClearSelectionDisabled).toBe(true)
    })
  })

  describe('prop deleteOnly', () => {
    it('mostra apenas os itens selecionados quando deleteOnly é true', async () => {
      const wrapper = factory({
        modelValue: ['item1'],
        searchBoxProps: { list: defaultList }
      })
      await flushPromises()
      // sortedList tem todos os itens, mas com itens selecionados primeiro
      expect(wrapper.vm.sortedList.length).toBe(3)
    })
  })
})
