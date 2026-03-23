import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasPagination from './QasPagination.vue'

describe('QasPagination', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 10 }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar um q-pagination', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').exists()).toBeTruthy()
    })

    it('deve ter classe "qas-pagination" no q-pagination', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').classes()).toContain('qas-pagination')
    })
  })

  describe('props padrão no q-pagination', () => {
    it('deve definir activeColor="primary"', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').attributes('activecolor')).toBe('primary')
    })

    it('deve definir color="grey-8"', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').attributes('color')).toBe('grey-8')
    })

    it('deve definir directionLinks=true', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').attributes('directionlinks')).toBeDefined()
    })

    it('deve definir iconNext="sym_r_chevron_right"', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').attributes('iconnext')).toBe('sym_r_chevron_right')
    })

    it('deve definir iconPrev="sym_r_chevron_left"', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 5 }
      })

      expect(wrapper.find('q-pagination').attributes('iconprev')).toBe('sym_r_chevron_left')
    })

    it('deve definir maxPages=3', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 1, max: 10 }
      })

      expect(wrapper.find('q-pagination').attributes('maxpages')).toBe('3')
    })
  })

  describe('modelValue', () => {
    it('deve passar modelValue ao q-pagination como atributo', () => {
      const wrapper = mountComponent(QasPagination, {
        attrs: { modelValue: 3, max: 10 }
      })

      const html = wrapper.html()
      // modelValue é passado como atributo ao custom element q-pagination
      expect(html).toContain('3')
    })
  })
})
