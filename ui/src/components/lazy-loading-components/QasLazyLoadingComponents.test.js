import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { h } from 'vue'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasLazyLoadingComponents from './QasLazyLoadingComponents.vue'

const MockChild = { name: 'MockChild', template: '<div class="mock-child">Item</div>' }

describe('QasLazyLoadingComponents', () => {
  let wrapper

  beforeAll(() => {
    const originalWarn = console.warn

    vi.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
      if (typeof msg === 'string' && msg.includes('Slot "default" invoked outside of the render function')) return
      originalWarn.call(console, msg, ...args)
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    wrapper = mountComponent(QasLazyLoadingComponents, {
      props: {},
      slots: {
        default: () => [h(MockChild), h(MockChild), h(MockChild)]
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('threshold tem default 0.1', () => {
      expect(QasLazyLoadingComponents.props?.threshold?.default).toBe(0.1)
    })

    it('rootMargin tem default "0px"', () => {
      expect(QasLazyLoadingComponents.props?.rootMargin?.default).toBe('0px')
    })

    it('placeholderHeight tem default "500px"', () => {
      expect(QasLazyLoadingComponents.props?.placeholderHeight?.default).toBe('500px')
    })
  })

  describe('Estado inicial', () => {
    it('visibleItems começa como Set vazio ou populado pelo observer', () => {
      expect(wrapper.vm.visibleItems instanceof Set).toBe(true)
    })
  })
})
