import { describe, it, expect, afterEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

import QasTooltip, { activeTooltip } from './QasTooltip.vue'
import QasBreakline from '../breakline/QasBreakline.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountTooltip ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasTooltip, { props: { text: 'Linha 1\nLinha 2', ...props }, ...options })

  return wrapper
}

const getQTooltip = wrapper => wrapper.findComponent({ name: 'QTooltip' })

// compara a instância com "===" para o Vitest não tentar imprimir o componente inteiro em caso de falha
const isActive = wrapper => activeTooltip.value === getQTooltip(wrapper).vm

async function show (wrapper) {
  getQTooltip(wrapper).vm.show()
  await flushPromises()
}

describe('QasTooltip', () => {
  afterEach(() => {
    activeTooltip.value = null
  })

  it('usa o QTooltip à direita do elemento, com o texto quebrando as linhas', async () => {
    const wrapper = await mountTooltip()

    // o conteúdo da tooltip só é renderizado quando ela aparece
    await show(wrapper)

    expect(getQTooltip(wrapper).props()).toMatchObject({ anchor: 'center right', self: 'center left', maxWidth: '300px' })
    expect(wrapper.findComponent(QasBreakline).props('text')).toBe('Linha 1\nLinha 2')
  })

  it('não exibe durante um arraste (ex: no QasBoardGenerator)', async () => {
    const wrapper = await mountTooltip({ provide: { isDragging: ref(true) } })

    expect(getQTooltip(wrapper).exists()).toBe(false)
  })

  it('exibe só uma tooltip por vez, escondendo a anterior', async () => {
    const first = await mountTooltip({ props: { text: 'Primeira' } })
    const second = await mountTooltip({ props: { text: 'Segunda' } })

    await show(first)

    expect(isActive(first)).toBe(true)

    await show(second)

    expect(isActive(second)).toBe(true)
    expect(isActive(first)).toBe(false)
  })

  it('ao esconder, deixa de ser a tooltip ativa', async () => {
    const wrapper = await mountTooltip()

    await show(wrapper)

    getQTooltip(wrapper).vm.hide()

    // o evento "hide" só acontece depois da transição de saída
    await vi.waitFor(() => expect(activeTooltip.value === null).toBe(true))
  })

  // Problema listado no documento: no onUnmounted a ref do template já é null, então a referência nunca é limpa.
  it.fails('ao desmontar a tooltip ativa, limpa a referência', async () => {
    const wrapper = await mountTooltip()

    await show(wrapper)

    wrapper.unmount()

    expect(activeTooltip.value === null).toBe(true)
  })
})
