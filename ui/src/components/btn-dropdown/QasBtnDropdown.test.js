import { describe, it, expect, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { Screen } from 'quasar'

import QasBtnDropdown from './QasBtnDropdown.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const buttonsPropsList = {
  edit: { label: 'Editar', icon: 'sym_r_edit' },
  view: { label: 'Visualizar', icon: 'sym_r_visibility' }
}

async function mountBtnDropdown ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasBtnDropdown, { props: { buttonsPropsList, ...props }, ...options })

  return wrapper
}

const getButtons = wrapper => wrapper.findAllComponents(QasBtn)
const getButtonLabels = wrapper => getButtons(wrapper).map(button => button.props('label'))
const getSplitButton = wrapper => getButtons(wrapper).find(button => button.props('label') === 'Opções')

describe('QasBtnDropdown', () => {
  describe('botões', () => {
    it('exibe um botão por item de "buttons-props-list"', async () => {
      const wrapper = await mountBtnDropdown()

      expect(getButtonLabels(wrapper)).toEqual(['Editar', 'Visualizar'])
    })

    it('emite "click" ao clicar em um botão', async () => {
      const wrapper = await mountBtnDropdown()

      await getButtons(wrapper)[0].find('button').trigger('click')

      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('o slot "btn-content-<chave>" substitui o conteúdo do botão', async () => {
      const wrapper = await mountBtnDropdown({ slots: { 'btn-content-edit': '<span class="custom">Custom</span>' } })

      expect(wrapper.find('.custom').exists()).toBe(true)
    })
  })

  describe('menu', () => {
    it('com um botão só e o slot default, o próprio botão abre o menu', async () => {
      const wrapper = await mountBtnDropdown({
        props: { buttonsPropsList: { options: { label: 'Opções' } }, menu: true },
        slots: { default: '<div class="item-menu">Item</div>' }
      })

      await flushPromises()

      expect(wrapper.findComponent({ name: 'QMenu' }).props('modelValue')).toBe(true)
      expect(document.body.querySelector('.item-menu')).not.toBeNull()
    })

    it('com "use-split", adiciona o botão "Opções" que abre o menu', async () => {
      const wrapper = await mountBtnDropdown({ props: { useSplit: true }, slots: { default: '<div>Item</div>' } })

      expect(getSplitButton(wrapper).props()).toMatchObject({ iconRight: 'sym_r_more_vert', useLabelOnSmallScreen: false })
      expect(getSplitButton(wrapper).findComponent({ name: 'QMenu' }).exists()).toBe(true)
    })

    it('emite "update:menu" quando o menu abre ou fecha', async () => {
      const wrapper = await mountBtnDropdown({ props: { useSplit: true }, slots: { default: '<div>Item</div>' } })

      wrapper.findComponent({ name: 'QMenu' }).vm.$emit('update:modelValue', true)

      expect(wrapper.emitted('update:menu')).toEqual([[true]])
    })
  })

  describe('telas pequenas', () => {
    // o Screen do Quasar é reativo, então basta alterar o "xs" e voltar ao valor original no final
    afterEach(() => {
      Screen.xs = false
    })

    it('com "use-split", esconde os botões e deixa só o "Opções" com o ícone à esquerda', async () => {
      Screen.xs = true

      const wrapper = await mountBtnDropdown({ props: { useSplit: true } })

      expect(getButtonLabels(wrapper)).toEqual(['Opções'])
      expect(getSplitButton(wrapper).props('icon')).toBe('sym_r_more_vert')
    })
  })
})
