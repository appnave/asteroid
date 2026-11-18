import { describe, it, expect } from 'vitest'

import QasCardImage from './QasCardImage.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const images = ['/1.png', '/2.png', '/3.png', '/4.png']

async function mountCardImage ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasCardImage, { props: { images, useHeader: true, ...props }, ...options })

  return wrapper
}

const getSlides = wrapper => wrapper.findAllComponents({ name: 'QCarouselSlide' })

describe('QasCardImage', () => {
  it('exibe no máximo 3 imagens no carrossel, com navegação', async () => {
    const wrapper = await mountCardImage()

    // o QCarousel só monta o slide atual, então as imagens são contadas pelos botões de navegação
    expect(wrapper.findAllComponents({ name: 'QasBtn' })).toHaveLength(3)
    expect(getSlides(wrapper)[0].props('imgSrc')).toBe('/1.png')
    expect(wrapper.findComponent({ name: 'QCarousel' }).props('navigation')).toBe(true)
  })

  it('com uma imagem só, não exibe a navegação', async () => {
    const wrapper = await mountCardImage({ props: { images: ['/1.png'] } })

    expect(wrapper.findComponent({ name: 'QCarousel' }).props('navigation')).toBe(false)
  })

  it('sem "use-header", não exibe o carrossel', async () => {
    const wrapper = await mountCardImage({ props: { useHeader: false } })

    expect(wrapper.findComponent({ name: 'QCarousel' }).exists()).toBe(false)
  })

  it('com "skeleton", exibe o carregamento sobre o carrossel e o conteúdo', async () => {
    const wrapper = await mountCardImage({ props: { skeleton: true } })

    expect(wrapper.findAllComponents(QasSkeleton)).toHaveLength(2)
  })
})
