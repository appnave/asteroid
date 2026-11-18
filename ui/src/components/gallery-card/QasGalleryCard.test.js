import { describe, it, expect } from 'vitest'

import QasGalleryCard from './QasGalleryCard.vue'
import QasHeader from '../header/QasHeader.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountGalleryCard ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasGalleryCard, { props: { url: 'https://cdn.com/foto.png', ...props }, ...options })

  return wrapper
}

describe('QasGalleryCard', () => {
  it('exibe a imagem da url', async () => {
    const wrapper = await mountGalleryCard()

    expect(wrapper.findComponent({ name: 'QImg' }).props('src')).toBe('https://cdn.com/foto.png')
  })

  it('com label ou ações em "header-props", exibe o cabeçalho com título h5 e menu sem label', async () => {
    const wrapper = await mountGalleryCard({ props: { headerProps: { labelProps: { label: 'Fachada' } } } })

    expect(wrapper.findComponent(QasHeader).props()).toMatchObject({
      labelProps: { label: 'Fachada', typography: 'h5' },
      actionsMenuProps: { useLabel: false }
    })
  })

  it('sem label nem ações, não exibe o cabeçalho', async () => {
    const wrapper = await mountGalleryCard()

    expect(wrapper.findComponent(QasHeader).exists()).toBe(false)
  })

  it.each([
    ['https://cdn.com/contrato.pdf', 'PDF'],
    ['https://cdn.com/download?file=planilha.xlsx', 'XLSX'],
    ['https://cdn.com/foto.png', '']
  ])('identifica o tipo de arquivo de "%s" para exibir quando a imagem falha', async (url, fileType) => {
    const wrapper = await mountGalleryCard({ props: { url } })

    expect(wrapper.vm.$.setupState.normalizedFileType).toBe(fileType)
  })

  it('"file-type" tem prioridade sobre a extensão da url', async () => {
    const wrapper = await mountGalleryCard({ props: { fileType: 'doc' } })

    expect(wrapper.vm.$.setupState.normalizedFileType).toBe('DOC')
  })
})
