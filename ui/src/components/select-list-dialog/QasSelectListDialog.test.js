import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasSelectListDialog from './QasSelectListDialog.vue'
import QasDialog from '../dialog/QasDialog.vue'
import QasHeader from '../header/QasHeader.vue'
import QasSelectList from '../select-list/QasSelectList.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeOptions = () => [
  { label: 'Ana', value: 'ana' },
  { label: 'Bruno', value: 'bruno' },
  { label: 'Carla', value: 'carla' }
]

async function mountSelectListDialog ({ props = {}, ...options } = {}) {
  const mounted = await mountQas(QasSelectListDialog, { props: { options: makeOptions(), ...props }, ...options })

  await flushPromises()

  return mounted
}

const getHeader = wrapper => wrapper.findAllComponents(QasHeader)[0]
const getLastModel = wrapper => wrapper.emitted('update:modelValue').at(-1)[0]
// o QVirtualScroll não renderiza as linhas no jsdom, então os itens são lidos da prop "items"
const getSelectedLabels = wrapper => wrapper.findComponent({ name: 'QVirtualScroll' }).props('items').map(item => item.label)

async function openDialog (wrapper) {
  getHeader(wrapper).props('buttonProps').onClick()
  await flushPromises()
}

// seleciona as opções dentro do dialog e confirma
async function addFromDialog (wrapper, selected) {
  await openDialog(wrapper)

  wrapper.findComponent(QasSelectList).vm.$emit('update:modelValue', selected)
  await flushPromises()

  wrapper.findComponent(QasDialog).props('ok').onClick()
  await flushPromises()
}

describe('QasSelectListDialog', () => {
  describe('cabeçalho', () => {
    it('exibe label, descrição e o botão de adicionar', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { label: 'Usuários', description: 'Selecione os usuários' } })

      expect(getHeader(wrapper).props()).toMatchObject({
        labelProps: { label: 'Usuários', color: 'grey-10' },
        description: 'Selecione os usuários',
        buttonProps: { icon: 'sym_r_add' }
      })
    })

    it('com erro, pinta o label de vermelho e exibe a mensagem', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { label: 'Usuários', error: ['Obrigatório.', 'Mínimo 2.'] } })

      expect(getHeader(wrapper).props('labelProps').color).toBe('negative')
      expect(wrapper.find('.app-select-list-dialog__error').text()).toBe('Obrigatório. Mínimo 2.')
    })
  })

  describe('itens selecionados', () => {
    it('exibe os itens do model com o label da opção', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['bruno', 'carla'] } })

      expect(getSelectedLabels(wrapper)).toEqual(['Bruno', 'Carla'])
    })

    it('ao remover um item, atualiza o model e emite "remove"', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['ana', 'bruno'] } })

      wrapper.vm.remove('ana')

      expect(getLastModel(wrapper)).toEqual(['bruno'])
      expect(wrapper.emitted('remove')).toEqual([['ana']])
    })

    it('"removeAll" limpa o model', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['ana', 'bruno'] } })

      wrapper.vm.removeAll()

      expect(getLastModel(wrapper)).toEqual([])
    })
  })

  describe('dialog', () => {
    it('abre o dialog com o título padrão e a lista de opções', async () => {
      const { wrapper } = await mountSelectListDialog()

      await openDialog(wrapper)

      expect(wrapper.findComponent(QasDialog).props()).toMatchObject({ title: 'Adicionar itens', size: 'md' })
      expect(wrapper.findComponent(QasSelectList).exists()).toBe(true)
    })

    it('o botão "Adicionar" fica desabilitado sem seleção', async () => {
      const { wrapper } = await mountSelectListDialog()

      await openDialog(wrapper)

      expect(wrapper.findComponent(QasDialog).props('ok')).toMatchObject({ label: 'Adicionar', disable: true })
    })

    it('ao confirmar, adiciona os itens selecionados e emite "add"', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['ana'] } })

      await addFromDialog(wrapper, [{ label: 'Carla', value: 'carla' }])

      expect(getLastModel(wrapper)).toEqual(['ana', 'carla'])
      expect(wrapper.emitted('add')).toEqual([[[{ label: 'Carla', value: 'carla' }]]])
    })

    it('chama o "onClick" de "dialog-props.ok" ao confirmar', async () => {
      const onClick = vi.fn()
      const { wrapper } = await mountSelectListDialog({ props: { dialogProps: { ok: { onClick } } } })

      await addFromDialog(wrapper, [{ label: 'Ana', value: 'ana' }])

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('exclui da lista do dialog os itens já selecionados', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['ana'] } })

      await openDialog(wrapper)

      expect(wrapper.findComponent(QasSelectList).props('searchBoxProps').optionsToExclude).toEqual(['ana'])
    })
  })

  describe('adicionar de novo', () => {
    it('um item removido e adicionado de novo aparece com o label', async () => {
      const { wrapper } = await mountSelectListDialog({ props: { modelValue: ['ana'] } })

      wrapper.vm.remove('ana')
      await wrapper.setProps({ modelValue: [] })

      wrapper.vm.add({ options: [{ label: 'Ana', value: 'ana' }] })
      await wrapper.setProps({ modelValue: ['ana'] })

      expect(getSelectedLabels(wrapper)).toEqual(['Ana'])
    })
  })
})
