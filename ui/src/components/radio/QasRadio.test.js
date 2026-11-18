import { describe, it, expect, afterEach } from 'vitest'
import { Screen } from 'quasar'

import QasRadio from './QasRadio.vue'
import QasLabel from '../label/QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const options = [
  { label: 'Sim', value: true },
  { label: 'Não', value: false }
]

async function mountRadio ({ props = {}, ...mountOptions } = {}) {
  const { wrapper } = await mountQas(QasRadio, { props, ...mountOptions })

  return wrapper
}

describe('QasRadio', () => {
  afterEach(() => {
    Screen.xs = false
  })

  it('sem "options", é um radio único com o label', async () => {
    const wrapper = await mountRadio({ props: { label: 'Sim' }, attrs: { val: true, modelValue: false } })

    expect(wrapper.findComponent({ name: 'QRadio' }).props()).toMatchObject({ label: 'Sim', val: true })
  })

  it('com "options", exibe o label do grupo e as opções em linha', async () => {
    const wrapper = await mountRadio({ props: { label: 'Possui filhos?' }, attrs: { options, modelValue: true } })

    expect(wrapper.findComponent(QasLabel).props('label')).toBe('Possui filhos?')
    expect(wrapper.findComponent({ name: 'QOptionGroup' }).props()).toMatchObject({ options, inline: true })
  })

  it('em telas pequenas, as opções ficam uma embaixo da outra', async () => {
    Screen.xs = true

    const wrapper = await mountRadio({ attrs: { options, modelValue: true } })

    expect(wrapper.findComponent({ name: 'QOptionGroup' }).props('inline')).toBe(false)
  })
})
