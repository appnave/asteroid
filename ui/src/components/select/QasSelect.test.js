import { flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import QasSelect from './QasSelect.vue'
import QasTip from '../tip/QasTip.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const makeOptions = quantity => Array.from({ length: quantity }, (_, index) => ({
  label: `Opção ${index + 1}`,
  value: `opcao-${index + 1}`
}))

const fruits = [
  { label: 'Banana', value: 'banana' },
  { label: 'Maçã', value: 'maca' },
  { label: 'Laranja', value: 'laranja' },
  { label: 'Uva', value: 'uva' },
  { label: 'Abacaxi', value: 'abacaxi' },
  { label: 'Morango', value: 'morango' },
  { label: 'Melancia', value: 'melancia' },
  { label: 'Pera', value: 'pera' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Manga', value: 'manga' }
]

function mountSelect ({ props = {}, attrs = {}, provide = {} } = {}) {
  return mountQas(QasSelect, {
    props: { options: makeOptions(3), ...props },
    attrs,
    provide
  })
}

const getQSelect = wrapper => wrapper.findComponent({ name: 'QSelect' })

/**
 * Executa o filtro como o QSelect faz ao digitar: emite "filter" e espera o "update".
 */
async function typeSearch (wrapper, value) {
  const update = vi.fn(callback => callback?.())

  getQSelect(wrapper).vm.$emit('filter', value, update)
  await flushPromises()

  expect(update).toHaveBeenCalled()

  return getQSelect(wrapper).props('options')
}

describe('QasSelect', () => {
  describe('repasse para o QSelect', () => {
    it('repassa as opções e emite o valor da opção (emit-value e map-options)', async () => {
      const { wrapper } = await mountSelect()
      const qSelect = getQSelect(wrapper)

      expect(qSelect.props('options')).toEqual(makeOptions(3))
      expect(qSelect.props('emitValue')).toBe(true)
      expect(qSelect.props('mapOptions')).toBe(true)
    })

    it('repassa o model', async () => {
      const { wrapper } = await mountSelect({ props: { modelValue: 'opcao-2' } })

      expect(getQSelect(wrapper).props('modelValue')).toBe('opcao-2')
    })

    it('emite "update:modelValue" quando o QSelect altera o valor', async () => {
      const { wrapper } = await mountSelect()

      await getQSelect(wrapper).vm.$emit('update:modelValue', 'opcao-3')

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['opcao-3'])
    })

    it('repassa atributos extras para o QSelect', async () => {
      const { wrapper } = await mountSelect({ attrs: { hint: 'Ajuda' } })

      expect(getQSelect(wrapper).props('hint')).toBe('Ajuda')
    })
  })

  describe('label e obrigatoriedade', () => {
    it('exibe o label', async () => {
      const { wrapper } = await mountSelect({ props: { label: 'Fruta' } })

      expect(getQSelect(wrapper).props('label')).toBe('Fruta')
    })

    it('com "required", adiciona "*" ao label e remove o botão de limpar', async () => {
      const { wrapper } = await mountSelect({ props: { label: 'Fruta', required: true, options: makeOptions(2) } })

      expect(getQSelect(wrapper).props('label')).toBe('Fruta*')
      expect(getQSelect(wrapper).props('clearable')).toBe(false)
    })

    it('sem "required", permite limpar o valor', async () => {
      const { wrapper } = await mountSelect()

      expect(getQSelect(wrapper).props('clearable')).toBe(true)
    })
  })

  describe('busca', () => {
    it('com menos de 10 opções, não habilita a busca', async () => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(9) } })

      expect(getQSelect(wrapper).props('useInput')).toBe(false)
    })

    it('a partir de 10 opções, habilita a busca e exibe o ícone de pesquisa', async () => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(10) } })

      expect(getQSelect(wrapper).props('useInput')).toBe(true)
      expect(wrapper.findComponent({ name: 'QIcon' }).props('name')).toBe('sym_r_search')
    })

    it('com "use-search" false, não habilita a busca mesmo com muitas opções', async () => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(20), useSearch: false } })

      expect(getQSelect(wrapper).props('useInput')).toBe(false)
    })

    it.each(['disable', 'readonly'])('com "%s", não habilita a busca', async prop => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(20), [prop]: true } })

      expect(getQSelect(wrapper).props('useInput')).toBe(false)
    })

    it('filtra as opções pelo texto digitado', async () => {
      const { wrapper } = await mountSelect({ props: { options: fruits } })

      const options = await typeSearch(wrapper, 'morango')

      expect(options.map(option => option.value)).toContain('morango')
      expect(options.map(option => option.value)).not.toContain('banana')
    })

    it('volta a exibir todas as opções quando a busca é apagada', async () => {
      const { wrapper } = await mountSelect({ props: { options: fruits } })

      await typeSearch(wrapper, 'morango')
      const options = await typeSearch(wrapper, '')

      expect(options).toHaveLength(fruits.length)
    })

    it('usa o ícone da prop "icon" no lugar do de pesquisa', async () => {
      const { wrapper } = await mountSelect({ props: { icon: 'sym_r_person' } })

      expect(wrapper.findComponent({ name: 'QIcon' }).props('name')).toBe('sym_r_person')
    })
  })

  describe('seleção automática', () => {
    const singleOption = [{ label: 'Única', value: 'unica' }]

    it.each([
      ['required', { required: true }],
      ['use-auto-select', { useAutoSelect: true }]
    ])('com "%s" e uma única opção, seleciona ela', async (_, props) => {
      const { wrapper } = await mountSelect({ props: { options: singleOption, ...props } })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['unica'])
    })

    it('no modo múltiplo, seleciona a opção dentro de uma lista', async () => {
      const { wrapper } = await mountSelect({ props: { options: singleOption, required: true, multiple: true } })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['unica']])
    })

    it('não seleciona quando já existe um valor', async () => {
      const { wrapper } = await mountSelect({ props: { options: singleOption, required: true, modelValue: 'outro' } })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('não seleciona quando há mais de uma opção', async () => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(2), required: true } })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('não seleciona sem "required" ou "use-auto-select"', async () => {
      const { wrapper } = await mountSelect({ props: { options: singleOption } })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('seleciona quando as opções mudam para uma única opção', async () => {
      const { wrapper } = await mountSelect({ props: { options: makeOptions(2), required: true } })

      await wrapper.setProps({ options: singleOption })

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['unica'])
    })

    it('dentro de um QasFormView, atualiza o cache de alterações não salvas', async () => {
      const updateUnsavedChangesCache = vi.fn()

      await mountSelect({ props: { options: singleOption, required: true }, provide: { updateUnsavedChangesCache } })

      expect(updateUnsavedChangesCache).toHaveBeenCalledTimes(1)
    })
  })

  describe('modo múltiplo e popup', () => {
    it('repassa "multiple" para o QSelect', async () => {
      const { wrapper } = await mountSelect({ props: { multiple: true } })

      expect(getQSelect(wrapper).props('multiple')).toBe(true)
    })

    it('exibe os itens como chips só enquanto o popup está aberto', async () => {
      const { wrapper } = await mountSelect({ props: { multiple: true } })
      const qSelect = getQSelect(wrapper)

      expect(qSelect.props('useChips')).toBe(false)

      qSelect.vm.$emit('popupShow')
      await flushPromises()
      expect(getQSelect(wrapper).props('useChips')).toBe(true)

      getQSelect(wrapper).vm.$emit('popupHide')
      await flushPromises()
      expect(getQSelect(wrapper).props('useChips')).toBe(false)
    })

    it('emite "popup-show" e "popup-hide"', async () => {
      const { wrapper } = await mountSelect()

      getQSelect(wrapper).vm.$emit('popupShow')
      getQSelect(wrapper).vm.$emit('popupHide')
      await flushPromises()

      expect(wrapper.emitted('popup-show')).toHaveLength(1)
      expect(wrapper.emitted('popup-hide')).toHaveLength(1)
    })
  })

  describe('erro e dica', () => {
    it('repassa o estado de erro do atributo "error"', async () => {
      const { wrapper } = await mountSelect({ attrs: { error: true, errorMessage: 'Campo obrigatório' } })

      expect(getQSelect(wrapper).props('error')).toBe(true)
      expect(getQSelect(wrapper).props('errorMessage')).toBe('Campo obrigatório')
    })

    it('com "tip", exibe a dica junto do label', async () => {
      const { wrapper } = await mountSelect({ props: { label: 'Fruta', tip: 'Escolha uma fruta' } })

      expect(wrapper.findComponent(QasTip).props('text')).toBe('Escolha uma fruta')
    })

    it('a dica fica vermelha quando o campo tem erro', async () => {
      const { wrapper } = await mountSelect({ props: { label: 'Fruta', tip: 'Dica' }, attrs: { error: true } })

      expect(wrapper.findComponent(QasTip).props('color')).toBe('negative')
    })
  })
})
