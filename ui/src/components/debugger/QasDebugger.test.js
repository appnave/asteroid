import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDebugger from './QasDebugger.vue'

describe('QasDebugger', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [] }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-debugger"', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [] }
      })

      expect(wrapper.classes()).toContain('qas-debugger')
    })

    it('deve renderizar uma tag details', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [] }
      })

      expect(wrapper.find('details').exists()).toBeTruthy()
    })

    it('deve renderizar o texto "Debugger" no summary', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [] }
      })

      expect(wrapper.find('summary').text()).toBe('Debugger')
    })
  })

  describe('prop inspect', () => {
    it('deve renderizar um bloco pre para cada item do array', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: ['item1', 'item2', 'item3'] }
      })

      const preElements = wrapper.findAll('pre')
      expect(preElements.length).toBe(3)
    })

    it('deve renderizar o conteúdo do item no pre', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: ['{ "foo": "bar" }'] }
      })

      const pre = wrapper.find('pre')
      expect(pre.text()).toContain('{ "foo": "bar" }')
    })

    it('não deve renderizar blocos pre quando o array está vazio', () => {
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [] }
      })

      expect(wrapper.findAll('pre').length).toBe(0)
    })

    it('deve renderizar objetos no pre', () => {
      const data = { nome: 'Teste', valor: 42 }
      const wrapper = mountComponent(QasDebugger, {
        props: { inspect: [data] }
      })

      expect(wrapper.findAll('pre').length).toBe(1)
    })
  })
})
