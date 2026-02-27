import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasWhatsappLink from './QasWhatsappLink.vue'

describe('QasWhatsappLink', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasWhatsappLink)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o componente QasBtn', () => {
      const wrapper = mountComponent(QasWhatsappLink)

      expect(wrapper.findComponent({ name: 'QasBtn' }).exists()).toBeTruthy()
    })
  })

  describe('link gerado', () => {
    it('deve gerar link correto com phone', () => {
      const wrapper = mountComponent(QasWhatsappLink, {
        props: { phone: '11999999999' }
      })

      expect(wrapper.vm.whatsappLink).toContain('wa.me/5511999999999')
    })

    it('deve usar callingCode 55 (Brasil) por padrão', () => {
      const wrapper = mountComponent(QasWhatsappLink, {
        props: { phone: '11912345678' }
      })

      expect(wrapper.vm.whatsappLink).toContain('wa.me/5511912345678')
    })

    it('deve usar callingCode customizado', () => {
      const wrapper = mountComponent(QasWhatsappLink, {
        props: { phone: '912345678', callingCode: 351 }
      })

      expect(wrapper.vm.whatsappLink).toContain('wa.me/351912345678')
    })

    it('deve remover caracteres especiais do telefone', () => {
      const wrapper = mountComponent(QasWhatsappLink, {
        props: { phone: '(11) 9 9999-9999' }
      })

      expect(wrapper.vm.whatsappLink).toContain('wa.me/5511999999999')
    })

    it('deve gerar link sem text quando text está vazio', () => {
      const wrapper = mountComponent(QasWhatsappLink, {
        props: { phone: '11999999999', text: '' }
      })

      expect(wrapper.vm.whatsappLink).toBe('https://wa.me/5511999999999?text=')
    })
  })

  describe('abertura em nova aba', () => {
    it('deve ter target="_blank"', () => {
      const wrapper = mountComponent(QasWhatsappLink)

      expect(wrapper.findComponent({ name: 'QasBtn' }).vm.$attrs.target).toBe('_blank')
    })
  })
})
