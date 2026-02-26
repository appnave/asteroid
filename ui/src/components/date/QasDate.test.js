import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDate from './QasDate.vue'

/**
 * QDate precisa de `.q-date__navigation` e `.q-date__content` no DOM para que o
 * onMounted de QasDate funcione corretamente (MutationObserver + querySelector).
 * Não declaramos `class` como prop para que o Vue aplique as classes dinâmicas
 * automaticamente via inheritAttrs no elemento raiz do stub.
 */
const QDateStub = {
  name: 'QDate',
  template: `
    <div class="q-date">
      <div class="q-date__navigation"></div>
      <div class="q-date__content"></div>
    </div>
  `,
  props: ['modelValue', 'color', 'mask', 'minimal', 'multiple', 'options', 'textColor'],
  emits: ['update:modelValue']
}

const defaultGlobal = {
  stubs: { QDate: QDateStub }
}

describe('QasDate', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o componente q-date (stub)', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.findComponent({ name: 'QDate' }).exists()).toBeTruthy()
    })
  })

  describe('classes CSS', () => {
    it('deve ter a classe "qas-date"', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.classes()).toContain('qas-date')
    })

    it('deve ter a classe "shadow-2"', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.classes()).toContain('shadow-2')
    })

    it('deve ter a classe "qas-date--inative" quando useInactiveDates é true (padrão)', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.classes()).toContain('qas-date--inative')
    })

    it('não deve ter a classe "qas-date--inative" quando useInactiveDates é false', () => {
      const wrapper = mountComponent(QasDate, {
        props: { useInactiveDates: false },
        global: defaultGlobal
      })

      expect(wrapper.classes()).not.toContain('qas-date--inative')
    })
  })

  describe('prop width', () => {
    it('deve aplicar o estilo de width ao q-date quando fornecido', () => {
      const wrapper = mountComponent(QasDate, {
        props: { width: '300px' },
        global: defaultGlobal
      })

      expect(wrapper.element.style.width).toBe('300px')
    })

    it('não deve aplicar style de width por padrão', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      expect(wrapper.element.style.width).toBe('')
    })
  })

  describe('prop modelValue', () => {
    it('deve aceitar uma data como string', () => {
      const wrapper = mountComponent(QasDate, {
        props: { modelValue: '2024/01/15' },
        global: defaultGlobal
      })

      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop multiple', () => {
    it('deve passar a prop "multiple" ao q-date quando ativado', () => {
      const wrapper = mountComponent(QasDate, {
        props: { multiple: true, modelValue: ['2024/01/01', '2024/01/05'] },
        global: defaultGlobal
      })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('multiple')).toBe(true)
    })

    it('não deve ter "multiple" ativo por padrão', () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('multiple')).toBeFalsy()
    })
  })

  describe('prop mask', () => {
    it('deve repassar a prop "mask" ao q-date', () => {
      const wrapper = mountComponent(QasDate, {
        props: { mask: 'YYYY/MM/DD' },
        global: defaultGlobal
      })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      expect(qDate.props('mask')).toBe('YYYY/MM/DD')
    })
  })

  describe('emissão de eventos', () => {
    it('deve emitir "update:modelValue" ao selecionar uma data no q-date', async () => {
      const wrapper = mountComponent(QasDate, { global: defaultGlobal })

      const qDate = wrapper.findComponent({ name: 'QDate' })

      await qDate.vm.$emit('update:modelValue', '2024/06/20')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('2024/06/20')
    })
  })
})
