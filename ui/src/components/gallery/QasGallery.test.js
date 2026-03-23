import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasGallery from './QasGallery.vue'

const defaultImages = [
  'https://example.com/img1.jpg',
  'https://example.com/img2.jpg',
  'https://example.com/img3.jpg',
  'https://example.com/img4.jpg',
  'https://example.com/img5.jpg'
]

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasGallery, {
    props: {
      modelValue: defaultImages,
      ...props
    },
    ...mountOptions
  })
}

describe('QasGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-gallery').exists()).toBe(true)
    })

    it('renderiza imagens com data-cy por índice', () => {
      const wrapper = factory()
      expect(wrapper.find('[data-cy="gallery-image-0"]').exists()).toBe(true)
    })

    it('renderiza botão "Ver mais" por padrão quando há mais imagens', () => {
      const wrapper = factory()
      expect(wrapper.find('[data-cy="gallery-btn-show-more"]').exists()).toBe(true)
    })
  })

  describe('prop initialSize', () => {
    it('exibe initialSize imagens inicialmente', () => {
      const wrapper = factory({ initialSize: 2 })
      const images = wrapper.findAll('[data-cy^="gallery-image-"]')
      expect(images.length).toBe(2)
    })

    it('não exibe botão "Ver mais" quando all imagens cabem no initialSize', () => {
      const wrapper = factory({ modelValue: defaultImages.slice(0, 4) })
      // 4 imagens, initialSize=4 → hideShowMore true
      expect(wrapper.vm.hideShowMore).toBe(true)
    })

    it('exibe botão "Ver mais" quando há mais imagens que o initialSize', () => {
      const wrapper = factory({ modelValue: defaultImages, initialSize: 4 })
      expect(wrapper.vm.hideShowMore).toBe(false)
    })
  })

  describe('prop useLoadAll', () => {
    it('oculta botão "Ver mais" quando useLoadAll é true', () => {
      const wrapper = factory({ useLoadAll: true })
      expect(wrapper.vm.hideShowMore).toBe(true)
    })
  })

  describe('prop showMoreLabel', () => {
    it('usa o label customizado no botão "Ver mais"', () => {
      const wrapper = factory({ showMoreLabel: 'Carregar mais' })
      expect(wrapper.vm.$props.showMoreLabel).toBe('Carregar mais')
    })
  })

  describe('prop useObjectModel', () => {
    it('normaliza imagens como { url } quando useObjectModel é false', () => {
      const wrapper = factory()
      const first = wrapper.vm.normalizedImages[0]
      expect(first).toHaveProperty('url')
    })

    it('mantém objetos como-são quando useObjectModel é true', () => {
      const objectImages = [{ url: 'https://example.com/img1.jpg', alt: 'Imagem 1' }]
      const wrapper = factory({ modelValue: objectImages, useObjectModel: true })
      expect(wrapper.vm.normalizedImages[0]).toMatchObject({ url: 'https://example.com/img1.jpg', alt: 'Imagem 1' })
    })
  })

  describe('prop showMoreAlign', () => {
    it('aplica classe de alinhamento corretamente', () => {
      const wrapper = factory({ showMoreAlign: 'left' })
      expect(wrapper.vm.actionsClasses).toBe('text-left')
    })
  })

  describe('slot padrão', () => {
    it('renderiza conteúdo no slot padrão', () => {
      const wrapper = factory({}, {
        slots: {
          default: '<button data-cy="custom-show-more">Custom</button>'
        }
      })
      expect(wrapper.find('[data-cy="custom-show-more"]').exists()).toBe(true)
    })
  })
})
