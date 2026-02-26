import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasDialog from './QasDialog.vue'

const QasActionsStub = {
  template: '<div class="qas-actions-stub"><slot name="primary" /><slot name="secondary" /></div>'
}

const stubs = { QasActions: QasActionsStub }

describe('QasDialog', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter o atributo data-cy="dialog"', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog"]').exists()).toBeTruthy()
    })
  })

  describe('prop card', () => {
    it('deve renderizar o título do card quando card.title é fornecido', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { card: { title: 'Confirmar' }, ok: false, cancel: false },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-title"]').exists()).toBeTruthy()
    })

    it('não deve exibir o header quando card.title está vazio', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { card: {} },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-title"]').exists()).toBeFalsy()
    })
  })

  describe('prop ok', () => {
    it('deve exibir o botão ok por padrão (ok = {})', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-ok-btn"]').exists()).toBeTruthy()
    })

    it('deve exibir o botão ok com label customizado', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { ok: { label: 'Confirmar' } },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-ok-btn"]').exists()).toBeTruthy()
    })

    it('não deve exibir o botão ok quando ok é false', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { ok: false },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-ok-btn"]').exists()).toBeFalsy()
    })
  })

  describe('prop cancel', () => {
    it('deve exibir o botão cancelar por padrão (cancel = {})', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-cancel-btn"]').exists()).toBeTruthy()
    })

    it('deve exibir o botão cancelar com label customizado', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { cancel: { label: 'Cancelar' } },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-cancel-btn"]').exists()).toBeTruthy()
    })

    it('não deve exibir o botão cancelar quando cancel é false', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { cancel: false },
        global: { stubs }
      })

      expect(wrapper.find('[data-cy="dialog-cancel-btn"]').exists()).toBeFalsy()
    })
  })

  describe('prop maxWidth', () => {
    it('deve aplicar maxWidth ao estilo do container interno', () => {
      const wrapper = mountComponent(QasDialog, {
        props: { maxWidth: '600px' },
        global: { stubs }
      })

      const contentDiv = wrapper.find('.bg-white')
      expect(contentDiv.attributes('style')).toContain('max-width: 600px')
    })

    it('deve usar maxWidth padrão de 470px quando não informado', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      const contentDiv = wrapper.find('.bg-white')
      expect(contentDiv.attributes('style')).toContain('max-width: 470px')
    })
  })

  describe('slot header', () => {
    it('deve renderizar conteúdo customizado no slot header', () => {
      const wrapper = mountComponent(QasDialog, {
        slots: { header: '<div class="header-customizado">Cabeçalho personalizado</div>' },
        global: { stubs }
      })

      expect(wrapper.find('.header-customizado').exists()).toBeTruthy()
      expect(wrapper.find('.header-customizado').text()).toBe('Cabeçalho personalizado')
    })
  })

  describe('slot description', () => {
    it('deve renderizar conteúdo customizado no slot description', () => {
      const wrapper = mountComponent(QasDialog, {
        slots: { description: '<p class="desc-customizada">Descrição personalizada</p>' },
        global: { stubs }
      })

      expect(wrapper.find('.desc-customizada').exists()).toBeTruthy()
      expect(wrapper.find('.desc-customizada').text()).toBe('Descrição personalizada')
    })
  })

  describe('slot actions', () => {
    it('deve renderizar conteúdo customizado no slot actions', () => {
      const wrapper = mountComponent(QasDialog, {
        slots: { actions: '<div class="acoes-customizadas">Ações</div>' },
        global: { stubs }
      })

      expect(wrapper.find('.acoes-customizadas').exists()).toBeTruthy()
    })
  })

  describe('provide isDialog', () => {
    it('deve renderizar sem erros (provide isDialog = true aplicado internamente)', () => {
      const wrapper = mountComponent(QasDialog, {
        global: { stubs }
      })

      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
