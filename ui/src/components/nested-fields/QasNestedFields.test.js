import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasNestedFields from './QasNestedFields.vue'
import QasActionsMenu from '../actions-menu/QasActionsMenu.vue'
import QasFormGenerator from '../form-generator/QasFormGenerator.vue'
import QasHeader from '../header/QasHeader.vue'
import QasLabel from '../label/QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const field = {
  name: 'phones',
  label: 'Telefones',
  children: {
    number: { name: 'number', label: 'Número', type: 'text' }
  }
}

const phones = [
  { uuid: 'a', number: '1111' },
  { uuid: 'b', number: '2222' }
]

// sem animação para não depender do scroll da página (window.scrollTo não existe no jsdom)
async function mountNestedFields ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasNestedFields, {
    props: { field, useAnimation: false, modelValue: phones, ...props },
    ...options
  })

  return wrapper
}

const getRows = wrapper => wrapper.findAll('[data-cy="nested-fields-item"]')
const getForms = wrapper => wrapper.findAllComponents(QasFormGenerator)
const getHeaders = wrapper => wrapper.findAllComponents(QasHeader)
const getLastEmitted = wrapper => wrapper.emitted('update:modelValue').at(-1)[0]

// executa uma ação do menu da linha (duplicar, excluir...)
function runRowAction (wrapper, rowIndex, actionName) {
  const actionsMenu = wrapper.findAllComponents(QasActionsMenu)[rowIndex]

  actionsMenu.props('list')[actionName].handler()
}

describe('QasNestedFields', () => {
  describe('linhas', () => {
    it('exibe um formulário por linha com os campos de "field.children"', async () => {
      const wrapper = await mountNestedFields()

      expect(getRows(wrapper)).toHaveLength(2)
      expect(getForms(wrapper)[0].props()).toMatchObject({ fields: field.children, modelValue: phones[0] })
    })

    it('não altera o "model-value" recebido', async () => {
      const modelValue = [{ uuid: 'a', number: '1111' }]
      const wrapper = await mountNestedFields({ props: { modelValue } })

      await getForms(wrapper)[0].vm.$emit('update:modelValue', { uuid: 'a', number: '9999' })

      expect(modelValue).toEqual([{ uuid: 'a', number: '1111' }])
      expect(getLastEmitted(wrapper)).toEqual([{ uuid: 'a', number: '9999' }])
    })

    it('"fields-handler-fn" define os campos de cada linha', async () => {
      const fieldsHandlerFn = vi.fn(({ fields, index }) => index === 0 ? fields : {})
      const wrapper = await mountNestedFields({ props: { fieldsHandlerFn } })

      expect(getForms(wrapper)[0].props('fields')).toEqual(field.children)
      expect(getForms(wrapper)[1].props('fields')).toEqual({})
      expect(fieldsHandlerFn).toHaveBeenCalledWith(expect.objectContaining({ index: 1, row: phones[1] }))
    })

    it('repassa os erros de cada linha, aceitando o formato da API', async () => {
      const wrapper = await mountNestedFields({ props: { errors: { 'phones.1.number': ['Inválido'] } } })

      expect(getForms(wrapper)[1].props('errors')).toEqual({ number: ['Inválido'] })
    })
  })

  describe('adicionar', () => {
    it('adiciona uma linha com o "row-object"', async () => {
      const wrapper = await mountNestedFields({ props: { rowObject: { number: '' } } })

      await wrapper.find('[data-cy="nested-fields-add-btn"] button, button[data-cy="nested-fields-add-btn"]').trigger('click')

      expect(getLastEmitted(wrapper)).toEqual([...phones, { number: '' }])
    })

    it('sem linhas, exibe o botão de primeira linha com "add-first-input-label"', async () => {
      const wrapper = await mountNestedFields({ props: { modelValue: [], addFirstInputLabel: 'Adicionar telefone' } })

      expect(wrapper.find('[data-cy="nested-fields-add-btn"]').text()).toBe('Adicionar telefone')
    })

    it('com "use-starts-empty" false, começa com uma linha', async () => {
      const wrapper = await mountNestedFields({ props: { modelValue: [], useStartsEmpty: false, rowObject: { number: '' } } })

      expect(getRows(wrapper)).toHaveLength(1)
    })

    it('duplicar copia a linha sem o identificador', async () => {
      const wrapper = await mountNestedFields()

      runRowAction(wrapper, 0, 'duplicate')

      expect(getLastEmitted(wrapper)).toEqual([...phones, { number: '1111' }])
    })
  })

  describe('excluir', () => {
    it('remove a linha por padrão', async () => {
      const wrapper = await mountNestedFields()

      runRowAction(wrapper, 0, 'destroy')

      expect(getLastEmitted(wrapper)).toEqual([phones[1]])
    })

    it('com "use-remove-on-destroy" false, marca a linha salva com "destroyed" e a esconde', async () => {
      const wrapper = await mountNestedFields({ props: { useRemoveOnDestroy: false } })

      runRowAction(wrapper, 0, 'destroy')
      await flushPromises()

      expect(getLastEmitted(wrapper)).toEqual([{ destroyed: true, ...phones[0] }, phones[1]])
      expect(getRows(wrapper)).toHaveLength(1)
    })

    it('com "use-remove-on-destroy" false, remove a linha que ainda não foi salva', async () => {
      const wrapper = await mountNestedFields({ props: { useRemoveOnDestroy: false, modelValue: [{ number: '1111' }, phones[1]] } })

      runRowAction(wrapper, 0, 'destroy')

      expect(getLastEmitted(wrapper)).toEqual([phones[1]])
    })

    it('com "use-destroy-always" false, não permite excluir a última linha', async () => {
      const wrapper = await mountNestedFields({ props: { useDestroyAlways: false, modelValue: [phones[0]] } })

      expect(wrapper.findComponent(QasActionsMenu).props('list').destroy).toBeUndefined()
    })
  })

  describe('cabeçalho e rótulos', () => {
    it('usa o label do field como título de cada linha', async () => {
      const wrapper = await mountNestedFields()

      expect(getHeaders(wrapper).map(header => header.props('labelProps').label)).toEqual(['Telefones', 'Telefones'])
    })

    it('com "row-label" e "use-index-label", numera as linhas', async () => {
      const wrapper = await mountNestedFields({ props: { rowLabel: 'Telefone', useIndexLabel: true } })

      expect(getHeaders(wrapper).map(header => header.props('labelProps').label)).toEqual(['Telefone 1', 'Telefone 2'])
    })

    it('a numeração ignora as linhas marcadas como excluídas', async () => {
      const wrapper = await mountNestedFields({
        props: {
          rowLabel: 'Telefone',
          useIndexLabel: true,
          useRemoveOnDestroy: false,
          modelValue: [{ ...phones[0], destroyed: true }, phones[1]]
        }
      })

      expect(getHeaders(wrapper).map(header => header.props('labelProps').label)).toEqual(['Telefone 1'])
    })

    it('com "use-single-label", exibe o label uma vez só, acima das linhas', async () => {
      const wrapper = await mountNestedFields({ props: { useSingleLabel: true } })

      expect(wrapper.findAllComponents(QasLabel)[0].props('label')).toBe('Telefones')
      expect(getHeaders(wrapper)[0].props('labelProps').label).toBeUndefined()
    })

    it('"header-props" adiciona ações próprias ao menu da linha, recebendo a linha', async () => {
      const handler = vi.fn()
      const wrapper = await mountNestedFields({
        props: { headerProps: () => ({ actionsMenuProps: { list: { view: { label: 'Ver', icon: 'sym_r_visibility', handler } } } }) }
      })

      runRowAction(wrapper, 1, 'view')

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({ index: 1, row: phones[1] }))
    })
  })

  describe('linhas desabilitadas', () => {
    it('com "disabled-rows" true, desabilita todas as linhas e esconde as ações', async () => {
      const wrapper = await mountNestedFields({ props: { disabledRows: true } })

      expect(getForms(wrapper).every(form => form.props('disable'))).toBe(true)
      expect(wrapper.findAllComponents(QasActionsMenu)).toHaveLength(0)
    })

    it('aceita a lista de identificadores das linhas desabilitadas', async () => {
      const wrapper = await mountNestedFields({ props: { disabledRows: ['b'] } })

      expect(getForms(wrapper).map(form => form.props('disable'))).toEqual([false, true])
    })
  })

  describe('ações em linha', () => {
    it('com "use-inline-actions", exibe as ações ao lado do formulário', async () => {
      const wrapper = await mountNestedFields({ props: { useInlineActions: true, useHeader: false } })

      expect(wrapper.findAll('.qas-nested-fields__actions')).toHaveLength(2)
      expect(wrapper.findComponent(QasActionsMenu).props('useLabel')).toBe(false)
    })

    it('"actions-menu-props" como função recebe a lista padrão', async () => {
      const actionsMenuProps = vi.fn(({ list }) => ({ list: { destroy: list.destroy } }))
      const wrapper = await mountNestedFields({ props: { useInlineActions: true, actionsMenuProps } })

      expect(Object.keys(wrapper.findComponent(QasActionsMenu).props('list'))).toEqual(['destroy'])
    })
  })
})
