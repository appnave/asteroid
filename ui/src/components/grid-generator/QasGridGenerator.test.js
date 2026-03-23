import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasGridGenerator from './QasGridGenerator.vue'

const defaultFields = {
  name: { label: 'Nome', name: 'name', type: 'text' },
  email: { label: 'E-mail', name: 'email', type: 'text' }
}

const defaultResult = {
  name: 'João Silva',
  email: 'joao@exemplo.com'
}

describe('QasGridGenerator', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasGridGenerator, {
      props: {
        fields: defaultFields,
        result: defaultResult
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza sem QasBox por padrão', () => {
      const box = wrapper.findComponent({ name: 'QasBox' })
      expect(box.exists()).toBe(false)
    })

    it('renderiza com QasBox quando useBox é true', () => {
      const w = mountComponent(QasGridGenerator, {
        props: { fields: defaultFields, result: defaultResult, useBox: true }
      })
      const box = w.findComponent({ name: 'QasBox' })
      expect(box.exists()).toBe(true)
    })

    it('renderiza QasGridItem para cada campo', () => {
      const items = wrapper.findAllComponents({ name: 'QasGridItem' })
      expect(items.length).toBe(Object.keys(defaultFields).length)
    })
  })

  describe('Props', () => {
    it('emptyResultText tem default "-"', () => {
      expect(QasGridGenerator.props?.emptyResultText?.default).toBe('-')
    })

    it('useEllipsis tem default true', () => {
      expect(QasGridGenerator.props?.useEllipsis?.default).toBe(true)
    })

    it('useEmptyResult tem default true', () => {
      expect(QasGridGenerator.props?.useEmptyResult?.default).toBe(true)
    })
  })

  describe('Computed - component', () => {
    it('component.is é "div" quando useBox é false', () => {
      expect(wrapper.vm.component.is).toBe('div')
    })

    it('component.is não é string quando useBox é true', () => {
      const w = mountComponent(QasGridGenerator, {
        props: { fields: defaultFields, result: defaultResult, useBox: true }
      })
      expect(typeof w.vm.component.is).not.toBe('string')
    })
  })

  describe('Computed - normalizedFields', () => {
    it('normalizedFields contém campos do default quando não há fieldset', () => {
      const nf = wrapper.vm.normalizedFields
      expect(nf.default).toBeDefined()
      expect(nf.default.fields).toBeDefined()
    })
  })

  describe('Slots', () => {
    it('renderiza slot field-{name} quando fornecido', () => {
      const w = mountComponent(QasGridGenerator, {
        props: { fields: defaultFields, result: defaultResult },
        slots: { 'field-name': '<div class="custom-field">Custom</div>' }
      })
      expect(w.find('.custom-field').exists()).toBe(true)
    })
  })
})
