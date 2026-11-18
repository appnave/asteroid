import { describe, it, expect } from 'vitest'

import QasPagination from './QasPagination.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountPagination (attrs = {}) {
  const { wrapper } = await mountQas(QasPagination, { attrs: { modelValue: 1, max: 10, ...attrs } })

  return wrapper
}

const getQPagination = wrapper => wrapper.findComponent({ name: 'QPagination' })

describe('QasPagination', () => {
  it('usa o visual padrão do design system', async () => {
    const wrapper = await mountPagination()

    expect(getQPagination(wrapper).props()).toMatchObject({
      activeColor: 'primary',
      activeDesign: 'flat',
      boundaryNumbers: true,
      color: 'grey-8',
      directionLinks: true,
      iconNext: 'sym_r_chevron_right',
      iconPrev: 'sym_r_chevron_left',
      maxPages: 3
    })

    expect(getQPagination(wrapper).classes()).toContain('qas-pagination')
  })

  it('repassa a página atual e emite a página selecionada', async () => {
    const pages = []
    const wrapper = await mountPagination({ modelValue: 3, 'onUpdate:modelValue': page => pages.push(page) })

    expect(getQPagination(wrapper).props('modelValue')).toBe(3)

    getQPagination(wrapper).vm.$emit('update:modelValue', 4)

    expect(pages).toEqual([4])
  })
})
