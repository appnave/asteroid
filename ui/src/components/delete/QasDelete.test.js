import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasDelete from './QasDelete.vue'

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: { id: 'route-id-123' }
    }))
  }
})

const mockQas = {
  delete: vi.fn()
}

describe('QasDelete', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(QasDelete, {
      props: {
        entity: 'users'
      },
      global: {
        provide: {
          qas: mockQas
        }
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasBtn', () => {
      const btn = wrapper.findComponent({ name: 'QasBtn' })
      expect(btn.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('entity é obrigatório', () => {
      expect(QasDelete.props?.entity?.required).toBe(true)
    })

    it('useAutoDeleteRoute tem default true', () => {
      expect(QasDelete.props?.useAutoDeleteRoute?.default).toBe(true)
    })

    it('customId tem default string vazia', () => {
      expect(QasDelete.props?.customId?.default).toBe('')
    })
  })

  describe('Computed', () => {
    it('id usa route.params.id quando customId não está definido', () => {
      expect(wrapper.vm.id).toBe('route-id-123')
    })

    it('id usa customId quando definido', () => {
      const w = mountComponent(QasDelete, {
        props: { entity: 'users', customId: 'custom-id-456' },
        global: { provide: { qas: mockQas } }
      })
      expect(w.vm.id).toBe('custom-id-456')
    })

    it('attributes tem label "Excluir" por padrão', () => {
      expect(wrapper.vm.attributes.label).toBe('Excluir')
    })

    it('attributes mescla buttonProps', () => {
      const w = mountComponent(QasDelete, {
        props: { entity: 'users', buttonProps: { label: 'Remover', color: 'negative' } },
        global: { provide: { qas: mockQas } }
      })
      expect(w.vm.attributes.label).toBe('Remover')
      expect(w.vm.attributes.color).toBe('negative')
    })
  })

  describe('Métodos', () => {
    it('onDelete chama qas.delete com os parâmetros corretos', async () => {
      await wrapper.vm.onDelete()
      expect(mockQas.delete).toHaveBeenCalledWith(expect.objectContaining({
        deleteActionParams: expect.objectContaining({
          entity: 'users',
          id: 'route-id-123'
        })
      }))
    })

    it('onDelete passa url quando definida', async () => {
      const w = mountComponent(QasDelete, {
        props: { entity: 'users', url: '/api/custom-delete' },
        global: { provide: { qas: mockQas } }
      })
      await w.vm.onDelete()
      expect(mockQas.delete).toHaveBeenCalledWith(expect.objectContaining({
        deleteActionParams: expect.objectContaining({
          url: '/api/custom-delete'
        })
      }))
    })
  })
})
