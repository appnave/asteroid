import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasInput from './QasInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountInput ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasInput, { props, ...options })

  // a máscara é definida no nextTick e os componentes internos são assíncronos
  await flushPromises()

  return wrapper
}

const getQInput = wrapper => wrapper.findComponent({ name: 'QInput' })

describe('QasInput', () => {
  describe('máscaras', () => {
    it.each([
      ['phone', '1198765432', '(##) ####-#####'],
      ['phone', '11987654321', '(##) #####-####'],
      ['document', '12345678901', 'XXX.XXX.XXX-XXX'],
      ['document', '12345678000199', 'XX.XXX.XXX/XXXX-##'],
      ['document', '12ABC345000199', 'XX.XXX.XXX/XXXX-##']
    ])('máscara "%s" com %j usa "%s"', async (mask, modelValue, expected) => {
      const wrapper = await mountInput({ props: { mask, modelValue } })

      expect(getQInput(wrapper).props('mask')).toBe(expected)
    })

    it('usa o teclado adequado para cada máscara', async () => {
      const phone = await mountInput({ props: { mask: 'phone' } })
      const email = await mountInput({ attrs: { type: 'email' } })

      expect(phone.find('input').attributes('inputmode')).toBe('tel')
      expect(email.find('input').attributes('inputmode')).toBe('email')
    })
  })

  describe('label e erro', () => {
    it('adiciona "*" ao label quando obrigatório', async () => {
      const wrapper = await mountInput({ props: { required: true }, attrs: { label: 'Nome' } })

      expect(getQInput(wrapper).props('label')).toBe('Nome*')
    })

    it('com "use-remove-error-on-type", limpa o erro ao digitar', async () => {
      const wrapper = await mountInput({ props: { error: true, useRemoveErrorOnType: true } })

      getQInput(wrapper).vm.$emit('update:modelValue', 'a')
      await flushPromises()

      expect(getQInput(wrapper).props('error')).toBe(false)
      expect(wrapper.emitted('update:modelValue')).toEqual([['a']])
    })

    it('sem "use-remove-error-on-type", mantém o erro ao digitar', async () => {
      const wrapper = await mountInput({ props: { error: true } })

      getQInput(wrapper).vm.$emit('update:modelValue', 'a')
      await flushPromises()

      expect(getQInput(wrapper).props('error')).toBe(true)
    })
  })

  describe('extras', () => {
    it('textarea cresce com o conteúdo e conta os caracteres quando tem "maxlength"', async () => {
      const wrapper = await mountInput({ attrs: { type: 'textarea', maxlength: 200 } })

      expect(getQInput(wrapper).props()).toMatchObject({ autogrow: true, counter: true })
    })

    it('com "use-copy" e "readonly", exibe o botão de copiar o valor', async () => {
      const wrapper = await mountInput({ props: { modelValue: 'ABC123', readonly: true, useCopy: true } })

      // o QasCopy é carregado de forma assíncrona
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'QasCopy' }).exists()).toBe(true))

      expect(wrapper.findComponent({ name: 'QasCopy' }).props()).toMatchObject({ text: 'ABC123', useText: false })
    })

    it('com "tip", exibe a dica ao lado do label', async () => {
      const wrapper = await mountInput({ props: { tip: 'Como aparece no documento' }, attrs: { label: 'Nome' } })

      // o QasTip é carregado de forma assíncrona
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'QasTip' }).exists()).toBe(true))

      expect(wrapper.findComponent({ name: 'QasTip' }).props('text')).toBe('Como aparece no documento')
    })
  })
})
