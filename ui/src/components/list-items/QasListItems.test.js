import { describe, it, expect } from 'vitest'

import QasListItems from './QasListItems.vue'
import QasBox from '../box/QasBox.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasLabel from '../label/QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const list = [
  { label: 'Contrato', description: 'Assinado em 01/01' },
  { label: 'Distrato' }
]

async function mountListItems ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasListItems, { props: { list, ...props }, ...options })

  return wrapper
}

describe('QasListItems', () => {
  it('exibe o label e a descrição de cada item, dentro de um QasBox', async () => {
    const wrapper = await mountListItems()

    expect(wrapper.findAllComponents(QasLabel).map(label => label.props('label'))).toEqual(['Contrato', 'Distrato'])
    expect(wrapper.text()).toContain('Assinado em 01/01')
    expect(wrapper.findComponent(QasBox).exists()).toBe(true)
  })

  it('"label-key" e "description-key" mudam as chaves usadas', async () => {
    const wrapper = await mountListItems({ props: { list: [{ name: 'Ana', email: 'ana@email.com' }], labelKey: 'name', descriptionKey: 'email' } })

    expect(wrapper.findComponent(QasLabel).props('label')).toBe('Ana')
    expect(wrapper.text()).toContain('ana@email.com')
  })

  it('ao clicar no botão do item, emite "click-item"', async () => {
    const wrapper = await mountListItems()

    await wrapper.findAllComponents(QasBtn)[1].find('button').trigger('click')

    expect(wrapper.emitted('click-item')).toEqual([[{ item: list[1], index: 1 }]])
  })

  it('com "use-clickable-item", o clique é no item inteiro', async () => {
    const wrapper = await mountListItems({ props: { useClickableItem: true } })

    await wrapper.findAll('.q-item')[0].trigger('click')

    expect(wrapper.emitted('click-item')).toEqual([[{ item: list[0], index: 0 }]])
  })
})
