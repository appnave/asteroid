import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasNestedFields from './QasNestedFields.vue'

const defaultField = {
  name: 'items',
  label: 'Itens',
  children: {
    name: { name: 'name', label: 'Nome', type: 'text' },
    age: { name: 'age', label: 'Idade', type: 'text' }
  }
}

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasNestedFields, {
    props: {
      field: defaultField,
      modelValue: [],
      ...props
    },
    ...mountOptions
  })
}

describe('QasNestedFields', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-nested-fields').exists()).toBe(true)
    })

    it('renderiza com data-cy baseado no nome do field', () => {
      const wrapper = factory()
      expect(wrapper.find('[data-cy="nested-fields-items"]').exists()).toBe(true)
    })

    it('renderiza botão de adicionar por padrão quando lista está vazia', () => {
      const wrapper = factory()
      expect(wrapper.find('[data-cy="nested-fields-add-btn"]').exists()).toBe(true)
    })

    it('renderiza itens quando modelValue tem elementos', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João', age: '25' }]
      })
      await flushPromises()
      expect(wrapper.find('[data-cy="nested-fields-item"]').exists()).toBe(true)
    })
  })

  describe('método add', () => {
    it('adiciona um item ao chamar add()', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.add()
      await flushPromises()
      expect(wrapper.vm.nested.length).toBe(1)
    })

    it('emite update:modelValue ao adicionar', async () => {
      const wrapper = factory()
      await flushPromises()
      wrapper.vm.add()
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('usa rowObject ao adicionar', async () => {
      const rowObject = { name: 'padrão', age: '' }
      const wrapper = factory({ rowObject })
      await flushPromises()
      wrapper.vm.add()
      await flushPromises()
      expect(wrapper.vm.nested[0]).toMatchObject(rowObject)
    })
  })

  describe('método destroy', () => {
    it('remove item ao chamar destroy() sem identificador', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }, { name: 'Maria' }]
      })
      await flushPromises()
      wrapper.vm.destroy(0, wrapper.vm.nested[0])
      await flushPromises()
      expect(wrapper.vm.nested.length).toBe(1)
      expect(wrapper.vm.nested[0].name).toBe('Maria')
    })

    it('emite update:modelValue ao destruir', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }, { name: 'Maria' }]
      })
      await flushPromises()
      wrapper.vm.destroy(0, wrapper.vm.nested[0])
      await flushPromises()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('adiciona flag destroyed em vez de remover quando há identificador', async () => {
      const wrapper = factory({
        modelValue: [{ uuid: 'abc', name: 'João' }],
        useRemoveOnDestroy: false
      })
      await flushPromises()
      wrapper.vm.destroy(0, wrapper.vm.nested[0])
      await flushPromises()
      expect(wrapper.vm.nested[0].destroyed).toBe(true)
    })
  })

  describe('prop useDuplicate', () => {
    it('inclui opção de duplicar na lista de ações por padrão', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }]
      })
      await flushPromises()
      const actionsList = wrapper.vm.getDefaultActionsMenuList(0, { name: 'João' })
      expect(actionsList.duplicate).toBeDefined()
    })

    it('não inclui duplicar quando useDuplicate é false', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }],
        useDuplicate: false
      })
      await flushPromises()
      const actionsList = wrapper.vm.getDefaultActionsMenuList(0, { name: 'João' })
      expect(actionsList.duplicate).toBeUndefined()
    })
  })

  describe('prop showDestroyButton', () => {
    it('exibe botão de destruir quando há mais de um item', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }, { name: 'Maria' }]
      })
      await flushPromises()
      expect(wrapper.vm.showDestroyButton).toBe(true)
    })

    it('exibe botão de destruir com um item quando hasDestroyAlways é true', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }],
        useStartsEmpty: true
      })
      await flushPromises()
      expect(wrapper.vm.showDestroyButton).toBe(true)
    })
  })

  describe('prop useBox', () => {
    it('renderiza com QasBox quando useBox é true', () => {
      const wrapper = factory({ useBox: true })
      expect(wrapper.find('.qas-box').exists()).toBe(true)
    })

    it('não renderiza QasBox por padrão', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-box').exists()).toBe(false)
    })
  })

  describe('transformedErrors', () => {
    it('transforma errors array para objeto indexado', async () => {
      const wrapper = factory({
        modelValue: [{ name: 'João' }],
        errors: [{ name: 'Nome inválido' }]
      })
      await flushPromises()
      expect(Array.isArray(wrapper.vm.transformedErrors)).toBe(true)
    })

    it('usa object errors diretamente quando é objeto (não Array)', async () => {
      const errors = { 0: { name: 'Nome inválido' } }
      const wrapper = factory({
        modelValue: [{ name: 'João' }],
        errors
      })
      await flushPromises()
      // quando errors é objeto (não Array), transformedErrors usa constructObject
      expect(Array.isArray(wrapper.vm.transformedErrors)).toBe(false)
    })
  })

  describe('slot add-input', () => {
    it('renderiza slot customizado de adicionar', () => {
      const wrapper = factory({}, {
        slots: {
          'add-input': '<button data-cy="custom-add-btn">Adicionar Custom</button>'
        }
      })
      expect(wrapper.find('[data-cy="custom-add-btn"]').exists()).toBe(true)
    })
  })
})
