import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasSkeleton from './QasSkeleton.vue'

describe('QasSkeleton', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasSkeleton)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar um q-skeleton', () => {
      const wrapper = mountComponent(QasSkeleton)

      expect(wrapper.find('q-skeleton').exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-skeleton"', () => {
      const wrapper = mountComponent(QasSkeleton)

      expect(wrapper.find('q-skeleton').classes()).toContain('qas-skeleton')
    })

    it('deve usar animação "blink" por padrão', () => {
      const wrapper = mountComponent(QasSkeleton)

      expect(wrapper.find('q-skeleton').attributes('animation')).toBe('blink')
    })
  })

  describe('prop type', () => {
    it('deve passar type ao q-skeleton', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { type: 'text' }
      })

      expect(wrapper.find('q-skeleton').attributes('type')).toBe('text')
    })

    it('deve usar type "circle" para QasStatus', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { type: 'QasStatus' }
      })

      expect(wrapper.find('q-skeleton').attributes('type')).toBe('circle')
    })
  })

  describe('prop width e height', () => {
    it('deve passar width ao q-skeleton', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { width: '200px' }
      })

      expect(wrapper.find('q-skeleton').attributes('width')).toBe('200px')
    })

    it('deve passar height ao q-skeleton', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { height: '50px' }
      })

      expect(wrapper.find('q-skeleton').attributes('height')).toBe('50px')
    })
  })

  describe('prop useContrast', () => {
    it('deve adicionar "bg-blue-grey-4" quando useContrast é true', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { useContrast: true }
      })

      expect(wrapper.find('q-skeleton').classes()).toContain('bg-blue-grey-4')
    })

    it('não deve ter "bg-blue-grey-4" por padrão', () => {
      const wrapper = mountComponent(QasSkeleton)

      expect(wrapper.find('q-skeleton').classes()).not.toContain('bg-blue-grey-4')
    })
  })

  describe('prop useOverlay', () => {
    it('deve adicionar "qas-skeleton--overlay" quando useOverlay é true', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { useOverlay: true }
      })

      expect(wrapper.find('q-skeleton').classes()).toContain('qas-skeleton--overlay')
    })
  })

  describe('prop gutter', () => {
    it('deve adicionar classe de gutter quando definido', () => {
      const wrapper = mountComponent(QasSkeleton, {
        props: { gutter: 'md' }
      })

      expect(wrapper.find('q-skeleton').classes()).toContain('qas-skeleton--md')
    })
  })
})
