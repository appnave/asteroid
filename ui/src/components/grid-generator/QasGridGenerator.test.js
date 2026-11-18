import { describe, it, expect } from 'vitest'

import QasGridGenerator from './QasGridGenerator.vue'
import QasGridItem from '../grid-item/QasGridItem.vue'
import QasHeader from '../header/QasHeader.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const fields = {
  name: { name: 'name', label: 'Nome', type: 'text' },
  birthDate: { name: 'birthDate', label: 'Nascimento', type: 'date' },
  status: { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Ativo', value: 'active' }] },
  notes: { name: 'notes', label: 'Observações', type: 'textarea' }
}

const result = {
  name: 'Ana',
  birthDate: '1990-08-20',
  status: 'active',
  notes: ''
}

async function mountGridGenerator ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasGridGenerator, { props: { fields, result, ...props }, ...options })

  return wrapper
}

const getHeader = (wrapper, name) => wrapper.find(`[data-cy="grid-generator-${name}-field"]`)
const getContent = (wrapper, name) => wrapper.find(`[data-cy="grid-generator-${name}-result"]`)

describe('QasGridGenerator', () => {
  describe('campos e resultado', () => {
    it('exibe o label e o resultado formatado de cada campo', async () => {
      const wrapper = await mountGridGenerator()

      expect(getHeader(wrapper, 'name').text()).toBe('Nome')
      expect(getContent(wrapper, 'name').text()).toBe('Ana')
      expect(getContent(wrapper, 'birthDate').text()).toBe('20/08/1990')
      expect(getContent(wrapper, 'status').text()).toBe('Ativo')
    })

    it('exibe "-" para resultado vazio, ou o texto de "empty-result-text"', async () => {
      const defaultText = await mountGridGenerator()
      const customText = await mountGridGenerator({ props: { emptyResultText: 'Não informado' } })

      expect(getContent(defaultText, 'notes').text()).toBe('-')
      expect(getContent(customText, 'notes').text()).toBe('Não informado')
    })

    it('não exibe nada sem "result"', async () => {
      const wrapper = await mountGridGenerator({ props: { result: {} } })

      expect(wrapper.findAllComponents(QasGridItem)).toHaveLength(0)
    })
  })

  describe('ellipsis', () => {
    it('corta o texto e usa o valor completo como "title"', async () => {
      const wrapper = await mountGridGenerator()

      expect(getContent(wrapper, 'name').classes()).toContain('ellipsis')
      expect(getContent(wrapper, 'name').attributes('title')).toBe('Ana')
    })

    it('campos "textarea" sempre exibem o texto completo', async () => {
      const wrapper = await mountGridGenerator({ props: { result: { ...result, notes: 'Texto longo' } } })

      expect(getContent(wrapper, 'notes').classes()).not.toContain('ellipsis')
    })
  })

  describe('slots', () => {
    it('o slot "content-field-<nome>" substitui o resultado do campo', async () => {
      const wrapper = await mountGridGenerator({
        slots: { 'content-field-name': '<strong class="custom">{{ params.field.formattedResult }}!</strong>' }
      })

      expect(wrapper.find('.custom').text()).toBe('Ana!')
    })

    it('o slot "field-<nome>" substitui o campo inteiro', async () => {
      const wrapper = await mountGridGenerator({ slots: { 'field-name': '<p class="custom">custom</p>' } })

      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(wrapper.findAllComponents(QasGridItem)).toHaveLength(3)
    })
  })

  describe('use-empty-result', () => {
    const emptyFields = {
      name: { name: 'name', label: 'Nome', type: 'text' },
      email: { name: 'email', label: 'E-mail', type: 'text' },
      document: { name: 'document', label: 'Documento', type: 'text' },
      tags: { name: 'tags', label: 'Tags', type: 'text' },
      address: { name: 'address', label: 'Endereço', type: 'text' },
      age: { name: 'age', label: 'Idade', type: 'text' }
    }

    // "document" não vem no result
    const emptyResult = { name: 'Ana', email: null, tags: [], address: {}, age: 0 }

    const getFieldNames = wrapper => wrapper.findAll('[data-cy$="-field"]').map(field => field.text())

    it('por padrão, exibe todos os campos, com "-" nos vazios', async () => {
      const wrapper = await mountGridGenerator({ props: { fields: emptyFields, result: emptyResult } })

      expect(getFieldNames(wrapper)).toEqual(['Nome', 'E-mail', 'Documento', 'Tags', 'Endereço', 'Idade'])
      expect(getContent(wrapper, 'email').text()).toBe('-')
      expect(getContent(wrapper, 'tags').text()).toBe('-')
    })

    it('com false, esconde os campos vazios, mantendo valores como 0', async () => {
      const wrapper = await mountGridGenerator({ props: { fields: emptyFields, result: emptyResult, useEmptyResult: false } })

      expect(getFieldNames(wrapper)).toEqual(['Nome', 'Idade'])
    })

    it('com false e fieldset, também esconde os campos vazios', async () => {
      const wrapper = await mountGridGenerator({
        props: {
          fields: emptyFields,
          result: emptyResult,
          useEmptyResult: false,
          fieldset: { personal: { label: 'Dados', fields: ['name', 'email', 'tags'] } }
        }
      })

      expect(getFieldNames(wrapper)).toEqual(['Nome'])
    })
  })

  describe('fieldset', () => {
    it('agrupa os campos em seções com cabeçalho', async () => {
      const wrapper = await mountGridGenerator({
        props: {
          fieldset: {
            personal: { label: 'Dados pessoais', fields: ['name', 'birthDate'] },
            other: { label: 'Outros', fields: ['status'], useSeparator: true }
          }
        }
      })

      expect(wrapper.findAllComponents(QasHeader).map(header => header.props('labelProps').label)).toEqual(['Dados pessoais', 'Outros'])
      expect(wrapper.findAllComponents(QasGridItem)).toHaveLength(3)
      expect(wrapper.findAllComponents({ name: 'QSeparator' })).toHaveLength(1)
    })

    it('subseções têm separador por padrão', async () => {
      const wrapper = await mountGridGenerator({
        props: {
          fieldset: {
            personal: { label: 'Dados', fields: ['name'], subset: { other: { label: 'Status', fields: ['status'] } } }
          }
        }
      })

      expect(wrapper.findAllComponents({ name: 'QSeparator' })).toHaveLength(1)
      expect(getContent(wrapper, 'status').text()).toBe('Ativo')
    })
  })

  describe('aparência', () => {
    it('com "header-props", exibe o cabeçalho sem fieldset', async () => {
      const wrapper = await mountGridGenerator({ props: { headerProps: { labelProps: { label: 'Resumo' } } } })

      expect(wrapper.findComponent(QasHeader).props('labelProps').label).toBe('Resumo')
    })
  })
})
