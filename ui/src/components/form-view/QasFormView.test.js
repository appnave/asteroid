import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { RouterView } from 'vue-router'

import QasFormView from './QasFormView.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasDialog from '../dialog/QasDialog.vue'
import NotifyError from '../../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../../plugins/notify-success/NotifySuccess.js'

import { mountQas, createAxiosMock } from '../../../../test/utils/mount-qas.js'

// o QasFormView notifica direto pelos plugins, sem passar pelo "$qas"
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))
vi.mock('../../plugins/notify-success/NotifySuccess.js', () => ({ default: vi.fn() }))

const EmptyPage = { template: '<div />' }

const fetchResponse = {
  fields: {
    name: { name: 'name', type: 'text', default: '' },
    active: { name: 'active', type: 'boolean', default: true }
  },
  result: { name: 'Ana' },
  metadata: {},
  errors: {}
}

function createFormAxiosMock ({ fetch = fetchResponse, submit = { result: {}, status: { text: 'Salvo!' } }, submitError } = {}) {
  return createAxiosMock(({ method }) => {
    if (method === 'get') return { data: fetch }

    if (submitError) throw submitError

    return { data: submit }
  })
}

function createSubmitError ({ errors, text } = {}) {
  return Object.assign(new Error('Request failed'), {
    response: { status: 400, data: { errors, status: { text } } }
  })
}

/**
 * Monta o QasFormView como página de uma rota (necessário para o aviso de alterações não salvas),
 * com o v-model ligado a um ref que o teste pode alterar.
 */
async function mountForm ({ props = {}, route = '/users/1/edit', axios = createFormAxiosMock(), slots = {} } = {}) {
  const model = ref({})

  const Page = defineComponent({
    setup () {
      return () => h(QasFormView, {
        entity: 'users',
        useStore: false,
        mode: 'update',
        ...props,
        modelValue: model.value,
        'onUpdate:modelValue': value => { model.value = value }
      }, slots)
    }
  })

  const mounted = await mountQas(RouterView, {
    route,
    axios,
    routes: [
      { path: '/users', name: 'UsersList', component: EmptyPage },
      { path: '/users/new', name: 'UsersCreate', component: Page },
      { path: '/users/:id/edit', name: 'UsersEdit', component: Page },
      { path: '/other', name: 'Other', component: EmptyPage }
    ]
  })

  await flushPromises()

  const form = mounted.wrapper.findComponent(QasFormView)

  return { ...mounted, form, model }
}

const getButton = (form, label) => form.findAllComponents(QasBtn).find(button => button.props('label') === label)

async function submit (form) {
  await form.find('form').trigger('submit')
  await flushPromises()
}

describe('QasFormView', () => {
  beforeEach(() => {
    vi.mocked(NotifyError).mockClear()
    vi.mocked(NotifySuccess).mockClear()
  })

  describe('busca do formulário', () => {
    it('no modo "create", busca "<entidade>/new"', async () => {
      const { axios } = await mountForm({ props: { mode: 'create' }, route: '/users/new' })

      expect(axios.get.mock.calls[0][0]).toBe('users/new')
    })

    it('no modo "update", busca "<entidade>/<id>/edit" com o id da rota', async () => {
      const { axios } = await mountForm()

      expect(axios.get.mock.calls[0][0]).toBe('users/1/edit')
    })

    it('usa o "custom-id" no lugar do id da rota', async () => {
      const { axios } = await mountForm({ props: { customId: 9 } })

      expect(axios.get.mock.calls[0][0]).toBe('users/9/edit')
    })

    it('com a prop "url", busca "<url>/new" ou "<url>/edit"', async () => {
      const { axios } = await mountForm({ props: { url: '/me' } })

      expect(axios.get.mock.calls[0][0]).toBe('/me/edit')
    })

    it('preenche o model com os valores padrão dos campos e o resultado da API', async () => {
      const { model } = await mountForm()

      expect(model.value).toEqual({ name: 'Ana', active: true })
    })

    it('emite "fetch-success" com a resposta', async () => {
      const { form } = await mountForm()

      expect(form.emitted('fetch-success')).toHaveLength(1)
    })
  })

  describe('envio', () => {
    it.each([
      ['create', 'post', 'users', '/users/new'],
      ['update', 'patch', 'users/1', '/users/1/edit'],
      ['replace', 'put', 'users/1', '/users/1/edit']
    ])('no modo "%s", envia %s para "%s" com o model', async (mode, method, url, route) => {
      const { form, axios } = await mountForm({ props: { mode }, route })

      await submit(form)

      expect(axios).toHaveBeenCalledWith({ method, url, data: { name: 'Ana', active: true } })
    })

    it('em caso de sucesso, notifica com a mensagem da API e emite "submit-success"', async () => {
      const { form } = await mountForm()

      await submit(form)

      expect(NotifySuccess).toHaveBeenCalledWith('Salvo!')
      expect(form.emitted('submit-success')).toHaveLength(1)
    })

    it('usa a mensagem padrão de sucesso quando a API não envia uma', async () => {
      const { form } = await mountForm({ axios: createFormAxiosMock({ submit: { result: {}, status: {} } }) })

      await submit(form)

      expect(NotifySuccess).toHaveBeenCalledWith('Informações salvas com sucesso.')
    })

    it('com "use-notify-success" false, não notifica o sucesso', async () => {
      const { form } = await mountForm({ props: { useNotifySuccess: false } })

      await submit(form)

      expect(NotifySuccess).not.toHaveBeenCalled()
      expect(form.emitted('submit-success')).toHaveLength(1)
    })

    it('dispara o evento global "submit-success" com a entidade', async () => {
      const listener = vi.fn()

      window.addEventListener('submit-success', listener)

      const { form } = await mountForm()

      await submit(form)

      window.removeEventListener('submit-success', listener)

      expect(listener.mock.calls[0][0].detail).toMatchObject({ entity: 'users', id: '1' })
    })

    it('atualiza o model com o resultado devolvido pelo envio', async () => {
      const { form, model } = await mountForm({ axios: createFormAxiosMock({ submit: { result: { uuid: 'abc' }, status: {} } }) })

      await submit(form)

      expect(model.value).toEqual({ name: 'Ana', active: true, uuid: 'abc' })
    })

    it('emite "update:submitting" true durante o envio e false ao terminar', async () => {
      const { form } = await mountForm()

      await submit(form)

      expect(form.emitted('update:submitting')).toEqual([[true], [false]])
    })

    it('com "disable", não envia', async () => {
      const { form, axios } = await mountForm({ props: { disable: true } })

      await submit(form)

      expect(axios).not.toHaveBeenCalled()
    })
  })

  describe('erros no envio', () => {
    it('com erros de campo, emite "update:errors" e notifica pedindo revisão dos campos', async () => {
      const errors = { name: ['Obrigatório'] }
      const { form } = await mountForm({ axios: createFormAxiosMock({ submitError: createSubmitError({ errors }) }) })

      await submit(form)

      expect(form.emitted('update:errors').at(-1)[0]).toEqual(errors)
      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos salvar as informações. Por favor, revise os campos e tente novamente.')
      expect(form.emitted('submit-error')).toHaveLength(1)
    })

    it('sem erros de campo, notifica com a mensagem genérica', async () => {
      const { form } = await mountForm({ axios: createFormAxiosMock({ submitError: createSubmitError() }) })

      await submit(form)

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos salvar as informações. Por favor, tente novamente em alguns minutos.')
    })

    it('prioriza a mensagem de erro enviada pela API', async () => {
      const { form } = await mountForm({ axios: createFormAxiosMock({ submitError: createSubmitError({ text: 'CPF já cadastrado' }) }) })

      await submit(form)

      expect(NotifyError).toHaveBeenCalledWith('CPF já cadastrado')
    })

    it('volta "submitting" para false mesmo com erro', async () => {
      const { form } = await mountForm({ axios: createFormAxiosMock({ submitError: createSubmitError() }) })

      await submit(form)

      expect(form.emitted('update:submitting').at(-1)).toEqual([false])
    })
  })

  describe('prop before-submit', () => {
    it('recebe o model e só envia quando chama o "resolve"', async () => {
      let resolveSubmit

      const beforeSubmit = vi.fn(({ resolve }) => { resolveSubmit = resolve })
      const { form, axios } = await mountForm({ props: { beforeSubmit } })

      await submit(form)

      expect(beforeSubmit.mock.calls[0][0].payload).toMatchObject({ id: '1', payload: { name: 'Ana', active: true } })
      expect(axios).not.toHaveBeenCalled()

      resolveSubmit()
      await flushPromises()

      expect(axios).toHaveBeenCalledTimes(1)
    })
  })

  describe('botões', () => {
    it('exibe "Salvar" e "Voltar" por padrão', async () => {
      const { form } = await mountForm()

      expect(getButton(form, 'Salvar')).toBeDefined()
      expect(getButton(form, 'Voltar')).toBeDefined()
    })

    it('usa os textos de "submit-button-label" e "cancel-button-label"', async () => {
      const { form } = await mountForm({ props: { submitButtonLabel: 'Enviar', cancelButtonLabel: 'Cancelar' } })

      expect(getButton(form, 'Enviar')).toBeDefined()
      expect(getButton(form, 'Cancelar')).toBeDefined()
    })

    it('esconde o botão de salvar com "use-submit-button" false', async () => {
      const { form } = await mountForm({ props: { useSubmitButton: false } })

      expect(getButton(form, 'Salvar')).toBeUndefined()
    })

    it('esconde o botão de voltar com "cancel-route" false', async () => {
      const { form } = await mountForm({ props: { cancelRoute: false } })

      expect(getButton(form, 'Voltar')).toBeUndefined()
    })

    it('esconde todos os botões com "use-actions" false', async () => {
      const { form } = await mountForm({ props: { useActions: false } })

      expect(form.findAllComponents(QasBtn)).toHaveLength(0)
    })
  })

  describe('voltar', () => {
    async function clickCancel (form) {
      await getButton(form, 'Voltar').find('button').trigger('click')
      await flushPromises()
    }

    it('por padrão, volta para o primeiro nível da URL atual', async () => {
      const { form, router } = await mountForm()

      await clickCancel(form)

      expect(router.currentRoute.value.path).toBe('/users')
    })

    it('vai para a "cancel-route" informada', async () => {
      const { form, router } = await mountForm({ props: { cancelRoute: { name: 'Other' } } })

      await clickCancel(form)

      expect(router.currentRoute.value.name).toBe('Other')
    })

    it('chama a "cancel-route" quando ela é uma função', async () => {
      const cancelRoute = vi.fn()
      const { form, router } = await mountForm({ props: { cancelRoute } })

      await clickCancel(form)

      expect(cancelRoute).toHaveBeenCalledTimes(1)
      expect(router.currentRoute.value.name).toBe('UsersEdit')
    })
  })

  describe('alterações não salvas', () => {
    const isDialogOpen = form => form.findComponent(QasDialog).props('modelValue')

    it('sem alterações, sai da página normalmente', async () => {
      const { form, router } = await mountForm()

      await router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('Other')
      expect(isDialogOpen(form)).toBe(false)
    })

    it('com alterações, bloqueia a saída e abre o dialog de confirmação', async () => {
      const { form, router, model } = await mountForm()

      model.value = { ...model.value, name: 'Outro nome' }
      router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('UsersEdit')
      expect(isDialogOpen(form)).toBe(true)
    })

    it('ignora as chaves de "ignore-keys-in-unsaved-changes"', async () => {
      const { router, model } = await mountForm({ props: { ignoreKeysInUnsavedChanges: ['name'] } })

      model.value = { ...model.value, name: 'Outro nome' }
      router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('Other')
    })

    it('ignora as chaves só na raiz do model, alterações aninhadas com o mesmo nome ainda pedem confirmação', async () => {
      const axios = createFormAxiosMock({ fetch: { ...fetchResponse, result: { name: 'Ana', address: { name: 'Casa' } } } })
      const { form, router, model } = await mountForm({ props: { ignoreKeysInUnsavedChanges: ['name'] }, axios })

      model.value = { ...model.value, address: { name: 'Trabalho' } }
      router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('UsersEdit')
      expect(isDialogOpen(form)).toBe(true)
    })

    it('com "use-dialog-on-unsaved-changes" false, sai mesmo com alterações', async () => {
      const { router, model } = await mountForm({ props: { useDialogOnUnsavedChanges: false } })

      model.value = { ...model.value, name: 'Outro nome' }
      await router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('Other')
    })

    it('depois de salvar, sai sem pedir confirmação', async () => {
      const { form, router, model } = await mountForm()

      model.value = { ...model.value, name: 'Outro nome' }
      await submit(form)

      await router.push('/other')
      await flushPromises()

      expect(router.currentRoute.value.name).toBe('Other')
    })
  })

  describe('limpeza ao desmontar', () => {
    it('para de ouvir o evento "delete-success"', async () => {
      const removeListener = vi.spyOn(window, 'removeEventListener')
      const { wrapper } = await mountForm()

      wrapper.unmount()

      const removed = removeListener.mock.calls.some(([event]) => event === 'delete-success')

      removeListener.mockRestore()

      expect(removed).toBe(true)
    })
  })
})
