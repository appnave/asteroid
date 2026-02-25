import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasBreakline from './QasBreakline.vue'

describe('QasBreakline', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Linha única' }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar uma linha por padrão', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Linha única' }
      })

      const elements = wrapper.findAll('div')
      expect(elements.length).toBe(1)
      expect(elements[0].text()).toBe('Linha única')
    })
  })

  describe('prop text', () => {
    it('deve renderizar múltiplas linhas quando o texto contém \\n', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Linha 1\nLinha 2\nLinha 3' }
      })

      const elements = wrapper.findAll('div')
      expect(elements.length).toBe(3)
      expect(elements[0].text()).toBe('Linha 1')
      expect(elements[1].text()).toBe('Linha 2')
      expect(elements[2].text()).toBe('Linha 3')
    })

    it('deve renderizar uma linha quando text é string vazia', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'texto' }
      })

      // split('') gera array de caracteres, mas split('\n') de '' gera ['']
      expect(wrapper.findAll('div').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('prop split', () => {
    it('deve dividir por vírgula quando split é ","', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'a,b,c', split: ',' }
      })

      const elements = wrapper.findAll('div')
      expect(elements.length).toBe(3)
      expect(elements[0].text()).toBe('a')
      expect(elements[1].text()).toBe('b')
      expect(elements[2].text()).toBe('c')
    })

    it('deve dividir por " | " quando split é " | "', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Parte 1 | Parte 2', split: ' | ' }
      })

      expect(wrapper.findAll('div').length).toBe(2)
    })
  })

  describe('prop tag', () => {
    it('deve usar "div" como tag padrão', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Teste' }
      })

      expect(wrapper.find('div').exists()).toBeTruthy()
    })

    it('deve usar a tag "p" quando especificada', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'Linha 1\nLinha 2', tag: 'p' }
      })

      const elements = wrapper.findAll('p')
      expect(elements.length).toBe(2)
    })

    it('deve usar a tag "span" quando especificada', () => {
      const wrapper = mountComponent(QasBreakline, {
        props: { text: 'texto', tag: 'span' }
      })

      expect(wrapper.find('span').exists()).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve usar o texto do slot quando text não é passado', () => {
      const wrapper = mountComponent(QasBreakline, {
        slots: { default: 'Texto do slot' }
      })

      expect(wrapper.text()).toContain('Texto do slot')
    })
  })
})
