import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasBtn from './QasBtn.vue'

// QasBtn.vue tem um comentário HTML antes do <q-btn> no template, criando um
// fragmento Vue onde wrapper.element aponta para o nó comentário (sem classes).
// Por isso, usamos getBtnEl(wrapper) para encontrar o elemento raiz real via
// seu atributo estático.  O stub explícito para QBtn garante que attrs
// (classe, data-*) sejam repassados ao elemento raiz do stub via inheritAttrs.
function mountBtn (options = {}) {
  return mountComponent(QasBtn, options)
}

/** Retorna o wrapper do elemento raiz real do QasBtn (elemento com classe qas-btn) */
function getBtnEl (wrapper) {
  return wrapper.find('[data-table-ignore-tr-hover]')
}

describe('QasBtn', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountBtn()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-btn"', () => {
      const wrapper = mountBtn()

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn')
    })

    it('deve ter o atributo "data-table-ignore-tr-hover"', () => {
      const wrapper = mountBtn()

      expect(getBtnEl(wrapper).attributes('data-table-ignore-tr-hover')).toBeDefined()
    })
  })

  describe('prop variant', () => {
    it('deve adicionar a classe "qas-btn--primary" quando variant é "primary"', () => {
      const wrapper = mountBtn({ props: { variant: 'primary' } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--primary')
    })

    it('deve adicionar a classe "qas-btn--secondary" quando variant é "secondary"', () => {
      const wrapper = mountBtn({ props: { variant: 'secondary' } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--secondary')
    })

    it('deve adicionar a classe "qas-btn--tertiary" quando variant é "tertiary"', () => {
      const wrapper = mountBtn({ props: { variant: 'tertiary' } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--tertiary')
    })

    it('deve usar "tertiary" como variant padrão (via btnPropsDefaults)', () => {
      const wrapper = mountBtn()

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--tertiary')
    })
  })

  describe('prop label', () => {
    it('deve exibir o texto do label quando fornecido', () => {
      const wrapper = mountBtn({ props: { label: 'Salvar' } })

      expect(wrapper.text()).toContain('Salvar')
    })

    it('não deve exibir texto quando label não é fornecido', () => {
      const wrapper = mountBtn()

      expect(wrapper.text()).toBe('')
    })
  })

  describe('prop icon', () => {
    it('deve renderizar q-icon quando icon é fornecido', () => {
      const wrapper = mountBtn({ props: { icon: 'home' } })

      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })

    it('deve passar o nome correto ao q-icon', () => {
      const wrapper = mountBtn({ props: { icon: 'home' } })

      expect(wrapper.find('q-icon').attributes('name')).toBe('home')
    })

    it('não deve renderizar q-icon quando icon não é fornecido', () => {
      const wrapper = mountBtn()

      expect(wrapper.find('q-icon').exists()).toBeFalsy()
    })
  })

  describe('prop iconRight', () => {
    it('deve renderizar q-icon à direita quando iconRight é fornecido', () => {
      const wrapper = mountBtn({ props: { iconRight: 'close' } })

      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })

    it('deve passar o nome correto ao q-icon right', () => {
      const wrapper = mountBtn({ props: { iconRight: 'close' } })

      expect(wrapper.find('q-icon').attributes('name')).toBe('close')
    })
  })

  describe('prop skeleton', () => {
    it('não deve renderizar o skeleton por padrão', () => {
      const wrapper = mountBtn()

      expect(wrapper.findComponent({ name: 'QasSkeleton' }).exists()).toBeFalsy()
    })

    it('deve renderizar o skeleton quando skeleton é true', () => {
      const wrapper = mountBtn({ props: { skeleton: true } })

      expect(wrapper.findComponent({ name: 'QasSkeleton' }).exists()).toBeTruthy()
    })
  })

  describe('prop tooltip', () => {
    it('não deve renderizar o tooltip por padrão', () => {
      const wrapper = mountBtn()

      expect(wrapper.findComponent({ name: 'QasTooltip' }).exists()).toBeFalsy()
    })

    it('deve renderizar o tooltip quando tooltip é fornecido', () => {
      const wrapper = mountBtn({ props: { tooltip: 'Dica do botão' } })

      expect(wrapper.findComponent({ name: 'QasTooltip' }).exists()).toBeTruthy()
    })
  })

  describe('prop disable + disabledTooltip', () => {
    it('deve renderizar o tooltip quando disable é true e disabledTooltip é fornecido', () => {
      const wrapper = mountBtn({
        props: { disable: true, disabledTooltip: 'Desabilitado' }
      })

      expect(wrapper.findComponent({ name: 'QasTooltip' }).exists()).toBeTruthy()
    })

    it('não deve renderizar tooltip de desabilitado quando disable é false', () => {
      const wrapper = mountBtn({
        props: { disable: false, disabledTooltip: 'Desabilitado' }
      })

      expect(wrapper.findComponent({ name: 'QasTooltip' }).exists()).toBeFalsy()
    })
  })

  describe('prop loading', () => {
    it('deve adicionar a classe "qas-btn--loading" quando loading é true', () => {
      const wrapper = mountBtn({ props: { loading: true } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--loading')
    })

    it('não deve adicionar "qas-btn--loading" por padrão', () => {
      const wrapper = mountBtn()

      expect(getBtnEl(wrapper).classes()).not.toContain('qas-btn--loading')
    })
  })

  describe('prop size', () => {
    it('deve adicionar a classe "qas-btn--sm" quando size é "sm"', () => {
      const wrapper = mountBtn({ props: { size: 'sm' } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--sm')
    })

    it('deve adicionar a classe "qas-btn--md" quando size é "md"', () => {
      const wrapper = mountBtn({ props: { size: 'md' } })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--md')
    })
  })

  describe('inject btnPropsDefaults', () => {
    it('deve usar a variant injetada quando não há prop variant', () => {
      const wrapper = mountBtn({
        global: {
          provide: { btnPropsDefaults: { variant: 'primary' } }
        }
      })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--primary')
    })

    it('deve priorizar a prop variant sobre o inject', () => {
      const wrapper = mountBtn({
        props: { variant: 'secondary' },
        global: {
          provide: { btnPropsDefaults: { variant: 'primary' } }
        }
      })

      expect(getBtnEl(wrapper).classes()).toContain('qas-btn--secondary')
      expect(getBtnEl(wrapper).classes()).not.toContain('qas-btn--primary')
    })
  })

  describe('slot default', () => {
    it('deve renderizar o conteúdo do slot default', () => {
      const wrapper = mountBtn({
        slots: { default: '<span class="slot-content">conteúdo extra</span>' }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
    })
  })
})
