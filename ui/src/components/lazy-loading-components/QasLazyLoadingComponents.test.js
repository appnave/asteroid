import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import QasLazyLoadingComponents from './QasLazyLoadingComponents.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

let visibleElements = null

/**
 * IntersectionObserver controlado pelo teste: só os elementos em "visibleElements" (por índice de observação)
 * são avisados como visíveis. Assim dá para simular itens fora da tela.
 */
class ControlledIntersectionObserver {
  constructor (callback) {
    this.callback = callback
    this.observed = []
  }

  observe (element) {
    const index = this.observed.push(element) - 1

    if (visibleElements.has(index)) {
      queueMicrotask(() => this.callback([{ isIntersecting: true, target: element }], this))
    }
  }

  unobserve () {}
  disconnect () {}
}

// o observer é criado em um requestAnimationFrame
async function waitForRender () {
  for (let frame = 0; frame < 3; frame++) {
    await flushPromises()
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  await flushPromises()
}

const Items = defineComponent({
  props: { quantity: { type: Number, default: 3 } },
  setup: props => () => h(QasLazyLoadingComponents, { direction: 'horizontal', placeholderWidth: '200px' }, {
    default: () => Array.from({ length: props.quantity }, (_, index) => h('div', { class: 'item', key: index }, `Item ${index + 1}`))
  })
})

async function mountLazyLoading ({ visible = [0, 1, 2], quantity = 3 } = {}) {
  visibleElements = new Set(visible)

  const { wrapper } = await mountQas(Items, { props: { quantity } })

  await waitForRender()

  return wrapper
}

const getRenderedItems = wrapper => wrapper.findAll('.item').map(item => item.text())

describe('QasLazyLoadingComponents', () => {
  let consoleWarn = null

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver)

    // o componente chama o slot fora do render (listado no documento), o resto dos avisos continua aparecendo
    const originalWarn = console.warn

    consoleWarn = vi.spyOn(console, 'warn').mockImplementation((message, ...args) => {
      if (String(message).includes('invoked outside of the render function')) return

      originalWarn(message, ...args)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    consoleWarn.mockRestore()
  })

  it('renderiza os itens visíveis', async () => {
    const wrapper = await mountLazyLoading()

    expect(getRenderedItems(wrapper)).toEqual(['Item 1', 'Item 2', 'Item 3'])
  })

  it('itens fora da tela ficam como espaço reservado com o tamanho informado', async () => {
    const wrapper = await mountLazyLoading({ visible: [0] })

    expect(getRenderedItems(wrapper)).toEqual(['Item 1'])
    expect(wrapper.findAll('div[style*="width: 200px"]')).toHaveLength(2)
  })

  it('emite os índices visíveis', async () => {
    const wrapper = await mountLazyLoading({ visible: [0, 2] })

    expect(wrapper.findComponent(QasLazyLoadingComponents).emitted('update:visibleItems').at(-1)[0]).toEqual([0, 2])
  })

  // Problema listado no documento: o slot é chamado fora do render, o que gera avisos no console em desenvolvimento.
  it.fails('não gera avisos do Vue no console', async () => {
    await mountLazyLoading()

    const slotWarnings = consoleWarn.mock.calls.filter(([message]) => String(message).includes('invoked outside of the render function'))

    expect(slotWarnings).toHaveLength(0)
  })
})
