import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasTransfer from './QasTransfer.vue'
import QasLabel from '../label/QasLabel.vue'
import QasSearchBox from '../search-box/QasSearchBox.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeOptions = () => [
  { label: 'Ana', value: 'ana' },
  { label: 'Bruno', value: 'bruno' },
  { label: 'Carla', value: 'carla' }
]

async function mountTransfer ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasTransfer, {
    props: {
      label: 'Disponíveis',
      options: makeOptions(),
      'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
      ...props
    },
    ...options
  })

  await flushPromises()

  return wrapper
}

const getSearchBoxes = wrapper => wrapper.findAllComponents(QasSearchBox)
const getAvailable = wrapper => getSearchBoxes(wrapper)[0].props('list').map(item => item.label)
const getSelected = wrapper => getSearchBoxes(wrapper)[1].props('list').map(item => item.label)
const getLastEmitted = wrapper => wrapper.emitted('update:modelValue').at(-1)[0]

async function clickItem (wrapper, columnIndex, label) {
  const column = getSearchBoxes(wrapper)[columnIndex]
  const item = column.findAll('.q-item').find(element => element.text() === label)

  await item.trigger('click')
}

async function clickArrow (wrapper, icon) {
  const button = wrapper.findAllComponents({ name: 'QasBtn' }).find(element => element.props('icon') === icon)

  await button.find('button').trigger('click')
  await flushPromises()
}

const select = wrapper => clickArrow(wrapper, 'sym_r_arrow_circle_down')
const unselect = wrapper => clickArrow(wrapper, 'sym_r_arrow_circle_up')

describe('QasTransfer', () => {
  it('exibe as opções disponíveis e as selecionadas', async () => {
    const wrapper = await mountTransfer({ props: { modelValue: [{ label: 'Bruno', value: 'bruno' }] } })

    expect(getAvailable(wrapper)).toEqual(['Ana', 'Carla'])
    expect(getSelected(wrapper)).toEqual(['Bruno'])
  })

  it('com "emit-value", o model são só os valores', async () => {
    const wrapper = await mountTransfer({ props: { emitValue: true, modelValue: ['carla'] } })

    expect(getSelected(wrapper)).toEqual(['Carla'])
  })

  describe('mover itens', () => {
    it('marca os itens e move para "Selecionadas"', async () => {
      const wrapper = await mountTransfer()

      await clickItem(wrapper, 0, 'Ana')
      await clickItem(wrapper, 0, 'Carla')
      await select(wrapper)

      expect(getSelected(wrapper)).toEqual(['Ana', 'Carla'])
      expect(getAvailable(wrapper)).toEqual(['Bruno'])
      expect(getLastEmitted(wrapper)).toEqual([{ label: 'Ana', value: 'ana' }, { label: 'Carla', value: 'carla' }])
    })

    it('clicar de novo desmarca o item', async () => {
      const wrapper = await mountTransfer()

      await clickItem(wrapper, 0, 'Ana')
      await clickItem(wrapper, 0, 'Ana')

      expect(getSearchBoxes(wrapper)[0].find('.bg-grey-4').exists()).toBe(false)
    })

    it('move de volta para as disponíveis', async () => {
      const wrapper = await mountTransfer({ props: { modelValue: [{ label: 'Ana', value: 'ana' }, { label: 'Bruno', value: 'bruno' }] } })

      await clickItem(wrapper, 1, 'Ana')
      await unselect(wrapper)

      expect(getSelected(wrapper)).toEqual(['Bruno'])
      expect(getAvailable(wrapper)).toContain('Ana')
      expect(getLastEmitted(wrapper)).toEqual([{ label: 'Bruno', value: 'bruno' }])
    })

    it('com "emit-value", emite só os valores', async () => {
      const wrapper = await mountTransfer({ props: { emitValue: true } })

      await clickItem(wrapper, 0, 'Bruno')
      await select(wrapper)

      expect(getLastEmitted(wrapper)).toEqual(['bruno'])
    })
  })

  describe('títulos e sincronização', () => {
    it('exibe a quantidade de itens no título de cada coluna', async () => {
      const wrapper = await mountTransfer({ props: { modelValue: [{ label: 'Bruno', value: 'bruno' }] } })

      expect(wrapper.findAllComponents(QasLabel).map(label => label.text())).toEqual(['Disponíveis (2)', 'Selecionadas (1)'])
    })
    it('não duplica os selecionados quando as "options" mudam', async () => {
      const wrapper = await mountTransfer({ props: { modelValue: [{ label: 'Ana', value: 'ana' }] } })

      await wrapper.setProps({ options: makeOptions() })
      await flushPromises()

      expect(getSelected(wrapper)).toEqual(['Ana'])
    })
    it('limpar o model por fora limpa as selecionadas', async () => {
      const wrapper = await mountTransfer({ props: { modelValue: [{ label: 'Ana', value: 'ana' }] } })

      await wrapper.setProps({ modelValue: [] })
      await flushPromises()

      expect(getSelected(wrapper)).toEqual([])
    })
  })
})
