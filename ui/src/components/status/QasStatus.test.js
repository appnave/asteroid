import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QasStatus from './QasStatus.vue'

describe('QasStatus', () => {
  describe('acessibilidade', () => {
    it('anuncia o status para leitores de tela', () => {
      const wrapper = mount(QasStatus)

      expect(wrapper.attributes('role')).toBe('status')
      expect(wrapper.attributes('aria-live')).toBe('polite')
    })
  })

  describe('prop color', () => {
    it('usa a cor "light-blue-2" por padrão', () => {
      const wrapper = mount(QasStatus)

      expect(wrapper.classes()).toContain('bg-light-blue-2')
    })

    it('aplica a cor informada', () => {
      const wrapper = mount(QasStatus, { props: { color: 'negative' } })

      expect(wrapper.classes()).toContain('bg-negative')
      expect(wrapper.classes()).not.toContain('bg-light-blue-2')
    })

    it('atualiza a cor quando a prop muda', async () => {
      const wrapper = mount(QasStatus, { props: { color: 'positive' } })

      await wrapper.setProps({ color: 'orange-8' })

      expect(wrapper.classes()).toContain('bg-orange-8')
      expect(wrapper.classes()).not.toContain('bg-positive')
    })
  })
})
