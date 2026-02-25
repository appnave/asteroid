import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasBadge from './QasBadge.vue'

// QBadge e QChip são componentes Quasar usados diretamente (não como custom elements)
// então precisamos defini-los como stubs para evitar erros de runtime do Quasar
const quasarStubs = {
  QBadge: {
    name: 'QBadge',
    template: '<span class="q-badge" v-bind="$attrs"><slot /></span>',
    inheritAttrs: false
  },
  QChip: {
    name: 'QChip',
    template: '<div class="q-chip" v-bind="$attrs" @remove="$emit(\'remove\')"><slot /></div>',
    inheritAttrs: false,
    emits: ['remove']
  }
}

describe('QasBadge', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter o atributo data-table-ignore-hover', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('data-table-ignore-hover')).toBeDefined()
    })

    it('deve ter a classe "qas-badge"', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').classes()).toContain('qas-badge')
    })
  })

  describe('prop removable', () => {
    it('deve renderizar q-badge quando removable é false (padrão)', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').exists()).toBeTruthy()
      expect(wrapper.find('.q-chip').exists()).toBeFalsy()
    })

    it('deve renderizar q-chip quando removable é true', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { removable: true },
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-chip').exists()).toBeTruthy()
      expect(wrapper.find('.q-badge').exists()).toBeFalsy()
    })
  })

  describe('prop label', () => {
    it('deve ter label vazio como padrão', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      const badge = wrapper.find('.q-badge')
      // quando label não é passado, o valor padrão string vazia é vinculado como atributo vazio
      expect(badge.attributes('label')).toBeFalsy()
    })

    it('deve passar label ao componente interno', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { label: 'Ativo' },
        global: { stubs: quasarStubs }
      })

      const badge = wrapper.find('.q-badge')
      expect(badge.attributes('label')).toBe('Ativo')
    })
  })

  describe('prop color', () => {
    it('deve usar "light-blue-2" como cor padrão', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('color')).toBe('light-blue-2')
    })

    it('deve aplicar cor customizada', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { color: 'negative' },
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('color')).toBe('negative')
    })
  })

  describe('prop textColor', () => {
    it('deve usar "black" como textColor padrão', () => {
      const wrapper = mountComponent(QasBadge, {
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('textcolor')).toBe('black')
    })

    it('deve aplicar textColor customizado', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { textColor: 'white' },
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('textcolor')).toBe('white')
    })
  })

  describe('prop multiLine', () => {
    it('deve passar multiLine para q-badge', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { multiLine: true },
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.q-badge').attributes('multiline')).toBeDefined()
    })
  })

  describe('evento remove', () => {
    it('deve emitir "remove" ao remover chip', async () => {
      const wrapper = mountComponent(QasBadge, {
        props: { removable: true },
        global: { stubs: quasarStubs }
      })

      await wrapper.find('.q-chip').trigger('remove')

      expect(wrapper.emitted('remove')).toBeTruthy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo no slot default', () => {
      const wrapper = mountComponent(QasBadge, {
        slots: { default: '<span class="slot-content">Teste</span>' },
        global: { stubs: quasarStubs }
      })

      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
    })
  })
})
