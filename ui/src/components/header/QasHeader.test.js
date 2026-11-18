import { describe, it, expect } from 'vitest'
import { defineComponent, h, inject } from 'vue'

import QasHeader from './QasHeader.vue'
import QasBadge from '../badge/QasBadge.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasLabel from '../label/QasLabel.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// QasFilters tem seus próprios testes, aqui só importa se ele aparece
const stubs = { QasFilters: true }

async function mountHeader (options = {}) {
  const { wrapper } = await mountQas(QasHeader, { stubs, ...options })

  return wrapper
}

describe('QasHeader', () => {
  describe('conteúdo', () => {
    it('não renderiza nada sem conteúdo', async () => {
      const wrapper = await mountHeader()

      expect(wrapper.html()).not.toContain('<div')
    })

    it('exibe a descrição', async () => {
      const wrapper = await mountHeader({ props: { description: 'Informe o endereço de entrega' } })

      expect(wrapper.text()).toContain('Informe o endereço de entrega')
    })

    it('exibe os badges, aceitando lista ou um único objeto', async () => {
      const list = await mountHeader({ props: { badges: [{ label: 'Ativo' }, { label: 'Novo' }] } })
      const single = await mountHeader({ props: { badges: { label: 'Ativo' } } })

      expect(list.findAllComponents(QasBadge).map(badge => badge.props('label'))).toEqual(['Ativo', 'Novo'])
      expect(single.findAllComponents(QasBadge)).toHaveLength(1)
    })
  })

  describe('ações', () => {
    it('com "button-props", exibe um QasBtn sem label em telas pequenas', async () => {
      const wrapper = await mountHeader({ props: { labelProps: { label: 'Usuários' }, buttonProps: { label: 'Novo' } } })

      expect(wrapper.findComponent(QasBtn).props()).toMatchObject({ label: 'Novo', useLabelOnSmallScreen: false })
    })

    it('com "filters-props", exibe o QasFilters sem pesquisa, sem chips e sem espaçamento', async () => {
      const wrapper = await mountHeader({ props: { labelProps: { label: 'Usuários' }, filtersProps: { entity: 'users' } } })

      expect(wrapper.findComponent({ name: 'QasFilters' }).attributes()).toMatchObject({
        entity: 'users',
        usesearch: 'false',
        usechip: 'false',
        usespacing: 'false'
      })
    })

    it('exibe o slot "actions" mesmo sem label, descrição ou componente de ações', async () => {
      const wrapper = await mountHeader({ slots: { actions: '<button class="acao">Ação</button>' } })

      expect(wrapper.find('.acao').exists()).toBe(true)
    })

    it('exibe o botão ao lado da descrição quando não há label', async () => {
      const wrapper = await mountHeader({ props: { description: 'Texto', buttonProps: { label: 'Novo' } } })

      expect(wrapper.findComponent(QasBtn).props('label')).toBe('Novo')
      expect(wrapper.text()).toContain('Texto')
    })
  })

  describe('carregamento e contexto', () => {
    it('com "skeleton", exibe carregamento no label e na descrição', async () => {
      const wrapper = await mountHeader({ props: { labelProps: { label: 'Usuários' }, description: 'Texto', skeleton: true } })

      expect(wrapper.findAllComponents(QasSkeleton).length).toBeGreaterThanOrEqual(2)
      expect(wrapper.findComponent(QasLabel).exists()).toBe(false)
    })

    it('avisa os componentes internos que estão dentro de um QasHeader', async () => {
      const Child = defineComponent({
        setup () {
          const isHeader = inject('isHeader', false)

          return () => h('span', { class: 'child' }, String(isHeader))
        }
      })

      const wrapper = await mountHeader({ props: { labelProps: { label: 'Usuários' } }, slots: { actions: () => h(Child) } })

      expect(wrapper.find('.child').text()).toBe('true')
    })
  })
})
