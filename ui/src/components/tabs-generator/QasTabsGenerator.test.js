import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasTabsGenerator from './QasTabsGenerator.vue'

describe('QasTabsGenerator', () => {
  let wrapper

  const tabsObject = {
    tab1: { label: 'Aba 1', value: 'tab1' },
    tab2: { label: 'Aba 2', value: 'tab2' },
    tab3: { label: 'Aba 3', value: 'tab3' }
  }

  const tabsArray = [
    { label: 'Aba A', value: 'a' },
    { label: 'Aba B', value: 'b' }
  ]

  beforeEach(() => {
    wrapper = mountComponent(QasTabsGenerator, {
      props: {
        tabs: tabsObject,
        modelValue: 'tab1'
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza q-tabs', () => {
      const tabs = wrapper.findComponent({ name: 'QTabs' })
      expect(tabs.exists()).toBe(true)
    })

    it('renderiza uma aba para cada item do objeto', () => {
      const qtabs = wrapper.findAllComponents({ name: 'QTab' })
      expect(qtabs.length).toBe(Object.keys(tabsObject).length)
    })

    it('renderiza abas a partir de tabs como array', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsArray, modelValue: 'a' }
      })
      const qtabs = w.findAllComponents({ name: 'QTab' })
      expect(qtabs.length).toBe(tabsArray.length)
    })
  })

  describe('Props', () => {
    it('aceita tabs como objeto', () => {
      expect(wrapper.props('tabs')).toEqual(tabsObject)
    })

    it('aceita tabs como array', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsArray, modelValue: 'a' }
      })
      expect(Array.isArray(w.props('tabs'))).toBe(true)
    })

    it('prop skeleton exibe esqueleto quando counter está ausente', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsObject, modelValue: 'tab1', skeleton: true }
      })
      const skeleton = w.findComponent({ name: 'QasSkeleton' })
      expect(skeleton.exists()).toBe(true)
    })

    it('não exibe esqueleto quando skeleton é false', () => {
      const skeleton = wrapper.findComponent({ name: 'QasSkeleton' })
      expect(skeleton.exists()).toBe(false)
    })

    it('useRouteTab usa QRouteTab em vez de QTab', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsObject, modelValue: 'tab1', useRouteTab: true }
      })
      const routeTabs = w.findAllComponents({ name: 'QRouteTab' })
      expect(routeTabs.length).toBeGreaterThan(0)
    })
  })

  describe('Computed - formattedTabs', () => {
    it('converte string simples em objeto com label e value', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: {
          tabs: { home: 'Início', about: 'Sobre' },
          modelValue: 'home'
        }
      })
      const formatted = w.vm.formattedTabs
      expect(formatted.home).toMatchObject({ label: 'Início', value: 'home' })
    })

    it('mantém objetos de aba inalterados', () => {
      const formatted = wrapper.vm.formattedTabs
      expect(formatted.tab1).toMatchObject({ label: 'Aba 1', value: 'tab1' })
    })
  })

  describe('Computed - getFormattedLabel', () => {
    it('retorna apenas o label quando não há counter', () => {
      const label = wrapper.vm.getFormattedLabel({ label: 'Aba 1', value: 'tab1' })
      expect(label).toBe('Aba 1')
    })

    it('inclui o counter formatado no label quando counter > 0', () => {
      const label = wrapper.vm.getFormattedLabel({ label: 'Aba 1', value: 'tab1', counter: 5 })
      expect(label).toContain('Aba 1')
      expect(label).toContain('05')
    })

    it('usa counters de prop quando disponível', () => {
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsObject, modelValue: 'tab1', counters: { tab1: 10 } }
      })
      const label = w.vm.getFormattedLabel({ label: 'Aba 1', value: 'tab1' })
      expect(label).toContain('10')
    })
  })

  describe('Emits', () => {
    it('emite update:modelValue ao alterar o model', async () => {
      wrapper.vm.model = 'tab2'
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('tab2')
    })

    it('não emite update:modelValue quando aba está disabled', async () => {
      const tabsWithDisabled = {
        tab1: { label: 'Aba 1', value: 'tab1' },
        tab2: { label: 'Aba 2', value: 'tab2', disabled: true }
      }
      const w = mountComponent(QasTabsGenerator, {
        props: { tabs: tabsWithDisabled, modelValue: 'tab1' }
      })
      w.vm.model = 'tab2'
      await w.vm.$nextTick()
      expect(w.emitted('update:modelValue')).toBeFalsy()
    })
  })
})
