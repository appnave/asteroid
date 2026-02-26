import { describe, it, expect } from 'vitest'
import { mountComponent } from '@test-utils'
import QasListItems from './QasListItems.vue'

const QasBoxStub = {
  name: 'QasBox',
  template: '<div class="qas-box-stub"><slot /></div>'
}

const defaultGlobal = {
  stubs: {
    QasBox: QasBoxStub,
    QasLabel: {
      name: 'QasLabel',
      template: '<div class="qas-label-stub">{{ label }}</div>',
      props: ['label', 'margin', 'typography']
    }
  }
}

const sampleList = [
  { label: 'Item 1', description: 'Descrição 1' },
  { label: 'Item 2', description: 'Descrição 2' }
]

describe('QasListItems', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com uma lista de itens', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-list-items"', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      expect(wrapper.classes()).toContain('qas-list-items')
    })
  })

  describe('prop list', () => {
    it('deve renderizar o número correto de q-item para a lista fornecida', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      const items = wrapper.findAll('q-item')

      expect(items).toHaveLength(2)
    })
  })

  describe('prop labelKey', () => {
    it('deve usar a chave customizada para exibir o label', () => {
      const list = [{ name: 'Produto A' }, { name: 'Produto B' }]

      const wrapper = mountComponent(QasListItems, {
        props: { list, labelKey: 'name' },
        global: defaultGlobal
      })

      expect(wrapper.text()).toContain('Produto A')
      expect(wrapper.text()).toContain('Produto B')
    })
  })

  describe('prop descriptionKey', () => {
    it('deve usar a chave customizada para exibir a descrição', () => {
      const list = [{ label: 'Item', text: 'Texto descritivo' }]

      const wrapper = mountComponent(QasListItems, {
        props: { list, descriptionKey: 'text' },
        global: defaultGlobal
      })

      expect(wrapper.text()).toContain('Texto descritivo')
    })
  })

  describe('prop useSectionActions', () => {
    it('deve exibir o botão de ação por item quando useSectionActions é true (padrão)', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      const actionButtons = wrapper.findAll('.qas-btn-stub')

      expect(actionButtons).toHaveLength(sampleList.length)
    })

    it('não deve exibir botão de ação quando useSectionActions é false', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList, useSectionActions: false },
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-btn-stub').exists()).toBeFalsy()
    })
  })

  describe('prop useClickableItem', () => {
    it('deve tornar o q-item clicável quando useClickableItem é true', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList, useClickableItem: true },
        global: defaultGlobal
      })

      const items = wrapper.findAllComponents({ name: 'QItem' })

      items.forEach(item => {
        expect(item.props('clickable')).toBe(true)
      })
    })

    it('não deve ter q-item clicável por padrão', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      const items = wrapper.findAllComponents({ name: 'QItem' })

      items.forEach(item => {
        expect(item.props('clickable')).toBeFalsy()
      })
    })
  })

  describe('emissão do evento click-item', () => {
    it('deve emitir "click-item" ao clicar no botão de ação (useClickableItem false)', async () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      await wrapper.findAll('.qas-btn-stub')[0].trigger('click')

      expect(wrapper.emitted('click-item')).toBeTruthy()
    })

    it('deve emitir "click-item" com item e index corretos ao clicar no botão de ação', async () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      await wrapper.findAll('.qas-btn-stub')[1].trigger('click')

      const emitted = wrapper.emitted('click-item')

      expect(emitted[0][0]).toMatchObject({ item: sampleList[1], index: 1 })
    })

    it('deve emitir "click-item" ao clicar no q-item quando useClickableItem é true', async () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList, useClickableItem: true },
        global: defaultGlobal
      })

      await wrapper.findAll('q-item')[0].trigger('click')

      expect(wrapper.emitted('click-item')).toBeTruthy()
    })

    it('não deve emitir "click-item" ao clicar no q-item quando useClickableItem é false', async () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList, useClickableItem: false },
        global: defaultGlobal
      })

      await wrapper.findAll('q-item')[0].trigger('click')

      expect(wrapper.emitted('click-item')).toBeUndefined()
    })
  })

  describe('prop useBox', () => {
    it('deve renderizar dentro do qas-box-stub por padrão (useBox true)', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList },
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-box-stub').exists()).toBeTruthy()
    })

    it('deve renderizar como div simples quando useBox é false', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: sampleList, useBox: false },
        global: defaultGlobal
      })

      expect(wrapper.find('.qas-box-stub').exists()).toBeFalsy()
      expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('slot item', () => {
    it('deve renderizar conteúdo customizado no slot item', () => {
      const wrapper = mountComponent(QasListItems, {
        props: { list: [{ label: 'Item 1' }] },
        slots: { item: '<div class="custom-item">Customizado</div>' },
        global: defaultGlobal
      })

      expect(wrapper.find('.custom-item').exists()).toBeTruthy()
      expect(wrapper.find('.custom-item').text()).toBe('Customizado')
    })
  })
})
