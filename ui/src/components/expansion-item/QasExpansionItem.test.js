import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasExpansionItem from './QasExpansionItem.vue'
import QasBadge from '../badge/QasBadge.vue'
import QasGridGenerator from '../grid-generator/QasGridGenerator.vue'
import QasLabel from '../label/QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountExpansionItem ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasExpansionItem, {
    props: { label: 'Dados do cliente', ...props },
    slots: { content: '<p class="conteudo">Conteúdo</p>' },
    ...options
  })

  return wrapper
}

const getQExpansionItem = wrapper => wrapper.findComponent({ name: 'QExpansionItem' })

describe('QasExpansionItem', () => {
  it('exibe o label e os badges no cabeçalho', async () => {
    const wrapper = await mountExpansionItem({ props: { badges: [{ label: 'Pendente' }] } })

    expect(wrapper.findComponent(QasLabel).props('label')).toBe('Dados do cliente')
    expect(wrapper.findComponent(QasBadge).props('label')).toBe('Pendente')
  })

  it('só renderiza o conteúdo depois de abrir pela primeira vez', async () => {
    const wrapper = await mountExpansionItem()

    expect(wrapper.find('.conteudo').exists()).toBe(false)

    getQExpansionItem(wrapper).vm.$emit('show')
    await flushPromises()

    expect(wrapper.find('.conteudo').exists()).toBe(true)
  })

  it('aberto pelo model, já renderiza o conteúdo', async () => {
    const wrapper = await mountExpansionItem({ props: { modelValue: true } })

    expect(wrapper.find('.conteudo').exists()).toBe(true)
  })

  it('com "grid-generator-props" e sem slot, exibe um QasGridGenerator em linha', async () => {
    const { wrapper } = await mountQas(QasExpansionItem, {
      props: { label: 'Dados', modelValue: true, gridGeneratorProps: { fields: { name: { name: 'name', label: 'Nome', type: 'text' } }, result: { name: 'Ana' } } }
    })

    expect(wrapper.findComponent(QasGridGenerator).props('useInline')).toBe(true)
  })

  it('com "disable", desabilita o item e o botão', async () => {
    const wrapper = await mountExpansionItem({ props: { disable: true } })

    expect(getQExpansionItem(wrapper).props('disable')).toBe(true)
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['qas-expansion-item--disabled', 'qas-expansion-item--disabled-full']))
  })
})
