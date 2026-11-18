import { describe, it, expect } from 'vitest'

import QasPageHeader from './QasPageHeader.vue'
import QasHeader from '../header/QasHeader.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const EmptyPage = { template: '<div />' }

async function mountPageHeader (options = {}) {
  const { wrapper } = await mountQas(QasPageHeader, options)

  return wrapper
}

// o primeiro item é o ícone da home, os demais são os breadcrumbs
const getBreadcrumbs = wrapper => wrapper.findAllComponents({ name: 'QBreadcrumbsEl' }).slice(1)
const getBreadcrumbLabels = wrapper => getBreadcrumbs(wrapper).map(item => item.text())

describe('QasPageHeader', () => {
  describe('breadcrumbs', () => {
    it('sem "breadcrumbs", usa o título como breadcrumb', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Usuários' } })

      expect(getBreadcrumbLabels(wrapper)).toEqual(['Usuários'])
    })

    it('aceita uma lista de textos', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Editar', breadcrumbs: ['Usuários', 'Editar'] } })

      expect(getBreadcrumbLabels(wrapper)).toEqual(['Usuários', 'Editar'])
    })

    it('transforma "routeName" em link para a rota', async () => {
      const wrapper = await mountPageHeader({
        props: { title: 'Editar', breadcrumbs: [{ label: 'Usuários', routeName: 'UsersList' }, 'Editar'] },
        routes: [{ path: '/users', name: 'UsersList', component: EmptyPage }]
      })

      expect(getBreadcrumbs(wrapper)[0].props('to')).toEqual({ name: 'UsersList' })
    })

    it('adiciona o "root" como primeiro breadcrumb', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Editar', root: 'Cadastros', breadcrumbs: ['Usuários', 'Editar'] } })

      expect(getBreadcrumbLabels(wrapper)).toEqual(['Cadastros', 'Usuários', 'Editar'])
    })

    it('com 5 ou mais breadcrumbs, resume os do meio em "..."', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'E', breadcrumbs: ['A', 'B', 'C', 'D', 'E'] } })

      expect(getBreadcrumbLabels(wrapper)).toEqual(['A', 'B', '...', 'E'])
    })
  })

  describe('ícone da home', () => {
    const getHomeIcon = wrapper => wrapper.findAllComponents({ name: 'QBreadcrumbsEl' })[0]

    it('aponta para "/" quando não existe a rota "Root"', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Usuários' } })

      expect(getHomeIcon(wrapper).props('icon')).toBe('sym_r_home')
      expect(getHomeIcon(wrapper).props('to')).toBe('/')
    })

    it('aponta para a rota "Root" quando ela existe', async () => {
      const wrapper = await mountPageHeader({
        props: { title: 'Usuários' },
        routes: [{ path: '/root', name: 'Root', component: EmptyPage }]
      })

      expect(getHomeIcon(wrapper).props('to')).toEqual({ name: 'Root' })
    })
  })

  describe('carregamento e cabeçalho', () => {
    it('com "skeleton", exibe carregamento no título e em 3 breadcrumbs', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Usuários', breadcrumbs: ['A', 'B'], skeleton: true } })

      expect(getBreadcrumbs(wrapper)).toHaveLength(3)
      expect(wrapper.findAllComponents(QasSkeleton)).toHaveLength(4)
      expect(wrapper.text()).not.toContain('Usuários')
    })

    it('com "header-props", exibe o QasHeader abaixo', async () => {
      const wrapper = await mountPageHeader({ props: { title: 'Usuários', headerProps: { description: 'Lista de usuários' } } })

      expect(wrapper.findComponent(QasHeader).props('description')).toBe('Lista de usuários')
    })
  })
})
