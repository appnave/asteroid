import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reactive } from 'vue'

import QasSingleView from './QasSingleView.vue'
import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { mountQas, createAxiosMock } from '../../../../test/utils/mount-qas.js'

// o QasSingleView notifica direto pelo plugin, sem passar pelo "$qas"
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

const user = { uuid: '1', name: 'Ana' }
const routes = [{ path: '/users/:id', name: 'UsersShow', component: { template: '<div />' } }]

function apiResponse (data = {}) {
  return createAxiosMock(() => ({
    data: { result: user, fields: {}, metadata: {}, errors: {}, ...data }
  }))
}

function apiError (status) {
  return createAxiosMock(() => {
    throw Object.assign(new Error(`Request failed with status code ${status}`), { response: { status } })
  })
}

function mountSingle ({ props = {}, ...options } = {}) {
  return mountQas(QasSingleView, {
    props: { entity: 'users', useStore: false, ...props },
    route: '/users/1',
    routes,
    axios: apiResponse(),
    ...options
  })
}

describe('QasSingleView', () => {
  beforeEach(() => {
    vi.mocked(NotifyError).mockClear()
  })

  describe('busca sem store', () => {
    it('busca o registro pelo id da rota ao ser criado', async () => {
      const { axios } = await mountSingle()

      expect(axios.get).toHaveBeenCalledTimes(1)
      expect(axios.get.mock.calls[0][0]).toBe('users/1')
    })

    it('converte a entidade em camelCase para a URL com hífen', async () => {
      const { axios } = await mountSingle({ props: { entity: 'realEstateDevelopments' } })

      expect(axios.get.mock.calls[0][0]).toBe('real-estate-developments/1')
    })

    it('usa o "custom-id" no lugar do id da rota', async () => {
      const { axios } = await mountSingle({ props: { customId: 42 } })

      expect(axios.get.mock.calls[0][0]).toBe('users/42')
    })

    it('usa a prop "url" no lugar da entidade e do id', async () => {
      const { axios } = await mountSingle({ props: { url: '/me/' } })

      expect(axios.get.mock.calls[0][0]).toBe('/me/')
    })

    it('pode ser buscado de novo pelo método exposto "fetchSingle"', async () => {
      const { wrapper, axios } = await mountSingle()

      await wrapper.vm.fetchSingle()

      expect(axios.get).toHaveBeenCalledTimes(2)
    })

    // ex: espelho de vendas, que troca o empreendimento pelo select e chama o "fetchSingle" em seguida
    it('não busca sozinho quando o id da rota muda, a tela precisa chamar o "fetchSingle"', async () => {
      const { wrapper, router, axios } = await mountSingle()

      await router.push('/users/2')
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)

      await wrapper.vm.fetchSingle()

      expect(axios.get).toHaveBeenCalledTimes(2)
      expect(axios.get.mock.calls[1][0]).toBe('users/2')
    })
  })

  describe('eventos e models', () => {
    it('emite "update:result" com o registro', async () => {
      const { wrapper } = await mountSingle()

      expect(wrapper.emitted('update:result').at(-1)[0]).toEqual(user)
    })

    it('emite "fetch-success" com a resposta', async () => {
      const { wrapper } = await mountSingle()

      expect(wrapper.emitted('fetch-success')[0][0].data.result).toEqual(user)
    })

    it('emite "update:fields" com o "name" de cada campo em camelCase', async () => {
      const { wrapper } = await mountSingle({
        axios: apiResponse({ fields: { fullName: { name: 'full_name', type: 'text' } } })
      })

      expect(wrapper.emitted('update:fields').at(-1)[0].fullName.name).toBe('fullName')
    })

    it('emite "update:metadata" com o metadata da resposta', async () => {
      const { wrapper } = await mountSingle({ axios: apiResponse({ metadata: { canEdit: true } }) })

      expect(wrapper.emitted('update:metadata').at(-1)[0]).toEqual({ canEdit: true })
    })

    it('emite "update:fetching" true no início e false ao terminar', async () => {
      const { wrapper } = await mountSingle()

      expect(wrapper.emitted('update:fetching')).toEqual([[true], [false]])
    })
  })

  describe('renderização', () => {
    it('exibe o slot default com o registro carregado', async () => {
      const { wrapper } = await mountSingle({ slots: { default: '<p class="detalhe">detalhe</p>' } })

      expect(wrapper.find('.detalhe').exists()).toBe(true)
    })

    it('exibe os slots "header" e "footer"', async () => {
      const { wrapper } = await mountSingle({
        slots: { header: '<p class="topo">topo</p>', footer: '<p class="rodape">rodapé</p>' }
      })

      expect(wrapper.find('header .topo').exists()).toBe(true)
      expect(wrapper.find('footer .rodape').exists()).toBe(true)
    })
  })

  describe('erros na busca', () => {
    it.each([
      [403, 'Forbidden'],
      [404, 'NotFound'],
      [500, 'ServerError']
    ])('status %i redireciona para "%s" sem notificar', async (status, routeName) => {
      const { router } = await mountSingle({ axios: apiError(status) })

      await flushPromises()

      expect(router.currentRoute.value.name).toBe(routeName)
      expect(NotifyError).not.toHaveBeenCalled()
    })

    it('outros erros notificam o usuário e emitem "fetch-error"', async () => {
      const { wrapper } = await mountSingle({ axios: apiError(400) })

      expect(NotifyError).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('fetch-error')).toHaveLength(1)
      expect(wrapper.emitted('update:fetching').at(-1)).toEqual([false])
    })

    it('exibe o slot "fetch-error" no lugar do conteúdo quando a busca falha', async () => {
      const { wrapper } = await mountSingle({
        axios: apiError(400),
        slots: {
          default: '<p class="detalhe">detalhe</p>',
          'fetch-error': '<p class="falhou">falhou</p>'
        }
      })

      expect(wrapper.find('.falhou').exists()).toBe(true)
      expect(wrapper.find('.detalhe').exists()).toBe(false)
    })
  })

  describe('prop before-fetch', () => {
    it('só busca quando o "before-fetch" chama o "resolve", recebendo o id no "payload"', async () => {
      let resolveFetch

      const beforeFetch = vi.fn(({ resolve }) => { resolveFetch = resolve })
      const { axios } = await mountSingle({ props: { beforeFetch } })

      expect(beforeFetch.mock.calls[0][0].payload).toMatchObject({ id: '1' })
      expect(axios.get).not.toHaveBeenCalled()

      resolveFetch()
      await flushPromises()

      expect(axios.get).toHaveBeenCalledTimes(1)
    })

    it('depois do "done", as próximas buscas não passam mais pelo "before-fetch"', async () => {
      const beforeFetch = vi.fn(({ resolve, done }) => { done(); resolve() })
      const { wrapper, axios } = await mountSingle({ props: { beforeFetch } })

      await wrapper.vm.fetchHandler({}, wrapper.vm.fetchSingle)
      await flushPromises()

      expect(beforeFetch).toHaveBeenCalledTimes(1)
      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('busca com store', () => {
    // simula uma store reativa: a action salva o registro e o getter "byId" passa a encontrá-lo
    function createQas () {
      const state = reactive({ items: {} })
      const byId = vi.fn(id => state.items[id])

      return {
        byId,
        qas: {
          getAction: vi.fn(async ({ payload }) => {
            state.items[payload.id] = { ...user, uuid: payload.id }

            return { data: { result: user } }
          }),
          getGetter: vi.fn(() => byId)
        }
      }
    }

    it('chama a action "fetchSingle" da store com o id, em vez do axios', async () => {
      const { qas } = createQas()
      const { axios } = await mountSingle({ props: { useStore: true }, provide: { qas } })

      expect(axios.get).not.toHaveBeenCalled()
      expect(qas.getAction).toHaveBeenCalledWith({
        entity: 'users',
        key: 'fetchSingle',
        payload: { id: '1', url: '' }
      })
    })

    it('usa o getter "byId" da store como resultado', async () => {
      const { qas, byId } = createQas()
      const { wrapper } = await mountSingle({ props: { useStore: true }, provide: { qas } })

      expect(qas.getGetter).toHaveBeenCalledWith({ entity: 'users', key: 'byId' })
      expect(byId).toHaveBeenCalledWith('1')
      expect(wrapper.emitted('update:result').at(-1)[0]).toEqual({ ...user, uuid: '1' })
    })
  })
})
