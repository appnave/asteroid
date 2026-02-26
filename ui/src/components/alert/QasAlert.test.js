import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import { LocalStorage } from 'quasar'

import QasAlert from './QasAlert.vue'

describe('QasAlert', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-alert"', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('.qas-alert').exists()).toBeTruthy()
    })

    it('deve renderizar um q-icon', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('q-icon').exists()).toBeTruthy()
    })
  })

  describe('prop text', () => {
    it('deve renderizar o texto passado via prop', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { text: 'Texto do alerta' }
      })
      expect(wrapper.text()).toContain('Texto do alerta')
    })
  })

  describe('prop status', () => {
    it('deve usar status "info" por padrão com ícone correto', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_info')
    })

    it('deve usar ícone correto para status "error"', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { status: 'error' }
      })
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_error')
    })

    it('deve usar ícone correto para status "success"', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { status: 'success' }
      })
      expect(wrapper.find('q-icon').attributes('name')).toBe('sym_r_check_circle')
    })
  })

  describe('prop useCloseButton', () => {
    it('não deve mostrar botão de fechar por padrão', () => {
      const wrapper = mountComponent(QasAlert)
      expect(wrapper.find('.qas-btn-stub').exists()).toBeFalsy()
    })

    it('deve mostrar botão de fechar quando useCloseButton é true', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { useCloseButton: true }
      })
      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('visibilidade via modelValue', () => {
    it('deve exibir o alerta quando modelValue é true', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { modelValue: true }
      })
      expect(wrapper.find('.qas-alert').exists()).toBeTruthy()
    })

    it('não deve exibir o alerta quando modelValue é false', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { modelValue: false }
      })
      expect(wrapper.find('.qas-alert').exists()).toBeFalsy()
    })
  })

  describe('slot default', () => {
    it('deve renderizar conteúdo do slot no lugar do texto da prop', () => {
      const wrapper = mountComponent(QasAlert, {
        slots: { default: '<span class="slot-content">Conteúdo personalizado</span>' }
      })
      expect(wrapper.find('.slot-content').exists()).toBeTruthy()
      expect(wrapper.text()).toContain('Conteúdo personalizado')
    })
  })

  describe('prop useBox', () => {
    it('deve renderizar dentro de QasBox quando useBox é true', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { useBox: true },
        global: {
          stubs: {
            QasBox: { template: '<div class="qas-box-stub"><slot /></div>' }
          }
        }
      })
      expect(wrapper.find('.qas-box-stub').exists()).toBeTruthy()
    })

    it('não deve renderizar QasBox quando useBox é false', () => {
      const wrapper = mountComponent(QasAlert, {
        props: { useBox: false },
        global: {
          stubs: {
            QasBox: { template: '<div class="qas-box-stub"><slot /></div>' }
          }
        }
      })
      expect(wrapper.find('.qas-box-stub').exists()).toBeFalsy()
    })
  })

  describe('fechamento via botão de fechar', () => {
    it('deve emitir update:modelValue com false ao clicar no botão de fechar', async () => {
      const wrapper = mountComponent(QasAlert, {
        props: { useCloseButton: true, modelValue: true }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
    })
  })

  describe('prop storageKey + usePersistentModelOnClose', () => {
    it('deve chamar LocalStorage.set e emitir update:modelValue ao fechar com usePersistentModelOnClose', async () => {
      LocalStorage.set = vi.fn()
      const wrapper = mountComponent(QasAlert, {
        props: {
          useCloseButton: true,
          modelValue: true,
          storageKey: 'minha-chave',
          usePersistentModelOnClose: true
        }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(LocalStorage.set).toHaveBeenCalled()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('não deve chamar LocalStorage.set ao fechar sem usePersistentModelOnClose', async () => {
      LocalStorage.set = vi.fn()
      const wrapper = mountComponent(QasAlert, {
        props: { useCloseButton: true, modelValue: true }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(LocalStorage.set).not.toHaveBeenCalled()
    })
  })

  describe('inject isDialog', () => {
    it('deve renderizar corretamente quando isDialog é true', () => {
      const wrapper = mountComponent(QasAlert, {
        global: {
          provide: { isDialog: true }
        }
      })
      expect(wrapper.find('.qas-alert').exists()).toBeTruthy()
    })
  })
})
