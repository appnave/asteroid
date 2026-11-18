import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'

import QasFormGenerator from './QasFormGenerator.vue'
import QasBox from '../box/QasBox.vue'
import QasField from '../field/QasField.vue'
import QasHeader from '../header/QasHeader.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const fields = {
  name: { name: 'name', label: 'Nome', type: 'text' },
  email: { name: 'email', label: 'E-mail', type: 'text' },
  phone: { name: 'phone', label: 'Telefone', type: 'text' },
  uuid: { name: 'uuid', type: 'hidden' }
}

async function mountFormGenerator ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasFormGenerator, { props: { fields, ...props }, ...options })

  return wrapper
}

const getFieldNames = wrapper => wrapper.findAllComponents(QasField).map(field => field.props('field').name)
const getField = (wrapper, name) => wrapper.findAllComponents(QasField).find(field => field.props('field').name === name)

describe('QasFormGenerator', () => {
  describe('campos', () => {
    it('exibe um campo para cada field, incluindo os do tipo "hidden"', async () => {
      const wrapper = await mountFormGenerator()

      expect(getFieldNames(wrapper)).toEqual(['name', 'email', 'phone', 'uuid'])
    })

    it('com "order", exibe só os campos visíveis informados, na ordem informada', async () => {
      const wrapper = await mountFormGenerator({ props: { order: ['phone', 'name'] } })

      expect(getFieldNames(wrapper)).toEqual(['phone', 'name', 'uuid'])
    })

    it('repassa o valor do model para cada campo', async () => {
      const wrapper = await mountFormGenerator({ props: { modelValue: { name: 'Ana', email: 'ana@email.com' } } })

      expect(getField(wrapper, 'name').props('modelValue')).toBe('Ana')
      expect(getField(wrapper, 'email').props('modelValue')).toBe('ana@email.com')
    })

    it('ao alterar um campo, emite o model completo com o novo valor', async () => {
      const wrapper = await mountFormGenerator({ props: { modelValue: { name: 'Ana', email: 'ana@email.com' } } })

      await getField(wrapper, 'name').vm.$emit('update:modelValue', 'Bruno')

      expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([{ name: 'Bruno', email: 'ana@email.com' }])
    })

    it('repassa o erro de cada campo', async () => {
      const wrapper = await mountFormGenerator({ props: { errors: { email: ['E-mail inválido'] } } })

      expect(getField(wrapper, 'email').props('error')).toEqual(['E-mail inválido'])
    })

    it('com "disable", desabilita todos os campos', async () => {
      const wrapper = await mountFormGenerator({ props: { disable: true } })

      expect(wrapper.findAllComponents(QasField).every(field => field.vm.$attrs.disable)).toBe(true)
    })

    it('desabilita só o campo que vem com "disable" no field', async () => {
      const wrapper = await mountFormGenerator({ props: { fields: { ...fields, email: { ...fields.email, disable: true } } } })

      expect(getField(wrapper, 'email').vm.$attrs.disable).toBe(true)
      expect(getField(wrapper, 'name').vm.$attrs.disable).toBeFalsy()
    })

    it('o slot "field-<nome>" substitui o campo', async () => {
      const wrapper = await mountFormGenerator({ slots: { 'field-email': '<p class="custom">custom</p>' } })

      expect(wrapper.find('.custom').exists()).toBe(true)
      expect(getFieldNames(wrapper)).not.toContain('email')
    })
  })

  describe('fieldset', () => {
    const fieldset = {
      personal: { label: 'Dados pessoais', description: 'Informe seus dados', fields: ['name', 'email'] },
      contact: { label: 'Contato', fields: ['phone'], buttonProps: { label: 'Adicionar telefone' } }
    }

    it('agrupa os campos em seções com cabeçalho', async () => {
      const wrapper = await mountFormGenerator({ props: { fieldset } })

      const headers = wrapper.findAllComponents(QasHeader)

      expect(headers.map(header => header.props('labelProps').label)).toEqual(['Dados pessoais', 'Contato'])
      expect(headers[0].props('description')).toBe('Informe seus dados')
      expect(getFieldNames(wrapper)).toEqual(['name', 'email', 'phone'])
    })

    it('exibe subseções com cabeçalho menor (h5)', async () => {
      const wrapper = await mountFormGenerator({
        props: {
          fieldset: {
            personal: { label: 'Dados', fields: ['name'], subset: { contact: { label: 'Contato', fields: ['email'] } } }
          }
        }
      })

      const subsetHeader = wrapper.findAllComponents(QasHeader).find(header => header.props('labelProps').label === 'Contato')

      expect(subsetHeader.props('labelProps').typography).toBe('h5')
      expect(getFieldNames(wrapper)).toEqual(['name', 'email'])
    })
  })

  describe('aparência', () => {
    it('um QasFormGenerator dentro de outro não cria um segundo QasBox', async () => {
      const Inner = defineComponent({
        setup: () => () => h(QasFormGenerator, { fields: { phone: fields.phone }, useBox: true })
      })

      const wrapper = await mountFormGenerator({
        props: { useBox: true, fields: { name: fields.name } },
        slots: { 'field-name': () => h(Inner) }
      })

      expect(wrapper.findAllComponents(QasBox)).toHaveLength(1)
    })

    it('com "skeleton", exibe o carregamento no lugar dos campos', async () => {
      const wrapper = await mountFormGenerator({ props: { skeleton: true } })

      expect(wrapper.findComponent(QasSkeleton).exists()).toBe(true)
      expect(wrapper.findAllComponents(QasField)).toHaveLength(0)
    })
  })
})
