import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasInfiniteScroll from './QasInfiniteScroll.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { createAxiosMock, mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

const makeItems = (quantity, start = 1) => Array.from({ length: quantity }, (_, index) => ({ id: start + index }))

/**
 * API paginada com "total" itens, respondendo conforme "offset" e "limit".
 */
function createApi ({ total = 30, fail = false } = {}) {
  return createAxiosMock(async ({ config: { params } }) => {
    if (fail) throw new Error('falhou')

    return {
      data: {
        results: makeItems(Math.max(0, Math.min(params.limit, total - params.offset)), params.offset + 1),
        count: total,
        fields: { name: { name: 'name' } }
      }
    }
  })
}

async function mountInfiniteScroll ({ props = {}, axios = createApi(), ...options } = {}) {
  const mounted = await mountQas(QasInfiniteScroll, { props: { url: 'users', ...props }, axios, ...options })

  await flushPromises()

  return mounted
}

const getLastList = wrapper => wrapper.emitted('update:list').at(-1)[0]

describe('QasInfiniteScroll', () => {
  beforeEach(() => {
    NotifyError.mockClear()
  })

  describe('busca', () => {
    it('busca a primeira página com "limit-per-page" e "params"', async () => {
      const { axios } = await mountInfiniteScroll({ props: { limitPerPage: 5, params: { status: 'active' } } })

      expect(axios.get).toHaveBeenCalledWith('users', { params: { offset: 0, limit: 5, status: 'active' } })
    })

    it('atualiza a lista e os fields e emite "fetch-success"', async () => {
      const { wrapper } = await mountInfiniteScroll({ props: { limitPerPage: 5 } })

      expect(getLastList(wrapper)).toEqual(makeItems(5))
      expect(wrapper.emitted('update:fields').at(-1)).toEqual([{ name: { name: 'name' } }])
      expect(wrapper.emitted('fetch-success')[0][0]).toMatchObject({ offset: 5, count: 30 })
    })

    it('a próxima busca continua de onde parou', async () => {
      const { wrapper, axios } = await mountInfiniteScroll({ props: { limitPerPage: 5 } })

      await wrapper.setProps({ list: getLastList(wrapper) })
      await wrapper.vm.fetchList()

      expect(axios.get).toHaveBeenLastCalledWith('users', { params: { offset: 5, limit: 5 } })
      expect(getLastList(wrapper)).toEqual(makeItems(10))
    })

    it('com erro, avisa o usuário e emite "fetch-error"', async () => {
      const { wrapper } = await mountInfiniteScroll({ axios: createApi({ fail: true }) })

      expect(NotifyError).toHaveBeenCalledWith('Ops… Não conseguimos acessar as informações. Por favor, tente novamente em alguns minutos.')
      expect(wrapper.emitted('fetch-error')).toHaveLength(1)
    })

    it('sem resultados, exibe o texto de vazio', async () => {
      const { wrapper } = await mountInfiniteScroll({ axios: createApi({ total: 0 }) })

      expect(wrapper.findComponent(QasEmptyResultText).exists()).toBe(true)
    })
  })

  describe('métodos', () => {
    it('"refresh" limpa a lista para buscar de novo do início', async () => {
      const { wrapper } = await mountInfiniteScroll({ props: { limitPerPage: 5 } })

      await wrapper.setProps({ list: getLastList(wrapper) })

      wrapper.vm.refresh()

      expect(getLastList(wrapper)).toEqual([])
    })

    it('"remove" tira o item da lista e ajusta a próxima busca', async () => {
      const { wrapper, axios } = await mountInfiniteScroll({ props: { limitPerPage: 5 } })

      await wrapper.setProps({ list: getLastList(wrapper) })

      wrapper.vm.remove(0)
      await wrapper.vm.fetchList()

      expect(axios.get).toHaveBeenLastCalledWith('users', { params: { offset: 4, limit: 5 } })
    })
  })

  describe('problemas', () => {
    // Problema listado no documento: o "refresh" não limpa o erro anterior, então a lista nunca volta a carregar.
    it.fails('"refresh" depois de um erro busca a lista de novo', async () => {
      let shouldFail = true

      const axios = createAxiosMock(async () => {
        if (shouldFail) throw new Error('falhou')

        return { data: { results: makeItems(3), count: 3, fields: {} } }
      })

      const { wrapper } = await mountInfiniteScroll({ axios })

      shouldFail = false
      wrapper.vm.refresh()
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('scroll', () => {
    it('com "max-height", rola dentro do próprio container', async () => {
      const { wrapper } = await mountInfiniteScroll({ props: { maxHeight: '300px' } })

      expect(wrapper.attributes('style')).toContain('max-height: 300px')
      expect(wrapper.findComponent({ name: 'QInfiniteScroll' }).props('scrollTarget')).toBe('.qas-infinite-scroll')
    })

    it('dentro de um overlay, rola dentro do conteúdo do drawer', async () => {
      const { wrapper } = await mountInfiniteScroll({ provide: { isOverlay: true } })

      expect(wrapper.findComponent({ name: 'QInfiniteScroll' }).props('scrollTarget')).toBe('.pv-layout-overlay-drawer__content')
    })
  })
})
