import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSearchInput from './QasSearchInput.vue'

describe('QasSearchInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasSearchInput, {
      props: { modelValue: '' }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasInput', () => {
      const input = wrapper.findComponent({ name: 'QasInput' })
      expect(input.exists()).toBe(true)
    })

    it('renderiza botão de busca quando useSearchOnType é false', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: '', useSearchOnType: false }
      })
      const btn = w.findAllComponents({ name: 'QasBtn' })
      expect(btn.length).toBeGreaterThan(0)
    })

    it('não exibe botão clear quando modelValue está vazio', () => {
      // hasSearch é false quando model está vazio
      expect(wrapper.vm.hasSearch).toBe(false)
    })

    it('exibe botão clear quando modelValue não está vazio', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: 'busca' }
      })
      expect(w.vm.hasSearch).toBe(true)
    })
  })

  describe('Props', () => {
    it('useSearchOnType tem default true', () => {
      expect(QasSearchInput.props?.useSearchOnType?.default).toBe(true)
    })

    it('useDebounce tem default true', () => {
      expect(QasSearchInput.props?.useDebounce?.default).toBe(true)
    })
  })

  describe('Computed', () => {
    it('debounce retorna "1200" quando useDebounce é true', () => {
      expect(wrapper.vm.debounce).toBe('1200')
    })

    it('debounce retorna string vazia quando useDebounce é false', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: '', useDebounce: false }
      })
      expect(w.vm.debounce).toBe('')
    })

    it('hasSearch retorna true quando model não está vazio', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: 'texto' }
      })
      expect(w.vm.hasSearch).toBe(true)
    })

    it('model retorna modelValue', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: 'teste' }
      })
      expect(w.vm.model).toBe('teste')
    })

    it('model emite update:modelValue ao setar', () => {
      wrapper.vm.model = 'novo valor'
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('novo valor')
    })
  })

  describe('Métodos', () => {
    it('clear emite "clear" com o valor atual', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: 'busca atual' }
      })
      w.vm.clear()
      expect(w.emitted('clear')).toBeTruthy()
      expect(w.emitted('clear')[0][0]).toBe('busca atual')
    })

    it('clear emite update:modelValue com string vazia', () => {
      const w = mountComponent(QasSearchInput, {
        props: { modelValue: 'busca atual' }
      })
      w.vm.clear()
      const events = w.emitted('update:modelValue')
      expect(events).toBeTruthy()
      expect(events[0][0]).toBe('')
    })
  })
})
