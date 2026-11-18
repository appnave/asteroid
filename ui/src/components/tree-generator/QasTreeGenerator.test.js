import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import axios from 'axios'

import QasTreeGenerator from './QasTreeGenerator.vue'
import QasDialog from '../dialog/QasDialog.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../../plugins/notify-success/NotifySuccess.js'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o QasTreeGenerator usa o axios direto, e o plugin Notify do Quasar não é instalado nos testes
vi.mock('axios', () => ({ default: { post: vi.fn(), put: vi.fn(), delete: vi.fn() } }))
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))
vi.mock('../../plugins/notify-success/NotifySuccess.js', () => ({ default: vi.fn() }))

const makeNodes = () => [
  {
    uuid: 'root',
    label: 'Empresa',
    lazy: true,
    children: [
      { uuid: 'sales', label: 'Vendas', lazy: true, children: [{ uuid: 'team', label: 'Equipe A' }] },
      { uuid: 'finance', label: 'Financeiro' }
    ]
  }
]

async function mountTreeGenerator ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasTreeGenerator, { props: { nodes: makeNodes(), resource: 'departments', ...props }, ...options })

  await flushPromises()

  return wrapper
}

const getTree = wrapper => wrapper.findComponent({ name: 'QTree' })
// o primeiro span de cada nó é o label, o segundo é o menu
const getNodeLabels = wrapper => wrapper.findAll('.q-tree__node-header-content > div > span:first-child').map(label => label.text())
const getDialogs = wrapper => wrapper.findAllComponents(QasDialog)
const getFormDialog = wrapper => getDialogs(wrapper)[1]

async function expandNode (wrapper, uuid) {
  getTree(wrapper).vm.setExpanded(uuid, true)
  await flushPromises()
}

describe('QasTreeGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('árvore', () => {
    it('começa só com o primeiro nó e emite os nós exibidos', async () => {
      const wrapper = await mountTreeGenerator()

      expect(getNodeLabels(wrapper)).toEqual(['Empresa'])
      expect(wrapper.emitted('update:lazyNodes').at(-1)[0]).toEqual([{ uuid: 'root', label: 'Empresa', lazy: true }])
    })

    it('carrega os filhos ao expandir um nó', async () => {
      const wrapper = await mountTreeGenerator()

      await expandNode(wrapper, 'root')

      expect(getNodeLabels(wrapper)).toEqual(['Empresa', 'Vendas', 'Financeiro'])
    })
  })

  describe('menu do nó', () => {
    it('com "readonly", não exibe o menu', async () => {
      const wrapper = await mountTreeGenerator({ props: { readonly: true } })

      expect(wrapper.findAllComponents({ name: 'QasBtn' })).toHaveLength(0)
    })

    it('não permite excluir o primeiro nó, a não ser com "use-destroy-on-first-node"', async () => {
      const wrapper = await mountTreeGenerator()
      const withFirstNode = await mountTreeGenerator({ props: { useDestroyOnFirstNode: true } })

      expect(wrapper.vm.hasDestroyButton({ uuid: 'root' })).toBe(false)
      expect(wrapper.vm.hasDestroyButton({ uuid: 'sales' })).toBe(true)
      expect(withFirstNode.vm.hasDestroyButton({ uuid: 'root' })).toBe(true)
    })

    it('sem nenhuma ação, não exibe o menu', async () => {
      const wrapper = await mountTreeGenerator({ props: { useAddButton: false, useEditButton: false, useDestroyButton: false } })

      expect(wrapper.findAllComponents({ name: 'QasBtn' })).toHaveLength(0)
    })
  })

  describe('excluir', () => {
    it('ao confirmar, apaga na API e tira o nó da árvore', async () => {
      axios.delete.mockResolvedValue({})

      const wrapper = await mountTreeGenerator()

      await expandNode(wrapper, 'root')

      const finance = wrapper.vm.parsedNodes[0].children.find(node => node.uuid === 'finance')

      wrapper.vm.onDestroy(finance)
      await flushPromises()

      getDialogs(wrapper)[0].props('ok').onClick()
      await flushPromises()

      expect(axios.delete).toHaveBeenCalledWith('departments/finance')
      expect(NotifySuccess).toHaveBeenCalledWith('Item deletado com sucesso!')
      expect(getNodeLabels(wrapper)).toEqual(['Empresa', 'Vendas'])
    })

    it('com erro na API, mantém o nó e avisa o usuário', async () => {
      axios.delete.mockRejectedValue(new Error('falhou'))

      const wrapper = await mountTreeGenerator()

      wrapper.vm.onDestroy(wrapper.vm.parsedNodes[0])
      getDialogs(wrapper)[0].props('ok').onClick()
      await flushPromises()

      expect(NotifyError).toHaveBeenCalledWith('Ops! Não foi possível deletar o item.')
      expect(getNodeLabels(wrapper)).toEqual(['Empresa'])
    })
  })

  describe('editar e adicionar', () => {
    it('editar abre o dialog com o nome atual', async () => {
      const wrapper = await mountTreeGenerator()

      wrapper.vm.handleTreeFormDialog(wrapper.vm.parsedNodes[0])
      await flushPromises()

      expect(getFormDialog(wrapper).props()).toMatchObject({ modelValue: true, title: 'Editar ramo' })
      expect(wrapper.vm.editModel).toBe('Empresa')
    })

    it('ao salvar a edição, envia o nome para a API e atualiza o nó', async () => {
      axios.put.mockResolvedValue({})

      const wrapper = await mountTreeGenerator()

      wrapper.vm.handleTreeFormDialog(wrapper.vm.parsedNodes[0])
      wrapper.vm.editModel = 'Empresa Nova'

      await wrapper.vm.onValidate(true)
      await flushPromises()

      expect(axios.put).toHaveBeenCalledWith('departments/root', { name: 'Empresa Nova', uuid: 'root', lazy: true })
      expect(getNodeLabels(wrapper)[0]).toBe('Empresa Nova')
    })

    it('ao adicionar, cria um item na API para cada linha e coloca no nó', async () => {
      axios.post.mockImplementation(async (_url, { name }) => ({ data: { result: { name, uuid: `uuid-${name}` } } }))

      const wrapper = await mountTreeGenerator({ props: { labelKey: 'name' } })

      wrapper.vm.handleTreeFormDialog(wrapper.vm.parsedNodes[0], true)
      wrapper.vm.nestedModel = [{ label: 'Jurídico' }, { label: 'RH' }]

      await wrapper.vm.onValidate(true)
      await flushPromises()

      expect(axios.post).toHaveBeenCalledWith('departments', { parent: 'root', name: 'Jurídico', lazy: true })
      // abrir o nó carrega os filhos que já existiam, e os novos entram no final
      expect(wrapper.vm.parsedNodes[0].children.map(node => node.label)).toEqual(['Vendas', 'Financeiro', 'Jurídico', 'RH'])
    })

    // Problema listado no documento: a regra "required" passada direto (:rules="[required]") recebe o segundo argumento do Quasar como mensagem e não bloqueia o campo vazio.
    it.fails('não salva a edição com o nome vazio', async () => {
      axios.put.mockResolvedValue({})

      const wrapper = await mountTreeGenerator()

      wrapper.vm.handleTreeFormDialog(wrapper.vm.parsedNodes[0])
      await flushPromises()

      wrapper.vm.editModel = ''
      await flushPromises()

      document.body.querySelector('.q-dialog form').dispatchEvent(new Event('submit', { cancelable: true }))
      await flushPromises()

      expect(axios.put).not.toHaveBeenCalled()
    })
  })
})
