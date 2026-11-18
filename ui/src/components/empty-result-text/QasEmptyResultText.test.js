import { describe, it, expect } from 'vitest'

import QasEmptyResultText from './QasEmptyResultText.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

describe('QasEmptyResultText', () => {
  it('exibe o texto padrão', async () => {
    const { wrapper } = await mountQas(QasEmptyResultText)

    expect(wrapper.text()).toBe('Não há itens para serem exibidos.')
  })

  it('exibe o texto da prop "text"', async () => {
    const { wrapper } = await mountQas(QasEmptyResultText, { props: { text: 'Nenhum contato encontrado.' } })

    expect(wrapper.text()).toBe('Nenhum contato encontrado.')
  })
})
