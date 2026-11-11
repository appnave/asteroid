import { describe, it, expect, vi } from 'vitest'
import { RouterLink } from 'vue-router'

import QasTableGenerator from './QasTableGenerator.vue'
import QasBox from '../box/QasBox.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasHeader from '../header/QasHeader.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const fields = {
  name: { name: 'name', label: 'Nome', type: 'text' },
  active: { name: 'active', label: 'Ativo', type: 'boolean' },
  role: {
    name: 'role',
    label: 'Perfil',
    type: 'select',
    options: [{ label: 'Administrador', value: 'admin' }, { label: 'Vendedor', value: 'seller' }]
  }
}

const results = [
  { uuid: '1', name: 'Ana', active: true, role: 'admin' },
  { uuid: '2', name: 'Bruno', active: false, role: 'seller' }
]

function mountTable ({ props = {}, ...options } = {}) {
  return mountQas(QasTableGenerator, {
    props: { fields, results, rowKey: 'uuid', ...props },
    ...options
  })
}

const getQTable = wrapper => wrapper.findComponent({ name: 'QTable' })
const getHeaders = wrapper => getQTable(wrapper).props('columns').map(column => column.label)
const getRows = wrapper => wrapper.findAll('tbody tr').map(row => row.findAll('td').map(td => td.text()))

describe('QasTableGenerator', () => {
  describe('colunas', () => {
    it('sem a prop "columns", cria uma coluna para cada campo, na ordem dos campos', async () => {
      const { wrapper } = await mountTable()

      expect(getHeaders(wrapper)).toEqual(['Nome', 'Ativo', 'Perfil'])
    })

    it('com a prop "columns", exibe só as colunas informadas, na ordem informada', async () => {
      const { wrapper } = await mountTable({ props: { columns: ['role', 'name'] } })

      expect(getHeaders(wrapper)).toEqual(['Perfil', 'Nome'])
    })

    it('ignora colunas que não existem nos campos', async () => {
      const { wrapper } = await mountTable({ props: { columns: ['name', 'inexistente'] } })

      expect(getHeaders(wrapper)).toEqual(['Nome'])
    })

    it('com "actions-menu-props", adiciona a coluna "Ações" no final', async () => {
      const { wrapper } = await mountTable({
        props: {
          columns: ['name'],
          fields: { ...fields, actions: { name: 'actions', label: 'Ações' } },
          actionsMenuProps: () => ({ list: {} })
        }
      })

      expect(getHeaders(wrapper)).toEqual(['Nome', 'Ações'])
    })
  })

  describe('valores das células', () => {
    it('formata os valores pelo tipo do campo', async () => {
      const { wrapper } = await mountTable()

      expect(getRows(wrapper)).toEqual([
        ['Ana', 'Sim', 'Administrador'],
        ['Bruno', 'Não', 'Vendedor']
      ])
    })

    it('exibe "-" para valores vazios', async () => {
      const { wrapper } = await mountTable({ props: { results: [{ uuid: '1', name: '', active: true, role: null }] } })

      expect(getRows(wrapper)).toEqual([['-', 'Sim', '-']])
    })

    it('usa a prop "empty-result-text" para valores vazios', async () => {
      const { wrapper } = await mountTable({
        props: { emptyResultText: 'Não informado', results: [{ uuid: '1', name: '', active: true, role: 'admin' }] }
      })

      expect(getRows(wrapper)[0][0]).toBe('Não informado')
    })

    it('não quebra com campo "select" múltiplo sem valor', async () => {
      const multipleFields = { ...fields, role: { ...fields.role, multiple: true } }

      const { wrapper } = await mountTable({
        props: {
          fields: multipleFields,
          results: [{ uuid: '1', name: 'Ana', active: true, role: null }]
        }
      })

      expect(getRows(wrapper)).toEqual([['Ana', 'Sim', '-']])
    })

    it('permite customizar a célula pelo slot "body-cell-<coluna>", com acesso ao valor original em "row.default"', async () => {
      const { wrapper } = await mountTable({
        slots: {
          'body-cell-active': `<template #body-cell-active="{ row }">
            <q-td>{{ row.default.active ? 'ativo' : 'inativo' }}</q-td>
          </template>`
        }
      })

      expect(getRows(wrapper).map(row => row[1])).toEqual(['ativo', 'inativo'])
    })
  })

  describe('sem resultados', () => {
    it('exibe o texto de vazio e esconde a tabela', async () => {
      const { wrapper } = await mountTable({ props: { results: [] } })

      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(true)
      expect(getQTable(wrapper).isVisible()).toBe(false)
    })
  })

  describe('seleção', () => {
    it('com "use-selection", habilita a seleção múltipla', async () => {
      const { wrapper } = await mountTable({ props: { useSelection: true } })

      expect(getQTable(wrapper).props('selection')).toBe('multiple')
    })

    it('sem "use-selection", não habilita a seleção', async () => {
      const { wrapper } = await mountTable()

      expect(getQTable(wrapper).props('selection')).toBe('none')
    })

    it('emite "update:selected" só com as chaves das linhas selecionadas', async () => {
      const { wrapper } = await mountTable({ props: { useSelection: true } })

      await getQTable(wrapper).vm.$emit('update:selected', [results[0]])

      expect(wrapper.emitted('update:selected').at(-1)).toEqual([['1']])
    })

    it('com "use-object-selected-model", emite as linhas completas', async () => {
      const { wrapper } = await mountTable({ props: { useSelection: true, useObjectSelectedModel: true } })

      await getQTable(wrapper).vm.$emit('update:selected', [results[1]])

      expect(wrapper.emitted('update:selected').at(-1)[0][0]).toMatchObject({ uuid: '2' })
    })

    it('repassa as chaves de "selected" para a tabela como linhas selecionadas', async () => {
      const { wrapper } = await mountTable({ props: { useSelection: true, selected: ['2'] } })

      expect(getQTable(wrapper).props('selected')).toEqual([{ uuid: '2' }])
    })
  })

  describe('navegação pela linha', () => {
    it('com "row-route-fn", cada célula vira um link para a rota da linha', async () => {
      const { wrapper } = await mountTable({
        props: { rowRouteFn: row => ({ path: `/users/${row.uuid}` }) },
        routes: [{ path: '/users/:id', component: { template: '<div />' } }]
      })

      const links = wrapper.findAllComponents(RouterLink)

      expect(links).toHaveLength(6)
      expect(links[0].props('to')).toEqual({ path: '/users/1' })
      expect(links[3].props('to')).toEqual({ path: '/users/2' })
    })

    it('com "use-external-link", usa links que abrem em nova aba', async () => {
      const { wrapper } = await mountTable({
        props: { rowRouteFn: row => `https://site.com/${row.uuid}`, useExternalLink: true }
      })

      const link = wrapper.find('td a')

      expect(link.attributes('href')).toBe('https://site.com/1')
      expect(link.attributes('target')).toBe('_blank')
    })

    it('sem "row-route-fn", as células não são links', async () => {
      const { wrapper } = await mountTable()

      expect(wrapper.findAllComponents(RouterLink)).toHaveLength(0)
      expect(wrapper.find('td a').exists()).toBe(false)
    })

    it('chama o "@row-click" ao clicar em uma linha', async () => {
      const onRowClick = vi.fn()
      const { wrapper } = await mountTable({ attrs: { onRowClick } })

      await wrapper.find('tbody tr').trigger('click')

      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0][1]).toMatchObject({ uuid: '1' })
    })
  })

  describe('aparência', () => {
    it('fica dentro de um QasBox por padrão, e fora com "use-box" false', async () => {
      const { wrapper: withBox } = await mountTable()
      const { wrapper: withoutBox } = await mountTable({ props: { useBox: false } })

      expect(withBox.findComponent(QasBox).exists()).toBe(true)
      expect(withoutBox.findComponent(QasBox).exists()).toBe(false)
    })

    it('com "header-props", exibe o cabeçalho', async () => {
      const { wrapper } = await mountTable({ props: { headerProps: { label: 'Usuários' } } })

      expect(wrapper.findComponent(QasHeader).exists()).toBe(true)
    })

    it('com "skeleton", exibe linhas de carregamento no lugar dos dados', async () => {
      const { wrapper } = await mountTable({ props: { skeleton: true, results: [], columns: ['name', 'active'] } })

      expect(wrapper.findAllComponents(QasSkeleton).length).toBeGreaterThan(0)
      expect(wrapper.text()).not.toContain('Ana')
    })

    it('com "skeleton", não chama o "@row-click"', async () => {
      const onRowClick = vi.fn()
      const { wrapper } = await mountTable({ props: { skeleton: true, columns: ['name'] }, attrs: { onRowClick } })

      await wrapper.find('tbody tr').trigger('click')

      expect(onRowClick).not.toHaveBeenCalled()
    })
  })

  describe('desmontagem', () => {
    it.each([true, false])('desmonta sem erros (use-scroll-on-grab: %s)', async useScrollOnGrab => {
      const { wrapper } = await mountTable({ props: { useScrollOnGrab } })

      expect(() => wrapper.unmount()).not.toThrow()
    })

    it('remove o listener de "resize" ao desmontar', async () => {
      const removeListener = vi.spyOn(window, 'removeEventListener')
      const { wrapper } = await mountTable()

      wrapper.unmount()

      const removed = removeListener.mock.calls.some(([event]) => event === 'resize')

      removeListener.mockRestore()

      expect(removed).toBe(true)
    })
  })
})
