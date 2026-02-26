import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDateTimeInput from './QasDateTimeInput.vue'

const QasInputStub = {
  name: 'QasInput',
  template: '<div class="qas-input-stub"><slot name="append" /></div>',
  props: ['modelValue', 'disable', 'readonly', 'mask', 'error', 'errorMessage']
}

const QasDateStub = {
  name: 'QasDate',
  template: '<div class="qas-date-stub" />',
  props: ['modelValue', 'width', 'mask']
}

const QasBtnWithProps = {
  name: 'QasBtn',
  template: '<button class="qas-btn-stub"><slot /></button>',
  props: ['icon', 'disable', 'color', 'variant', 'class']
}

const defaultGlobal = {
  stubs: {
    QasInput: QasInputStub,
    QasDate: QasDateStub,
    QasBtn: QasBtnWithProps
  }
}

describe('QasDateTimeInput', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o componente qas-input', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-input-stub').exists()).toBeTruthy()
    })
  })

  describe('prop useDateOnly', () => {
    it('deve exibir apenas o botão de data quando useDateOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useDateOnly: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(1)
    })

    it('não deve exibir o botão de hora quando useDateOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useDateOnly: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).not.toContain('sym_r_access_time')
    })
  })

  describe('prop useTimeOnly', () => {
    it('deve exibir apenas o botão de hora quando useTimeOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useTimeOnly: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(1)
    })

    it('não deve exibir o botão de data quando useTimeOnly é true', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { useTimeOnly: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).not.toContain('sym_r_calendar_today')
    })
  })

  describe('exibição padrão de botões', () => {
    it('deve exibir os botões de data e hora por padrão', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(2)
    })

    it('deve exibir o botão de data com ícone de calendário', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).toContain('sym_r_calendar_today')
    })

    it('deve exibir o botão de hora com ícone de relógio', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })
      const icons = buttons.map(btn => btn.props('icon'))

      expect(icons).toContain('sym_r_access_time')
    })
  })

  describe('prop disable', () => {
    it('deve repassar a prop disable como true para os botões', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { disable: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      buttons.forEach(btn => {
        expect(btn.props('disable')).toBe(true)
      })
    })

    it('não deve ter disable nos botões por padrão', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        global: defaultGlobal
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
        props: { readonly: true },
        global: defaultGlobal
      })

      const buttons = wrapper.findAllComponents({ name: 'QasBtn' })

      expect(buttons).toHaveLength(0)
    })

    it('deve repassar a prop readonly ao qas-input', () => {
      const wrapper = mountComponent(QasDateTimeInput, {
        props: { readonly: true },
        global: defaultGlobal
      })

      const input = wrapper.findComponent({ name: 'QasInput' })

      expect(input.props('readonly')).toBe(true)
    })
  })
})
