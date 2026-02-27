import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountComponent } from '@test-utils'
import { useRouter, useRoute } from 'vue-router'
import QasPageHeader from './QasPageHeader.vue'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn()
}))

function mountPageHeader (options = {}) {
  return mountComponent(QasPageHeader, {
    ...options,
    global: {
      ...(options.global || {})
    }
  })
}

beforeEach(() => {
  vi.mocked(useRoute).mockReturnValue({
    name: 'home',
    params: {},
    query: {},
    meta: {},
    fullPath: '/',
    path: '/'
  })

  vi.mocked(useRouter).mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: { value: { name: 'home', params: {}, query: {}, meta: {} } },
    hasRoute: vi.fn(() => false)
  })
})

describe('QasPageHeader', () => {
  describe('renderização básica', () => {
    it('deve renderizar sem erros com as props padrão', () => {
      const wrapper = mountPageHeader()

      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop title', () => {
    it('deve exibir o título passado como prop', () => {
      const wrapper = mountPageHeader({
        props: { title: 'Meu Título' }
      })

      expect(wrapper.text()).toContain('Meu Título')
    })

    it('não deve renderizar o toolbar title quando title não é fornecido', () => {
      const wrapper = mountPageHeader()

      expect(wrapper.find('.text-h3').exists()).toBeFalsy()
    })
  })

  describe('prop useBreadcrumbs', () => {
    it('não deve renderizar breadcrumbs quando useBreadcrumbs=false', () => {
      const wrapper = mountPageHeader({
        props: {
          useBreadcrumbs: false,
          breadcrumbs: ['Início', 'Listagem']
        }
      })

      expect(wrapper.find('.q-breadcrumbs').exists()).toBeFalsy()
    })

    it('deve renderizar breadcrumbs quando useBreadcrumbs=true (padrão)', () => {
      const wrapper = mountPageHeader({
        props: {
          breadcrumbs: ['Início', 'Listagem'],
          useHomeIcon: false
        }
      })

      // QBreadcrumbs renderiza os labels no DOM
      expect(wrapper.text()).toContain('Início')
      expect(wrapper.text()).toContain('Listagem')
    })
  })

  describe('prop useHomeIcon', () => {
    it('deve renderizar o ícone home por padrão', () => {
      const wrapper = mountPageHeader({
        props: { breadcrumbs: ['Listagem'] }
      })

      expect(wrapper.html()).toContain('sym_r_home')
    })

    it('não deve renderizar o ícone home quando useHomeIcon=false', () => {
      const wrapper = mountPageHeader({
        props: {
          breadcrumbs: ['Listagem'],
          useHomeIcon: false
        }
      })

      const breadcrumbsEl = wrapper.findAll('.qas-page-header__breadcrumbs-el')
      const hasHomeIcon = breadcrumbsEl.some(el => el.html().includes('sym_r_home'))
      expect(hasHomeIcon).toBeFalsy()
    })
  })

  describe('prop breadcrumbs', () => {
    it('deve renderizar os labels dos breadcrumbs passados como array', () => {
      const wrapper = mountPageHeader({
        props: {
          breadcrumbs: ['Início', 'Listagem', 'Detalhe'],
          useHomeIcon: false
        }
      })

      expect(wrapper.text()).toContain('Início')
      expect(wrapper.text()).toContain('Listagem')
      expect(wrapper.text()).toContain('Detalhe')
    })
  })

  describe('prop skeleton', () => {
    it('deve renderizar QasSkeleton quando skeleton=true e title é fornecido', () => {
      const wrapper = mountPageHeader({
        props: { skeleton: true, title: 'Carregando...' }
      })

      expect(wrapper.findComponent({ name: 'QasSkeleton' }).exists()).toBeTruthy()
    })
  })

  describe('prop headerProps', () => {
    it('deve renderizar QasHeader quando headerProps é fornecido', () => {
      const wrapper = mountPageHeader({
        props: { headerProps: { labelProps: { label: 'Cabeçalho' } } }
      })

      expect(wrapper.findComponent({ name: 'QasHeader' }).exists()).toBeTruthy()
    })

    it('não deve renderizar QasHeader quando headerProps está vazio', () => {
      const wrapper = mountPageHeader({
        props: { headerProps: {} }
      })

      expect(wrapper.findComponent({ name: 'QasHeader' }).exists()).toBeFalsy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo personalizado no slot default', () => {
      const wrapper = mountPageHeader({
        slots: { default: '<button class="custom-slot-action">Ação</button>' }
      })

      expect(wrapper.find('.custom-slot-action').exists()).toBeTruthy()
    })
  })
})
