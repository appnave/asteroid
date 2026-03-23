import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDateTimeInput from './QasDateTimeInput.vue'

describe('QasDateTimeInput', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o componente qas-input', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      expect(wrapper.findComponent({ name: 'QasInput' }).exists()).toBeTruthy()
    })
  })

  describe('prop useDateOnly', () => {
    it('deve exibir apenas o botão de data quando useDateOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useDateOnly: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(1)
    })

    it('não deve exibir o botão de hora quando useDateOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useDateOnly: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).not.toContain('sym_r_access_time')
    })
  })

  describe('prop useTimeOnly', () => {
    it('deve exibir apenas o botão de hora quando useTimeOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useTimeOnly: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(1)
    })

    it('não deve exibir o botão de data quando useTimeOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useTimeOnly: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).not.toContain('sym_r_calendar_today')
    })
  })

  describe('exibição padrão de botões', () => {
    it('deve exibir os botões de data e hora por padrão', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(2)
    })

    it('deve exibir o botão de data com ícone de calendário', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).toContain('sym_r_calendar_today')
    })

    it('deve exibir o botão de hora com ícone de relógio', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).toContain('sym_r_access_time')
    })
  })

  describe('prop disable', () => {
    it('deve repassar a prop disable como true para os botões', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { disable: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      buttons.forEach(btn => {
        expect(btn.props('disable')).toBe(true)
      })
    })

    it('não deve ter disable nos botões por padrão', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      buttons.forEach(btn => {
        expect(btn.props('disable')).toBeFalsy()
      })
    })
  })

  describe('prop readonly', () => {
    it('não deve exibir botões quando readonly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { readonly: true }
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(0)
    })

    it('deve repassar a prop readonly ao qas-input', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { readonly: true }
      })

      const input = wrapper.findComponent({ name: 'QasInput' })

      expect(input.props('readonly')).toBe(true)
    })
  })
})
