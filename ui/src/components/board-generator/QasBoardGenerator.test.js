import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'

import QasBoardGenerator from './QasBoardGenerator.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { createAxiosMock, mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

const headers = [
  { status: 'todo', label: 'A fazer' },
  { status: 'doing', label: 'Fazendo' }
]

const makeItems = (status, quantity, start = 1) => Array.from({ length: quantity }, (_, index) => ({
  uuid: `${status}-${start + index}`,
  title: `${status} ${start + index}`
}))

/**
 * API com "total" itens por coluna, paginando por "limit" e "offset".
 * "failing" lista as colunas que respondem com erro.
 */
function createApi ({ total = 3, failing = [] } = {}) {
  return createAxiosMock(async ({ url, config: { params } }) => {
    const status = url.split('/').at(-1)

    if (failing.includes(status)) throw new Error('falhou')

    const quantity = Math.max(0, Math.min(params.limit, total - params.offset))

    return { data: { results: makeItems(status, quantity, params.offset + 1), count: total, fields: {} } }
  })
}

/**
 * O QasLazyLoadingComponents cria o observer em um requestAnimationFrame, então além das Promises
 * é preciso esperar alguns frames para as colunas e os cards serem renderizados.
 */
async function waitForRender () {
  for (let frame = 0; frame < 3; frame++) {
    await flushPromises()
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  await flushPromises()
}

/**
 * Simula o pai com "v-model:results": os resultados ficam em um objeto reativo, como em um ref.
 * O primeiro "update:results" acontece durante a montagem, antes do wrapper existir.
 */
async function mountBoard ({ props = {}, axios = createApi(), ...options } = {}) {
  let board = null

  const mounted = await mountQas(QasBoardGenerator, {
    props: {
      headers,
      columnIdKey: 'status',
      columnUrl: 'tasks/columns',
      itemIdKey: 'uuid',
      results: reactive({}),
      'onUpdate:results': value => board?.setProps({ results: reactive(value) }),
      ...props
    },
    slots: {
      'header-column': '<span class="cabecalho">{{ params.header.label }}</span>',
      'column-item': '<div class="card">{{ params.item.title }}</div>'
    },
    axios,
    ...options
  })

  board = mounted.wrapper

  await waitForRender()

  return mounted
}

// os cards de cada coluna, na ordem das colunas
const getColumnsCards = wrapper => wrapper.findAll('[data-header-key]').map(column => column.findAll('.card').map(card => card.text()))

describe('QasBoardGenerator', () => {
  let consoleLog = null
  let consoleWarn = null

  beforeEach(() => {
    NotifyError.mockClear()

    // o componente tem um console.log de depuração (listado no documento), silenciado para não poluir a saída
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    // o QasLazyLoadingComponents chama o slot fora do render (listado no documento), o resto dos avisos continua aparecendo
    const originalWarn = console.warn

    consoleWarn = vi.spyOn(console, 'warn').mockImplementation((message, ...args) => {
      if (String(message).includes('invoked outside of the render function')) return

      originalWarn(message, ...args)
    })
  })

  afterEach(() => {
    consoleLog.mockRestore()
    consoleWarn.mockRestore()
  })

  describe('colunas', () => {
    it('busca os itens de cada coluna com o limite e os "column-params"', async () => {
      const { axios } = await mountBoard({ props: { limitPerColumn: 2, columnParams: { company: 'a' } } })

      expect(axios.get).toHaveBeenCalledWith('tasks/columns/todo', expect.objectContaining({ params: { company: 'a', limit: 2, offset: 0 } }))
      expect(axios.get).toHaveBeenCalledWith('tasks/columns/doing', expect.objectContaining({ params: { company: 'a', limit: 2, offset: 0 } }))
    })

    it('exibe o cabeçalho e os cards de cada coluna pelos slots', async () => {
      const { wrapper } = await mountBoard()

      expect(wrapper.findAll('.cabecalho').map(header => header.text())).toEqual(['A fazer', 'Fazendo'])
      expect(getColumnsCards(wrapper)).toEqual([['todo 1', 'todo 2', 'todo 3'], ['doing 1', 'doing 2', 'doing 3']])
    })

    it('emite o sucesso de cada coluna e de todas', async () => {
      const { wrapper } = await mountBoard()

      expect(wrapper.emitted('fetch-column-success')).toHaveLength(2)
      expect(wrapper.emitted('fetch-columns-success')).toHaveLength(1)
    })

    it('coluna vazia exibe o texto de vazio', async () => {
      const { wrapper } = await mountBoard({ axios: createApi({ total: 0 }) })

      expect(wrapper.findAllComponents(QasEmptyResultText)).toHaveLength(2)
    })

    it('com "skeleton", exibe 8 colunas de carregamento sem buscar na API', async () => {
      const { wrapper, axios } = await mountBoard({ props: { skeleton: true } })

      expect(wrapper.findAll('[data-header-key]')).toHaveLength(8)
      expect(axios.get).not.toHaveBeenCalled()
    })
  })

  describe('paginação', () => {
    it('exibe "Ver mais" quando há mais itens e busca a próxima página', async () => {
      const { wrapper, axios } = await mountBoard({ props: { limitPerColumn: 2 } })

      const seeMoreButton = wrapper.findAllComponents({ name: 'QasBtn' }).find(button => button.props('label') === 'Ver mais')

      await seeMoreButton.find('button').trigger('click')
      await waitForRender()

      expect(axios.get).toHaveBeenLastCalledWith('tasks/columns/todo', expect.objectContaining({ params: { limit: 2, offset: 2 } }))
      expect(getColumnsCards(wrapper)[0]).toEqual(['todo 1', 'todo 2', 'todo 3'])
    })
  })

  describe('erros', () => {
    it('coluna com erro exibe a mensagem e o botão de tentar novamente', async () => {
      const { wrapper } = await mountBoard({ axios: createApi({ failing: ['doing'] }) })

      expect(wrapper.text()).toContain('Não foi possível carregar os itens desta coluna.')
      expect(wrapper.findAllComponents({ name: 'QasBtn' }).some(button => button.props('label') === 'Tentar novamente')).toBe(true)
      expect(wrapper.emitted('fetch-column-error')).toHaveLength(1)
      expect(wrapper.emitted('fetch-columns-success')).toBeUndefined()
    })

    it('com todas as colunas com erro, avisa o usuário', async () => {
      const { wrapper } = await mountBoard({ axios: createApi({ failing: ['todo', 'doing'] }) })

      expect(wrapper.emitted('fetch-columns-error')).toHaveLength(1)
      expect(NotifyError).toHaveBeenCalledWith('Ocorreu um erro ao carregar as colunas. Tente novamente mais tarde.')
    })
  })

  describe('métodos', () => {
    it('"refreshColumn" busca a coluna do início', async () => {
      const { wrapper, axios } = await mountBoard({ props: { limitPerColumn: 2 } })

      wrapper.vm.refreshColumn(headers[0])
      await waitForRender()

      expect(axios.get).toHaveBeenLastCalledWith('tasks/columns/todo', expect.objectContaining({ params: { limit: 2, offset: 0 } }))
      expect(getColumnsCards(wrapper)[0]).toEqual(['todo 1', 'todo 2'])
    })

    it('"removeItemFromList" tira o card da coluna', async () => {
      const { wrapper } = await mountBoard()

      wrapper.vm.removeItemFromList({ headerKey: 'todo', itemId: 'todo-2' })
      await waitForRender()

      expect(getColumnsCards(wrapper)[0]).toEqual(['todo 1', 'todo 3'])
    })

    it('"updateItemInList" troca o card pelo atualizado (com drag and drop)', async () => {
      const { wrapper } = await mountBoard({ props: { useDragAndDropX: true } })

      wrapper.vm.updateItemInList({ headerKey: 'todo', itemId: 'todo-1', updatedItem: { uuid: 'todo-1', title: 'todo editado' } })
      await waitForRender()

      expect(getColumnsCards(wrapper)[0][0]).toBe('todo editado')
    })

    it('"transferItemToColumn" move o card para o topo de outra coluna (com drag and drop)', async () => {
      const { wrapper } = await mountBoard({ props: { useDragAndDropX: true } })

      wrapper.vm.transferItemToColumn({ itemId: 'todo-1', fromColumnId: 'todo', toColumnId: 'doing' })
      await waitForRender()

      expect(getColumnsCards(wrapper)).toEqual([['todo 2', 'todo 3'], ['todo 1', 'doing 1', 'doing 2', 'doing 3']])
    })
  })

  describe('problemas', () => {
    // Problema listado no documento: com um id que não existe, o último card da coluna é removido.
    it.fails('"removeItemFromList" com id que não existe não remove nada', async () => {
      const { wrapper } = await mountBoard()

      wrapper.vm.removeItemFromList({ headerKey: 'todo', itemId: 'nao-existe' })
      await waitForRender()

      expect(getColumnsCards(wrapper)[0]).toEqual(['todo 1', 'todo 2', 'todo 3'])
    })

    // Problema listado no documento: sem drag and drop, a lista da coluna não é reativa e a alteração no lugar não aparece.
    it.fails('"updateItemInList" sem drag and drop troca o card pelo atualizado', async () => {
      const { wrapper } = await mountBoard()

      wrapper.vm.updateItemInList({ headerKey: 'todo', itemId: 'todo-1', updatedItem: { uuid: 'todo-1', title: 'todo editado' } })
      await waitForRender()

      expect(getColumnsCards(wrapper)[0][0]).toBe('todo editado')
    })

    it.fails('"transferItemToColumn" sem drag and drop mostra o card na outra coluna', async () => {
      const { wrapper } = await mountBoard()

      wrapper.vm.transferItemToColumn({ itemId: 'todo-1', fromColumnId: 'todo', toColumnId: 'doing' })
      await waitForRender()

      expect(getColumnsCards(wrapper)[1]).toContain('todo 1')
    })

    // Problema listado no documento: ficou um console.log de depuração no fetchColumns.
    it.fails('não escreve no console ao buscar as colunas', async () => {
      await mountBoard()

      expect(consoleLog).not.toHaveBeenCalled()
    })

    // Problema listado no documento: "use-confirm-dialog" está na documentação e no código, mas não é mais uma prop.
    it.fails('declara a prop "use-confirm-dialog"', () => {
      expect(QasBoardGenerator.props).toHaveProperty('useConfirmDialog')
    })
  })
})
