import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasPdfViewer from './QasPdfViewer.vue'

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn()
}))

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs', () => ({}))

describe('QasPdfViewer', () => {
  describe('Renderização', () => {
    it('renderiza o componente', () => {
      const wrapper = mountComponent(QasPdfViewer, {
        props: { url: '' }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('tem a classe qas-pdf-viewer', () => {
      const wrapper = mountComponent(QasPdfViewer, {
        props: { url: '' }
      })
      expect(wrapper.find('.qas-pdf-viewer').exists()).toBe(true)
    })

    it('não exibe spinner quando não está carregando', () => {
      const wrapper = mountComponent(QasPdfViewer, {
        props: { url: '' }
      })
      const spinner = wrapper.findComponent({ name: 'QSpinner' })
      expect(spinner.exists()).toBe(false)
    })
  })

  describe('Props', () => {
    it('url tem default string vazia', () => {
      expect(QasPdfViewer.props?.url?.default).toBe('')
    })

    it('maxHeight tem default undefined', () => {
      expect(QasPdfViewer.props?.maxHeight?.default).toBeUndefined()
    })
  })

  describe('Estado inicial', () => {
    it('isLoading começa false', () => {
      const wrapper = mountComponent(QasPdfViewer, {
        props: { url: '' }
      })
      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('hasError começa false', () => {
      const wrapper = mountComponent(QasPdfViewer, {
        props: { url: '' }
      })
      expect(wrapper.vm.hasError).toBe(false)
    })

    it('não tenta carregar quando url está vazio', () => {
      // loadPDF retorna cedo sem processar quando url está vazio
      // Verificamos o estado inicial: não está carregando
      const wrapper = mountComponent(QasPdfViewer, { props: { url: '' } })
      expect(wrapper.vm.isLoading).toBe(false)
      expect(wrapper.vm.hasError).toBe(false)
    })
  })
})
