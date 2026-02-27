import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSelectListDialog from './QasSelectListDialog.vue'

const mockQas = {
  getGetter: vi.fn(() => ({})),
  getAction: vi.fn(() => Promise.resolve())
}

const defaultOptions = [
  { label: 'Item 1', value: 'i1' },
  { label: 'Item 2', value: 'i2' },
  { label: 'Item 3', value: 'i3' }
]

describe('QasSelectListDialog', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasSelectListDialog, {
      props: {
        options: defaultOptions,
        modelValue: []
      },
      global: {
        provide: { qas: mockQas }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasDialog', () => {
      const dialog = wrapper.findComponent({ name: 'QasDialog' })
      expect(dialog.exists()).toBe(true)
    })

    it('renderiza QasSelectList dentro do diálogo', () => {
      const list = wrapper.findComponent({ name: 'QasSelectList' })
      expect(list.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('options tem default array vazio', () => {
      const def = QasSelectListDialog.props?.options?.default()
      expect(def).toEqual([])
    })

    it('listLabel tem default string vazia', () => {
      expect(QasSelectListDialog.props?.listLabel?.default).toBe('')
    })

    it('label tem default string vazia', () => {
      expect(QasSelectListDialog.props?.label?.default).toBe('')
    })
  })

  describe('Estado inicial', () => {
    it('showDialog começa false', () => {
      expect(wrapper.vm.showDialog).toBe(false)
    })
  })

  describe('Computed', () => {
    it('selectedOptions retorna os itens selecionados', () => {
      const w = mountComponent(QasSelectListDialog, {
        props: {
          options: defaultOptions,
          modelValue: ['i1', 'i2']
        },
        global: { provide: { qas: mockQas } }
      })
      const selected = w.vm.selectedOptions
      expect(Array.isArray(selected)).toBe(true)
      expect(selected.length).toBe(2)
    })

    it('hasError é false quando error está vazio', () => {
      expect(wrapper.vm.hasError).toBe(false)
    })

    it('hasError é true quando error é string não vazia', () => {
      const w = mountComponent(QasSelectListDialog, {
        props: { options: defaultOptions, modelValue: [], error: 'Campo obrigatório' },
        global: { provide: { qas: mockQas } }
      })
      expect(w.vm.hasError).toBe(true)
    })
  })
})
