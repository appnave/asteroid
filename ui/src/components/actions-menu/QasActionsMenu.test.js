import { describe, it, expect, vi } from 'vitest'

import QasActionsMenu from './QasActionsMenu.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const edit = { label: 'Editar', icon: 'sym_r_edit' }
const view = { label: 'Visualizar', icon: 'sym_r_visibility' }
const copy = { label: 'Copiar', icon: 'sym_r_content_copy' }

async function mountActionsMenu (options) {
  return mountQas(QasActionsMenu, options)
}

const getButtonLabels = wrapper => wrapper.findAllComponents(QasBtn).map(button => button.props('label'))
const getDropdownList = wrapper => wrapper.findComponent({ name: 'QasBtnDropdown' }).props('buttonsPropsList')

describe('QasActionsMenu', () => {
  it('não renderiza nada sem ações', async () => {
    const { wrapper } = await mountActionsMenu()

    expect(wrapper.find('[data-cy="actions-menu"]').exists()).toBe(false)
  })

  describe('uma ação', () => {
    it('exibe a ação como botão "primary"', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit } } })

      expect(getButtonLabels(wrapper)).toEqual(['Editar'])
      expect(getDropdownList(wrapper).edit.color).toBe('primary')
    })

    it('ao clicar, chama o "handler" com o item sem o próprio handler', async () => {
      const handler = vi.fn()
      const { wrapper } = await mountActionsMenu({ props: { list: { edit: { ...edit, handler } } } })

      await wrapper.findComponent(QasBtn).find('button').trigger('click')

      expect(handler).toHaveBeenCalledWith({ label: 'Editar', icon: 'sym_r_edit' })
    })
  })

  describe('várias ações sem "split-name"', () => {
    it('agrupa as ações no botão "Opções"', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit, view } } })

      expect(Object.keys(getDropdownList(wrapper))).toEqual(['options'])
      expect(getButtonLabels(wrapper)).toEqual(['Opções'])
    })

    it('com "use-dropdown-always", usa o botão "Opções" mesmo com uma ação', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit }, useDropdownAlways: true } })

      expect(Object.keys(getDropdownList(wrapper))).toEqual(['options'])
    })
  })

  describe('com "split-name"', () => {
    it('com 2 ações, exibe as duas lado a lado, a do "split-name" primeiro como "primary"', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit, view }, splitName: 'view' } })

      const list = getDropdownList(wrapper)

      expect(Object.keys(list)).toEqual(['view', 'edit'])
      expect(list.view.color).toBe('primary')
      expect(list.edit.color).toBe('grey-10')
    })

    it('com mais de 2 ações, exibe a do "split-name" e o restante no menu', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit, view, copy }, splitName: 'copy' } })

      expect(Object.keys(getDropdownList(wrapper))).toEqual(['copy'])
      expect(wrapper.findComponent({ name: 'QasBtnDropdown' }).props('useSplit')).toBe(true)
    })

    it('se o "split-name" não existir na lista, usa a primeira ação', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit, view, copy }, splitName: 'remove' } })

      expect(Object.keys(getDropdownList(wrapper))).toEqual(['edit'])
    })
  })

  describe('excluir', () => {
    it('com "delete-props", adiciona a ação de excluir', async () => {
      const { wrapper } = await mountActionsMenu({ props: { deleteProps: { id: 1, entity: 'users' } } })

      expect(getDropdownList(wrapper).delete).toMatchObject({ label: 'Excluir', icon: 'sym_r_delete', color: 'grey-10' })
    })

    it('ao clicar em excluir, chama o "$qas.delete" com "delete-props"', async () => {
      const deleteProps = { id: 1, entity: 'users' }
      const { wrapper, qas } = await mountActionsMenu({ props: { deleteProps } })

      await wrapper.findComponent(QasBtn).find('button').trigger('click')

      expect(qas.delete).toHaveBeenCalledWith(deleteProps)
    })
  })

  describe('estado', () => {
    it('com uma ação em "loading", não fecha o menu automaticamente', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit: { ...edit, loading: true }, view } } })

      expect(wrapper.findComponent({ name: 'QasBtnDropdown' }).props('useAutoClose')).toBe(false)
    })

    it('com "use-tooltip" e sem label, exibe o label como tooltip', async () => {
      const { wrapper } = await mountActionsMenu({ props: { list: { edit }, useLabel: false, useTooltip: true } })

      expect(wrapper.findComponent({ name: 'QTooltip' }).exists()).toBe(true)
    })
  })
})
