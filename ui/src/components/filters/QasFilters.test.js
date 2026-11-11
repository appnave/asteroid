import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { reactive } from 'vue'

import QasFilters from './QasFilters.vue'
import QasBadge from '../badge/QasBadge.vue'
import QasSearchInput from '../search-input/QasSearchInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const filterFields = {
  status: {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [{ label: 'Ativo', value: 'active' }, { label: 'Inativo', value: 'inactive' }]
  },
  city: { name: 'city', label: 'Cidade', type: 'text' }
}

/**
 * Store reativa como a do store-module: "filters" começa vazio e a action "fetchFilters" preenche.
 */
function createStore ({ loaded = false, fail = false } = {}) {
  const users = reactive({
    filters: loaded ? filterFields : {},
    fetchFilters: vi.fn(async () => {
      if (fail) throw new Error('falhou')

      users.filters = filterFields

      return { data: { fields: filterFields } }
    })
  })

  return { users }
}

async function mountFilters ({ props = {}, route = '/', piniaStore = createStore(), slots } = {}) {
  const mounted = await mountQas(QasFilters, {
    props: { entity: 'users', ...props },
    route,
    piniaStore,
    slots
  })

  await flushPromises()

  return { ...mounted, piniaStore }
}

// lê só o conteúdo do chip, sem o ícone de remover
const getChips = wrapper => wrapper.findAll('.qas-filters__badge-content').map(content => content.text())

describe('QasFilters', () => {
  describe('busca dos filtros', () => {
    it('busca os filtros na store ao ser criado, enviando os filtros da URL', async () => {
      const { piniaStore } = await mountFilters({ props: { url: '/users/filters' }, route: '/?status=active&page=2' })

      expect(piniaStore.users.fetchFilters).toHaveBeenCalledWith({
        url: '/users/filters',
        params: { status: 'active' }
      })
    })

    it('não busca de novo quando os filtros já estão na store', async () => {
      const { piniaStore } = await mountFilters({ piniaStore: createStore({ loaded: true }) })

      expect(piniaStore.users.fetchFilters).not.toHaveBeenCalled()
    })

    it('com "use-force-refetch", busca mesmo com os filtros na store', async () => {
      const { piniaStore } = await mountFilters({ props: { useForceRefetch: true }, piniaStore: createStore({ loaded: true }) })

      expect(piniaStore.users.fetchFilters).toHaveBeenCalledTimes(1)
    })

    it('com "use-filter-button" false, não busca os filtros', async () => {
      const { piniaStore } = await mountFilters({ props: { useFilterButton: false } })

      expect(piniaStore.users.fetchFilters).not.toHaveBeenCalled()
    })

    it('emite "fetch-success" ao buscar e "fetch-error" quando falha', async () => {
      const { wrapper: success } = await mountFilters()
      const { wrapper: failure } = await mountFilters({ piniaStore: createStore({ fail: true }) })

      expect(success.emitted('fetch-success')).toHaveLength(1)
      expect(failure.emitted('fetch-error')).toHaveLength(1)
    })

    it('busca de novo quando muda uma das chaves de "listener-query-keys"', async () => {
      const { router, piniaStore } = await mountFilters({
        props: { listenerQueryKeys: ['company'] },
        route: '/?company=1'
      })

      await router.push({ query: { company: '2' } })
      await flushPromises()

      expect(piniaStore.users.fetchFilters).toHaveBeenCalledTimes(2)
    })
  })

  describe('chips dos filtros ativos', () => {
    it('exibe um chip para cada filtro da URL, com o label do campo e o valor formatado', async () => {
      const { wrapper } = await mountFilters({ route: '/?status=active&city=Campinas' })

      expect(getChips(wrapper)).toEqual(['Status: "Ativo"', 'Cidade: "Campinas"'])
    })

    it('ignora parâmetros da URL que não são filtros', async () => {
      const { wrapper } = await mountFilters({ route: '/?status=active&tab=documentos' })

      expect(getChips(wrapper)).toEqual(['Status: "Ativo"'])
    })

    it('ao remover um chip, remove o filtro da URL', async () => {
      const { wrapper, router } = await mountFilters({ route: '/?status=active&city=Campinas' })

      await wrapper.findAllComponents(QasBadge)[0].vm.$emit('remove')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ city: 'Campinas' })
    })

    it('com "use-chip" false, não exibe os chips', async () => {
      const { wrapper } = await mountFilters({ props: { useChip: false }, route: '/?status=active' })

      expect(getChips(wrapper)).toEqual([])
    })
  })

  describe('ordenação', () => {
    const orderByOptions = [{ label: 'Nome', value: 'name' }, { label: 'Mais recentes', value: '-created_at' }]

    it('exibe o chip da ordenação atual', async () => {
      const { wrapper } = await mountFilters({ props: { orderByOptions }, route: '/?order_by=name' })

      expect(getChips(wrapper)).toContain('Ordenar por: "Nome"')
    })

    it('ao remover o chip da ordenação, remove "order_by" da URL', async () => {
      const { wrapper, router } = await mountFilters({ props: { orderByOptions }, route: '/?order_by=name&status=active' })

      const orderChip = wrapper.findAllComponents(QasBadge).find(badge => badge.text().includes('Ordenar por'))

      await orderChip.vm.$emit('remove')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ status: 'active' })
    })
  })

  describe('pesquisa', () => {
    it('preenche a pesquisa com o "search" da URL', async () => {
      const { wrapper } = await mountFilters({ route: '/?search=ana' })

      expect(wrapper.findComponent(QasSearchInput).props('modelValue')).toBe('ana')
    })

    it('ao pesquisar, coloca o termo na URL mantendo os filtros e voltando para a primeira página', async () => {
      const { wrapper, router } = await mountFilters({ route: '/?status=active&page=3' })

      await wrapper.findComponent(QasSearchInput).vm.$emit('update:modelValue', 'ana')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ status: 'active', search: 'ana' })
    })

    it('ao limpar a pesquisa, remove o termo da URL', async () => {
      const { wrapper, router } = await mountFilters({ route: '/?search=ana' })

      await wrapper.findComponent(QasSearchInput).vm.$emit('clear')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({})
    })

    it('com "use-search" false, não exibe o campo de pesquisa', async () => {
      const { wrapper } = await mountFilters({ props: { useSearch: false } })

      expect(wrapper.findComponent(QasSearchInput).exists()).toBe(false)
    })

    it('usa o "search-placeholder" no campo de pesquisa', async () => {
      const { wrapper } = await mountFilters({ props: { searchPlaceholder: 'Buscar usuário' } })

      expect(wrapper.findComponent(QasSearchInput).find('input').attributes('placeholder')).toBe('Buscar usuário')
    })
  })

  describe('sem atualizar a URL', () => {
    it('com "use-update-route" false, pesquisa sem alterar a URL e emite "update:currentFilters"', async () => {
      const { wrapper, router } = await mountFilters({ props: { useUpdateRoute: false } })

      await wrapper.findComponent(QasSearchInput).vm.$emit('update:modelValue', 'ana')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({})
      expect(wrapper.emitted('update:currentFilters').at(-1)).toEqual([{ search: 'ana' }])
    })
  })

  describe('entidade sem store', () => {
    // ex: QasListView com "use-store" false, que exibe o QasFilters por padrão
    it('não quebra quando a URL tem filtros e a entidade não tem store', async () => {
      const { wrapper } = await mountFilters({
        route: '/?status=active',
        piniaStore: {}
      })

      expect(getChips(wrapper)).toEqual([])
      // a inicialização termina emitindo os filtros atuais, o que não acontece se ela quebrar no meio
      expect(wrapper.emitted('update:currentFilters')).toEqual([[{ status: 'active' }]])
    })

    it('não quebra ao navegar mudando os filtros da URL quando a entidade não tem store', async () => {
      const { router, wrapper } = await mountFilters({ route: '/?date=2026-11-10', piniaStore: {} })
      const navigationErrors = []

      router.onError(error => navigationErrors.push(error))

      // ex: trocar a data em um calendário que altera a query da mesma rota
      await router.push({ query: { date: '2026-11-11' } })
      await flushPromises()

      expect(navigationErrors).toEqual([])
      expect(router.currentRoute.value.query).toEqual({ date: '2026-11-11' })
      expect(wrapper.vm.internalFilters).toEqual({ date: '2026-11-11' })
    })
  })
})
