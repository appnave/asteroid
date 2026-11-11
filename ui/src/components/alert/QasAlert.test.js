import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorage } from 'quasar'
import { RouterLink } from 'vue-router'

import QasAlert from './QasAlert.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountAlert (options) {
  const { wrapper } = await mountQas(QasAlert, options)

  return wrapper
}

const getIcon = wrapper => wrapper.findComponent({ name: 'QIcon' })
const getContainer = wrapper => wrapper.find('.qas-alert > div')
const getCloseButton = wrapper => wrapper.findAllComponents(QasBtn).find(button => button.props('icon') === 'sym_r_close')
const clickClose = wrapper => getCloseButton(wrapper).find('button').trigger('click')

describe('QasAlert', () => {
  beforeEach(() => {
    LocalStorage.clear()
  })

  describe('conteúdo', () => {
    it('exibe o texto da prop "text"', async () => {
      const wrapper = await mountAlert({ props: { text: 'Mensagem de alerta' } })

      expect(wrapper.text()).toContain('Mensagem de alerta')
    })

    it('usa o slot default no lugar da prop "text"', async () => {
      const wrapper = await mountAlert({
        props: { text: 'Texto da prop' },
        slots: { default: 'Texto do slot' }
      })

      expect(wrapper.text()).toContain('Texto do slot')
      expect(wrapper.text()).not.toContain('Texto da prop')
    })
  })

  describe('prop status', () => {
    it('usa "info" por padrão', async () => {
      const wrapper = await mountAlert()

      expect(getIcon(wrapper).props('name')).toBe('sym_r_info')
      expect(getContainer(wrapper).classes()).toContain('qas-alert--info')
    })

    it.each([
      ['info', 'sym_r_info', 'primary'],
      ['error', 'sym_r_dangerous', 'negative'],
      ['success', 'sym_r_check_circle', 'positive'],
      ['warning', 'sym_r_warning', 'orange-8']
    ])('status "%s" usa o ícone "%s", a cor "%s" e a classe do status', async (status, icon, color) => {
      const wrapper = await mountAlert({ props: { status } })

      expect(getIcon(wrapper).props('name')).toBe(icon)
      expect(getIcon(wrapper).props('color')).toBe(color)
      expect(getContainer(wrapper).classes()).toContain(`qas-alert--${status}`)
    })

    // hoje o componente não tem fallback para status inválido: o validator avisa e a renderização quebra
    it('avisa e quebra a renderização ao receber um status inválido', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await expect(mountAlert({ props: { status: 'invalido' } })).rejects.toThrow("reading 'icon'")

      expect(warn.mock.calls.flat().join(' ')).toMatch(/Invalid prop.*"status"/)

      warn.mockRestore()
    })
  })

  describe('background', () => {
    it('usa background por padrão fora de QasBox e QasDialog', async () => {
      const wrapper = await mountAlert()

      expect(getContainer(wrapper).classes()).toContain('q-pa-md')
    })

    it.each(['isBox', 'isDialog'])('não usa background dentro de um componente com "%s"', async key => {
      const wrapper = await mountAlert({ provide: { [key]: true } })

      expect(getContainer(wrapper).classes()).toHaveLength(0)
    })

    it('"use-background" força o background dentro de um QasBox', async () => {
      const wrapper = await mountAlert({ props: { useBackground: true }, provide: { isBox: true } })

      expect(getContainer(wrapper).classes()).toContain('q-pa-md')
    })

    it('"use-background" false remove o background fora de QasBox e QasDialog', async () => {
      const wrapper = await mountAlert({ props: { useBackground: false } })

      expect(getContainer(wrapper).classes()).toHaveLength(0)
    })
  })

  describe('model e botão de fechar', () => {
    it('não renderiza nada quando o model é false', async () => {
      const wrapper = await mountAlert({ props: { modelValue: false } })

      expect(wrapper.find('.qas-alert').exists()).toBe(false)
    })

    it('não exibe o botão de fechar por padrão', async () => {
      const wrapper = await mountAlert()

      expect(getCloseButton(wrapper)).toBeUndefined()
    })

    it('exibe o botão de fechar com "use-close-button"', async () => {
      const wrapper = await mountAlert({ props: { useCloseButton: true } })

      expect(getCloseButton(wrapper)).toBeDefined()
    })

    it('não exibe o botão de fechar sem background', async () => {
      const wrapper = await mountAlert({ props: { useCloseButton: true, useBackground: false } })

      expect(getCloseButton(wrapper)).toBeUndefined()
    })

    it('ao fechar, emite "update:modelValue" com false e some da tela', async () => {
      const wrapper = await mountAlert({ props: { useCloseButton: true } })

      await clickClose(wrapper)

      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
      expect(wrapper.find('.qas-alert').exists()).toBe(false)
    })
  })

  describe('persistência ao fechar', () => {
    const props = { useCloseButton: true, usePersistentModelOnClose: true, storageKey: 'aviso' }

    it('salva no LocalStorage que o alerta foi fechado, usando a "storage-key"', async () => {
      const wrapper = await mountAlert({ props })

      await clickClose(wrapper)

      expect(LocalStorage.getItem('alert-aviso-closed')).toBe(true)
    })

    it('não exibe o alerta novamente depois de fechado', async () => {
      await clickClose(await mountAlert({ props }))

      expect((await mountAlert({ props })).find('.qas-alert').exists()).toBe(false)
    })

    it('alertas com "storage-key" diferentes são independentes', async () => {
      await clickClose(await mountAlert({ props }))

      const otherAlert = await mountAlert({ props: { ...props, storageKey: 'outro' } })

      expect(otherAlert.find('.qas-alert').exists()).toBe(true)
    })

    it('sem "use-persistent-model-on-close" não salva nada no LocalStorage', async () => {
      const wrapper = await mountAlert({ props: { useCloseButton: true, storageKey: 'aviso' } })

      await clickClose(wrapper)

      expect(LocalStorage.getItem('alert-aviso-closed')).toBeNull()
    })
  })

  describe('prop use-regex', () => {
    it('sem "use-regex", mantém "**" e "[]" como texto', async () => {
      const wrapper = await mountAlert({ props: { text: 'Texto **negrito** e [link]' } })

      expect(wrapper.text()).toContain('Texto **negrito** e [link]')
      expect(wrapper.find('strong').exists()).toBe(false)
    })

    it('transforma "**texto**" em negrito', async () => {
      const wrapper = await mountAlert({ props: { useRegex: true, text: 'Atenção **importante** aqui' } })

      expect(wrapper.find('strong').text()).toBe('importante')
      expect(wrapper.text()).toContain('Atenção importante aqui')
    })

    it('transforma "[texto]" em RouterLink com as "router-link-props"', async () => {
      const wrapper = await mountAlert({
        props: { useRegex: true, text: 'Clique [aqui] agora', routerLinkProps: { to: { name: 'Home' } } }
      })

      const link = wrapper.findComponent(RouterLink)

      expect(link.text()).toBe('aqui')
      expect(link.props('to')).toEqual({ name: 'Home' })
    })

    it('transforma "[texto]" em QasBtn quando recebe "button-props"', async () => {
      const wrapper = await mountAlert({
        props: { useRegex: true, text: 'Clique [aqui] agora', buttonProps: { icon: 'sym_r_add' } }
      })

      const button = wrapper.findAllComponents(QasBtn).find(button => button.props('label') === 'aqui')

      expect(button).toBeDefined()
      expect(button.props('icon')).toBe('sym_r_add')
      expect(wrapper.findComponent(RouterLink).exists()).toBe(false)
    })

    it('usa as props de cada índice quando "button-props" é uma lista', async () => {
      const wrapper = await mountAlert({
        props: {
          useRegex: true,
          text: '[primeiro] e [segundo]',
          buttonProps: [{ icon: 'sym_r_add' }, { icon: 'sym_r_delete' }]
        }
      })

      const icons = wrapper.findAllComponents(QasBtn).map(button => [button.props('label'), button.props('icon')])

      expect(icons).toEqual([['primeiro', 'sym_r_add'], ['segundo', 'sym_r_delete']])
    })

    it('combina negrito e link no mesmo texto', async () => {
      const wrapper = await mountAlert({
        props: { useRegex: true, text: '**Atenção**: veja [detalhes]', routerLinkProps: { to: '/' } }
      })

      expect(wrapper.find('strong').text()).toBe('Atenção')
      expect(wrapper.findComponent(RouterLink).text()).toBe('detalhes')
    })
  })
})
