import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils/mount-helper'
import { getAction } from '@bildvitta/store-adapter'
import { useRouter, useRoute } from 'vue-router'
import QasFormView from './QasFormView.vue'

const defaultEntity = 'users'
const defaultUrl = '/api/users'
const defaultRoute = { name: 'users-edit', params: { id: '1' }, query: {}, meta: {}, path: '/users/1' }

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasFormView, {
    props: {
      entity: defaultEntity,
      url: defaultUrl,
      // Passar route via prop para evitar dependência de $route
      route: defaultRoute,
      ...props
    },
    ...mountOptions
  })
}

describe('QasFormView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAction.mockResolvedValue({
      data: { results: {}, fields: {}, metadata: {}, result: {}, status: { text: 'Salvo com sucesso.' } }
    })
    useRoute.mockReturnValue({
      name: 'users-edit',
      params: { id: '1' },
      query: {},
      meta: {},
      path: '/users/1'
    })
    useRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      resolve: vi.fn(path => ({ path })),
      currentRoute: { value: defaultRoute }
    })
  })

  describe('renderização básica', () => {
    it('renderiza corretamente com props mínimas', () => {
      const wrapper = factory()
      expect(wrapper.exists()).toBe(true)
    })

    it('tem a classe "qas-form-view"', () => {
      const wrapper = factory()
      expect(wrapper.find('.qas-form-view').exists()).toBe(true)
    })
  })

  describe('lifecycle created — fetch', () => {
    it('chama getAction fetchSingle no created com useStore=true', async () => {
      factory()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ entity: defaultEntity, key: 'fetchSingle' })
      )
    })

    it('chama getAction com payload contendo id da rota quando mode="update"', async () => {
      factory({ mode: 'update', route: { name: 'edit', params: { id: '42' }, query: {}, meta: {}, path: '/users/42' } })
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({
          entity: defaultEntity,
          key: 'fetchSingle',
          payload: expect.objectContaining({ id: '42' })
        })
      )
    })

    it('usa customId quando fornecido ao invés de route.params.id', async () => {
      factory({ customId: 'custom-99' })
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ id: 'custom-99' })
        })
      )
    })

    it('emite fetch-success após fetch bem-sucedido', async () => {
      const wrapper = factory()
      await flushPromises()
      expect(wrapper.emitted('fetch-success')).toBeTruthy()
    })

    it('chama beforeFetch quando prop fornecida antes do fetch', async () => {
      const beforeFetch = vi.fn(({ resolve }) => resolve())
      factory({ beforeFetch })
      await flushPromises()
      expect(beforeFetch).toHaveBeenCalled()
    })
  })

  describe('submit via submitHandler', () => {
    it('emite submit-success após submit bem-sucedido', async () => {
      const wrapper = factory({ mode: 'create' })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: { id: 1 }, status: { text: 'Criado!' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(wrapper.emitted('submit-success')).toBeTruthy()
    })

    it('dispara window event submit-success após submit bem-sucedido', async () => {
      const spy = vi.spyOn(window, 'dispatchEvent')
      const wrapper = factory({ mode: 'create' })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(spy).toHaveBeenCalledWith(expect.any(CustomEvent))
    })

    it('emite submit-error quando getAction rejeita', async () => {
      const wrapper = factory({ mode: 'create' })
      await flushPromises()
      getAction.mockRejectedValueOnce({ response: { status: 422, data: { errors: {}, status: { text: 'Erro' } } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(wrapper.emitted('submit-error')).toBeTruthy()
    })

    it('disable=true retorna null sem processar submit', async () => {
      const wrapper = factory({ disable: true })
      await flushPromises()
      vi.clearAllMocks()
      const result = await wrapper.vm.submit()
      expect(result).toBeNull()
      expect(getAction).not.toHaveBeenCalled()
    })

    it('beforeSubmit controla quando chamar submit via resolve', async () => {
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      const wrapper = factory({
        beforeSubmit: ({ resolve }) => resolve()
      })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submitHandler()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'create' })
      )
    })

    it('usa key "update" no getAction quando mode="update"', async () => {
      const wrapper = factory({ mode: 'update' })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'update' })
      )
    })

    it('usa key "replace" no getAction quando mode="replace"', async () => {
      const wrapper = factory({ mode: 'replace' })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(getAction).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'replace' })
      )
    })
  })

  describe('emits de model', () => {
    it('mx_fields é populado com os fields retornados pela API', async () => {
      getAction.mockResolvedValueOnce({ data: { fields: { name: { name: 'name', label: 'Nome', type: 'text' } }, metadata: {}, result: {}, status: {} } })
      const wrapper = factory({ mode: 'update' })
      await flushPromises()
      expect(Object.keys(wrapper.vm.mx_fields).length).toBeGreaterThan(0)
    })

    it('emite update:metadata quando API retorna metadata', async () => {
      getAction.mockResolvedValueOnce({ data: { fields: {}, metadata: { title: 'Usuário' }, result: {}, status: {} } })
      const wrapper = factory({ mode: 'update' })
      await flushPromises()
      expect(wrapper.emitted('update:metadata')).toBeTruthy()
    })

    it('emite update:errors após submit com sucesso (limpa erros)', async () => {
      const wrapper = factory({ mode: 'create' })
      await flushPromises()
      vi.clearAllMocks()
      getAction.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(wrapper.emitted('update:errors')).toBeTruthy()
    })
  })

  describe('props de exibição', () => {
    it('useSubmitButton=false oculta botão de submit', () => {
      const wrapper = factory({ useSubmitButton: false })
      expect(wrapper.find(`[data-cy="form-view-submit-btn-${defaultEntity}"]`).exists()).toBe(false)
    })

    it('useSubmitButton=true (padrão) exibe botão de submit', async () => {
      const wrapper = factory({ useSubmitButton: true })
      await flushPromises()
      expect(wrapper.find(`[data-cy="form-view-submit-btn-${defaultEntity}"]`).exists()).toBe(true)
    })

    it('useActions=false não renderiza área de ações', () => {
      const wrapper = factory({ useActions: false })
      expect(wrapper.find(`[data-cy="form-view-submit-btn-${defaultEntity}"]`).exists()).toBe(false)
    })

    it('disable=true aplica disable ao botão de submit', async () => {
      const wrapper = factory({ disable: true })
      await flushPromises()
      const submitBtn = wrapper.find(`[data-cy="form-view-submit-btn-${defaultEntity}"]`)
      expect(submitBtn.attributes('disabled')).toBeDefined()
    })

    it('cancelRoute=false oculta botão de cancelar', async () => {
      const wrapper = factory({ cancelRoute: false })
      await flushPromises()
      expect(wrapper.find(`[data-cy="form-view-cancel-btn-${defaultEntity}"]`).exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('slot header renderiza conteúdo customizado', () => {
      const wrapper = factory({}, { slots: { header: '<div data-cy="custom-header">header</div>' } })
      expect(wrapper.find('[data-cy="custom-header"]').exists()).toBe(true)
    })

    it('slot footer renderiza conteúdo customizado', () => {
      const wrapper = factory({}, { slots: { footer: '<div data-cy="custom-footer">footer</div>' } })
      expect(wrapper.find('[data-cy="custom-footer"]').exists()).toBe(true)
    })

    it('slot fetch-error exibido quando mx_hasFetchError=true', async () => {
      const wrapper = factory({}, { slots: { 'fetch-error': '<div data-cy="fetch-error-slot">erro</div>' } })
      wrapper.vm.mx_hasFetchError = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-cy="fetch-error-slot"]').exists()).toBe(true)
    })
  })

  describe('useStore=false', () => {
    it('usa this.$axios.get diretamente quando useStore=false', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { fields: {}, metadata: {}, result: {}, status: {} } })
      factory({ useStore: false }, {
        global: {
          mocks: {
            $axios: {
              get: axiosGetMock,
              post: vi.fn().mockResolvedValue({ data: { result: {}, status: { text: 'OK' } } }),
              put: vi.fn().mockResolvedValue({ data: {} }),
              patch: vi.fn().mockResolvedValue({ data: {} }),
              delete: vi.fn().mockResolvedValue({ data: {} })
            }
          }
        }
      })
      await flushPromises()
      expect(axiosGetMock).toHaveBeenCalled()
      expect(getAction).not.toHaveBeenCalled()
    })

    it('usa this.$axios.post quando useStore=false e mode=create', async () => {
      const axiosGetMock = vi.fn().mockResolvedValue({ data: { fields: {}, metadata: {}, result: {}, status: {} } })
      const axiosMock = vi.fn().mockResolvedValue({ data: { result: {}, status: { text: 'OK' } } })
      axiosMock.get = axiosGetMock
      const wrapper = factory({ useStore: false, mode: 'create' }, {
        global: {
          mocks: {
            $axios: axiosMock
          }
        }
      })
      await flushPromises()
      vi.clearAllMocks()
      axiosMock.mockResolvedValueOnce({ data: { result: {}, status: { text: 'OK' } } })
      await wrapper.vm.submit()
      await flushPromises()
      expect(axiosMock).toHaveBeenCalledWith(expect.objectContaining({ method: 'post' }))
      expect(getAction).not.toHaveBeenCalled()
    })
  })

  describe('provide', () => {
    it('provide updateUnsavedChangesCache é uma função', () => {
      const wrapper = factory()
      expect(typeof wrapper.vm.$.provides.updateUnsavedChangesCache).toBe('function')
    })
  })
})
