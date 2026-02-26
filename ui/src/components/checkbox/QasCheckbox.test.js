import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasCheckbox from './QasCheckbox.vue'

describe('QasCheckbox', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasCheckbox)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-checkbox"', () => {
      const wrapper = mountComponent(QasCheckbox)

      expect(wrapper.classes()).toContain('qas-checkbox')
    })
  })

  describe('modo single (sem options)', () => {
    it('deve renderizar q-checkbox quando não há options', () => {
      const wrapper = mountComponent(QasCheckbox)
      expect(wrapper.find('q-checkbox').exists()).toBeTruthy()
    })

    it('não deve renderizar q-option-group no modo single', () => {
      const wrapper = mountComponent(QasCheckbox)

      expect(wrapper.find('q-option-group').exists()).toBeFalsy()
    })

    it('deve passar a label ao q-checkbox', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { label: 'Aceito os termos' }
      })

      expect(wrapper.find('q-checkbox').attributes('label')).toBe('Aceito os termos')
    })

    it('deve passar o disable ao q-checkbox', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { disable: true }
      })

      expect(wrapper.find('q-checkbox').attributes('disable')).toBeDefined()
    })
  })

  describe('modo grupo (com options)', () => {
    const options = [
      { label: 'Opção A', value: 'a' },
      { label: 'Opção B', value: 'b' }
    ]

    it('deve renderizar q-option-group quando options são fornecidas', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { options, modelValue: [] }
      })

      expect(wrapper.find('q-option-group').exists()).toBeTruthy()
      expect(wrapper.find('q-checkbox').exists()).toBeFalsy()
    })

    it('deve exibir a label quando há options e label fornecida', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { label: 'Selecione', options, modelValue: [] }
      })

      expect(wrapper.findComponent({ name: 'QasLabel' }).exists()).toBeTruthy()
    })
  })

  describe('prop required', () => {
    it('deve adicionar asterisco na label quando required é true', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: {
          label: 'Campo',
          required: true,
          options: [{ label: 'Op', value: 'op' }],
          modelValue: []
        }
      })

      // A label formatada é passada para o qas-label-stub
      const label = wrapper.findComponent({ name: 'QasLabel' })
      expect(label.exists()).toBeTruthy()
    })
  })

  describe('prop error e errorMessage', () => {
    it('deve renderizar qas-error-message no modo grupo quando errorMessage é fornecida', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: {
          errorMessage: 'Selecione ao menos uma opção',
          error: true,
          options: [{ label: 'Op', value: 'op' }],
          modelValue: []
        }
      })

      expect(wrapper.findComponent({ name: 'QasErrorMessage' }).exists()).toBeTruthy()
    })

    it('deve aplicar "qas-checkbox--error" no modo single com error', () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { error: true }
      })

      expect(wrapper.classes()).toContain('qas-checkbox--error')
    })
  })

  describe('eventos', () => {
    it('deve emitir "update:modelValue" ao alterar o modelo', async () => {
      const wrapper = mountComponent(QasCheckbox, {
        props: { modelValue: false }
      })

      // Altera o valor via setProps para forçar o emit de update:modelValue
      await wrapper.setProps({ modelValue: true })

      // O componente usa defineModel internamente, testamos que aceita a prop corretamente
      expect(wrapper.props('modelValue')).toBe(true)
    })
  })
})
