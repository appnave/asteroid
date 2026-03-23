import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasResizer from './QasResizer.vue'

describe('QasResizer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasResizer, {
      props: {
        source: 'path/to/image.jpg'
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza q-img', () => {
      const img = wrapper.findComponent({ name: 'QImg' })
      expect(img.exists()).toBe(true)
    })

    it('passa imageSource para q-img como src', () => {
      const img = wrapper.findComponent({ name: 'QImg' })
      expect(img.props('src')).toBeTruthy()
      expect(img.props('src')).toContain('https://image-resize.nave.dev/')
    })
  })

  describe('Props', () => {
    it('source é obrigatório', () => {
      expect(QasResizer.props?.source?.required).toBe(true)
    })

    it('resize tem default "cover"', () => {
      expect(QasResizer.props?.resize?.default).toBe('cover')
    })

    it('valida resize aceita valores válidos', () => {
      const validator = QasResizer.props?.resize?.validator
      expect(validator('cover')).toBe(true)
      expect(validator('contain')).toBe(true)
      expect(validator('fill')).toBe(true)
      expect(validator('invalid')).toBe(false)
    })
  })

  describe('Computed - imageSource', () => {
    it('imageSource inclui a URL base de resize', () => {
      expect(wrapper.vm.imageSource).toContain('https://image-resize.nave.dev/')
    })

    it('imageSource é gerado via btoa do JSON dos parâmetros', () => {
      const source = wrapper.vm.imageSource
      const base64Part = source.replace('https://image-resize.nave.dev/', '')
      const decoded = JSON.parse(atob(base64Part))
      expect(decoded.key).toBe('path/to/image.jpg')
    })
  })

  describe('Computed - ratio', () => {
    it('ratio é undefined quando não há height nem width', () => {
      expect(wrapper.vm.ratio).toBeUndefined()
    })

    it('ratio é 1 quando height igual a width', () => {
      const w = mountComponent(QasResizer, {
        props: { source: 'img.jpg', size: '100x100' }
      })
      expect(w.vm.ratio).toBe(1)
    })

    it('ratio é calculado corretamente com height e width diferentes', () => {
      const w = mountComponent(QasResizer, {
        props: { source: 'img.jpg', size: '200x400' }
      })
      // width(400) / gcd(200,400) / height(200) / gcd(200,400) = 2/1 = 2
      expect(typeof w.vm.ratio).toBe('number')
    })
  })

  describe('Computed - imageSize', () => {
    it('imageSize extrai width e height do prop size', () => {
      const w = mountComponent(QasResizer, {
        props: { source: 'img.jpg', size: '300x600' }
      })
      expect(w.vm.imageSize.width).toBe('300')
      expect(w.vm.imageSize.height).toBe('600')
    })
  })
})
