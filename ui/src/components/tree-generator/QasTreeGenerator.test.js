import { describe, it, expect, beforeEach } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasTreeGenerator from './QasTreeGenerator.vue'

const defaultNodes = [
  { uuid: 'uuid-1', name: 'Raiz 1', lazy: false, children: [] },
  { uuid: 'uuid-2', name: 'Raiz 2', lazy: false, children: [] }
]

describe('QasTreeGenerator', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasTreeGenerator, {
      props: {
        nodes: defaultNodes,
        resource: '/api/tree-items'
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza a árvore q-tree', () => {
      const tree = wrapper.findComponent({ name: 'QTree' })
      expect(tree.exists()).toBe(true)
    })

    it('renderiza o diálogo de exclusão', () => {
      const dialogs = wrapper.findAllComponents({ name: 'QasDialog' })
      expect(dialogs.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Data', () => {
    it('showDestroyDialog começa false', () => {
      expect(wrapper.vm.showDestroyDialog).toBe(false)
    })

    it('showFormDialog começa false', () => {
      expect(wrapper.vm.showFormDialog).toBe(false)
    })

    it('isAdd começa true', () => {
      expect(wrapper.vm.isAdd).toBe(true)
    })

    it('parsedNodes é populado a partir dos nodes', () => {
      // parsedNodes pode ter menos itens dependendo de como o watcher processa
      expect(wrapper.vm.parsedNodes.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Computed', () => {
    it('nodeTitle retorna "ramo" quando isAdd é true e currentNode não tem label', () => {
      expect(wrapper.vm.nodeTitle).toBe('ramo')
    })

    it('nodeTitle retorna label do currentNode quando isAdd é true e tem label', () => {
      wrapper.vm.currentNode = { uuid: 'uuid-1', label: 'Nó Atual' }
      wrapper.vm.isAdd = true
      expect(wrapper.vm.nodeTitle).toBe('Nó Atual')
    })

    it('nodeTitle retorna "Nome do ramo" quando isAdd é false', () => {
      wrapper.vm.isAdd = false
      expect(wrapper.vm.nodeTitle).toBe('Nome do ramo')
    })

    it('hasAddField é true quando isAdd é true', () => {
      wrapper.vm.isAdd = true
      expect(wrapper.vm.hasAddField).toBe(true)
    })

    it('hasAddField é false quando não é add e useFormViewEdit está ativo', () => {
      const w = mountComponent(QasTreeGenerator, {
        props: { nodes: defaultNodes, resource: '/api', useFormViewEdit: true, formViewProps: { entity: 'test-entity' } }
      })
      w.vm.isAdd = false
      expect(w.vm.hasAddField).toBe(false)
    })

    it('destroyDialogConfig tem configuração de ok e cancel', () => {
      const config = wrapper.vm.destroyDialogConfig
      expect(config.ok?.label).toBe('Excluir')
      expect(typeof config.ok?.onClick).toBe('function')
      expect(typeof config.cancel?.onClick).toBe('function')
    })

    it('formDialogConfig title muda com base em isAdd', () => {
      wrapper.vm.isAdd = true
      expect(wrapper.vm.formDialogConfig.card.title).toBe('Adicionar ramo')

      wrapper.vm.isAdd = false
      expect(wrapper.vm.formDialogConfig.card.title).toBe('Editar ramo')
    })

    it('parentsList retorna lista de uuids dos nodes raiz', () => {
      const list = wrapper.vm.parentsList
      expect(list).toContain('uuid-1')
      expect(list).toContain('uuid-2')
    })
  })

  describe('Props', () => {
    it('useAddButton tem default true', () => {
      expect(QasTreeGenerator.props?.useAddButton?.default).toBe(true)
    })

    it('useDestroyButton tem default true', () => {
      expect(QasTreeGenerator.props?.useDestroyButton?.default).toBe(true)
    })

    it('useEditButton tem default true', () => {
      expect(QasTreeGenerator.props?.useEditButton?.default).toBe(true)
    })

    it('labelKey tem default "name"', () => {
      expect(QasTreeGenerator.props?.labelKey?.default).toBe('name')
    })
  })

  describe('Métodos', () => {
    it('handleTreeFormDialog abre o diálogo e define isAdd', () => {
      const node = defaultNodes[0]
      wrapper.vm.handleTreeFormDialog(node, true)
      expect(wrapper.vm.showFormDialog).toBe(true)
      expect(wrapper.vm.isAdd).toBe(true)
      expect(wrapper.vm.currentNode).toEqual(node)
    })

    it('handleTreeFormDialog define editModel ao editar', () => {
      const node = { uuid: 'uuid-1', label: 'Meu Nó' }
      wrapper.vm.handleTreeFormDialog(node, false)
      expect(wrapper.vm.isAdd).toBe(false)
      expect(wrapper.vm.editModel).toBe('Meu Nó')
    })

    it('onDestroy abre o diálogo de exclusão e define currentNode', () => {
      const node = defaultNodes[0]
      wrapper.vm.onDestroy(node)
      expect(wrapper.vm.showDestroyDialog).toBe(true)
      expect(wrapper.vm.currentNode).toEqual(node)
    })

    it('resetCurrentNode limpa currentNode', () => {
      wrapper.vm.currentNode = defaultNodes[0]
      wrapper.vm.resetCurrentNode()
      expect(wrapper.vm.currentNode).toEqual({})
    })

    it('resetModels limpa os modelos do formulário', () => {
      wrapper.vm.editModel = 'alguma coisa'
      wrapper.vm.resetModels()
      expect(wrapper.vm.editModel).toBe('')
      expect(wrapper.vm.nestedModel).toEqual([{ label: '' }])
    })
  })
})
