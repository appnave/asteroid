import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasTabsGenerator from './QasTabsGenerator.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const tabs = {
  active: 'Ativos',
  inactive: 'Inativos'
}

async function mountTabsGenerator ({ props = {}, ...options } = {}) {
  return mountQas(QasTabsGenerator, { props: { tabs, ...props }, ...options })
}

const getTabs = wrapper => wrapper.findAllComponents({ name: 'QTab' })
const getLabels = wrapper => getTabs(wrapper).map(tab => tab.text())

describe('QasTabsGenerator', () => {
  describe('abas', () => {
    it('aceita as abas como objeto de textos, usando a chave como valor', async () => {
      const { wrapper } = await mountTabsGenerator()

      expect(getLabels(wrapper)).toEqual(['Ativos', 'Inativos'])
      expect(getTabs(wrapper).map(tab => tab.props('name'))).toEqual(['active', 'inactive'])
    })

    it('aceita as abas como lista de objetos', async () => {
      const { wrapper } = await mountTabsGenerator({
        props: { tabs: [{ label: 'Pendentes', value: 'pending' }, { label: 'Concluídos', value: 'done' }] }
      })

      expect(getLabels(wrapper)).toEqual(['Pendentes', 'Concluídos'])
      expect(getTabs(wrapper).map(tab => tab.props('name'))).toEqual(['pending', 'done'])
    })
  })

  describe('contadores', () => {
    it('exibe o contador de "counters" com dois dígitos', async () => {
      const { wrapper } = await mountTabsGenerator({ props: { counters: { active: 5, inactive: 1200 } } })

      expect(getLabels(wrapper)).toEqual(['Ativos (05)', 'Inativos (1.200)'])
    })

    it('usa o "counter" da aba quando não há "counters"', async () => {
      const { wrapper } = await mountTabsGenerator({ props: { tabs: { active: { label: 'Ativos', value: 'active', counter: 3 } } } })

      expect(getLabels(wrapper)).toEqual(['Ativos (03)'])
    })

    it('com contador zero, exibe só o label', async () => {
      const { wrapper } = await mountTabsGenerator({ props: { counters: { active: 0 } } })

      expect(getLabels(wrapper)[0]).toBe('Ativos')
    })
  })

  describe('seleção', () => {
    it('emite a aba selecionada', async () => {
      const { wrapper } = await mountTabsGenerator({ props: { modelValue: 'active' } })

      wrapper.findComponent({ name: 'QTabs' }).vm.$emit('update:modelValue', 'inactive')

      expect(wrapper.emitted('update:modelValue')).toEqual([['inactive']])
    })

    it('não seleciona uma aba com "disabled"', async () => {
      const { wrapper } = await mountTabsGenerator({
        props: { tabs: [{ label: 'Ativos', value: 'active' }, { label: 'Bloqueados', value: 'blocked', disabled: true }] }
      })

      wrapper.findComponent({ name: 'QTabs' }).vm.$emit('update:modelValue', 'blocked')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('query da URL', () => {
    it('com "query-slug", seleciona a aba que está na URL', async () => {
      const { wrapper } = await mountTabsGenerator({ props: { querySlug: 'tab' }, route: '/?tab=inactive' })

      expect(wrapper.emitted('update:modelValue')).toEqual([['inactive']])
    })

    it('com "query-slug", grava a aba selecionada na URL mantendo as outras queries', async () => {
      const { router } = await mountTabsGenerator({ props: { querySlug: 'tab', modelValue: 'active' }, route: '/?page=2' })

      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ page: '2', tab: 'active' })
    })

    it('com "query-slug" e sem aba selecionada, remove a query da URL', async () => {
      const { router, wrapper } = await mountTabsGenerator({ props: { querySlug: 'tab', modelValue: 'active' }, route: '/?page=2' })

      await wrapper.setProps({ modelValue: '' })
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ page: '2' })
    })
  })
})
