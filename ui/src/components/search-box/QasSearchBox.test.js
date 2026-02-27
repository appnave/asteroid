import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasSearchBox from './QasSearchBox.vue'

const defaultList = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasSearchBox, {
    props: {
      list: defaultList,
      results: [],
      ...props
    },
    ...mountOptions
  })
}

describe('QasSearchBox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-search-box').exists()).toBe(true)
    })

    it('emite update:results com todos os itens ao iniciar', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('update:results')).toBeTruthy()
    })
  })

  describe('busca com Fuse', () => {
    it('filtra resultados ao pesquisar', async () => {
      const wrapper = factory({ fuseOptions: { keys: ['label', 'value'] } })
      await flushPromises()
      wrapper.vm.filterOptionsByFuse('apple')
      // Com Fuse e keys configuradas, deve retornar ao menos um resultado
      expect(wrapper.vm.mx_filteredOptions.length).toBeGreaterThanOrEqual(1)
    })

    it('retorna todos os itens quando busca está vazia', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.filterOptionsByFuse('')
      expect(wrapper.vm.mx_filteredOptions.length).toBe(3)
    })
  })

  describe('prop outlined', () => {
    it('aplica classe de container quando outlined é true', async () => {
      const wrapper = factory({ outlined: true })
      await flushPromises()
      expect(wrapper.vm.containerClasses['qas-search-box__container']).toBe(true)
    })

    it('não aplica classe de container quando outlined é false', async () => {
      const wrapper = factory({ outlined: false })
      expect(wrapper.vm.containerClasses['qas-search-box__container']).toBe(false)
    })
  })

  describe('prop maxHeight', () => {
    it('usa maxHeight como altura máxima do container', async () => {
      const wrapper = factory({ maxHeight: '500px' })
      await flushPromises()
      expect(wrapper.vm.containerStyle.maxHeight).toBe('500px')
    })
  })

  describe('prop placeholder', () => {
    it('usa placeholder customizado', () => {
      const wrapper = factory({ placeholder: 'Buscar item...' })
      expect(wrapper.vm.attributes.placeholder).toBe('Buscar item...')
    })

    it('usa placeholder padrão "Pesquisar"', () => {
      const wrapper = factory()
      expect(wrapper.vm.attributes.placeholder).toBe('Pesquisar')
    })
  })

  describe('prop useEmptySlot', () => {
    it('exibe resultado vazio quando não há opções filtradas e useEmptySlot é true', async () => {
      const wrapper = factory({ list: [], useEmptySlot: true })
      await flushPromises()
      expect(wrapper.vm.showEmptyResult).toBe(true)
    })

    it('não exibe resultado vazio quando useEmptySlot é false', async () => {
      const wrapper = factory({ list: [], useEmptySlot: false })
      await flushPromises()
      expect(wrapper.vm.showEmptyResult).toBe(false)
    })
  })

  describe('slot after-search', () => {
    it('renderiza slot after-search', async () => {
      const wrapper = factory({}, {
        slots: {
          'after-search': '<div data-cy="after-search-content">Filtros</div>'
        }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="after-search-content"]').exists()).toBe(true)
    })
  })

  describe('slot default', () => {
    it('renderiza conteúdo no slot default quando há opções', async () => {
      const wrapper = factory({ list: defaultList }, {
        slots: {
          default: '<ul data-cy="custom-list"><li>Item</li></ul>'
        }
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="custom-list"]').exists()).toBe(true)
    })
  })
})
