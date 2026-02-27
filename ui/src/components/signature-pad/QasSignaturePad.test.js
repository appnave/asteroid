import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSignaturePad from './QasSignaturePad.vue'

// Mock de signature_pad
const signaturePadMock = {
  clear: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/png;base64,abc123'),
  isEmpty: vi.fn(() => true),
  on: vi.fn(),
  off: vi.fn(),
  addEventListener: vi.fn()
}

vi.mock('signature_pad', () => ({
  default: function SignaturePad () {
    return signaturePadMock
  }
}))

// Mock do canvas para document.getElementById
Object.defineProperty(global, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    getContext () { return null }
    setAttribute () {}
    offsetWidth = 300
    clientWidth = 285
    getBoundingClientRect () { return { left: 0, width: 300 } }
  }
})

describe('QasSignaturePad', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock getElementById para retornar um elemento canvas falso
    document.getElementById = vi.fn(() => ({
      getContext: vi.fn(() => null),
      setAttribute: vi.fn(),
      offsetWidth: 300,
      clientWidth: 285
    }))

    wrapper = mountComponent(QasSignaturePad, {
      attachTo: document.body
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza canvas', () => {
      const canvas = wrapper.find('canvas')
      expect(canvas.exists()).toBe(true)
    })

    it('não renderiza botão de limpar quando empty é true', () => {
      const btn = wrapper.findComponent({ name: 'QasBtn' })
      // empty default é true → botão não deve aparecer
      expect(btn.exists()).toBe(false)
    })

    it('renderiza botão de limpar quando empty é false', () => {
      const w = mountComponent(QasSignaturePad, {
        props: { empty: false },
        attachTo: document.body
      })
      const btn = w.findComponent({ name: 'QasBtn' })
      expect(btn.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('empty default é true', () => {
      expect(QasSignaturePad.props?.empty?.default).toBe(true)
    })

    it('height default é "250"', () => {
      expect(QasSignaturePad.props?.height?.default).toBe('250')
    })

    it('type default é "image/png"', () => {
      expect(QasSignaturePad.props?.type?.default).toBe('image/png')
    })

    it('canvas recebe height do prop', () => {
      const w = mountComponent(QasSignaturePad, {
        props: { height: '300' },
        attachTo: document.body
      })
      const canvas = w.find('canvas')
      expect(canvas.attributes('height')).toBe('300')
    })
  })

  describe('Métodos expostos', () => {
    it('getSignatureData retorna string de dados', () => {
      const result = wrapper.vm.getSignatureData()
      expect(typeof result).toBe('string')
    })

    it('clearSignature chama o método do signaturePad', () => {
      wrapper.vm.clearSignature()
      expect(signaturePadMock.clear).toHaveBeenCalled()
    })
  })

  describe('Slots', () => {
    it('renderiza conteúdo do slot padrão', () => {
      const w = mountComponent(QasSignaturePad, {
        slots: { default: '<span class="slot-content">Assinar aqui</span>' },
        attachTo: document.body
      })
      expect(w.find('.slot-content').exists()).toBe(true)
    })
  })
})
