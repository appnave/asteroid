import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasNumericInput from './QasNumericInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o AutoNumeric é criado no nextTick depois de montar
async function mountNumericInput ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasNumericInput, { props, ...options })

  await flushPromises()

  return wrapper
}

const getInput = wrapper => wrapper.find('input')
const getDisplayedValue = wrapper => getInput(wrapper).element.value

async function blur (wrapper) {
  await getInput(wrapper).trigger('blur')
}

describe('QasNumericInput', () => {
  describe('formatação por modo', () => {
    it.each([
      ['integer', 1234, '1.234'],
      ['decimal', 1234.5, '1.234,50'],
      ['money', 1234.5, 'R$ 1.234,50'],
      ['percent', 0.35, '35,00 %']
    ])('modo "%s" exibe %s como "%s"', async (mode, modelValue, displayedValue) => {
      const wrapper = await mountNumericInput({ props: { mode, modelValue } })

      expect(getDisplayedValue(wrapper)).toBe(displayedValue)
    })

    it('atualiza o valor exibido quando o model muda', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'decimal', modelValue: 1 } })

      await wrapper.setProps({ modelValue: 25.75 })

      expect(getDisplayedValue(wrapper)).toBe('25,75')
    })
  })

  describe('valor emitido', () => {
    it('ao sair do campo, emite o número', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'money', modelValue: 99.9 } })

      await blur(wrapper)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([99.9])
    })

    it('em porcentagem, emite a fração sem dízimas (0,35% vira 0.0035)', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'percent', modelValue: 0.0035 } })

      await blur(wrapper)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([0.0035])
    })

    it('ao digitar, emite "update-model" com o texto e o número', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'decimal' } })

      wrapper.vm.autoNumeric.set(12.5)
      await getInput(wrapper).trigger('input')

      expect(wrapper.emitted('update-model').at(-1)).toEqual([{ value: '12,50', raw: 12.5 }])
    })

    it('campo limpo vira 0', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'decimal', modelValue: 10 } })

      wrapper.vm.autoNumeric.set('')
      await getInput(wrapper).trigger('input')
      await blur(wrapper)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([0])
    })
  })

  describe('limites', () => {
    it('por padrão, não aceita negativos', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'decimal' } })

      expect(wrapper.vm.autoNumeric.getSettings().minimumValue).toBe('0')
    })

    it('com "use-negative", aceita negativos', async () => {
      const wrapper = await mountNumericInput({ props: { mode: 'decimal', useNegative: true, modelValue: -5 } })

      expect(getDisplayedValue(wrapper)).toBe('-5,00')
    })
  })
})
