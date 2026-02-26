import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasActions from './QasActions.vue'

function mountActions (options = {}) {
  return mountComponent(QasActions, options)
}

describe('QasActions', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountActions()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('não deve renderizar botões quando nenhuma prop de botão é fornecida', () => {
      const wrapper = mountActions()

      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeFalsy()
    })
  })

  describe('prop spacingTop', () => {
    it('deve adicionar "q-mt-sm" por padrão (spacingTop padrão é "sm")', () => {
      const wrapper = mountActions()

      expect(wrapper.classes()).toContain('q-mt-sm')
    })

    it('deve adicionar "q-mt-md" quando spacingTop é "md"', () => {
      const wrapper = mountActions({ props: { spacingTop: 'md' } })

      expect(wrapper.classes()).toContain('q-mt-md')
    })

    it('deve adicionar "q-mt-lg" quando spacingTop é "lg"', () => {
      const wrapper = mountActions({ props: { spacingTop: 'lg' } })

      expect(wrapper.classes()).toContain('q-mt-lg')
    })

    it('deve adicionar "q-mt-none" quando spacingTop é "none"', () => {
      const wrapper = mountActions({ props: { spacingTop: 'none' } })

      expect(wrapper.classes()).toContain('q-mt-none')
    })
  })

  describe('prop align', () => {
    it('deve ter "justify-end" por padrão', () => {
      const wrapper = mountActions()

      expect(wrapper.classes()).toContain('justify-end')
    })

    it('deve adicionar "justify-start" quando align é "start"', () => {
      const wrapper = mountActions({ props: { align: 'start' } })

      expect(wrapper.classes()).toContain('justify-start')
    })

    it('deve adicionar "justify-center" quando align é "center"', () => {
      const wrapper = mountActions({ props: { align: 'center' } })

      expect(wrapper.classes()).toContain('justify-center')
    })
  })

  describe('prop primaryButtonProps', () => {
    it('não deve renderizar o botão primário por padrão', () => {
      const wrapper = mountActions()

      expect(wrapper.findAllComponents({ name: 'QasBtn' }).length).toBe(0)
    })

    it('deve renderizar o botão primário quando primaryButtonProps tem propriedades', () => {
      const wrapper = mountActions({
        props: { primaryButtonProps: { label: 'Salvar' } }
      })

      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeTruthy()
    })
  })

  describe('prop secondaryButtonProps', () => {
    it('deve renderizar o botão secundário quando secondaryButtonProps tem propriedades', () => {
      const wrapper = mountActions({
        props: { secondaryButtonProps: { label: 'Cancelar' } }
      })

      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeTruthy()
    })
  })

  describe('prop tertiaryButtonProps', () => {
    it('deve renderizar o botão terciário quando tertiaryButtonProps tem propriedades', () => {
      const wrapper = mountActions({
        props: { tertiaryButtonProps: { label: 'Voltar' } }
      })

      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeTruthy()
    })
  })

  describe('múltiplos botões', () => {
    it('deve renderizar três botões quando os três props de botão são fornecidos', () => {
      const wrapper = mountActions({
        props: {
          primaryButtonProps: { label: 'Salvar' },
          secondaryButtonProps: { label: 'Cancelar' },
          tertiaryButtonProps: { label: 'Voltar' }
        }
      })

      expect(wrapper.findAllComponents({ name: 'QasBtn' }).length).toBe(3)
    })

    it('deve renderizar dois botões quando dois props de botão são fornecidos', () => {
      const wrapper = mountActions({
        props: {
          primaryButtonProps: { label: 'Confirmar' },
          secondaryButtonProps: { label: 'Cancelar' }
        }
      })

      expect(wrapper.findAllComponents({ name: 'QasBtn' }).length).toBe(2)
    })
  })

  describe('prop useFullWidth', () => {
    it('deve adicionar "column" e "reverse" quando useFullWidth é true', () => {
      const wrapper = mountActions({ props: { useFullWidth: true } })

      expect(wrapper.classes()).toContain('column')
      expect(wrapper.classes()).toContain('reverse')
    })

    it('deve adicionar "row" quando useFullWidth é false em tela grande', () => {
      // O mock do Screen define tela grande (lg: true)
      const wrapper = mountActions({ props: { useFullWidth: false } })

      expect(wrapper.classes()).toContain('row')
    })
  })

  describe('prop useEqualWidth', () => {
    it('deve aplicar classes de coluna igual quando useEqualWidth é true', () => {
      const wrapper = mountActions({
        props: {
          useEqualWidth: true,
          primaryButtonProps: { label: 'Salvar' }
        }
      })

      // O container do botão deve ter col-12 e col-sm-6
      expect(wrapper.find('.col-12.col-sm-6').exists()).toBeTruthy()
    })
  })

  describe('slot primary', () => {
    it('deve renderizar o conteúdo do slot primary', () => {
      const wrapper = mountActions({
        slots: { primary: '<button class="custom-primary">Ação Primária</button>' }
      })

      expect(wrapper.find('.custom-primary').exists()).toBeTruthy()
    })
  })

  describe('slot secondary', () => {
    it('deve renderizar o conteúdo do slot secondary', () => {
      const wrapper = mountActions({
        slots: { secondary: '<button class="custom-secondary">Ação Secundária</button>' }
      })

      expect(wrapper.find('.custom-secondary').exists()).toBeTruthy()
    })
  })

  describe('slot tertiary', () => {
    it('deve renderizar o conteúdo do slot tertiary', () => {
      const wrapper = mountActions({
        slots: { tertiary: '<button class="custom-tertiary">Ação Terciária</button>' }
      })

      expect(wrapper.find('.custom-tertiary').exists()).toBeTruthy()
    })
  })

  describe('slot + prop juntos', () => {
    it('deve priorizar o slot primary quando fornecido junto com primaryButtonProps', () => {
      const wrapper = mountActions({
        props: { primaryButtonProps: { label: 'Salvar' } },
        slots: { primary: '<button class="slot-btn">Slot Botão</button>' }
      })

      expect(wrapper.find('.slot-btn').exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeFalsy()
    })
  })
})
