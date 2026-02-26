import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDate from './QasDate.vue'

describe('QasDate', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o componente q-date (stub)', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.findComponent({ name: 'QDate' }).exists()).toBeTruthy()
    })
  })

  describe('classes CSS', () => {
    it('deve ter a classe "qas-date"', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.classes()).toContain('qas-date')
    })

    it('deve ter a classe "shadow-2"', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.classes()).toContain('shadow-2')
    })

    it('deve ter a classe "qas-date--inative" quando useInactiveDates é true (padrão)', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.classes()).toContain('qas-date--inative')
    })

    it('não deve ter a classe "qas-date--inative" quando useInactiveDates é false', () => {
      const wrapper = mountComponent(QasDate, {
        props: { useInactiveDates: false }
      })

      expect(wrapper.classes()).not.toContain('qas-date--inative')
    })
  })

  describe('prop width', () => {
    it('deve aplicar o estilo de width ao q-date quando fornecido', () => {
      const wrapper = mountComponent(QasDate, {
        props: { width: '300px' }
      })

      expect(wrapper.element.style.width).toBe('300px')
    })

    it('não deve aplicar style de width por padrão', () => {
      const wrapper = mountComponent(QasDate)

      expect(wrapper.element.style.width).toBe('')
    })
  })

  describe('prop modelValue', () => {
    it('deve aceitar uma data como string', () => {
      const wrapper = mountComponent(QasDate, {
        props: { modelValue: '2024/01/15' }
      })

      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop multiple', () => {
    it('deve passar a prop "multiple" ao q-date quando ativado', () => {
      const wrapper = mountComponent(QasDate, {
        props: { multiple: true, modelValue: ['2024/01/01', '2024/01/05'] }
      })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('multiple')).toBe(true)
    })

    it('não deve ter "multiple" ativo por padrão', () => {
      const wrapper = mountComponent(QasDate)

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('multiple')).toBeFalsy()
    })
  })

  describe('prop mask', () => {
    it('deve repassar a prop "mask" ao q-date', () => {
      const wrapper = mountComponent(QasDate, {
        props: { mask: 'YYYY/MM/DD' }
      })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('mask')).toBe('YYYY/MM/DD')
    })
  })

  describe('emissão de eventos', () => {
    it('deve emitir "update:modelValue" ao selecionar uma data no q-date', async () => {
      const wrapper = mountComponent(QasDate)

      const qDate = wrapper.findComponent({ name: 'QDate' })

      await qDate.vm.$emit('update:modelValue', '2024/06/20')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('2024/06/20')
    })
  })
})
