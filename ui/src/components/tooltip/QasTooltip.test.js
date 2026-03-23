import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasTooltip from './QasTooltip.vue'

describe('QasTooltip', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasTooltip)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar um q-tooltip', () => {
      const wrapper = mountComponent(QasTooltip)

      expect(wrapper.find('q-tooltip').exists()).toBeTruthy()
    })
  })

  describe('prop text', () => {
    it('deve ter string vazia como padrão', () => {
      const wrapper = mountComponent(QasTooltip)

      expect(wrapper.find('q-tooltip').exists()).toBeTruthy()
    })

    it('deve passar a prop text para QasBreakline', () => {
      const wrapper = mountComponent(QasTooltip, {
        props: { text: 'Texto do tooltip' }
      })

      const breakline = wrapper.findComponent({ name: 'QasBreakline' })
      expect(breakline.exists()).toBeTruthy()
      expect(breakline.props('text')).toBe('Texto do tooltip')
    })
  })
})
