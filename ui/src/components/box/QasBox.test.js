import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mountComponent } from '@test-utils'
import QasBox from './QasBox.vue'

describe('QasBox', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasBox)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter as classes "bg-white", "qas-box" e "rounded-borders"', () => {
      const wrapper = mountComponent(QasBox)

      expect(wrapper.classes()).toContain('bg-white')
      expect(wrapper.classes()).toContain('qas-box')
      expect(wrapper.classes()).toContain('rounded-borders')
    })

    it('deve ter "shadow-2" por padrão (não unelevated)', () => {
      const wrapper = mountComponent(QasBox)

      expect(wrapper.classes()).toContain('shadow-2')
    })
  })

  describe('prop outlined', () => {
    it('deve adicionar "border-grey" quando outlined é true', () => {
      const wrapper = mountComponent(QasBox, {
        props: { outlined: true }
      })

      expect(wrapper.classes()).toContain('border-grey')
    })

    it('não deve ter "border-grey" quando outlined é false', () => {
      const wrapper = mountComponent(QasBox, {
        props: { outlined: false }
      })

      expect(wrapper.classes()).not.toContain('border-grey')
    })
  })

  describe('prop unelevated', () => {
    it('deve remover "shadow-2" quando unelevated é true', () => {
      const wrapper = mountComponent(QasBox, {
        props: { unelevated: true }
      })

      expect(wrapper.classes()).not.toContain('shadow-2')
    })
  })

  describe('prop skeleton', () => {
    it('não deve mostrar o skeleton por padrão', () => {
      const wrapper = mountComponent(QasBox)

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeFalsy()
    })

    it('deve mostrar o skeleton quando skeleton é true', () => {
      const wrapper = mountComponent(QasBox, {
        props: { skeleton: true }
      })

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeTruthy()
    })
  })

  describe('prop useSpacing', () => {
    it('deve aplicar classes de spacing por padrão (useSpacing=true)', () => {
      const wrapper = mountComponent(QasBox)

      expect(wrapper.classes()).toContain('q-px-md')
      expect(wrapper.classes()).toContain('q-py-md')
    })

    it('não deve aplicar classes de spacing quando useSpacing é false', () => {
      const wrapper = mountComponent(QasBox, {
        props: { useSpacing: false }
      })

      expect(wrapper.classes()).not.toContain('q-px-md')
      expect(wrapper.classes()).not.toContain('q-py-md')
    })
  })

  describe('prop spacingX e spacingY', () => {
    it('deve aplicar spacingX customizado', () => {
      const wrapper = mountComponent(QasBox, {
        props: { spacingX: 'lg' }
      })

      expect(wrapper.classes()).toContain('q-px-lg')
    })

    it('deve aplicar spacingY customizado', () => {
      const wrapper = mountComponent(QasBox, {
        props: { spacingY: 'sm' }
      })

      expect(wrapper.classes()).toContain('q-py-sm')
    })
  })

  describe('provide isBox', () => {
    it('deve prover isBox=true para componentes filhos', () => {
      let capturedIsBox = null

      const ChildComponent = defineComponent({
        name: 'ChildComponent',
        inject: ['isBox'],
        mounted () {
          capturedIsBox = this.isBox
        },
        template: '<div class="child" />'
      })

      mountComponent(QasBox, {
        slots: { default: ChildComponent },
        global: {
          stubs: { ChildComponent: false }
        }
      })

      expect(capturedIsBox).toBe(true)
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot', () => {
      const wrapper = mountComponent(QasBox, {
        slots: { default: '<span class="slot-content">Conteúdo</span>' }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
      expect(wrapper.find('.slot-content').text()).toBe('Conteúdo')
    })
  })
})
