import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasBadge from './QasBadge.vue'

// QBadge e QChip são componentes Quasar usados diretamente (não como custom elements)
// então precisamos defini-los como stubs para evitar erros de runtime do Quasar
// const quasarStubs = {
//   QBadge: {
//     name: 'QBadge',
//     template: '<span class="q-badge" v-bind="$attrs"><slot /></span>',
//     inheritAttrs: false
//   },
//   QChip: {
//     name: 'QChip',
//     template: '<div class="q-chip" v-bind="$attrs" @remove="$emit(\'remove\')"><slot /></div>',
//     inheritAttrs: false,
//     emits: ['remove']
//   }
// }

describe('QasBadge', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente sem props', () => {
      const wrapper = mountComponent(QasBadge)

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter o atributo data-table-ignore-hover', () => {
      const wrapper = mountComponent(QasBadge)

      const badge = wrapper.findComponent({ name: 'QBadge' })
      expect(badge.attributes('data-table-ignore-hover')).toBeDefined()
    })

    it('deve ter a classe "qas-badge"', () => {
      const wrapper = mountComponent(QasBadge)

      const badge = wrapper.findComponent({ name: 'QBadge' })
      expect(badge.classes()).toContain('qas-badge')
    })
  })

  describe('prop removable', () => {
    it('deve renderizar q-badge quando removable é false (padrão)', () => {
      const wrapper = mountComponent(QasBadge)

      expect(wrapper.findComponent({ name: 'QBadge' }).exists()).toBeTruthy()
      expect(wrapper.findComponent({ name: 'QChip' }).exists()).toBeFalsy()
    })

    it('deve renderizar q-chip quando removable é true', () => {
      const wrapper = mountComponent(QasBadge, { props: { removable: true } })

      const qBadge = wrapper.findComponent({ name: 'QBadge' })
      const qChip = wrapper.findComponent({ name: 'QChip' })

      expect(qChip.exists()).toBeTruthy()
      expect(qBadge.exists()).toBeFalsy()
    })
  })

  describe('prop label', () => {
    it('deve ter label vazio como padrão', () => {
      const wrapper = mountComponent(QasBadge)

      const qBadge = wrapper.findComponent({ name: 'QBadge' })
      // quando label não é passado, o valor padrão string vazia deve ser prop vazia
      expect(qBadge.props('label')).toBe('')
    })

    it('deve passar label ao componente interno', () => {
      const wrapper = mountComponent(QasBadge, { props: { label: 'Ativo' } })

      const qBadge = wrapper.findComponent({ name: 'QBadge' })
      expect(qBadge.props('label')).toBe('Ativo')
    })
  })

  describe('prop color', () => {
    it('deve usar "light-blue-2" como cor padrão', () => {
      const wrapper = mountComponent(QasBadge, { props: { color: undefined } })
      const qBadge = wrapper.findComponent({ name: 'QBadge' })
      expect(qBadge.props('color')).toBe('light-blue-2')
    })

    it('deve aplicar cor customizada', () => {
      const wrapper = mountComponent(QasBadge, {
        props: { color: 'negative' }
      })

      const qBadge = wrapper.findComponent({ name: 'QBadge' })
      expect(qBadge.props('color')).toBe('negative')
    })
  })

  describe('prop textColor', () => {
    it('deve usar "black" como textColor padrão', () => {
      const wrapper = mountComponent(QasBadge)
      const qBadge = wrapper.findComponent({ name: 'QBadge', props: { textColor: undefined } })
      expect(qBadge.props('textColor')).toBe('black')
    })
  })

  it('deve aplicar textColor customizado', () => {
    const wrapper = mountComponent(QasBadge, { props: { textColor: 'white' } })
    const qBadge = wrapper.findComponent({ name: 'QBadge' })

    expect(qBadge.props('textColor')).toBe('white')
  })
})

describe('prop multiLine', () => {
  it('deve passar multiLine para q-badge', () => {
    const wrapper = mountComponent(QasBadge)
    const qBadge = wrapper.findComponent({ name: 'QBadge' })
    expect(qBadge.props('multiLine')).toBeDefined()
  })
})

describe('evento remove', () => {
  it('deve emitir "remove" ao remover chip', async () => {
    const wrapper = mountComponent(QasBadge, { props: { removable: true } })

    await wrapper.findComponent({ name: 'QChip' }).vm.$emit('remove')

    expect(wrapper.emitted('remove')).toBeTruthy()
  })
})

describe('slot default', () => {
  it('deve renderizar conteúdo no slot default', () => {
    const wrapper = mountComponent(QasBadge, { slots: { default: '<span class="slot-content">x</span>' } })

    expect(wrapper.find('.slot-content').exists()).toBeTruthy()
  })
})
