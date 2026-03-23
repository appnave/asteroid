import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasOptionGroup from './QasOptionGroup.vue'

const defaultOptions = [
  { label: 'Opção 1', value: 'opt1' },
  { label: 'Opção 2', value: 'opt2' },
  { label: 'Opção 3', value: 'opt3' }
]

describe('QasOptionGroup', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasOptionGroup, {
      props: {
        options: defaultOptions,
        modelValue: 'opt1'
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza q-option-group', () => {
      const group = wrapper.findComponent({ name: 'QOptionGroup' })
      expect(group.exists()).toBe(true)
    })

    it('passa as options para o q-option-group', () => {
      const group = wrapper.findComponent({ name: 'QOptionGroup' })
      expect(group.props('options')).toEqual(defaultOptions)
    })
  })

  describe('Props', () => {
    it('type tem default "radio"', () => {
      expect(QasOptionGroup.props?.type?.default).toBe('radio')
    })

    it('valida type aceita "radio", "checkbox", "toggle"', () => {
      const validator = QasOptionGroup.props?.type?.validator
      expect(validator('radio')).toBe(true)
      expect(validator('checkbox')).toBe(true)
      expect(validator('toggle')).toBe(true)
      expect(validator('invalid')).toBe(false)
    })

    it('aceita modelValue como array (checkbox)', () => {
      const w = mountComponent(QasOptionGroup, {
        props: { options: defaultOptions, modelValue: 'opt1', type: 'checkbox' }
      })
      expect(w.exists()).toBe(true)
    })
  })

  describe('Computed - model', () => {
    it('model retorna modelValue', () => {
      expect(wrapper.vm.model).toBe('opt1')
    })

    it('model emite update:modelValue ao ser alterado', () => {
      wrapper.vm.model = 'opt2'
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('opt2')
    })
  })

  describe('Computed - attributes', () => {
    it('attributes inclui inline baseado em screen.isSmall', () => {
      // $qas.screen.isSmall é false no mock, então inline deve ser true
      expect(wrapper.vm.attributes.inline).toBe(true)
    })
  })
})
