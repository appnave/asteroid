import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import QasSelect from './QasSelect.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeOptions = (quantity, start = 1) => Array.from({ length: quantity }, (_, index) => ({
  label: `Usuário ${start + index}`,
  value: `user-${start + index}`
}))

/**
 * Store com a action "fetchFieldOptions", paginando uma lista de "total" opções.
 * "search" filtra pelo label, e "withCount" false simula APIs que respondem com "hasNextPage" no lugar do "count".
 */
function createStore ({ total = 3, withCount = true, fail = false } = {}) {
  const allOptions = makeOptions(total)

  const fetchFieldOptions = vi.fn(async ({ params }) => {
    if (fail) throw new Error('falhou')

    const filtered = allOptions.filter(option => option.label.toLowerCase().includes((params.search || '').toLowerCase()))
    const results = filtered.slice(params.offset, params.offset + params.limit)

    return {
      data: {
        results,
        ...(withCount ? { count: filtered.length } : { hasNextPage: params.offset + params.limit < filtered.length })
      }
    }
  })

  return { users: { fetchFieldOptions } }
}

async function mountLazySelect ({ props = {}, store = createStore() } = {}) {
  const mounted = await mountQas(QasSelect, {
    props: { useLazyLoading: true, entity: 'users', name: 'responsibleUser', ...props },
    piniaStore: store
  })

  await flushPromises()

  return { ...mounted, fetch: store.users.fetchFieldOptions }
}

const getQSelect = wrapper => wrapper.findComponent({ name: 'QSelect' })
const getOptionValues = wrapper => getQSelect(wrapper).props('options').map(option => option.value)

async function typeSearch (wrapper, value) {
  getQSelect(wrapper).vm.$emit('filter', value, callback => callback?.())
  await flushPromises()
}

async function scrollToEnd (wrapper) {
  const ref = { reset: vi.fn(), refresh: vi.fn() }

  getQSelect(wrapper).vm.$emit('virtual-scroll', { index: getOptionValues(wrapper).length - 1, ref })
  await flushPromises()
}

describe('QasSelect com lazy loading', () => {
  describe('primeira busca', () => {
    it('busca as opções ao ser criado, com o nome do campo com hífen, limite de 48 e sem busca', async () => {
      const { fetch } = await mountLazySelect()

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith({
        url: '',
        field: 'responsible-user',
        params: { limit: 48, search: '', offset: 0 }
      })
    })

    it('exibe as opções devolvidas pela API', async () => {
      const { wrapper } = await mountLazySelect()

      expect(getOptionValues(wrapper)).toEqual(['user-1', 'user-2', 'user-3'])
    })

    it('usa a url, os parâmetros e o limite de "lazy-loading-props"', async () => {
      const { fetch } = await mountLazySelect({
        props: { lazyLoadingProps: { url: '/users/options/', params: { limit: 10, active: true } } }
      })

      expect(fetch).toHaveBeenCalledWith({
        url: '/users/options/',
        field: 'responsible-user',
        params: { limit: 10, active: true, search: '', offset: 0 }
      })
    })

    it('com "decamelize-field-name" false, envia o nome do campo como está', async () => {
      const { fetch } = await mountLazySelect({ props: { lazyLoadingProps: { decamelizeFieldName: false } } })

      expect(fetch.mock.calls[0][0].field).toBe('responsibleUser')
    })

    it('habilita a busca no campo, com espera maior entre as teclas', async () => {
      const { wrapper } = await mountLazySelect()

      expect(getQSelect(wrapper).props('useInput')).toBe(true)
      expect(getQSelect(wrapper).props('inputDebounce')).toBe(1200)
    })

    it('emite "update:fetching" durante a busca e "fetch-options-success" com a resposta', async () => {
      const { wrapper } = await mountLazySelect()

      expect(wrapper.emitted('update:fetching')).toEqual([[true], [false]])
      expect(wrapper.emitted('fetchOptionsSuccess')[0][0].results).toHaveLength(3)
    })
  })

  describe('busca ao abrir', () => {
    it('com "use-fetch-options-on-focus", só busca ao abrir as opções, e uma única vez', async () => {
      const { wrapper, fetch } = await mountLazySelect({ props: { useFetchOptionsOnFocus: true } })

      expect(fetch).not.toHaveBeenCalled()

      getQSelect(wrapper).vm.$emit('popupShow')
      await flushPromises()
      getQSelect(wrapper).vm.$emit('popupShow')
      await flushPromises()

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('com "use-fetch-options-on-create" false, não busca ao ser criado', async () => {
      const { fetch } = await mountLazySelect({ props: { useFetchOptionsOnCreate: false } })

      expect(fetch).not.toHaveBeenCalled()
    })
  })

  describe('pesquisa', () => {
    it('busca na API com o texto digitado e substitui as opções', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 15 }) })

      await typeSearch(wrapper, 'Usuário 1')

      expect(fetch.mock.calls.at(-1)[0].params).toMatchObject({ search: 'Usuário 1', offset: 0 })
      expect(getOptionValues(wrapper)).toEqual(['user-1', 'user-10', 'user-11', 'user-12', 'user-13', 'user-14', 'user-15'])
    })

    it('não busca de novo quando o texto não mudou', async () => {
      const { wrapper, fetch } = await mountLazySelect()

      await typeSearch(wrapper, 'Usuário 2')
      await typeSearch(wrapper, 'Usuário 2')

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('volta para a lista completa quando a pesquisa é apagada', async () => {
      const { wrapper } = await mountLazySelect()

      await typeSearch(wrapper, 'Usuário 2')
      await typeSearch(wrapper, '')

      expect(getOptionValues(wrapper)).toEqual(['user-1', 'user-2', 'user-3'])
    })
  })

  describe('paginação ao rolar', () => {
    it('ao chegar no fim da lista, busca a próxima página e adiciona as opções', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 100 }) })

      await scrollToEnd(wrapper)

      expect(fetch.mock.calls.at(-1)[0].params).toMatchObject({ offset: 48 })
      expect(getOptionValues(wrapper)).toHaveLength(96)
      expect(getOptionValues(wrapper).at(-1)).toBe('user-96')
    })

    it('para de buscar depois da última página', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 100 }) })

      await scrollToEnd(wrapper)
      await scrollToEnd(wrapper)
      await scrollToEnd(wrapper)

      expect(fetch).toHaveBeenCalledTimes(3)
      expect(getOptionValues(wrapper)).toHaveLength(100)
    })

    it('não busca ao rolar se ainda não chegou no fim da lista', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 100 }) })

      getQSelect(wrapper).vm.$emit('virtual-scroll', { index: 10, ref: { reset: vi.fn(), refresh: vi.fn() } })
      await flushPromises()

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('funciona com APIs que respondem "hasNextPage" no lugar de "count"', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 60, withCount: false }) })

      await scrollToEnd(wrapper)
      await scrollToEnd(wrapper)

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(getOptionValues(wrapper)).toHaveLength(60)
    })

    it('pagina a partir da pesquisa atual', async () => {
      const { wrapper, fetch } = await mountLazySelect({ store: createStore({ total: 200 }) })

      await typeSearch(wrapper, 'Usuário 1')
      await scrollToEnd(wrapper)

      expect(fetch.mock.calls.at(-1)[0].params).toMatchObject({ search: 'Usuário 1', offset: 48 })
    })
  })

  describe('opções já selecionadas', () => {
    it('mantém no topo as opções passadas em "options" (ex: o valor já salvo), sem duplicar', async () => {
      const { wrapper } = await mountLazySelect({
        props: { modelValue: 'user-2', options: [{ label: 'Usuário 2', value: 'user-2' }] }
      })

      expect(getOptionValues(wrapper)).toEqual(['user-2', 'user-1', 'user-3'])
    })

    it('remove as opções de "options-to-exclude"', async () => {
      const { wrapper } = await mountLazySelect({ props: { optionsToExclude: ['user-2'] } })

      expect(getOptionValues(wrapper)).toEqual(['user-1', 'user-3'])
    })

    it('emite "update:selectedOptions" com as opções completas quando o valor muda', async () => {
      const { wrapper } = await mountLazySelect()

      await wrapper.setProps({ modelValue: 'user-3' })

      expect(wrapper.emitted('update:selectedOptions').at(-1)).toEqual([[{ label: 'Usuário 3', value: 'user-3' }]])
    })
  })

  describe('seleção automática', () => {
    it('com "required", seleciona a opção quando a API devolve uma única opção', async () => {
      const { wrapper } = await mountLazySelect({ props: { required: true }, store: createStore({ total: 1 }) })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['user-1'])
    })

    it('não seleciona quando a API devolve mais de uma opção', async () => {
      const { wrapper } = await mountLazySelect({ props: { required: true } })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('mudança de parâmetros', () => {
    it('quando os parâmetros mudam, busca de novo e limpa o valor selecionado', async () => {
      vi.useFakeTimers()

      const { wrapper, fetch } = await mountLazySelect({
        props: { modelValue: 'user-1', lazyLoadingProps: { params: { company: 1 } } }
      })

      await wrapper.setProps({ lazyLoadingProps: { params: { company: 2 } } })
      await vi.runAllTimersAsync()

      vi.useRealTimers()

      expect(fetch.mock.calls.at(-1)[0].params).toMatchObject({ company: 2, offset: 0 })
      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([undefined])
    })

    it('não busca de novo quando recebe os mesmos parâmetros em um novo objeto', async () => {
      const { wrapper, fetch } = await mountLazySelect({ props: { lazyLoadingProps: { params: { company: 1 } } } })

      await wrapper.setProps({ lazyLoadingProps: { params: { company: 1 } } })
      await flushPromises()

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('erros', () => {
    it('quando a busca falha, marca o campo com erro e emite "fetch-options-error"', async () => {
      const { wrapper } = await mountLazySelect({ store: createStore({ fail: true }) })

      expect(getQSelect(wrapper).props('error')).toBe(true)
      expect(wrapper.emitted('fetchOptionsError')).toHaveLength(1)
    })

    it('lança um erro avisando quando falta a prop "name", sem fazer a requisição', async () => {
      // sem a busca ao criar, para o erro ser lançado na chamada abaixo e não durante a montagem
      const { wrapper, fetch } = await mountLazySelect({ props: { name: '', useFetchOptionsOnCreate: false } })

      await expect(wrapper.vm.mx_fetchOptions()).rejects.toThrow(
        'A propriedade "name" é obrigatória quando a propriedade "useLazyLoading" está ativa.'
      )

      expect(fetch).not.toHaveBeenCalled()
    })
  })
})
