import { describe, it, expect, afterEach, vi } from 'vitest'
import { Screen } from 'quasar'

import QasOptionGroup from './QasOptionGroup.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const options = [
  { label: 'Pix', value: 'pix' },
  { label: 'Boleto', value: 'boleto' }
]

async function mountOptionGroup ({ props = {}, ...mountOptions } = {}) {
  const { wrapper } = await mountQas(QasOptionGroup, { props: { options, ...props }, ...mountOptions })

  return wrapper
}

const getQOptionGroup = wrapper => wrapper.findComponent({ name: 'QOptionGroup' })

describe('QasOptionGroup', () => {
  afterEach(() => {
    Screen.xs = false
  })

  it('exibe as opções como radio, em linha', async () => {
    const wrapper = await mountOptionGroup({ props: { modelValue: 'pix' } })

    expect(getQOptionGroup(wrapper).props()).toMatchObject({ options, modelValue: 'pix', inline: true })
  })

  it('em telas pequenas, as opções ficam uma embaixo da outra', async () => {
    Screen.xs = true

    const wrapper = await mountOptionGroup()

    expect(getQOptionGroup(wrapper).props('inline')).toBe(false)
  })

  it('emite a opção selecionada', async () => {
    const wrapper = await mountOptionGroup({ props: { modelValue: 'pix' } })

    getQOptionGroup(wrapper).vm.$emit('update:modelValue', 'boleto')

    expect(wrapper.emitted('update:modelValue')).toEqual([['boleto']])
  })

  // Problema listado no documento: a prop "type" é declarada mas não é repassada, então sempre usa radio.
  it.fails('com "type" checkbox, exibe checkboxes', async () => {
    // enquanto o problema existe, o QOptionGroup fica como radio e reclama do model em lista
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = await mountOptionGroup({ props: { type: 'checkbox', modelValue: [] } })

    consoleError.mockRestore()

    expect(getQOptionGroup(wrapper).props('type')).toBe('checkbox')
  })
})
