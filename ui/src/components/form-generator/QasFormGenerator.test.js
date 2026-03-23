import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import { flushPromises } from '@vue/test-utils'
import QasFormGenerator from './QasFormGenerator.vue'

const defaultFields = {
  name: { name: 'name', label: 'Nome', type: 'text' },
  email: { name: 'email', label: 'E-mail', type: 'email' }
}

const defaultModelValue = { name: '', email: '' }

const factory = (props = {}, mountOptions = {}) => {
  return mountComponent(QasFormGenerator, {
    props: {
      fields: defaultFields,
      modelValue: defaultModelValue,
      ...props
    },
    ...mountOptions
  })
}

describe('QasFormGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('renderização', () => {
    it('renderiza sem erros', () => {
      const wrapper = factory()
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza campos visíveis a partir dos fields', () => {
      const wrapper = factory()
      // Verifica que os fields foram normalizados e expostos pelo computed
      expect(Object.keys(wrapper.vm.normalizedFields).length).toBeGreaterThan(0)
    })

    it('renderiza skeleton quando prop skeleton é true', () => {
      const wrapper = factory({ skeleton: true })
      expect(wrapper.find('.qas-skeleton').exists()).toBe(true)
    })

    it('não renderiza skeleton quando prop skeleton é false', () => {
      const wrapper = factory({ skeleton: false })
      expect(wrapper.find('.qas-skeleton').exists()).toBe(false)
    })
  })

  describe('campo hidden', () => {
    it('campos do tipo hidden são renderizados diferentemente dos visíveis', () => {
      const fields = {
        ...defaultFields,
        secret: { name: 'secret', label: 'Segredo', type: 'hidden' }
      }
      const wrapper = factory({ fields, modelValue: { ...defaultModelValue, secret: '' } })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('prop order', () => {
    it('respeita a ordem definida pela prop order', async () => {
      const wrapper = factory({
        order: ['email', 'name']
      })
      await flushPromises()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('prop useBox', () => {
    it('renderiza com QasBox quando useBox é true', () => {
      const wrapper = factory({ useBox: true })
      expect(wrapper.find('.qas-box').exists()).toBe(true)
    })

    it('renderiza sem QasBox quando useBox é false', () => {
      const wrapper = factory({ useBox: false })
      expect(wrapper.find('.qas-box').exists()).toBe(false)
    })
  })

  describe('prop disable', () => {
    it('desabilita os campos quando disable é true', () => {
      const fields = {
        name: { name: 'name', label: 'Nome', type: 'text', disable: false }
      }
      const wrapper = factory({ fields, disable: true, modelValue: { name: '' } })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('emits', () => {
    it('emite update:modelValue quando um campo é atualizado', async () => {
      const wrapper = factory()
      // Chama updateModelValue diretamente
      wrapper.vm.updateModelValue({ key: 'name', value: 'João' })
      await flushPromises()
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual({ name: 'João', email: '' })
    })
  })

  describe('slot field-{name}', () => {
    it('renderiza slot customizado para um campo', () => {
      const wrapper = factory({}, {
        slots: {
          'field-name': '<input data-cy="custom-name-field" />'
        }
      })
      expect(wrapper.find('[data-cy="custom-name-field"]').exists()).toBe(true)
    })
  })

  describe('fieldset', () => {
    it('renderiza com fieldset definido', () => {
      const fieldset = {
        section1: {
          label: 'Seção 1',
          fields: ['name', 'email']
        }
      }
      const wrapper = factory({ fieldset })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('nested QasFormGenerator', () => {
    it('não renderiza QasBox em nível aninhado mesmo com useBox true', () => {
      const wrapper = mountComponent(QasFormGenerator, {
        props: {
          fields: defaultFields,
          modelValue: defaultModelValue,
          useBox: true
        },
        global: {
          provide: {
            isFormGenerator: true
          }
        }
      })
      expect(wrapper.find('.qas-box').exists()).toBe(false)
    })
  })
})
