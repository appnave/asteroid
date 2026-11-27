import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

import QasTextTruncate from './QasTextTruncate.vue'
import QasBadge from '../badge/QasBadge.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasDialog from '../dialog/QasDialog.vue'
import QasSearchBox from '../search-box/QasSearchBox.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountTextTruncate ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasTextTruncate, { props, ...options })

  await flushPromises()

  return wrapper
}

const getButton = wrapper => wrapper.findComponent(QasBtn)
const getDialog = wrapper => wrapper.findComponent(QasDialog)

async function openDialog (wrapper) {
  await getButton(wrapper).find('button').trigger('click')
  await flushPromises()
}

const users = ['Ana', 'Bruno', 'Carla']

describe('QasTextTruncate', () => {
  describe('texto', () => {
    it('exibe o texto', async () => {
      const wrapper = await mountTextTruncate({ props: { text: 'Observação do contrato' } })

      expect(wrapper.text()).toContain('Observação do contrato')
    })

    it('sem texto, exibe o "empty-text"', async () => {
      const defaultText = await mountTextTruncate()
      const customText = await mountTextTruncate({ props: { emptyText: 'Sem observação' } })

      expect(defaultText.text()).toBe('-')
      expect(customText.text()).toBe('Sem observação')
    })

    it('usa a tipografia injetada por componentes pais, de forma reativa ou não', async () => {
      const injected = await mountTextTruncate({ props: { text: 'Texto' }, provide: { textTruncatePropsDefaults: { typography: 'body2' } } })
      const reactive = await mountTextTruncate({ props: { text: 'Texto' }, provide: { textTruncatePropsDefaults: ref({ typography: 'caption' }) } })

      expect(injected.classes()).toContain('text-body2')
      expect(reactive.classes()).toContain('text-caption')
    })

    it('sem texto cortado, não exibe o botão "Ver mais"', async () => {
      const wrapper = await mountTextTruncate({ props: { text: 'Curto' } })

      expect(getButton(wrapper).exists()).toBe(false)
    })

    it('com "use-always-see-more", sempre exibe o botão, abrindo o texto completo no dialog', async () => {
      const wrapper = await mountTextTruncate({ props: { text: 'Texto completo', dialogTitle: 'Observação', useAlwaysSeeMore: true } })

      await openDialog(wrapper)

      expect(getButton(wrapper).props('label')).toBe('Ver mais')
      expect(getDialog(wrapper).props()).toMatchObject({ modelValue: true, title: 'Observação', description: 'Texto completo', ok: false, cancel: false })
    })

    it('"dialog-props.description" substitui a descrição do dialog', async () => {
      const wrapper = await mountTextTruncate({
        props: { text: 'Resumo', useAlwaysSeeMore: true, dialogProps: { description: 'Texto detalhado' } }
      })

      expect(getDialog(wrapper).props('description')).toBe('Texto detalhado')
    })

    it('com slot, o dialog exibe o texto do conteúdo, sem HTML', async () => {
      const wrapper = await mountTextTruncate({ props: { useAlwaysSeeMore: true }, slots: { default: '<span>Texto <b>longo</b></span>' } })

      expect(getDialog(wrapper).props('description')).toBe('Texto longo')
    })
  })

  describe('lista', () => {
    it('exibe o primeiro item e um botão com a quantidade restante', async () => {
      const wrapper = await mountTextTruncate({ props: { list: users } })

      expect(wrapper.text()).toContain('Ana')
      expect(getButton(wrapper).props('label')).toBe('+2')
    })

    it('com todos os itens visíveis, não exibe o botão', async () => {
      const wrapper = await mountTextTruncate({ props: { list: users, maxVisibleItem: 3 } })

      expect(getButton(wrapper).exists()).toBe(false)
    })

    it('o dialog lista todos os itens', async () => {
      const wrapper = await mountTextTruncate({ props: { list: users } })

      await openDialog(wrapper)

      expect([...document.body.querySelectorAll('.q-dialog .q-item .text-body1')].map(item => item.textContent.trim())).toEqual(users)
    })

    it('com mais de 12 itens, o dialog tem pesquisa', async () => {
      const list = Array.from({ length: 13 }, (_, index) => `Usuário ${index + 1}`)
      const wrapper = await mountTextTruncate({ props: { list } })

      await openDialog(wrapper)

      expect(wrapper.findComponent(QasSearchBox).props('list')).toEqual(list)
    })
  })

  describe('badges', () => {
    const badges = [{ label: 'Ativo', color: 'positive', extra: 'ignorado' }, { label: 'Novo' }]

    it('com "use-badge" e "use-object-list", exibe os itens como badges, só com as props do QasBadge', async () => {
      const wrapper = await mountTextTruncate({ props: { list: badges, useBadge: true, useObjectList: true, maxVisibleItem: 2 } })

      const badgeComponents = wrapper.findAllComponents(QasBadge)

      expect(badgeComponents.map(badge => badge.props('label'))).toEqual(['Ativo', 'Novo'])
      expect(badgeComponents[0].vm.$attrs.extra).toBeUndefined()
    })
  })
})
