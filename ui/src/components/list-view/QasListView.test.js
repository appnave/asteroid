import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import QasListView from './QasListView.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'
import QasPagination from '../pagination/QasPagination.vue'

// QasPagination repassa as props para o QPagination do Quasar
const getPagination = wrapper => wrapper.findComponent({ name: 'QPagination' })

import { mountQas, createAxiosMock } from '../../../../test/utils/mount-qas.js'

const users = [{ uuid: '1', name: 'Ana' }, { uuid: '2', name: 'Bruno' }]

function apiResponse (data = {}) {
  return createAxiosMock(() => ({
    data: { results: users, count: users.length, fields: {}, metadata: {}, errors: {}, ...data }
  }))
}

function apiError (status) {
  return createAxiosMock(() => {
    throw Object.assign(new Error(`Request failed with status code ${status}`), { response: { status } })
  })
}

// QasFilters é testado separadamente, aqui só importa se ele aparece ou não
const stubs = { QasFilters: true }

function mountList ({ props = {}, ...options } = {}) {
  return mountQas(QasListView, {
    props: { entity: 'users', useStore: false, ...props },
    stubs,
    axios: apiResponse(),
    ...options
  })
}

describe('QasListView', () => {
  describe('busca sem store', () => {
    it('busca a entidade ao ser criado, na primeira página com o limite padrão', async () => {
      const { axios } = await mountList()

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledWith('users', { params: { limit: 36, offset: 0 } })
    })

    it('converte a entidade em camelCase para a URL com hífen', async () => {
      const { axios } = await mountList({ props: { entity: 'realEstateDevelopments' } })

      expect(axios.get.mock.calls[0][0]).toBe('real-estate-developments')
    })

    it('usa a prop "url" no lugar da entidade', async () => {
      const { axios } = await mountList({ props: { url: '/custom/users/' } })

      expect(axios.get.mock.calls[0][0]).toBe('/custom/users/')
    })

    it('envia página, busca, ordenação e filtros da URL como parâmetros', async () => {
      const { axios } = await mountList({ route: '/?page=3&search=ana&ordering=name&status=active' })

      expect(axios.get.mock.calls[0][1].params).toEqual({
        status: 'active',
        search: 'ana',
        ordering: 'name',
        limit: 36,
        offset: 72
      })
    })

    it('usa "results-per-page" para calcular limite e deslocamento', async () => {
      const { axios } = await mountList({ props: { resultsPerPage: 10 }, route: '/?page=2' })

      expect(axios.get.mock.calls[0][1].params).toMatchObject({ limit: 10, offset: 10 })
    })
  })

  describe('eventos e models', () => {
    it('emite "fetch-start" e "fetch-success" com a resposta', async () => {
      const { wrapper } = await mountList()

      expect(wrapper.emitted('fetch-start')).toHaveLength(1)
      expect(wrapper.emitted('fetch-success')[0][0].data.results).toEqual(users)
    })

    it('emite "update:results" com os resultados', async () => {
      const { wrapper } = await mountList()

      expect(wrapper.emitted('update:results').at(-1)[0]).toEqual(users)
    })

    it('emite "update:fields" com o "name" de cada campo em camelCase', async () => {
      const axios = apiResponse({ fields: { fullName: { name: 'full_name', type: 'text' } } })
      const { wrapper } = await mountList({ axios })

      const fields = wrapper.emitted('update:fields').at(-1)[0]

      expect(fields.fullName).toMatchObject({ name: 'fullName', type: 'text' })
    })

    it('emite "update:metadata" com o metadata da resposta', async () => {
      const { wrapper } = await mountList({ axios: apiResponse({ metadata: { total: 2 } }) })

      expect(wrapper.emitted('update:metadata').at(-1)[0]).toEqual({ total: 2 })
    })

    it('emite "update:fetching" true no início e false ao terminar', async () => {
      const { wrapper } = await mountList()

      expect(wrapper.emitted('update:fetching')).toEqual([[true], [false]])
    })
  })

  describe('renderização', () => {
    it('exibe o slot default quando há resultados', async () => {
      const { wrapper } = await mountList({ slots: { default: '<p class="lista">lista</p>' } })

      expect(wrapper.find('.lista').exists()).toBe(true)
      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(false)
    })

    it('exibe o texto de vazio quando não há resultados', async () => {
      const { wrapper } = await mountList({
        axios: apiResponse({ results: [], count: 0 }),
        slots: { default: '<p class="lista">lista</p>' }
      })

      expect(wrapper.find('.lista').exists()).toBe(false)
      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(true)
    })

    it('usa a prop "empty-result-text" no texto de vazio', async () => {
      const { wrapper } = await mountList({
        props: { emptyResultText: 'Nenhum usuário' },
        axios: apiResponse({ results: [], count: 0 })
      })

      expect(wrapper.findComponent(QasEmptyResultText).props('text')).toBe('Nenhum usuário')
    })

    it('permite substituir o vazio pelo slot "empty-results"', async () => {
      const { wrapper } = await mountList({
        axios: apiResponse({ results: [], count: 0 }),
        slots: { 'empty-results': '<p class="vazio">vazio</p>' }
      })

      expect(wrapper.find('.vazio').exists()).toBe(true)
      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(false)
    })

    it('exibe os slots "header" e "footer"', async () => {
      const { wrapper } = await mountList({
        slots: { header: '<p class="topo">topo</p>', footer: '<p class="rodape">rodapé</p>' }
      })

      expect(wrapper.find('header .topo').exists()).toBe(true)
      expect(wrapper.find('.rodape').exists()).toBe(true)
    })

    it('exibe os filtros por padrão e esconde com "use-filter" false', async () => {
      const { wrapper: withFilter } = await mountList()
      const { wrapper: withoutFilter } = await mountList({ props: { useFilter: false } })

      expect(withFilter.findComponent({ name: 'QasFilters' }).exists()).toBe(true)
      expect(withoutFilter.findComponent({ name: 'QasFilters' }).exists()).toBe(false)
    })
  })

  describe('paginação', () => {
    it('não exibe paginação quando tudo cabe em uma página', async () => {
      const { wrapper } = await mountList()

      expect(wrapper.findComponent(QasPagination).exists()).toBe(false)
    })

    it('exibe a paginação com o total de páginas calculado pelo "count"', async () => {
      const { wrapper } = await mountList({ axios: apiResponse({ count: 80 }) })

      expect(getPagination(wrapper).props('max')).toBe(3)
    })

    it('esconde a paginação com "use-pagination" false', async () => {
      const { wrapper } = await mountList({ props: { usePagination: false }, axios: apiResponse({ count: 80 }) })

      expect(wrapper.findComponent(QasPagination).exists()).toBe(false)
    })

    it('começa na página da URL', async () => {
      const { wrapper } = await mountList({ route: '/?page=2', axios: apiResponse({ count: 80 }) })

      expect(getPagination(wrapper).props('modelValue')).toBe(2)
    })

    it('busca novamente quando a query da mesma rota muda', async () => {
      const { router, axios } = await mountList({ axios: apiResponse({ count: 80 }) })

      await router.push({ query: { page: 2 } })
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(2)
      expect(axios.get.mock.calls[1][1].params).toMatchObject({ offset: 36 })
    })
  })

  describe('erros na busca', () => {
    it.each([
      [403, 'Forbidden'],
      [404, 'NotFound'],
      [500, 'ServerError'],
      [503, 'ServerError']
    ])('status %i redireciona para "%s" sem notificar', async (status, routeName) => {
      const { router, qas } = await mountList({ axios: apiError(status) })

      await flushPromises()

      expect(router.currentRoute.value.name).toBe(routeName)
      expect(qas.error).not.toHaveBeenCalled()
    })

    it('outros erros notificam o usuário e emitem "fetch-error"', async () => {
      const { wrapper, qas } = await mountList({ axios: apiError(400) })

      expect(qas.error).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('fetch-error')).toHaveLength(1)
      expect(wrapper.emitted('update:fetching').at(-1)).toEqual([false])
    })

    it('exibe o slot "fetch-error" no lugar do vazio quando a busca falha', async () => {
      const { wrapper } = await mountList({
        axios: apiError(400),
        slots: { 'fetch-error': '<p class="falhou">falhou</p>' }
      })

      expect(wrapper.find('.falhou').exists()).toBe(true)
      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(false)
    })
  })

  describe('prop before-fetch', () => {
    it('só busca quando o "before-fetch" chama o "resolve"', async () => {
      let resolveFetch

      const beforeFetch = vi.fn(({ resolve }) => { resolveFetch = resolve })
      const { axios } = await mountList({ props: { beforeFetch } })

      expect(beforeFetch).toHaveBeenCalledTimes(1)
      expect(axios.get).not.toHaveBeenCalled()

      resolveFetch()
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('recebe o contexto da URL no "payload"', async () => {
      const beforeFetch = vi.fn()

      await mountList({ props: { beforeFetch }, route: '/?page=2&search=ana' })

      expect(beforeFetch.mock.calls[0][0].payload).toMatchObject({ page: 2, search: 'ana' })
    })

    it('depois do "done", as próximas buscas não passam mais pelo "before-fetch"', async () => {
      const beforeFetch = vi.fn(({ resolve, done }) => { done(); resolve() })
      const { router, axios } = await mountList({ props: { beforeFetch } })

      await router.push({ query: { search: 'ana' } })
      await flushPromises()

      expect(beforeFetch).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('busca com store', () => {
    function createStore ({ list = users, totalPages = 1 } = {}) {
      return {
        users: {
          list,
          totalPages,
          fetchList: vi.fn(async () => ({ data: { results: list, count: list.length } }))
        }
      }
    }

    it('chama a action "fetchList" da store em vez do axios', async () => {
      const piniaStore = createStore()
      const { axios } = await mountList({ props: { useStore: true }, piniaStore, route: '/?search=ana' })

      expect(axios.get).not.toHaveBeenCalled()
      expect(piniaStore.users.fetchList).toHaveBeenCalledWith(expect.objectContaining({ search: 'ana', page: 1 }))
    })

    it('usa a lista e o total de páginas do state da store', async () => {
      const piniaStore = createStore({ totalPages: 4 })
      const { wrapper } = await mountList({ props: { useStore: true }, piniaStore })

      expect(wrapper.emitted('update:results').at(-1)[0]).toEqual(users)
      expect(getPagination(wrapper).props('max')).toBe(4)
    })
  })

  describe('remoção de itens', () => {
    it('com "use-auto-refetch-on-delete", busca de novo quando um item é removido', async () => {
      const { axios, wrapper } = await mountList({ props: { useAutoRefetchOnDelete: true } })

      window.dispatchEvent(new CustomEvent('delete-success', { detail: { entity: 'users' } }))
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(2)

      wrapper.unmount()
    })

    it('sem as props de remoção, ignora o evento "delete-success"', async () => {
      const { axios } = await mountList()

      window.dispatchEvent(new CustomEvent('delete-success', { detail: { entity: 'users' } }))
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('para de ouvir o evento depois de desmontado', async () => {
      const { axios, wrapper } = await mountList({ props: { useAutoRefetchOnDelete: true } })

      wrapper.unmount()
      window.dispatchEvent(new CustomEvent('delete-success', { detail: { entity: 'users' } }))
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)
    })
  })
})
