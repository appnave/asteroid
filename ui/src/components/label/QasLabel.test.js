import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasLabel from './QasLabel.vue'

describe('QasLabel', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-label"', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.classes()).toContain('qas-label')
    })

    it('deve renderizar como "h4" por padrão', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.find('h4').exists()).toBeTruthy()
    })
  })

  describe('prop label', () => {
    it('deve renderizar o texto da label', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { label: 'Nome do campo' }
      })

      expect(wrapper.text()).toContain('Nome do campo')
    })

    it('deve renderizar label vazia por padrão', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.text()).toBe('')
    })
  })

  describe('prop count', () => {
    it('deve adicionar sufixo de contagem quando count > 0', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { label: 'Itens', count: 5 }
      })

      expect(wrapper.text()).toContain('(5)')
    })

    it('não deve adicionar sufixo quando count é 0 (padrão)', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { label: 'Itens', count: 0 }
      })

      expect(wrapper.text()).not.toContain('(')
    })
  })

  describe('prop required', () => {
    it('deve adicionar asterisco quando required é true', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { label: 'Campo obrigatório', required: true }
      })

      expect(wrapper.text()).toContain('*')
    })

    it('não deve adicionar asterisco quando required é false', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { label: 'Campo', required: false }
      })

      expect(wrapper.text()).not.toContain('*')
    })
  })

  describe('prop color', () => {
    it('deve usar "grey-10" como cor padrão', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.classes()).toContain('text-grey-10')
    })

    it('deve aplicar cor customizada', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { color: 'primary' }
      })

      expect(wrapper.classes()).toContain('text-primary')
    })
  })

  describe('prop typography', () => {
    it('deve renderizar como "h4" por padrão', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.element.tagName.toLowerCase()).toBe('h4')
    })

    it('deve renderizar como "h5" quando especificado', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { typography: 'h5' }
      })

      expect(wrapper.element.tagName.toLowerCase()).toBe('h5')
    })
  })

  describe('prop margin', () => {
    it('deve usar "md" como margem padrão', () => {
      const wrapper = mountComponent(QasLabel)

      expect(wrapper.classes()).toContain('q-mb-md')
    })

    it('deve aplicar margem customizada', () => {
      const wrapper = mountComponent(QasLabel, {
        props: { margin: 'sm' }
      })

      expect(wrapper.classes()).toContain('q-mb-sm')
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot em vez da label por padrão', () => {
      const wrapper = mountComponent(QasLabel, {
        slots: { default: '<span class="custom-label">Custom</span>' }
      })

      expect(wrapper.find('.custom-label').exists()).toBeTruthy()
    })
  })
})
