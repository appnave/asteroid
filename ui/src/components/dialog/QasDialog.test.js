import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'

import QasDialog from './QasDialog.vue'
import QasActions from '../actions/QasActions.vue'
import QasHeader from '../header/QasHeader.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountDialog ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasDialog, {
    props: { title: 'Confirmar', description: 'Deseja continuar?', modelValue: true, ...props },
    ...options
  })

  await flushPromises()

  return wrapper
}

// o QDialog renderiza o conteúdo em um portal fora do wrapper
const findInBody = selector => document.body.querySelector(selector)
const clickInBody = selector => findInBody(selector).click()

describe('QasDialog', () => {
  describe('conteúdo', () => {
    it('exibe o título no QasHeader e a descrição', async () => {
      const wrapper = await mountDialog()

      expect(wrapper.findComponent(QasHeader).props('labelProps').label).toBe('Confirmar')
      expect(findInBody('[data-cy="dialog-description"]').textContent.trim()).toBe('Deseja continuar?')
    })

    it('com "use-html-description", renderiza a descrição como HTML', async () => {
      await mountDialog({ props: { description: '<strong class="forte">Atenção</strong>', useHtmlDescription: true } })

      expect(findInBody('.forte').textContent).toBe('Atenção')
    })
  })

  describe('botões', () => {
    it('exibe "Ok" e "Cancelar" por padrão', async () => {
      const wrapper = await mountDialog()

      const actions = wrapper.findComponent(QasActions)

      expect(actions.props('primaryButtonProps').label).toBe('Ok')
      expect(actions.props('secondaryButtonProps').label).toBe('Cancelar')
    })

    it('com "ok" e "cancel" false, não exibe as ações', async () => {
      const wrapper = await mountDialog({ props: { ok: false, cancel: false } })

      expect(wrapper.findComponent(QasActions).exists()).toBe(false)
    })

    it('ao clicar em "Ok", chama o "onClick", emite "ok" e fecha', async () => {
      const onClick = vi.fn()
      const wrapper = await mountDialog({ props: { ok: { onClick } } })

      clickInBody('[data-cy="dialog-ok-btn"]')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('ok')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    })

    it('com "use-auto-close-on-ok" false, não fecha ao clicar em "Ok"', async () => {
      const wrapper = await mountDialog({ props: { useAutoCloseOnOk: false } })

      clickInBody('[data-cy="dialog-ok-btn"]')

      expect(wrapper.emitted('ok')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('ao clicar em "Cancelar", chama o "onClick", emite "cancel" e fecha', async () => {
      const onClick = vi.fn()
      const wrapper = await mountDialog({ props: { cancel: { onClick } } })

      clickInBody('[data-cy="dialog-cancel-btn"]')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    })

    it('o botão de fechar fecha o dialog', async () => {
      const wrapper = await mountDialog()

      clickInBody('[data-cy="dialog-close-btn"]')

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    })

    it('desabilita o botão de fechar enquanto o "Ok" está em loading', async () => {
      const wrapper = await mountDialog({ props: { ok: { loading: true } } })

      expect(wrapper.findComponent(QasHeader).props('buttonProps').disable).toBe(true)
    })
  })

  describe('persistent', () => {
    it('dentro de um drawer, respeita o "persistent" do drawer', async () => {
      const wrapper = await mountDialog({ provide: { drawerProps: { value: { persistent: false } } } })

      expect(wrapper.findComponent({ name: 'QDialog' }).props('persistent')).toBe(false)
    })
  })

  describe('use-form', () => {
    async function submit () {
      findInBody('form').dispatchEvent(new Event('submit', { cancelable: true }))
      await flushPromises()
    }

    it('o "Ok" vira o botão de submit do formulário', async () => {
      const wrapper = await mountDialog({ props: { useForm: true } })

      expect(wrapper.findComponent(QasActions).props('primaryButtonProps').type).toBe('submit')
      expect(findInBody('form')).not.toBeNull()
    })

    it('ao enviar, emite "ok" sem fechar o dialog', async () => {
      const wrapper = await mountDialog({ props: { useForm: true } })

      await submit()

      expect(wrapper.emitted('ok')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('ao enviar, emite "validate" com um boolean', async () => {
      const wrapper = await mountDialog({ props: { useForm: true } })

      await submit()

      expect(typeof wrapper.emitted('validate')[0][0]).toBe('boolean')
    })
  })

  it('avisa os componentes internos que estão em um dialog e usa botões "md"', async () => {
    const Child = defineComponent({
      setup () {
        const isDialog = inject('isDialog', false)
        const btnPropsDefaults = inject('btnPropsDefaults', null)

        return () => h('span', { class: 'filho' }, `${isDialog}-${btnPropsDefaults?.size}`)
      }
    })

    await mountDialog({ slots: { description: () => h(Child) } })

    expect(findInBody('.filho').textContent).toBe('true-md')
  })
})
