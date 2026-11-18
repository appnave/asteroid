import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasSelectList from './QasSelectList.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const list = [
  { label: 'Ana', value: 'ana', email: 'ana@email.com' },
  { label: 'Bruno', value: 'bruno', email: 'bruno@email.com' },
  { label: 'Carla', value: 'carla', email: 'carla@email.com' }
]

async function mountSelectList ({ props = {}, searchBoxProps = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasSelectList, {
    props: { searchBoxProps: { list, ...searchBoxProps }, ...props },
    ...options
  })

  await flushPromises()

  return wrapper
}

const getCheckboxes = wrapper => wrapper.findAllComponents({ name: 'PvSelectListCheckbox' })
const getCheckbox = (wrapper, value) => getCheckboxes(wrapper).find(checkbox => checkbox.props('result').value === value)
const getLabels = wrapper => getCheckboxes(wrapper).map(checkbox => checkbox.props('result').label)
const getClearButton = wrapper => wrapper.findAllComponents({ name: 'QasBtn' }).find(button => button.props('label') === 'Limpar seleção')
const getLastModel = wrapper => wrapper.emitted('update:modelValue').at(-1)[0]

describe('QasSelectList', () => {
  describe('lista', () => {
    it('exibe um checkbox por item, marcando os que estão no model', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['bruno'] } })

      expect(getCheckboxes(wrapper)).toHaveLength(3)
      expect(getCheckbox(wrapper, 'bruno').props('useActive')).toBe(true)
      expect(getCheckbox(wrapper, 'ana').props('useActive')).toBe(false)
    })

    it('exibe primeiro os itens selecionados', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['carla'] } })

      expect(getLabels(wrapper)).toEqual(['Carla', 'Ana', 'Bruno'])
    })

    it('com "delete-only", exibe só os itens selecionados', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['carla'], deleteOnly: true } })

      expect(getLabels(wrapper)).toEqual(['Carla'])
    })

    it('o slot "item" substitui o checkbox, recebendo as funções de seleção', async () => {
      const wrapper = await mountSelectList({
        slots: { item: '<button class="custom" @click="params.add(params.item)">{{ params.item.label }}</button>' }
      })

      await wrapper.find('.custom').trigger('click')

      expect(getLastModel(wrapper)).toEqual(['ana'])
    })
  })

  describe('seleção', () => {
    it('ao marcar, adiciona o valor ao model e emite "add"', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['bruno'] } })

      getCheckbox(wrapper, 'ana').vm.$emit('add', list[0])

      expect(getLastModel(wrapper)).toEqual(['bruno', 'ana'])
      expect(wrapper.emitted('add')).toEqual([[list[0]]])
    })

    it('ao desmarcar, remove o valor do model e emite "remove" com a posição', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['ana', 'bruno'] } })

      getCheckbox(wrapper, 'bruno').vm.$emit('remove', list[1])

      expect(getLastModel(wrapper)).toEqual(['ana'])
      expect(wrapper.emitted('remove')).toEqual([[list[1], 1]])
    })

    it('com "emit-value" false, usa objetos com label e value', async () => {
      const wrapper = await mountSelectList({ props: { emitValue: false } })

      getCheckbox(wrapper, 'ana').vm.$emit('add', list[0])

      expect(getLastModel(wrapper)).toEqual([{ label: 'Ana', value: 'ana' }])
    })

    it('com "emit-value" false, remove pelo value do objeto', async () => {
      const wrapper = await mountSelectList({
        props: { emitValue: false, modelValue: [{ label: 'Ana', value: 'ana' }, { label: 'Bruno', value: 'bruno' }] }
      })

      getCheckbox(wrapper, 'ana').vm.$emit('remove', list[0])

      expect(getLastModel(wrapper)).toEqual([{ label: 'Bruno', value: 'bruno' }])
    })
  })

  describe('limpar seleção', () => {
    it('limpa o model e emite "clear" com os valores anteriores', async () => {
      const wrapper = await mountSelectList({ props: { modelValue: ['ana', 'bruno'] } })

      await getClearButton(wrapper).find('button').trigger('click')

      expect(wrapper.emitted('clear')[0][0]).toEqual(['ana', 'bruno'])
      expect(getLastModel(wrapper)).toEqual([])
    })

    it('fica desabilitado sem seleção ou com "readonly"', async () => {
      const empty = await mountSelectList()
      const readonly = await mountSelectList({ props: { modelValue: ['ana'], readonly: true } })

      expect(getClearButton(empty).props('disable')).toBe(true)
      expect(getClearButton(readonly).props('disable')).toBe(true)
    })
  })
})
