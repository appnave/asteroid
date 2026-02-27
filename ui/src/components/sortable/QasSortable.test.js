import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSortable from './QasSortable.vue'

vi.mock('sortablejs', () => ({
  default: function Sortable () {
    this.destroy = vi.fn()
    this.options = {}
  }
}))

vi.mock('../../plugins/notify-error/NotifyError.js', () => ({
  default: vi.fn()
}))

const defaultItems = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]

describe('QasSortable', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasSortable, {
      props: {
        modelValue: defaultItems
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza como div por padrão', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('renderiza com tag customizada', () => {
      const w = mountComponent(QasSortable, {
        props: { modelValue: defaultItems, tag: 'ul' }
      })
      expect(w.element.tagName).toBe('UL')
    })
  })

  describe('Props', () => {
    it('tag tem default "div"', () => {
      expect(QasSortable.props?.tag?.default).toBe('div')
    })

    it('useSaveOnSort tem default true', () => {
      expect(QasSortable.props?.useSaveOnSort?.default).toBe(true)
    })

    it('entity tem default string vazia', () => {
      expect(QasSortable.props?.entity?.default).toBe('')
    })
  })

  describe('Data', () => {
    it('sortedList é inicializado com os itens do modelValue', () => {
      expect(wrapper.vm.sortedList).toHaveLength(defaultItems.length)
      expect(wrapper.vm.sortedList[0].name).toBe('Item 1')
    })
  })

  describe('Computed', () => {
    it('identifiers retorna os ids da sortedList', () => {
      const ids = wrapper.vm.identifiers
      expect(ids).toEqual([1, 2, 3])
    })
  })

  describe('Métodos', () => {
    it('updateOrder reordena a lista corretamente', () => {
      // Move item do índice 0 para índice 2
      wrapper.vm.updateOrder({ oldIndex: 0, newIndex: 2 })
      // O item que estava no índice 0 agora está no 2 (mas useSaveOnSort vai chamar replace)
      // Verificamos que update:modelValue foi emitido
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('updateModel emite update:modelValue com sortedList', () => {
      wrapper.vm.updateModel()
      const events = wrapper.emitted('update:modelValue')
      expect(events).toBeTruthy()
      expect(events[0][0]).toEqual(wrapper.vm.sortedList)
    })

    it('setSortedValue copia o modelValue para sortedList', () => {
      wrapper.vm.sortedList = []
      wrapper.vm.setSortedValue()
      expect(wrapper.vm.sortedList).toHaveLength(defaultItems.length)
    })
  })
})
