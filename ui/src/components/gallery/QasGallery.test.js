import { describe, it, expect, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { Screen } from 'quasar'

import QasGallery from './QasGallery.vue'
import QasGalleryCard from '../gallery-card/QasGalleryCard.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeUrls = quantity => Array.from({ length: quantity }, (_, index) => `/foto-${index + 1}.png`)

async function mountGallery ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasGallery, { props: { modelValue: makeUrls(6), ...props }, ...options })

  return wrapper
}

const getCards = wrapper => wrapper.findAllComponents(QasGalleryCard)
const getCardUrls = wrapper => getCards(wrapper).map(card => card.props('url'))
const getShowMoreButton = wrapper => wrapper.find('[data-cy="gallery-btn-show-more"]')

// executa a ação "Excluir" do menu do card e confirma no dialog
async function destroyImage (wrapper, index) {
  getCards(wrapper)[index].props('headerProps').actionsMenuProps.list.destroy.handler()
  await flushPromises()

  wrapper.findComponent({ name: 'PvGalleryDeleteDialog' }).vm.$emit('success', {})
  await flushPromises()
}

describe('QasGallery', () => {
  afterEach(() => {
    Screen.xs = false
  })

  describe('imagens', () => {
    it('exibe as primeiras 4 imagens em 4 colunas', async () => {
      const wrapper = await mountGallery()

      expect(getCardUrls(wrapper)).toEqual(makeUrls(4))
      expect(wrapper.find('[data-cy="gallery-image-0"]').classes()).toContain('col-3')
    })

    it('"Ver mais" dobra a quantidade exibida e some quando todas aparecem', async () => {
      const wrapper = await mountGallery()

      await getShowMoreButton(wrapper).trigger('click')

      expect(getCards(wrapper)).toHaveLength(6)
      expect(getShowMoreButton(wrapper).exists()).toBe(false)
    })

    it('com "use-load-all", exibe todas as imagens sem "Ver mais"', async () => {
      const wrapper = await mountGallery({ props: { useLoadAll: true } })

      expect(getCards(wrapper)).toHaveLength(6)
      expect(getShowMoreButton(wrapper).exists()).toBe(false)
    })

    it('com "use-object-model", usa os objetos como props dos cards', async () => {
      const wrapper = await mountGallery({ props: { useObjectModel: true, modelValue: [{ url: '/a.png', fileType: 'pdf' }] } })

      expect(getCards(wrapper)[0].props()).toMatchObject({ url: '/a.png', fileType: 'pdf' })
    })

    it('ao clicar na imagem, abre o carrossel nela', async () => {
      const wrapper = await mountGallery()

      getCards(wrapper)[2].props('imageProps').onClick()
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PvGalleryCarouselDialog' }).props()).toMatchObject({ modelValue: true, imageIndex: 2 })
    })

    it('se a imagem não carregar, tira ela da galeria', async () => {
      const wrapper = await mountGallery({ props: { useLoadAll: true } })

      getCards(wrapper)[0].props('imageProps').onError()
      await flushPromises()

      expect(getCardUrls(wrapper)).not.toContain('/foto-1.png')
    })
  })

  describe('excluir', () => {
    it('imagens com "destroyable" false ficam com a ação desabilitada', async () => {
      const wrapper = await mountGallery({ props: { useDestroy: true, useObjectModel: true, modelValue: [{ url: '/a.png', destroyable: false }] } })

      expect(getCards(wrapper)[0].props('headerProps').actionsMenuProps.list.destroy.disable).toBe(true)
    })

    it('envia para a API a lista sem a imagem excluída, no campo "model-key"', async () => {
      const wrapper = await mountGallery({ props: { useDestroy: true, useObjectModel: true, modelKey: 'photos', modelValue: [{ url: '/a.png' }, { url: '/b.png' }] } })

      getCards(wrapper)[0].props('headerProps').actionsMenuProps.list.destroy.handler()
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PvGalleryDeleteDialog' }).props()).toMatchObject({ modelKey: 'photos', payload: [{ url: '/b.png' }] })
    })

    it('com "use-object-model", ao excluir emite o model sem a imagem', async () => {
      const wrapper = await mountGallery({ props: { useDestroy: true, useObjectModel: true, modelValue: [{ url: '/a.png' }, { url: '/b.png' }] } })

      await destroyImage(wrapper, 0)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([[{ url: '/b.png' }]])
      expect(wrapper.emitted('delete-success')[0][0]).toMatchObject({ index: 0 })
    })

    // Problema listado no documento: sem "use-object-model", o model (lista de URLs) volta como lista de objetos.
    it.fails('com lista de URLs, ao excluir emite o model ainda como lista de URLs', async () => {
      const wrapper = await mountGallery({ props: { useDestroy: true, modelValue: ['/a.png', '/b.png'] } })

      await destroyImage(wrapper, 0)

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['/b.png']])
    })
  })
})
