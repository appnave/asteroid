import { describe, it, expect } from 'vitest'

import QasGrabbable from './QasGrabbable.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountGrabbable ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasGrabbable, {
    props,
    slots: { default: '<div class="conteudo">Conteúdo</div>' },
    ...options
  })

  return wrapper
}

const getContainer = wrapper => wrapper.find('.qas-grabbable__container')

describe('QasGrabbable', () => {
  it('sem conteúdo maior que o container, não habilita o arrastar', async () => {
    const wrapper = await mountGrabbable()

    expect(getContainer(wrapper).classes()).toContain('qas-grabbable__container--no-grab')
  })

  it('com conteúdo maior que o container, habilita o arrastar e marca a posição inicial', async () => {
    const wrapper = await mountGrabbable()
    const container = getContainer(wrapper).element

    Object.defineProperty(container, 'scrollWidth', { value: 1000 })
    Object.defineProperty(container, 'offsetWidth', { value: 300 })

    // simula o ResizeObserver avisando que o tamanho mudou
    wrapper.vm.$.setupState.handleEnableScrollOnGrab()
    await wrapper.vm.$nextTick()

    expect(getContainer(wrapper).classes()).not.toContain('qas-grabbable__container--no-grab')
    expect(getContainer(wrapper).classes()).toContain('qas-grabbable__container--grab-start')
  })
})
