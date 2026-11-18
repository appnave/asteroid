import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import QasField from './QasField.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// stubs que só guardam os atributos recebidos, para conferir o que o QasField repassa
const stubNames = [
  'QasCheckbox',
  'QasDateTimeInput',
  'QasInput',
  'QasNumericInput',
  'QasPasswordInput',
  'QasRadio',
  'QasSelect',
  'QasSignatureUploader',
  'QasToggle',
  'QasUploader',
  'QEditor'
]

const createStub = name => defineComponent({ name, inheritAttrs: false, props: { modelValue: { type: null, default: undefined } }, render: () => h('div') })
const stubs = Object.fromEntries(stubNames.map(name => [name, createStub(name)]))

async function mountField ({ field, props, attrs } = {}) {
  const { wrapper } = await mountQas(QasField, {
    props: { field: { name: 'name', label: 'Nome', ...field }, ...props },
    attrs,
    stubs
  })

  // os componentes são carregados de forma assíncrona
  await flushPromises()

  return wrapper
}

const getComponent = (wrapper, name) => wrapper.findComponent({ name })
const getAttrs = (wrapper, name) => getComponent(wrapper, name).vm.$attrs

describe('QasField', () => {
  describe('componente por tipo', () => {
    it.each([
      ['text', 'QasInput'],
      ['money', 'QasNumericInput'],
      ['datetime', 'QasDateTimeInput'],
      ['select', 'QasSelect'],
      ['boolean', 'QasToggle'],
      ['upload', 'QasUploader'],
      ['tipo-desconhecido', 'QasInput']
    ])('tipo "%s" usa o %s', async (type, componentName) => {
      const wrapper = await mountField({ field: { type } })

      expect(getComponent(wrapper, componentName).exists()).toBe(true)
    })

    it('tipo "hidden" vira um input escondido', async () => {
      const wrapper = await mountField({ field: { type: 'hidden' } })

      expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('name')
    })

    it('repassa o "type" do input para textarea, email e number', async () => {
      const textarea = await mountField({ field: { type: 'textarea' } })
      const email = await mountField({ field: { type: 'email' } })
      const number = await mountField({ field: { type: 'number' } })

      expect(getAttrs(textarea, 'QasInput').type).toBe('textarea')
      expect(getAttrs(email, 'QasInput').type).toBe('email')
      expect(getAttrs(number, 'QasInput').type).toBe('number')
    })

    it('repassa o modo dos tipos numéricos e de data', async () => {
      const money = await mountField({ field: { type: 'money' } })
      const date = await mountField({ field: { type: 'date' } })
      const time = await mountField({ field: { type: 'time' } })

      expect(getAttrs(money, 'QasNumericInput').mode).toBe('money')
      expect(getAttrs(date, 'QasDateTimeInput').useDateOnly).toBe(true)
      expect(getAttrs(time, 'QasDateTimeInput').useTimeOnly).toBe(true)
    })

    it('upload usa envio automático e o nome do campo', async () => {
      const wrapper = await mountField({ field: { type: 'upload', entity: 'users' } })

      expect(getAttrs(wrapper, 'QasUploader')).toMatchObject({ autoUpload: true, entity: 'users', fieldName: 'name' })
    })
  })

  describe('props do field', () => {
    it('converte "maxLength", "minLength" e "readOnly" para os atributos do input', async () => {
      const wrapper = await mountField({ field: { type: 'text', maxLength: 10, minLength: 2, readOnly: true } })

      expect(getAttrs(wrapper, 'QasInput')).toMatchObject({ maxlength: 10, minlength: 2, readonly: true })
    })

    it('os atributos têm prioridade sobre o field', async () => {
      const wrapper = await mountField({ field: { type: 'text' }, attrs: { label: 'Outro', disable: true } })

      expect(getAttrs(wrapper, 'QasInput')).toMatchObject({ label: 'Outro', disable: true })
    })
  })

  describe('erro', () => {
    it('aceita o erro como texto', async () => {
      const wrapper = await mountField({ field: { type: 'text' }, props: { error: 'Obrigatório' } })

      expect(getAttrs(wrapper, 'QasInput')).toMatchObject({ error: true, errorMessage: 'Obrigatório', hideBottomSpace: false })
    })

    it('aceita o erro como lista, juntando as mensagens', async () => {
      const wrapper = await mountField({ field: { type: 'text' }, props: { error: ['Obrigatório.', 'Inválido.'] } })

      expect(getAttrs(wrapper, 'QasInput').errorMessage).toBe('Obrigatório. Inválido.')
    })
  })

  describe('valor', () => {
    it('repassa o valor e emite o novo valor', async () => {
      const wrapper = await mountField({ field: { type: 'text' }, props: { modelValue: 'Ana' } })

      expect(getComponent(wrapper, 'QasInput').props('modelValue')).toBe('Ana')

      getComponent(wrapper, 'QasInput').vm.$emit('update:modelValue', 'Bruno')

      expect(wrapper.emitted('update:modelValue')).toEqual([['Bruno']])
    })

    it('tipo "number" emite o valor como número', async () => {
      const wrapper = await mountField({ field: { type: 'number' } })

      getComponent(wrapper, 'QasInput').vm.$emit('update:modelValue', '42')

      expect(wrapper.emitted('update:modelValue')).toEqual([[42]])
    })

    it.each([
      [undefined, false],
      ['', false],
      ['true', true],
      ['false', false],
      [true, true]
    ])('tipo "boolean" converte %j para %j', async (modelValue, expected) => {
      const wrapper = await mountField({ field: { type: 'boolean' }, props: { modelValue } })

      expect(getComponent(wrapper, 'QasToggle').props('modelValue')).toBe(expected)
    })
  })
})
