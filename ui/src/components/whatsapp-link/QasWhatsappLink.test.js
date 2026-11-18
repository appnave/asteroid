import { describe, it, expect } from 'vitest'

import QasWhatsappLink from './QasWhatsappLink.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountWhatsappLink (props = {}) {
  const { wrapper } = await mountQas(QasWhatsappLink, { props: { phone: '(11) 98765-4321', ...props } })

  return wrapper
}

const getLink = wrapper => wrapper.findComponent(QasBtn).vm.$attrs.href

describe('QasWhatsappLink', () => {
  it('abre o WhatsApp em outra aba com o telefone só com números e o código do Brasil', async () => {
    const wrapper = await mountWhatsappLink()

    expect(getLink(wrapper)).toBe('https://wa.me/5511987654321?text=')
    expect(wrapper.findComponent(QasBtn).vm.$attrs.target).toBe('_blank')
    expect(wrapper.findComponent(QasBtn).props('tooltip')).toBe('Enviar mensagem')
  })

  it('envia o texto com as quebras de linha', async () => {
    const wrapper = await mountWhatsappLink({ text: 'Olá\nTudo bem?' })

    expect(getLink(wrapper)).toContain('?text=Olá%0aTudo bem?')
  })

  // Problema listado no documento: o texto não é codificado, então "#" e "&" cortam a mensagem.
  it.fails.each([
    ['Pedido #123', 'Pedido #123'],
    ['Preço & condições', 'Preço & condições']
  ])('"%s" chega inteiro no WhatsApp', async (text, expected) => {
    const wrapper = await mountWhatsappLink({ text })

    expect(new URL(getLink(wrapper)).searchParams.get('text')).toBe(expected)
  })
})
