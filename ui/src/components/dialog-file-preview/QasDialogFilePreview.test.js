import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasDialogFilePreview from './QasDialogFilePreview.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o panzoom só aplica transformações de CSS na imagem, aqui ele só registra as chamadas
const panzoomInstance = {
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  zoom: vi.fn(),
  reset: vi.fn(),
  destroy: vi.fn(),
  zoomWithWheel: vi.fn()
}

vi.mock('@panzoom/panzoom', () => ({ default: vi.fn(() => panzoomInstance) }))

async function mountFilePreview ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasDialogFilePreview, {
    props: { url: 'https://cdn.com/foto.png', title: 'Planta', modelValue: false, 'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }), ...props },
    ...options
  })

  return wrapper
}

async function open (wrapper) {
  await wrapper.setProps({ modelValue: true })
  await flushPromises()
}

const findInBody = selector => document.body.querySelector(selector)
const getButtonByIcon = (wrapper, icon) => wrapper.findAllComponents({ name: 'QasBtn' }).find(button => button.props('icon') === icon)

describe('QasDialogFilePreview', () => {
  it('imagem: exibe a imagem com carregamento e controles de zoom', async () => {
    const wrapper = await mountFilePreview()

    await open(wrapper)

    expect(findInBody('img.qas-dialog-file-preview__image').getAttribute('src')).toBe('https://cdn.com/foto.png')
    expect(wrapper.findComponent({ name: 'QSpinner' }).exists()).toBe(true)
    expect(getButtonByIcon(wrapper, 'sym_r_zoom_in')).toBeDefined()
    expect(getButtonByIcon(wrapper, 'sym_r_zoom_out').props('disable')).toBe(true)
  })

  it('imagem: ao carregar, esconde o carregamento', async () => {
    const wrapper = await mountFilePreview()

    await open(wrapper)

    findInBody('img.qas-dialog-file-preview__image').dispatchEvent(new Event('load'))
    await flushPromises()

    expect(wrapper.findComponent({ name: 'QSpinner' }).exists()).toBe(false)
  })

  it('imagem: se não carregar, exibe a mensagem de erro', async () => {
    const wrapper = await mountFilePreview()

    await open(wrapper)

    findInBody('img.qas-dialog-file-preview__image').dispatchEvent(new Event('error'))
    await flushPromises()

    expect(findInBody('.q-dialog').textContent).toContain('Erro ao carregar imagem.')
  })

  it.each([
    [{ url: 'https://cdn.com/contrato.pdf?token=abc' }],
    [{ url: 'https://cdn.com/arquivo', fileType: 'pdf' }]
  ])('PDF (%j): exibe em um iframe, sem zoom', async props => {
    const wrapper = await mountFilePreview({ props })

    await open(wrapper)

    expect(findInBody('iframe.qas-dialog-file-preview__pdf-iframe').getAttribute('src')).toBe(props.url)
    expect(getButtonByIcon(wrapper, 'sym_r_zoom_in')).toBeUndefined()
  })

  it('"custom-download" substitui o download padrão', async () => {
    const customDownload = vi.fn()
    const wrapper = await mountFilePreview({ props: { customDownload } })

    await open(wrapper)
    await getButtonByIcon(wrapper, 'sym_r_download').find('button').trigger('click')

    expect(customDownload).toHaveBeenCalledWith('https://cdn.com/foto.png')
  })

  it('ao abrir outra imagem depois de um erro, tenta carregar de novo', async () => {
    const wrapper = await mountFilePreview()

    await open(wrapper)

    findInBody('img.qas-dialog-file-preview__image').dispatchEvent(new Event('error'))
    await flushPromises()

    await wrapper.setProps({ modelValue: false, url: 'https://cdn.com/outra.png' })
    await open(wrapper)

    expect(findInBody('img.qas-dialog-file-preview__image')?.getAttribute('src')).toBe('https://cdn.com/outra.png')
  })
})
