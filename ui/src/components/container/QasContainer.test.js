import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasContainer from './QasContainer.vue'

describe('QasContainer', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasContainer)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter classes "container" e "spaced" por padrão', () => {
      const wrapper = mountComponent(QasContainer)

      expect(wrapper.classes()).toContain('container')
      expect(wrapper.classes()).toContain('spaced')
    })
  })

  describe('prop useBoundary', () => {
    it('deve remover "container" e "spaced" quando useBoundary é false', () => {
      const wrapper = mountComponent(QasContainer, {
        props: { useBoundary: false }
      })

      expect(wrapper.classes()).not.toContain('container')
      expect(wrapper.classes()).not.toContain('spaced')
    })
  })

  describe('prop useSpaced', () => {
    it('deve remover "spaced" quando useSpaced é false', () => {
      const wrapper = mountComponent(QasContainer, {
        props: { useSpaced: false }
      })

      expect(wrapper.classes()).not.toContain('spaced')
      expect(wrapper.classes()).toContain('container')
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot', () => {
      const wrapper = mountComponent(QasContainer, {
        slots: { default: '<p class="slot-content">Conteúdo</p>' }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
    })
  })
})
