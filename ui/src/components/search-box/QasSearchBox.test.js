import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasSearchBox from './QasSearchBox.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasSearchInput from '../search-input/QasSearchInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeList = () => [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Bruno Lima', value: 'bruno' },
  { label: 'Carla Dias', value: 'carla' }
]

const fuseOptions = { keys: ['label'] }

async function mountSearchBox ({ props = {}, ...options } = {}) {
  const mounted = await mountQas(QasSearchBox, { props: { list: makeList(), fuseOptions, ...props }, ...options })

  await flushPromises()

  return mounted
}

const getResults = wrapper => wrapper.emitted('update:results').at(-1)[0].map(option => option.value)
const getSearchInput = wrapper => wrapper.findComponent(QasSearchInput)

async function search (wrapper, value) {
  getSearchInput(wrapper).vm.$emit('update:modelValue', value)
  await flushPromises()
}

describe('QasSearchBox', () => {
  describe('busca local', () => {
    it('começa com a lista inteira como resultado', async () => {
      const { wrapper } = await mountSearchBox()

      expect(getResults(wrapper)).toEqual(['ana', 'bruno', 'carla'])
    })

    it('filtra a lista pelo texto pesquisado', async () => {
      const { wrapper } = await mountSearchBox()

      await search(wrapper, 'brun')

      expect(getResults(wrapper)).toEqual(['bruno'])
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['brun'])
    })

    it('ao limpar a pesquisa, volta a lista inteira', async () => {
      const { wrapper } = await mountSearchBox()

      await search(wrapper, 'brun')
      await search(wrapper, '')

      expect(getResults(wrapper)).toEqual(['ana', 'bruno', 'carla'])
    })

    it('atualiza os resultados quando a lista muda', async () => {
      const { wrapper } = await mountSearchBox()

      await wrapper.setProps({ list: [...makeList(), { label: 'Daniel Rocha', value: 'daniel' }] })
      await flushPromises()

      expect(getResults(wrapper)).toContain('daniel')
    })

    it('sem resultado, emite "empty-result" e exibe o texto de vazio', async () => {
      const { wrapper } = await mountSearchBox()

      await search(wrapper, 'zzzzzz')

      expect(wrapper.emitted('empty-result')).toHaveLength(1)
      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(true)
    })

    it('com a lista vazia, desabilita a pesquisa e usa a altura de "empty-list-height"', async () => {
      const { wrapper } = await mountSearchBox({ props: { list: [], emptyListHeight: '80px' } })

      expect(getSearchInput(wrapper).vm.$attrs.disable).toBe(true)
      expect(wrapper.find('.overflow-auto').attributes('style')).toContain('max-height: 80px')
    })

    it('remove das opções os valores de "options-to-exclude"', async () => {
      const { wrapper } = await mountSearchBox({ props: { optionsToExclude: ['bruno'] } })

      expect(getResults(wrapper)).toEqual(['ana', 'carla'])
    })

    it('"options-to-exclude" não altera a lista recebida', async () => {
      const list = makeList()

      await mountSearchBox({ props: { list, optionsToExclude: ['bruno'] } })

      expect(list.map(option => option.value)).toEqual(['ana', 'bruno', 'carla'])
    })

    // Problema listado no documento: quando a lista muda, as opções excluídas voltam.
    it.fails('"options-to-exclude" continua valendo quando a lista muda', async () => {
      const { wrapper } = await mountSearchBox({ props: { optionsToExclude: ['bruno'] } })

      await wrapper.setProps({ list: makeList() })
      await flushPromises()

      expect(getResults(wrapper)).not.toContain('bruno')
    })
  })

  describe('lazy loading', () => {
    function createStore ({ fail = false } = {}) {
      const fetchFieldOptions = vi.fn(async ({ params }) => {
        if (fail) throw new Error('falhou')

        const results = makeList().filter(option => option.label.toLowerCase().includes(params.search.toLowerCase()))

        return { data: { results, count: results.length } }
      })

      return { users: { fetchFieldOptions } }
    }

    async function mountLazySearchBox ({ props = {}, store = createStore() } = {}) {
      const mounted = await mountSearchBox({
        props: { list: [], useLazyLoading: true, entity: 'users', name: 'responsibleUser', ...props },
        piniaStore: store
      })

      return { ...mounted, fetch: store.users.fetchFieldOptions }
    }

    it('busca as opções na API ao montar', async () => {
      const { wrapper, fetch } = await mountLazySearchBox()

      expect(fetch).toHaveBeenCalledWith(expect.objectContaining({
        field: 'responsible-user',
        params: expect.objectContaining({ search: '', limit: 48, offset: 0 })
      }))

      expect(getResults(wrapper)).toEqual(['ana', 'bruno', 'carla'])
    })

    it('pesquisa na API com o texto digitado', async () => {
      const { wrapper, fetch } = await mountLazySearchBox()

      await search(wrapper, 'carla')

      expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ params: expect.objectContaining({ search: 'carla' }) }))
      expect(getResults(wrapper)).toEqual(['carla'])
    })

    it('com erro na API, marca a pesquisa com erro', async () => {
      const { wrapper } = await mountLazySearchBox({ store: createStore({ fail: true }) })

      expect(getSearchInput(wrapper).vm.$attrs.error).toBe(true)
      expect(wrapper.emitted('fetchOptionsError')).toHaveLength(1)
    })

    it('usa debounce na pesquisa, diferente da busca local', async () => {
      const { wrapper: localWrapper } = await mountSearchBox()

      const { wrapper } = await mountLazySearchBox()

      expect(getSearchInput(wrapper).props('useDebounce')).toBe(true)
      expect(getSearchInput(localWrapper).props('useDebounce')).toBe(false)
    })
  })
})
