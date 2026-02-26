import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasTextTruncate from './QasTextTruncate.vue'

const QasDialogStub = {
  template: '<div class="qas-dialog-stub" />',
  props: ['modelValue', 'card']
}

const stubs = {
  QasDialog: QasDialogStub,
  QasBadge: { template: '<span class="qas-badge-stub" />' }
}

describe('QasTextTruncate', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        global: { stubs }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe de cor padrão "text-grey-8"', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        global: { stubs }
      })

      expect(wrapper.classes()).toContain('text-grey-8')
    })
  })

  describe('prop text', () => {
    it('deve exibir o texto fornecido', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { text: 'Texto de exemplo' },
        global: { stubs }
      })

      expect(wrapper.text()).toContain('Texto de exemplo')
    })

    it('deve exibir o emptyText padrão "-" quando text está vazio', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { text: '' },
        global: { stubs }
      })

      expect(wrapper.text()).toContain('-')
    })
  })

  describe('prop emptyText', () => {
    it('deve exibir emptyText customizado quando text está vazio', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { text: '', emptyText: 'Não informado' },
        global: { stubs }
      })

      expect(wrapper.text()).toContain('Não informado')
    })

    it('não deve exibir emptyText quando text está preenchido', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { text: 'Conteúdo', emptyText: 'Não informado' },
        global: { stubs }
      })

      expect(wrapper.text()).not.toContain('Não informado')
      expect(wrapper.text()).toContain('Conteúdo')
    })
  })

  describe('prop useAlwaysSeeMore', () => {
    it('deve exibir o botão "ver mais" quando useAlwaysSeeMore é true', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { useAlwaysSeeMore: true, text: 'Algum texto' },
        global: { stubs }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })

    it('não deve exibir o botão por padrão (sem useAlwaysSeeMore)', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { text: 'Algum texto' },
        global: { stubs }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeFalsy()
    })
  })

  describe('prop seeMoreLabel', () => {
    it('deve usar "Ver mais" como label padrão do botão', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { useAlwaysSeeMore: true, text: 'Algum texto' },
        global: { stubs }
      })

      expect(wrapper.find('.qas-btn-stub').attributes('label')).toBe('Ver mais')
    })

    it('deve usar o seeMoreLabel customizado', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { useAlwaysSeeMore: true, text: 'Algum texto', seeMoreLabel: 'Expandir' },
        global: { stubs }
      })

      expect(wrapper.find('.qas-btn-stub').attributes('label')).toBe('Expandir')
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo customizado via slot padrão', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        slots: { default: '<span class="conteudo-customizado">Conteúdo personalizado</span>' },
        global: { stubs }
      })

      expect(wrapper.find('.conteudo-customizado').exists()).toBeTruthy()
      expect(wrapper.find('.conteudo-customizado').text()).toBe('Conteúdo personalizado')
    })
  })

  describe('prop dialogTitle', () => {
    it('deve repassar dialogTitle às props do dialog interno', () => {
      const wrapper = mountComponent(QasTextTruncate, {
        props: { dialogTitle: 'Título do diálogo', useAlwaysSeeMore: true, text: 'Texto' },
        global: { stubs }
      })

      const dialog = wrapper.findComponent(QasDialogStub)
      expect(dialog.exists()).toBeTruthy()
    })
  })
})
