import { describe, it, expect } from 'vitest'

import QasCard from './QasCard.vue'
import QasActionsMenu from '../actions-menu/QasActionsMenu.vue'
import QasCheckbox from '../checkbox/QasCheckbox.vue'
import QasRouterLink from '../router-link/QasRouterLink.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const EmptyPage = { template: '<div />' }

async function mountCard ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasCard, {
    props: { title: 'Contrato 123', ...props },
    slots: { default: '<p class="conteudo">Conteúdo</p>' },
    routes: [{ path: '/contracts/:id', name: 'ContractsShow', component: EmptyPage }],
    ...options
  })

  return wrapper
}

describe('QasCard', () => {
  it('exibe o título e o conteúdo', async () => {
    const wrapper = await mountCard()

    expect(wrapper.find('h5').text()).toBe('Contrato 123')
    expect(wrapper.find('.conteudo').exists()).toBe(true)
  })

  it('sem título, não exibe o cabeçalho', async () => {
    const wrapper = await mountCard({ props: { title: '' } })

    expect(wrapper.find('header').exists()).toBe(false)
  })

  it('com "route", o título vira um link', async () => {
    const wrapper = await mountCard({ props: { route: { name: 'ContractsShow', params: { id: 1 } } } })

    expect(wrapper.findComponent(QasRouterLink).props('route')).toEqual({ name: 'ContractsShow', params: { id: 1 } })
  })

  it('com "actions-menu-props", exibe o menu de ações sem label', async () => {
    const wrapper = await mountCard({ props: { actionsMenuProps: { list: { edit: { label: 'Editar', icon: 'sym_r_edit' } } } } })

    expect(wrapper.findComponent(QasActionsMenu).props('useLabel')).toBe(false)
  })

  it('com "use-selection", exibe o checkbox e emite a seleção', async () => {
    const wrapper = await mountCard({ props: { useSelection: true } })

    wrapper.findComponent(QasCheckbox).vm.$emit('update:modelValue', true)

    expect(wrapper.emitted('update:selected')).toEqual([[true]])
  })

  it('com "expansion-props", exibe um rodapé expansível', async () => {
    const wrapper = await mountCard({ props: { expansionProps: { label: 'Detalhes', content: 'Mais informações' } } })

    expect(wrapper.findComponent({ name: 'QExpansionItem' }).props('label')).toBe('Detalhes')
  })

  it('com "skeleton", exibe o carregamento no lugar do título e do conteúdo', async () => {
    const wrapper = await mountCard({ props: { skeleton: true } })

    expect(wrapper.findAllComponents(QasSkeleton).length).toBeGreaterThanOrEqual(2)
    expect(wrapper.find('.conteudo').exists()).toBe(false)
  })
})
