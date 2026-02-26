import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'

vi.mock('../../helpers', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    copyToClipboard: vi.fn(() => Promise.resolve())
  }
})

import { copyToClipboard } from '../../helpers'
import QasCopy from './QasCopy.vue'

describe('QasCopy', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente com a prop text obrigatória', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto para copiar' }
      })
      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve renderizar o botão de copiar', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto para copiar' }
      })
      expect(wrapper.find('.qas-btn-stub').exists()).toBeTruthy()
    })
  })

  describe('prop useText', () => {
    it('deve exibir o texto quando useText é true (padrão)', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto visível', useText: true }
      })
      expect(wrapper.text()).toContain('Texto visível')
    })

    it('não deve exibir o texto quando useText é false', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto oculto', useText: false }
      })
      expect(wrapper.text()).not.toContain('Texto oculto')
    })
  })

  describe('prop text + clique no botão', () => {
    it('deve chamar copyToClipboard com o valor de text ao clicar', async () => {
      copyToClipboard.mockClear()
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Copiar este texto' }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(copyToClipboard).toHaveBeenCalledWith('Copiar este texto', expect.any(Function))
    })
  })

  describe('prop rawText', () => {
    it('deve chamar copyToClipboard com rawText quando rawText está definido', async () => {
      copyToClipboard.mockClear()
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto visível', rawText: 'Texto sem formatação' }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(copyToClipboard).toHaveBeenCalledWith('Texto sem formatação', expect.any(Function))
    })

    it('deve usar text quando rawText está vazio', async () => {
      copyToClipboard.mockClear()
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto principal', rawText: '' }
      })
      await wrapper.find('.qas-btn-stub').trigger('click')
      expect(copyToClipboard).toHaveBeenCalledWith('Texto principal', expect.any(Function))
    })
  })

  describe('prop icon', () => {
    const iconStub = {
      QasBtn: { template: '<button class="qas-btn-stub" :data-icon="icon"><slot /></button>', props: ['icon', 'variant', 'color', 'loading'] }
    }

    it('deve passar o icon padrão sym_r_file_copy para o botão', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto' },
        global: { stubs: iconStub }
      })
      expect(wrapper.find('.qas-btn-stub').attributes('data-icon')).toBe('sym_r_file_copy')
    })

    it('deve passar o icon customizado para o botão quando definido', () => {
      const wrapper = mountComponent(QasCopy, {
        props: { text: 'Texto', icon: 'sym_r_content_copy' },
        global: { stubs: iconStub }
      })
      expect(wrapper.find('.qas-btn-stub').attributes('data-icon')).toBe('sym_r_content_copy')
    })
  })
})
