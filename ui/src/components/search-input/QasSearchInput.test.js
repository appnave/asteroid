import { describe, it, expect } from 'vitest'

import QasSearchInput from './QasSearchInput.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasInput from '../input/QasInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountSearchInput ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasSearchInput, { props, ...options })

  return wrapper
}

const getInput = wrapper => wrapper.findComponent(QasInput)
const getButtonByIcon = (wrapper, icon) => wrapper.findAllComponents(QasBtn).find(button => button.props('icon') === icon)

describe('QasSearchInput', () => {
  it('pesquisa ao digitar, com debounce de 1200ms', async () => {
    const wrapper = await mountSearchInput()

    expect(getInput(wrapper).vm.$attrs.debounce).toBe('1200')
    expect(wrapper.findComponent({ name: 'QIcon' }).props('name')).toBe('sym_r_search')
  })

  it('com "use-search-on-type" false, a lupa vira um botão que emite "filter"', async () => {
    const wrapper = await mountSearchInput({ props: { useSearchOnType: false } })

    await getButtonByIcon(wrapper, 'sym_r_search').find('button').trigger('click')

    expect(wrapper.emitted('filter')).toHaveLength(1)
  })

  it('emite o texto digitado', async () => {
    const wrapper = await mountSearchInput()

    getInput(wrapper).vm.$emit('update:modelValue', 'ana')

    expect(wrapper.emitted('update:modelValue')).toEqual([['ana']])
  })

  it('com texto, o botão de limpar emite "clear" e apaga a pesquisa', async () => {
    const wrapper = await mountSearchInput({ props: { modelValue: 'ana' } })

    await getButtonByIcon(wrapper, 'sym_r_clear').find('button').trigger('click')

    expect(wrapper.emitted('clear')).toEqual([['ana']])
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
  })
})
