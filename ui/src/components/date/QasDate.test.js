import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasDate from './QasDate.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountDate ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasDate, { props: { modelValue: '2025-08-20', ...props }, ...options })

  await flushPromises()

  return wrapper
}

const getQDate = wrapper => wrapper.findComponent({ name: 'QDate' })

describe('QasDate', () => {
  it('usa o calendário mínimo com a máscara "YYYY-MM-DD"', async () => {
    const wrapper = await mountDate()

    expect(getQDate(wrapper).props()).toMatchObject({ minimal: true, color: 'primary', mask: 'YYYY-MM-DD', modelValue: '2025-08-20' })
  })

  it('emite a data selecionada', async () => {
    const wrapper = await mountDate()

    getQDate(wrapper).vm.$emit('update:modelValue', '2025-08-25')

    expect(wrapper.emitted('update:modelValue')).toEqual([['2025-08-25']])
  })

  it('com "use-iso", emite a data em ISO', async () => {
    const wrapper = await mountDate({ props: { useIso: true } })

    getQDate(wrapper).vm.$emit('update:modelValue', '2025-08-25')

    expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2025, 7, 25).toISOString()]])
  })

  it('com "multiple" e "use-iso", emite cada data em ISO', async () => {
    const wrapper = await mountDate({ props: { multiple: true, useIso: true, modelValue: [] } })

    getQDate(wrapper).vm.$emit('update:modelValue', ['2025-08-25', '2025-08-26'])

    expect(wrapper.emitted('update:modelValue')).toEqual([[[new Date(2025, 7, 25).toISOString(), new Date(2025, 7, 26).toISOString()]]])
  })

  it('converte as datas de "options" para o formato do QDate', async () => {
    const wrapper = await mountDate({ props: { options: ['2025-08-21', '2025-08-22'] } })

    expect(getQDate(wrapper).props('options')).toEqual(['2025/08/21', '2025/08/22'])
  })

  it('marca os dias com eventos', async () => {
    const wrapper = await mountDate({ props: { events: [{ date: '2025-08-21' }, { date: '2025-08-22', counter: 3 }] } })

    expect(wrapper.findAll('.qas-date__event--pointer')).toHaveLength(1)
    // o jsdom não implementa innerText, então o texto "(3)" do contador não aparece aqui
    expect(wrapper.find('.qas-date__event--counter').exists()).toBe(true)
  })
})
