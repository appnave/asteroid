import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasErrorMessage from './QasErrorMessage.vue'

describe('QasErrorMessage', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasErrorMessage)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-error-message"', () => {
      const wrapper = mountComponent(QasErrorMessage)

      expect(wrapper.classes()).toContain('qas-error-message')
    })
  })

  describe('prop message', () => {
    it('deve renderizar a mensagem de erro', () => {
      const wrapper = mountComponent(QasErrorMessage, {
        props: { message: 'Campo obrigatório' }
      })

      expect(wrapper.text()).toBe('Campo obrigatório')
    })

    it('deve ter mensagem vazia por padrão', () => {
      const wrapper = mountComponent(QasErrorMessage)

      expect(wrapper.text()).toBe('')
    })

    it('deve atualizar a mensagem quando a prop muda', async () => {
      const wrapper = mountComponent(QasErrorMessage, {
        props: { message: 'Erro inicial' }
      })

      await wrapper.setProps({ message: 'Novo erro' })

      expect(wrapper.text()).toBe('Novo erro')
    })
  })
})
