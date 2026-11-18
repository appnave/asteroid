import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { copyToClipboard } from 'quasar'

import QasCopy from './QasCopy.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'
import NotifySuccess from '../../plugins/notify-success/NotifySuccess.js'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes, e o jsdom não tem área de transferência
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))
vi.mock('../../plugins/notify-success/NotifySuccess.js', () => ({ default: vi.fn() }))

vi.mock('quasar', async importOriginal => ({
  ...await importOriginal(),
  copyToClipboard: vi.fn(async () => {})
}))

async function mountCopy ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasCopy, { props: { text: '123.456.789-00', ...props }, ...options })

  return wrapper
}

async function clickCopy (wrapper) {
  await wrapper.findComponent(QasBtn).find('button').trigger('click')
  await flushPromises()
}

describe('QasCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe o texto e o botão de copiar com tooltip', async () => {
    const wrapper = await mountCopy()

    expect(wrapper.text()).toContain('123.456.789-00')
    expect(wrapper.findComponent(QasBtn).props('icon')).toBe('sym_r_file_copy')
    expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Copiar')
  })

  it('ao clicar, copia o texto e avisa o usuário', async () => {
    const wrapper = await mountCopy()

    await clickCopy(wrapper)

    expect(copyToClipboard).toHaveBeenCalledWith('123.456.789-00')
    expect(NotifySuccess).toHaveBeenCalledWith('Item copiado com sucesso.')
  })

  it('copia o "raw-text" quando informado', async () => {
    const wrapper = await mountCopy({ props: { rawText: '12345678900' } })

    await clickCopy(wrapper)

    expect(copyToClipboard).toHaveBeenCalledWith('12345678900')
  })

  it('exibe carregamento no botão por meio segundo', async () => {
    const wrapper = await mountCopy()

    await clickCopy(wrapper)

    expect(wrapper.findComponent(QasBtn).props('loading')).toBe(true)

    await vi.advanceTimersByTimeAsync(500)

    expect(wrapper.findComponent(QasBtn).props('loading')).toBe(false)
  })

  it('se não conseguir copiar, avisa o usuário', async () => {
    copyToClipboard.mockRejectedValueOnce(new Error('sem permissão'))

    const wrapper = await mountCopy()

    await clickCopy(wrapper)

    expect(NotifyError).toHaveBeenCalledWith('Não foi possível copiar o item.')
  })

  it('o clique não se propaga para elementos de fora (ex: linha da tabela)', async () => {
    const onParentClick = vi.fn()
    const wrapper = await mountCopy()

    wrapper.element.addEventListener('click', onParentClick)
    await clickCopy(wrapper)

    expect(onParentClick).not.toHaveBeenCalled()
  })
})
