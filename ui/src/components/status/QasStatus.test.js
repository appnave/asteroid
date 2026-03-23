import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasStatus from './QasStatus.vue'

describe('QasStatus', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasStatus)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-status"', () => {
      const wrapper = mountComponent(QasStatus)

      expect(wrapper.classes()).toContain('qas-status')
    })

    it('deve ter role="status"', () => {
      const wrapper = mountComponent(QasStatus)

      expect(wrapper.attributes('role')).toBe('status')
    })

    it('deve ter aria-live="polite"', () => {
      const wrapper = mountComponent(QasStatus)

      expect(wrapper.attributes('aria-live')).toBe('polite')
    })
  })

  describe('prop color', () => {
    it('deve usar "light-blue-2" como cor padrão', () => {
      const wrapper = mountComponent(QasStatus)

      expect(wrapper.classes()).toContain('bg-light-blue-2')
    })

    it('deve aplicar a cor customizada via classe bg-{color}', () => {
      const wrapper = mountComponent(QasStatus, {
        props: { color: 'primary' }
      })

      expect(wrapper.classes()).toContain('bg-primary')
    })

    it('deve aplicar cor negativa', () => {
      const wrapper = mountComponent(QasStatus, {
        props: { color: 'negative' }
      })

      expect(wrapper.classes()).toContain('bg-negative')
    })

    it('deve aplicar cor positive', () => {
      const wrapper = mountComponent(QasStatus, {
        props: { color: 'positive' }
      })

      expect(wrapper.classes()).toContain('bg-positive')
    })

    it('deve remover a classe da cor anterior ao trocar a prop color', async () => {
      const wrapper = mountComponent(QasStatus, {
        props: { color: 'primary' }
      })

      await wrapper.setProps({ color: 'negative' })

      expect(wrapper.classes()).toContain('bg-negative')
      expect(wrapper.classes()).not.toContain('bg-primary')
    })
  })
})
