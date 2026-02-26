import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasTimeline from './QasTimeline.vue'

function mountTimeline (options = {}) {
  return mountComponent(QasTimeline, options)
}

describe('QasTimeline', () => {
  describe('renderização básica', () => {
    it('deve renderizar sem erros com props padrão', () => {
      const wrapper = mountTimeline()
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop list', () => {
    it('não deve renderizar entradas quando a lista está vazia', () => {
      const wrapper = mountTimeline({ props: { list: [] } })
      expect(wrapper.findAll('.q-timeline-entry-stub')).toHaveLength(0)
    })

    it('deve renderizar o texto de descrição de um item', () => {
      const wrapper = mountTimeline({
        props: {
          list: [{ date: '2024-01-15', description: 'Evento 1' }]
        }
      })
      expect(wrapper.text()).toContain('Evento 1')
    })

    it('deve renderizar os textos de descrição de dois itens', () => {
      const wrapper = mountTimeline({
        props: {
          list: [
            { date: '2024-01-15', description: 'Evento 1' },
            { date: '2024-01-16', description: 'Evento 2' }
          ]
        }
      })
      expect(wrapper.text()).toContain('Evento 1')
      expect(wrapper.text()).toContain('Evento 2')
    })
  })

  describe('prop descriptionKey', () => {
    it('deve usar o campo correto quando descriptionKey personalizado é passado', () => {
      const wrapper = mountTimeline({
        props: {
          list: [{ date: '2024-01-15', text: 'Descrição customizada' }],
          descriptionKey: 'text'
        }
      })
      expect(wrapper.text()).toContain('Descrição customizada')
    })
  })

  describe('datas inválidas', () => {
    it('não deve lançar erro ao receber data inválida na lista', () => {
      expect(() => mountTimeline({
        props: {
          list: [{ date: 'invalid-date', description: 'Teste data inválida' }]
        }
      })).not.toThrow()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo personalizado via slot default com binding de item', () => {
      const wrapper = mountTimeline({
        props: {
          list: [{ date: '2024-01-15', description: 'Evento slot' }]
        },
        slots: {
          default: '<div class="custom-slot">conteúdo personalizado</div>'
        }
      })
      expect(wrapper.find('.custom-slot').exists()).toBeTruthy()
    })
  })

  describe('slot description', () => {
    it('deve renderizar conteúdo personalizado via slot description', () => {
      const wrapper = mountTimeline({
        props: {
          list: [{ date: '2024-01-15', description: 'Evento' }]
        },
        slots: {
          description: '<span class="custom-description">desc customizada</span>'
        }
      })
      expect(wrapper.find('.custom-description').exists()).toBeTruthy()
    })
  })
})
