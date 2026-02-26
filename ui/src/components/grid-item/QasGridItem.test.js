import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasGridItem from './QasGridItem.vue'

const QasTipStub = {
  name: 'QasTip',
  template: '<div class="qas-tip-stub" />',
  props: ['text']
}

const defaultGlobal = {
  stubs: { QasTip: QasTipStub }
}

describe('QasGridItem', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasGridItem, {
        global: defaultGlobal
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('não deve exibir qas-tip quando tip não é fornecido', () => {
      const wrapper = mountComponent(QasGridItem, {
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-tip-stub').exists()).toBeFalsy()
    })
  })

  describe('prop label', () => {
    it('deve exibir o texto do label', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { label: 'Nome' },
        global: defaultGlobal
      })

      expect(wrapper.text()).toContain('Nome')
    })
  })

  describe('prop value', () => {
    it('deve exibir o texto do value', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { value: 'João' },
        global: defaultGlobal
      })

      expect(wrapper.text()).toContain('João')
    })
  })

  describe('prop tip', () => {
    it('deve renderizar o qas-tip quando tip é fornecido', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { tip: 'Dica importante' },
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-tip-stub').exists()).toBeTruthy()
    })

    it('deve repassar o texto ao qas-tip', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { tip: 'Dica importante' },
        global: defaultGlobal
      })

      expect(wrapper.findComponent({ name: 'QasTip' }).props('text')).toBe('Dica importante')
    })
  })

  describe('prop useInline', () => {
    it('deve aplicar classe de layout flex no container quando useInline é true', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { useInline: true },
        global: defaultGlobal
      })

      expect(wrapper.classes()).toContain('flex')
      expect(wrapper.classes()).toContain('justify-between')
    })

    it('não deve aplicar classe flex no container quando useInline é false', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { useInline: false },
        global: defaultGlobal
      })

      expect(wrapper.classes()).not.toContain('flex')
    })

    it('deve aplicar classe "text-body1" no header quando useInline é true', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { useInline: true },
        global: defaultGlobal
      })

      expect(wrapper.find('header').classes()).toContain('text-body1')
    })

    it('deve aplicar classe "text-caption" no header quando useInline é false (padrão)', () => {
      const wrapper = mountComponent(QasGridItem, {
        global: defaultGlobal
      })

      expect(wrapper.find('header').classes()).toContain('text-caption')
    })
  })

  describe('prop useEllipsis', () => {
    it('deve aplicar a classe "ellipsis" no conteúdo com useEllipsis true por padrão (desktop)', () => {
      const wrapper = mountComponent(QasGridItem, {
        global: defaultGlobal
      })

      const content = wrapper.find('[class*="text-grey-10"]')

      expect(content.classes()).toContain('ellipsis')
    })

    it('não deve aplicar a classe "ellipsis" quando useEllipsis é false', () => {
      const wrapper = mountComponent(QasGridItem, {
        props: { useEllipsis: false },
        global: defaultGlobal
      })

      const content = wrapper.find('[class*="text-grey-10"]')

      expect(content.classes()).not.toContain('ellipsis')
    })
  })

  describe('slot header', () => {
    it('deve renderizar conteúdo customizado no slot header', () => {
      const wrapper = mountComponent(QasGridItem, {
        slots: { header: '<div class="custom-header">Header Customizado</div>' },
        global: defaultGlobal
      })

      expect(wrapper.find('.custom-header').exists()).toBeTruthy()
      expect(wrapper.find('.custom-header').text()).toBe('Header Customizado')
    })
  })

  describe('slot content', () => {
    it('deve renderizar conteúdo customizado no slot content', () => {
      const wrapper = mountComponent(QasGridItem, {
        slots: { content: '<span class="custom-content">Conteúdo</span>' },
        global: defaultGlobal
      })

      expect(wrapper.find('.custom-content').exists()).toBeTruthy()
      expect(wrapper.find('.custom-content').text()).toBe('Conteúdo')
    })
  })
})
