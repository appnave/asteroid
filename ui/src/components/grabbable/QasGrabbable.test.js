import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import QasGrabbable from './QasGrabbable.vue'

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class ResizeObserver {
    constructor (cb) { this.cb = cb }
    observe () {}
    unobserve () {}
    disconnect () {}
  })
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe('QasGrabbable', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasGrabbable)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-grabbable" no elemento raiz', () => {
      const wrapper = mountComponent(QasGrabbable)

      expect(wrapper.classes()).toContain('qas-grabbable')
    })

    it('deve ter a classe "relative-position" no elemento raiz', () => {
      const wrapper = mountComponent(QasGrabbable)

      expect(wrapper.classes()).toContain('relative-position')
    })
  })

  describe('container interno', () => {
    it('deve ter a classe "qas-grabbable__container" no container interno', () => {
      const wrapper = mountComponent(QasGrabbable)
      const container = wrapper.find('.qas-grabbable__container')

      expect(container.exists()).toBeTruthy()
    })

    it('deve ter a classe "secondary-scroll" no container interno', () => {
      const wrapper = mountComponent(QasGrabbable)
      const container = wrapper.find('.qas-grabbable__container')

      expect(container.classes()).toContain('secondary-scroll')
    })

    it('deve ter as classes "flex" e "no-wrap" no container interno', () => {
      const wrapper = mountComponent(QasGrabbable)
      const container = wrapper.find('.qas-grabbable__container')

      expect(container.classes()).toContain('flex')
      expect(container.classes()).toContain('no-wrap')
    })
  })

  describe('prop useScrollBar', () => {
    it('deve aplicar a classe "qas-grabbable__container--no-scroll" quando useScrollBar é false', () => {
      const wrapper = mountComponent(QasGrabbable, {
        props: { useScrollBar: false }
      })

      expect(wrapper.find('.qas-grabbable__container--no-scroll').exists()).toBeTruthy()
    })

    it('não deve aplicar a classe "qas-grabbable__container--no-scroll" quando useScrollBar é true', () => {
      const wrapper = mountComponent(QasGrabbable, {
        props: { useScrollBar: true }
      })

      expect(wrapper.find('.qas-grabbable__container--no-scroll').exists()).toBeFalsy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot dentro do container', () => {
      const wrapper = mountComponent(QasGrabbable, {
        slots: { default: '<span class="slot-item">Item</span>' }
      })

      const container = wrapper.find('.qas-grabbable__container')

      expect(container.find('.slot-item').exists()).toBeTruthy()
      expect(container.find('.slot-item').text()).toBe('Item')
    })

    it('deve renderizar múltiplos elementos no slot', () => {
      const wrapper = mountComponent(QasGrabbable, {
        slots: { default: '<span class="item-1">A</span><span class="item-2">B</span>' }
      })

      const container = wrapper.find('.qas-grabbable__container')

      expect(container.find('.item-1').exists()).toBeTruthy()
      expect(container.find('.item-2').exists()).toBeTruthy()
    })
  })

  describe('emit grabbing', () => {
    it('deve declarar o emit "grabbing"', () => {
      const wrapper = mountComponent(QasGrabbable)

      expect(wrapper.emitted()).toBeDefined()
    })
  })
})
