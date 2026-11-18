import { describe, it, expect } from 'vitest'

import QasCheckbox from './QasCheckbox.vue'
import QasErrorMessage from '../error-message/QasErrorMessage.vue'
import QasLabel from '../label/QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountCheckbox ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasCheckbox, { props, ...options })

  return wrapper
}

const options = [
  { label: 'Vendas', value: 'sales' },
  { label: 'Financeiro', value: 'finance' }
]

const optionsWithChildren = [
  {
    label: 'Relatórios',
    children: [{ label: 'Vendas', value: 'sales' }, { label: 'Financeiro', value: 'finance' }]
  }
]

const getParentCheckbox = wrapper => wrapper.findAllComponents({ name: 'QCheckbox' }).find(checkbox => checkbox.props('label') === 'Relatórios')

describe('QasCheckbox', () => {
  describe('único', () => {
    it('sem "options", é um checkbox único com o label', async () => {
      const wrapper = await mountCheckbox({ props: { label: 'Aceito os termos', modelValue: false } })

      expect(wrapper.findComponent({ name: 'QCheckbox' }).props()).toMatchObject({ label: 'Aceito os termos', modelValue: false })
    })

    it('emite o novo valor', async () => {
      const wrapper = await mountCheckbox({ props: { modelValue: false } })

      wrapper.findComponent({ name: 'QCheckbox' }).vm.$emit('update:modelValue', true)

      expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    })
  })

  describe('grupo', () => {
    it('com "options", exibe o label do grupo e uma opção para cada item', async () => {
      const wrapper = await mountCheckbox({ props: { label: 'Áreas', required: true, options } })

      expect(wrapper.findComponent(QasLabel).props('label')).toBe('Áreas*')
      expect(wrapper.findAllComponents({ name: 'QOptionGroup' })).toHaveLength(2)
    })

    it('exibe a mensagem de erro do grupo', async () => {
      const wrapper = await mountCheckbox({ props: { options, errorMessage: 'Selecione uma área' } })

      expect(wrapper.findComponent(QasErrorMessage).props('message')).toBe('Selecione uma área')
    })

    it('marcar o pai seleciona todos os filhos', async () => {
      const wrapper = await mountCheckbox({ props: { options: optionsWithChildren, modelValue: [] } })

      getParentCheckbox(wrapper).vm.$emit('update:modelValue', true)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['sales', 'finance']])
    })

    it('desmarcar o pai remove todos os filhos', async () => {
      const wrapper = await mountCheckbox({ props: { options: optionsWithChildren, modelValue: ['sales', 'finance', 'outro'] } })

      getParentCheckbox(wrapper).vm.$emit('update:modelValue', false)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['outro']])
    })

    it('o pai fica marcado, desmarcado ou parcial conforme os filhos', async () => {
      const all = await mountCheckbox({ props: { options: optionsWithChildren, modelValue: ['sales', 'finance'] } })
      const some = await mountCheckbox({ props: { options: optionsWithChildren, modelValue: ['sales'] } })
      const none = await mountCheckbox({ props: { options: optionsWithChildren, modelValue: [] } })

      expect(getParentCheckbox(all).props('modelValue')).toBe(true)
      expect(getParentCheckbox(some).props('modelValue')).toBeNull()
      expect(getParentCheckbox(none).props('modelValue')).toBe(false)
    })
  })
})
