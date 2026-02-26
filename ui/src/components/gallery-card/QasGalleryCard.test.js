import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasGalleryCard from './QasGalleryCard.vue'

const additionalStubs = {
  QasBox: { template: '<div class="qas-box-stub"><slot /></div>' },
  QasHeader: { template: '<div class="qas-header-stub" />' },
  QasGridGenerator: { template: '<div class="qas-grid-generator-stub" />' },
  QVideo: { template: '<div class="q-video-stub" />' },
  'q-video': { template: '<div class="q-video-stub" />' },
  QImg: { template: '<div class="q-img-stub" />', props: ['src', 'height'] },
  'q-img': { template: '<div class="q-img-stub" />', props: ['src', 'height'] }
}

function mountGalleryCard (options = {}) {
  return mountComponent(QasGalleryCard, {
    ...options,
    global: {
      ...(options.global || {}),
      stubs: {
        ...additionalStubs,
        ...(options.global?.stubs || {})
      }
    }
  })
}

describe('QasGalleryCard', () => {
  describe('renderização básica', () => {
    it('deve renderizar sem erros e sem props', () => {
      const wrapper = mountGalleryCard()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o QasBox como contêiner raiz', () => {
      const wrapper = mountGalleryCard()

      expect(wrapper.find('.qas-box-stub').exists()).toBeTruthy()
    })
  })

  describe('prop url', () => {
    it('deve renderizar q-img com a url fornecida', () => {
      const url = 'https://example.com/imagem.jpg'

      const wrapper = mountGalleryCard({
        props: { url }
      })

      expect(wrapper.find('.q-img-stub').exists()).toBeTruthy()
    })
  })

  describe('prop disable', () => {
    it('deve aplicar classe text-grey-6 quando disable=true', () => {
      const wrapper = mountGalleryCard({
        props: { disable: true }
      })

      expect(wrapper.find('.qas-box-stub').classes()).toContain('text-grey-6')
    })

    it('não deve aplicar classe text-grey-6 quando disable não é fornecido', () => {
      const wrapper = mountGalleryCard()

      expect(wrapper.find('.qas-box-stub').classes()).not.toContain('text-grey-6')
    })
  })

  describe('prop useVideo', () => {
    it('deve renderizar a seção de vídeo quando useVideo=true', () => {
      const wrapper = mountGalleryCard({
        props: { useVideo: true, url: 'https://example.com/video.mp4' }
      })

      // O div wrapper .rounded-borders é renderizado quando useVideo=true
      expect(wrapper.find('.rounded-borders').exists()).toBeTruthy()
    })

    it('não deve renderizar a seção de vídeo quando useVideo=false', () => {
      const wrapper = mountGalleryCard({
        props: { useVideo: false }
      })

      expect(wrapper.find('.q-video-stub').exists()).toBeFalsy()
    })

    it('deve renderizar a imagem quando useVideo não é fornecido', () => {
      const wrapper = mountGalleryCard({
        props: { url: 'https://example.com/img.png' }
      })

      expect(wrapper.find('.q-img-stub').exists()).toBeTruthy()
    })
  })

  describe('prop headerProps', () => {
    it('deve renderizar QasHeader quando headerProps contém labelProps com label', () => {
      const wrapper = mountGalleryCard({
        props: { headerProps: { labelProps: { label: 'Título do card' } } }
      })

      expect(wrapper.find('.qas-header-stub').exists()).toBeTruthy()
    })

    it('não deve renderizar QasHeader quando headerProps está vazio', () => {
      const wrapper = mountGalleryCard()

      expect(wrapper.find('.qas-header-stub').exists()).toBeFalsy()
    })
  })

  describe('slot bottom', () => {
    it('deve renderizar conteúdo personalizado no slot bottom', () => {
      const wrapper = mountGalleryCard({
        slots: { bottom: '<p class="custom-bottom">Conteúdo inferior</p>' }
      })

      expect(wrapper.find('.custom-bottom').exists()).toBeTruthy()
    })
  })

  describe('slot video', () => {
    it('deve renderizar conteúdo personalizado no slot video quando useVideo=true', () => {
      const wrapper = mountGalleryCard({
        props: { useVideo: true },
        slots: { video: '<video class="custom-video" />' }
      })

      expect(wrapper.find('.custom-video').exists()).toBeTruthy()
      expect(wrapper.find('.q-video-stub').exists()).toBeFalsy()
    })
  })
})
