import { describe, it, expect } from 'vitest'

import QasToggle from './QasToggle.vue'
import QasTip from '../tip/QasTip.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountToggle ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasToggle, { props, ...options })

  return wrapper
}

const getQToggle = wrapper => wrapper.findComponent({ name: 'QToggle' })

describe('QasToggle', () => {
  it('com "tip" e label, exibe a dica ao lado do label', async () => {
    const wrapper = await mountToggle({ props: { tip: 'Some do site' }, attrs: { label: 'Ativo', modelValue: false } })

    expect(wrapper.findComponent(QasTip).props('text')).toBe('Some do site')
    expect(getQToggle(wrapper).props('label')).toBeUndefined()
    expect(wrapper.text()).toContain('Ativo')
  })

  it('emite o novo valor', async () => {
    const values = []
    const wrapper = await mountToggle({ attrs: { modelValue: false, 'onUpdate:modelValue': value => values.push(value) } })

    getQToggle(wrapper).vm.$emit('update:modelValue', true)

    expect(values).toEqual([true])
  })
})
