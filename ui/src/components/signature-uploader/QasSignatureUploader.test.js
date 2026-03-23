import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasSignatureUploader from './QasSignatureUploader.vue'

vi.mock('signature_pad', () => ({
  default: function SignaturePad () {
    return {
      clear: vi.fn(),
      toDataURL: vi.fn(() => 'data:image/png;base64,abc123'),
      isEmpty: vi.fn(() => true),
      on: vi.fn(),
      off: vi.fn(),
      addEventListener: vi.fn()
    }
  }
}))

vi.mock('../../helpers', async importOriginal => {
  const actual = await importOriginal()
  return { ...actual, base64ToBlob: vi.fn(() => new Blob()) }
})

vi.mock('../../plugins/notify-error/NotifyError.js', () => ({
  default: vi.fn()
}))

describe('QasSignatureUploader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasSignatureUploader, {
      props: { modelValue: '', uploaderProps: { entity: 'test-entity' } }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasUploader', () => {
      const uploader = wrapper.findComponent({ name: 'QasUploader' })
      expect(uploader.exists()).toBe(true)
    })

    it('renderiza QasDialog', () => {
      const dialog = wrapper.findComponent({ name: 'QasDialog' })
      expect(dialog.exists()).toBe(true)
    })
  })

  describe('Props', () => {
    it('signatureLabel tem default "Assinatura"', () => {
      expect(QasSignatureUploader.props?.signatureLabel?.default).toBe('Assinatura')
    })

    it('type tem default "image/png"', () => {
      expect(QasSignatureUploader.props?.type?.default).toBe('image/png')
    })
  })

  describe('Data', () => {
    it('isOpenedDialog começa false', () => {
      expect(wrapper.vm.isOpenedDialog).toBe(false)
    })

    it('isEmpty começa true', () => {
      expect(wrapper.vm.isEmpty).toBe(true)
    })
  })

  describe('Computed', () => {
    it('defaultUploaderProps inclui label de adicionar', () => {
      expect(wrapper.vm.defaultUploaderProps.addButtonLabel).toBe('Adicionar assinatura')
    })

    it('defaultUploaderProps mescla uploaderProps', () => {
      const w = mountComponent(QasSignatureUploader, {
        props: { modelValue: '', uploaderProps: { entity: 'test-entity', someOption: true } }
      })

      expect(w.vm.defaultUploaderProps.someOption).toBe(true)
    })

    it('defaultDialogProps tem ok.label "Salvar"', () => {
      expect(wrapper.vm.defaultDialogProps.ok.label).toBe('Salvar')
    })

    it('model emite update:modelValue ao setar', () => {
      wrapper.vm.model = 'new-signature-url'
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBe('new-signature-url')
    })
  })

  describe('Métodos', () => {
    it('openDialog abre o diálogo', () => {
      wrapper.vm.openDialog()
      expect(wrapper.vm.isOpenedDialog).toBe(true)
    })

    it('closeSignature fecha o diálogo', () => {
      wrapper.vm.isOpenedDialog = true
      wrapper.vm.closeSignature()
      expect(wrapper.vm.isOpenedDialog).toBe(false)
    })
  })
})
