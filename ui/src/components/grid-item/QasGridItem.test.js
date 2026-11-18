import { describe, it, expect, afterEach } from 'vitest'
import { Screen } from 'quasar'

import QasGridItem from './QasGridItem.vue'
import QasTip from '../tip/QasTip.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountGridItem ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasGridItem, { props: { label: 'Nome', value: 'Ana Souza', ...props }, ...options })

  return wrapper
}

const getContent = wrapper => wrapper.find('header + div')

describe('QasGridItem', () => {
  afterEach(() => {
    Screen.xs = false
  })

  it('exibe o label e o valor, cortando o texto e usando o valor como "title"', async () => {
    const wrapper = await mountGridItem()

    expect(wrapper.find('header').text()).toBe('Nome')
    expect(getContent(wrapper).text()).toBe('Ana Souza')
    expect(getContent(wrapper).classes()).toContain('ellipsis')
    expect(getContent(wrapper).attributes('title')).toBe('Ana Souza')
  })

  it('em telas pequenas, não corta o texto', async () => {
    Screen.xs = true

    const wrapper = await mountGridItem()

    expect(getContent(wrapper).classes()).not.toContain('ellipsis')
  })

  it('com "tip", exibe a dica ao lado do label', async () => {
    const wrapper = await mountGridItem({ props: { tip: 'Nome completo' } })

    expect(wrapper.findComponent(QasTip).props('text')).toBe('Nome completo')
  })
})
