import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasHeader from './QasHeader.vue'

const additionalStubs = {
  QasActionsMenu: { template: '<div class="qas-actions-menu-stub" />' },
  QasBadge: { template: '<div class="qas-badge-stub" />' },
  QasTip: { template: '<div class="qas-tip-stub" />' },
  QasFilters: { template: '<div class="qas-filters-stub" />' }
}

function mountHeader (options = {}) {
  return mountComponent(QasHeader, {
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

describe('QasHeader', () => {
  describe('renderização básica', () => {
    it('não deve renderizar conteúdo quando nenhuma prop de conteúdo é fornecida', () => {
      const wrapper = mountHeader()

      expect(wrapper.find('div').exists()).toBeFalsy()
    })
  })

  describe('prop labelProps', () => {
    it('deve renderizar QasLabel quando labelProps é fornecido', () => {
      const wrapper = mountHeader({
        props: { labelProps: { label: 'Título' } }
      })

      expect(wrapper.find('.qas-label-stub').exists()).toBeTruthy()
    })
  })

  describe('prop description', () => {
    it('deve exibir o texto da descrição', () => {
      const wrapper = mountHeader({
        props: { description: 'Texto da descrição' }
      })

      expect(wrapper.text()).toContain('Texto da descrição')
    })
  })

  describe('prop skeleton', () => {
    it('deve renderizar QasSkeleton quando skeleton=true com labelProps', () => {
      const wrapper = mountHeader({
        props: { skeleton: true, labelProps: { label: 'Título' } }
      })

      expect(wrapper.find('.qas-skeleton-stub').exists()).toBeTruthy()
    })
  })

  describe('prop spacing', () => {
    it('deve aplicar classe q-mb-md por padrão', () => {
      const wrapper = mountHeader({
        props: { labelProps: { label: 'Título' } }
      })

      expect(wrapper.classes()).toContain('q-mb-md')
    })

    it('deve aplicar classe q-mb-lg quando spacing="lg"', () => {
      const wrapper = mountHeader({
        props: { spacing: 'lg', labelProps: { label: 'Título' } }
      })

      expect(wrapper.classes()).toContain('q-mb-lg')
    })

    it('deve aplicar classe q-mb-sm quando spacing="sm"', () => {
      const wrapper = mountHeader({
        props: { spacing: 'sm', labelProps: { label: 'Título' } }
      })

      expect(wrapper.classes()).toContain('q-mb-sm')
    })
  })

  describe('prop buttonProps', () => {
    it('deve renderizar QasBtn quando buttonProps é fornecido', () => {
      const wrapper = mountHeader({
        props: { buttonProps: { label: 'Salvar' } }
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('prop actionsMenuProps', () => {
    it('deve renderizar QasActionsMenu quando actionsMenuProps é fornecido', () => {
      const wrapper = mountHeader({
        props: { actionsMenuProps: { list: { edit: { label: 'Editar' } } } }
      })

      expect(wrapper.find('.qas-actions-menu-stub').exists()).toBeTruthy()
    })
  })

  describe('slot label', () => {
    it('deve renderizar conteúdo personalizado no slot label', () => {
      const wrapper = mountHeader({
        props: { labelProps: { label: 'Título' } },
        slots: { label: '<span class="custom-label">Label customizado</span>' }
      })

      expect(wrapper.find('.custom-label').exists()).toBeTruthy()
      expect(wrapper.find('.custom-label').text()).toBe('Label customizado')
    })
  })

  describe('slot description', () => {
    it('deve renderizar conteúdo personalizado no slot description', () => {
      const wrapper = mountHeader({
        props: { description: 'Desc' },
        slots: { description: '<p class="custom-desc">Descrição customizada</p>' }
      })

      expect(wrapper.find('.custom-desc').exists()).toBeTruthy()
    })
  })

  describe('slot actions', () => {
    it('deve renderizar conteúdo personalizado no slot actions', () => {
      const wrapper = mountHeader({
        props: { labelProps: { label: 'Título' } },
        slots: { actions: '<button class="custom-action">Ação</button>' }
      })

      expect(wrapper.find('.custom-action').exists()).toBeTruthy()
    })
  })
})
