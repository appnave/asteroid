import { describe, it, expect } from 'vitest'

import QasTimeline from './QasTimeline.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountTimeline ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasTimeline, { props, ...options })

  return wrapper
}

const getEntries = wrapper => wrapper.findAllComponents({ name: 'QTimelineEntry' })

describe('QasTimeline', () => {
  it('exibe a data, a hora e a descrição de cada item', async () => {
    const wrapper = await mountTimeline({
      props: { list: [{ date: new Date(2025, 7, 20, 14, 30).toISOString(), description: 'Contrato assinado' }] }
    })

    expect(getEntries(wrapper)[0].props('subtitle')).toBe('20 ago 2025')
    expect(wrapper.text()).toContain('Adicionado às 14:30')
    expect(wrapper.text()).toContain('Contrato assinado')
  })

  it('"date-key", "hour-key" e "description-key" mudam as chaves usadas', async () => {
    const wrapper = await mountTimeline({
      props: {
        list: [{ day: '2025-08-20T12:00:00', time: '2025-08-20T09:15:00', text: 'Proposta enviada' }],
        dateKey: 'day',
        hourKey: 'time',
        descriptionKey: 'text'
      }
    })

    expect(getEntries(wrapper)[0].props('subtitle')).toBe('20 ago 2025')
    expect(wrapper.text()).toContain('Adicionado às 09:15')
    expect(wrapper.text()).toContain('Proposta enviada')
  })

  it('com uma data que não é válida, exibe o valor como veio', async () => {
    const wrapper = await mountTimeline({ props: { list: [{ date: 'Sem data', description: 'Item' }] } })

    expect(getEntries(wrapper)[0].props('subtitle')).toBe('Sem data')
  })
})
