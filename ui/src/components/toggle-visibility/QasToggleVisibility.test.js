import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasToggleVisibility from './QasToggleVisibility.vue'

describe('QasToggleVisibility', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasToggleVisibility)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-toggle-visibility" no elemento raiz', () => {
      const wrapper = mountComponent(QasToggleVisibility)

      expect(wrapper.find('.qas-toggle-visibility').exists()).toBeTruthy()
    })

    it('deve ter o atributo "data-no-grab" no elemento raiz', () => {
      const wrapper = mountComponent(QasToggleVisibility)

      expect(wrapper.find('[data-no-grab]').exists()).toBeTruthy()
    })
  })

  describe('visibilidade padrão', () => {
    it('deve iniciar com conteúdo oculto (isVisible = false)', () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { text: 'Conteúdo secreto' }
      })

      const content = wrapper.find('.qas-toggle-visibility__content')

      expect(content.find('.ellipsis.full-width').exists()).toBeFalsy()
    })

    it('deve exibir o separador quando conteúdo está oculto', () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { text: 'Conteúdo secreto' }
      })

      expect(wrapper.find('.qas-toggle-visibility__separator').exists()).toBeTruthy()
    })
  })

  describe('interação de toggle', () => {
    it('deve exibir o texto após clicar no container', async () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { text: 'Conteúdo visível' }
      })

      const container = wrapper.find('.qas-toggle-visibility__container')
      await container.trigger('click')

      expect(wrapper.find('.qas-toggle-visibility__content .ellipsis.full-width').exists()).toBeTruthy()
    })

    it('deve ocultar o texto ao clicar duas vezes', async () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { text: 'Texto' }
      })

      const container = wrapper.find('.qas-toggle-visibility__container')
      await container.trigger('click')
      await container.trigger('click')

      expect(wrapper.find('.qas-toggle-visibility__content .ellipsis.full-width').exists()).toBeFalsy()
    })
  })

  describe('prop width', () => {
    it('deve aplicar o estilo de width no container', () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { width: '200px' }
      })

      const container = wrapper.find('.qas-toggle-visibility__container')

      expect(container.attributes('style')).toContain('width: 200px')
    })

    it('deve usar "140px" como valor padrão de width', () => {
      const wrapper = mountComponent(QasToggleVisibility)
      const container = wrapper.find('.qas-toggle-visibility__container')

      expect(container.attributes('style')).toContain('width: 140px')
    })
  })

  describe('prop hiddenTooltip', () => {
    it('deve exibir o tooltip de "oculto" quando conteúdo está escondido', () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        props: { hiddenTooltip: 'Mostrar conteúdo' }
      })

      const tooltip = wrapper.findComponent({ name: 'QasTooltip' })

      expect(tooltip.exists()).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot quando visível', async () => {
      const wrapper = mountComponent(QasToggleVisibility, {
        slots: { default: '<span class="slot-content">Conteúdo personalizado</span>' }
      })

      const container = wrapper.find('.qas-toggle-visibility__container')
      await container.trigger('click')

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
      expect(wrapper.find('.slot-content').text()).toBe('Conteúdo personalizado')
    })
  })

  describe('atributos de acessibilidade', () => {
    it('deve ter role="button" no container', () => {
      const wrapper = mountComponent(QasToggleVisibility)
      const container = wrapper.find('.qas-toggle-visibility__container')

      expect(container.attributes('role')).toBe('button')
    })

    it('deve ter aria-label no container', () => {
      const wrapper = mountComponent(QasToggleVisibility)
      const container = wrapper.find('.qas-toggle-visibility__container')

      expect(container.attributes('aria-label')).toBe('Alternar visibilidade do conteúdo')
    })
  })
})
