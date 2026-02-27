import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasUploader from './QasUploader.vue'

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasUploader, {
    props: {
      entity: 'documents',
      modelValue: '',
      ...props
    },
    ...mountOptions
  })
}

describe('QasUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-uploader').exists()).toBe(true)
    })

    it('renderiza header por padrão (useHeader true)', () => {
      const wrapper = factory()
      expect(wrapper.vm.useHeader).toBe(true)
    })

    it('não renderiza header quando useHeader é false', () => {
      const wrapper = factory({ useHeader: false })
      expect(wrapper.vm.useHeader).toBe(false)
    })
  })

  describe('prop readonly', () => {
    it('marca readonly corretamente', () => {
      const wrapper = factory({ readonly: true })
      expect(wrapper.props('readonly')).toBe(true)
    })
  })

  describe('prop maxFiles', () => {
    it('isMultiple é true quando atributo multiple é passado', () => {
      const wrapper = mountComponent(QasUploader, {
        props: { entity: 'documents', modelValue: [], maxFiles: 3 },
        attrs: { multiple: true }
      })
      expect(wrapper.vm.isMultiple).toBe(true)
    })

    it('isMultiple é false sem atributo multiple', () => {
      const wrapper = factory({ maxFiles: 1 })
      expect(wrapper.vm.isMultiple).toBe(false)
    })
  })

  describe('prop useEmptyResultText', () => {
    it('exibe texto de resultado vazio por padrão', () => {
      const wrapper = factory({ modelValue: [] })
      expect(wrapper.vm.useEmptyResultText).toBe(true)
    })
  })

  describe('prop useObjectModel', () => {
    it('useObjectModel padrão é false', () => {
      const wrapper = factory()
      expect(wrapper.vm.useObjectModel).toBeFalsy()
    })
  })

  describe('prop useResize', () => {
    it('useResize é true por padrão', () => {
      const wrapper = factory()
      expect(wrapper.vm.useResize).toBe(true)
    })
  })

  describe('colunas', () => {
    it('gera colunas default corretas para single file', () => {
      const wrapper = factory({ maxFiles: 1 })
      const cols = wrapper.vm.defaultColumns
      expect(cols).toMatchObject({ col: 12, sm: 6 })
    })

    it('gera colunas com md e lg para múltiplos arquivos com galleryCard', () => {
      const wrapper = mountComponent(QasUploader, {
        props: { entity: 'documents', modelValue: [], maxFiles: 5, useGalleryCard: true },
        attrs: { multiple: true }
      })
      const cols = wrapper.vm.defaultColumns
      expect(cols.md).toBe(4)
      expect(cols.lg).toBe(3)
    })
  })

  describe('savedFiles', () => {
    it('savedFiles começa vazio', () => {
      const wrapper = factory()
      expect(wrapper.vm.savedFiles).toEqual({})
    })
  })
})
