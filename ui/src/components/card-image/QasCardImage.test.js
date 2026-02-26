import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'

import QasCardImage from './QasCardImage.vue'

/** Stubs para componentes Quasar não registrados globalmente nos testes */
const baseStubs = {
  QCard: { template: '<div class="q-card-stub"><slot /></div>' },
  QCardSection: { template: '<div class="q-card-section-stub"><slot /></div>' },
  QCarousel: { template: '<div class="q-carousel-stub"><slot /></div>' },
  QCarouselSlide: { template: '<div class="q-carousel-slide-stub" />', props: ['name', 'imgSrc'] },
  'q-card': { template: '<div class="q-card-stub"><slot /></div>' },
  'q-card-section': { template: '<div class="q-card-section-stub"><slot /></div>' },
  'q-carousel': { template: '<div class="q-carousel-stub"><slot /></div>' },
  'q-carousel-slide': { template: '<div class="q-carousel-slide-stub" />', props: ['name', 'img-src'] }
}

function mount (props = {}, slots = {}) {
  return mountComponent(QasCardImage, {
    props,
    slots,
    global: { stubs: baseStubs }
  })
}

describe('QasCardImage', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mount()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o card container', () => {
      const wrapper = mount()
      expect(wrapper.find('q-card').exists()).toBeTruthy()
    })
  })

  describe('prop useHeader', () => {
    it('deve renderizar o header quando useHeader é true', () => {
      const wrapper = mount({ useHeader: true })
      expect(wrapper.find('header').exists()).toBeTruthy()
    })

    it('não deve renderizar o header quando useHeader é false (padrão)', () => {
      const wrapper = mount()
      expect(wrapper.find('header').exists()).toBeFalsy()
    })
  })

  describe('prop outlined', () => {
    it('deve adicionar classes border-primary, no-shadow e bg-white quando outlined é true', () => {
      const wrapper = mount({ outlined: true })
      const card = wrapper.find('q-card')
      expect(card.classes()).toContain('border-primary')
      expect(card.classes()).toContain('no-shadow')
      expect(card.classes()).toContain('bg-white')
    })

    it('não deve adicionar classes de outlined por padrão', () => {
      const wrapper = mount()
      const card = wrapper.find('q-card')
      expect(card.classes()).not.toContain('border-primary')
      expect(card.classes()).not.toContain('no-shadow')
    })
  })

  describe('prop unelevated', () => {
    it('não deve ter classe shadow-2 quando unelevated é true', () => {
      const wrapper = mount({ unelevated: true })
      expect(wrapper.find('q-card').classes()).not.toContain('shadow-2')
    })

    it('deve ter classe shadow-2 quando unelevated é false (padrão)', () => {
      const wrapper = mount()
      expect(wrapper.find('q-card').classes()).toContain('shadow-2')
    })
  })

  describe('prop gutter', () => {
    it('deve aplicar classe q-col-gutter-lg quando gutter é "lg"', () => {
      const wrapper = mount({ gutter: 'lg' })
      expect(wrapper.find('.q-col-gutter-lg').exists()).toBeTruthy()
    })

    it('deve aplicar classe q-col-gutter-sm por padrão', () => {
      const wrapper = mount()
      expect(wrapper.find('.q-col-gutter-sm').exists()).toBeTruthy()
    })
  })

  describe('prop images', () => {
    it('deve renderizar no máximo 3 slides mesmo que images tenha mais de 3 itens', () => {
      const wrapper = mount({ useHeader: true, images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'] })
      expect(wrapper.findAll('q-carousel-slide').length).toBe(3)
    })

    it('deve renderizar corretamente quando images tem menos de 3 itens', () => {
      const wrapper = mount({ useHeader: true, images: ['a.jpg', 'b.jpg'] })
      expect(wrapper.findAll('q-carousel-slide').length).toBe(2)
    })
  })

  describe('prop skeleton', () => {
    it('deve renderizar QasSkeleton quando skeleton é true', () => {
      const wrapper = mount({ skeleton: true })
      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeTruthy()
    })

    it('não deve renderizar QasSkeleton quando skeleton é false (padrão)', () => {
      const wrapper = mount()
      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeFalsy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot default', () => {
      const wrapper = mountComponent(QasCardImage, {
        slots: { default: '<p class="card-content">Conteúdo do card</p>' },
        global: { stubs: baseStubs }
      })
      expect(wrapper.find('.card-content').exists()).toBeTruthy()
      expect(wrapper.text()).toContain('Conteúdo do card')
    })
  })

  describe('slot actions', () => {
    it('deve renderizar a seção de actions quando o slot actions é fornecido', () => {
      const wrapper = mountComponent(QasCardImage, {
        slots: { actions: '<button class="action-btn">Ação</button>' },
        global: { stubs: baseStubs }
      })
      expect(wrapper.find('.action-btn').exists()).toBeTruthy()
    })

    it('não deve renderizar a seção de actions quando o slot não é fornecido', () => {
      const wrapper = mount()
      expect(wrapper.find('.action-btn').exists()).toBeFalsy()
    })
  })

  describe('slot carousel-header', () => {
    it('deve renderizar conteúdo do slot carousel-header dentro do header', () => {
      const wrapper = mount(
        { useHeader: true },
        { 'carousel-header': '<span class="carousel-header-content">Topo do carousel</span>' }
      )
      expect(wrapper.find('.carousel-header-content').exists()).toBeTruthy()
    })
  })
})
