import { describe, it, expect } from 'vitest'

import QasDelete from './QasDelete.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const EmptyPage = { template: '<div />' }

async function mountDelete ({ props = {}, ...options } = {}) {
  return mountQas(QasDelete, { props: { entity: 'users', ...props }, ...options })
}

async function clickDelete (wrapper) {
  await wrapper.find('button').trigger('click')
}

// parâmetros passados para o $qas.delete no último clique
const getDeleteParams = qas => qas.delete.mock.calls.at(-1)[0]

describe('QasDelete', () => {
  it('é um botão "Excluir" com ícone de lixeira', async () => {
    const { wrapper } = await mountDelete()

    expect(wrapper.findComponent(QasBtn).props()).toMatchObject({ label: 'Excluir', icon: 'sym_r_delete', color: 'grey-10' })
  })

  it('ao clicar, chama o "$qas.delete" com a entidade, a url e o id da rota', async () => {
    const { wrapper, qas } = await mountDelete({
      props: { url: 'users/custom', dialogProps: { title: 'Excluir usuário' } },
      routes: [{ path: '/users/:id', name: 'UsersShow', component: EmptyPage }],
      route: '/users/42'
    })

    await clickDelete(wrapper)

    expect(getDeleteParams(qas)).toMatchObject({
      deleteActionParams: { entity: 'users', id: '42', url: 'users/custom' },
      dialogProps: { title: 'Excluir usuário' },
      useAutoDeleteRoute: true,
      redirectRoute: ''
    })
  })

  it('"custom-id" tem prioridade sobre o id da rota', async () => {
    const { wrapper, qas } = await mountDelete({
      props: { customId: 7 },
      routes: [{ path: '/users/:id', name: 'UsersShow', component: EmptyPage }],
      route: '/users/42'
    })

    await clickDelete(wrapper)

    expect(getDeleteParams(qas).deleteActionParams.id).toBe(7)
  })

  it('emite "update:deleting", "success" e "error" pelos callbacks do delete', async () => {
    const { wrapper, qas } = await mountDelete({ props: { customId: 1 } })

    await clickDelete(wrapper)

    const { onDelete, onDeleteSuccess, onDeleteError } = getDeleteParams(qas)

    onDelete(true)
    onDeleteSuccess({ status: 204 })
    onDeleteError('falhou')

    expect(wrapper.emitted('update:deleting')).toEqual([[true]])
    expect(wrapper.emitted('success')).toEqual([[{ status: 204 }]])
    expect(wrapper.emitted('error')).toEqual([['falhou']])
  })

  it('o clique não se propaga para elementos de fora', async () => {
    const { wrapper } = await mountDelete({ props: { customId: 1 } })

    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    let propagated = false

    wrapper.element.parentElement?.addEventListener('click', () => { propagated = true })
    wrapper.find('button').element.dispatchEvent(event)

    expect(propagated).toBe(false)
    expect(event.defaultPrevented).toBe(true)
  })
})
