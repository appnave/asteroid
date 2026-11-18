import { describe, it, expect } from 'vitest'

import QasAvatar from './QasAvatar.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountAvatar ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasAvatar, { props, ...options })

  return wrapper
}

const getQImg = wrapper => wrapper.findComponent({ name: 'QImg' })

describe('QasAvatar', () => {
  it('com imagem, exibe a imagem com o título como texto alternativo', async () => {
    const wrapper = await mountAvatar({ props: { image: '/foto.png', title: 'Ana' } })

    expect(getQImg(wrapper).props()).toMatchObject({ src: '/foto.png', alt: 'Ana' })
  })

  it('sem imagem, exibe a primeira letra do título em maiúscula', async () => {
    const wrapper = await mountAvatar({ props: { title: 'ana souza' } })

    expect(wrapper.text()).toBe('A')
  })

  it('sem imagem e sem título, exibe o ícone', async () => {
    const wrapper = await mountAvatar({ props: { icon: 'sym_r_person' } })

    expect(wrapper.findComponent({ name: 'QIcon' }).props('name')).toBe('sym_r_person')
  })

  it('se a imagem falhar, exibe a letra do título', async () => {
    const wrapper = await mountAvatar({ props: { image: '/quebrada.png', title: 'Bruno' } })

    getQImg(wrapper).vm.$emit('error')
    await wrapper.vm.$nextTick()

    expect(getQImg(wrapper).exists()).toBe(false)
    expect(wrapper.text()).toBe('B')
  })

  it('ao trocar a imagem, tenta carregar de novo', async () => {
    const wrapper = await mountAvatar({ props: { image: '/quebrada.png', title: 'Bruno' } })

    getQImg(wrapper).vm.$emit('error')
    await wrapper.setProps({ image: '/nova.png' })

    expect(getQImg(wrapper).props('src')).toBe('/nova.png')
  })
})
