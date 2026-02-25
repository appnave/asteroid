import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils'

import QasField from './QasField.vue'

describe('QasField', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com um field básico', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'nome', type: 'text', label: 'Nome' }
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter data-cy com o nome do field (tipo hidden)', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'email', type: 'hidden' }
        }
      })

      await flushPromises()
      // tipo hidden renderiza <input> diretamente (sem async), então data-cy é acessível
      const input = wrapper.find('input[type="hidden"]')
      expect(input.attributes('data-cy')).toBe('email')
    })
  })

  describe('tipo hidden', () => {
    it('deve renderizar input hidden sem componente async', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'id', type: 'hidden' }
        }
      })

      await flushPromises()
      expect(wrapper.find('input[type="hidden"]').exists()).toBeTruthy()
    })
  })

  describe('prop modelValue', () => {
    it('deve renderizar corretamente com modelValue', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'nome', type: 'text', label: 'Nome' },
          modelValue: 'João'
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBeTruthy()
    })
  })

  describe('prop error', () => {
    it('deve renderizar corretamente com erro como string', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'nome', type: 'text', label: 'Nome' },
          error: 'Campo obrigatório'
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar corretamente com erro como array', async () => {
      const wrapper = mountComponent(QasField, {
        props: {
          field: { name: 'nome', type: 'text', label: 'Nome' },
          error: ['Erro 1', 'Erro 2']
        }
      })

      await flushPromises()
      expect(wrapper.exists()).toBeTruthy()
    })
  })
})
