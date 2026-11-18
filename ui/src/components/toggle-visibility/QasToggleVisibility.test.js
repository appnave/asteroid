import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasToggleVisibility from './QasToggleVisibility.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

let uuidCounter = 0

async function mountToggleVisibility ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasToggleVisibility, {
    props: { text: '123.456.789-00', uuid: `toggle-${++uuidCounter}`, ...props },
    ...options
  })

  return wrapper
}

const getToggle = wrapper => wrapper.find('[role="button"]')

/**
 * O componente ignora cliques que não vieram do usuário (event.isTrusted), e no jsdom
 * todo evento criado é "não confiável". Aqui o handler do elemento é chamado com um clique do usuário.
 */
async function userClick (wrapper) {
  getToggle(wrapper).element.__vnode.props.onClick({ isTrusted: true, preventDefault () {}, stopPropagation () {} })
  await flushPromises()
}

describe('QasToggleVisibility', () => {
  beforeEach(() => {
    localStorage.clear()
    NotifyError.mockClear()
  })

  it('começa escondido, com a tooltip "Visualizar conteúdo"', async () => {
    const wrapper = await mountToggleVisibility()

    expect(wrapper.text()).not.toContain('123.456.789-00')
    expect(wrapper.findComponent(QasBtn).props('icon')).toBe('sym_r_visibility_off')
    expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Visualizar conteúdo')
    expect(getToggle(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('ao clicar, exibe o conteúdo e emite "show"', async () => {
    const wrapper = await mountToggleVisibility()

    await userClick(wrapper)

    expect(wrapper.text()).toContain('123.456.789-00')
    expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Ocultar conteúdo')
    expect(wrapper.emitted('show')).toHaveLength(1)
  })

  it('clicar de novo esconde e emite "hide"', async () => {
    const wrapper = await mountToggleVisibility()

    await userClick(wrapper)
    await userClick(wrapper)

    expect(wrapper.text()).not.toContain('123.456.789-00')
    expect(wrapper.emitted('hide')).toHaveLength(1)
  })

  it('ignora cliques que não vieram do usuário', async () => {
    const wrapper = await mountToggleVisibility()

    await getToggle(wrapper).trigger('click')

    expect(wrapper.text()).not.toContain('123.456.789-00')
  })

  it('no mesmo grupo, só um fica visível por vez', async () => {
    const first = await mountToggleVisibility({ props: { group: 'cpfs' } })
    const second = await mountToggleVisibility({ props: { group: 'cpfs' } })

    await userClick(first)
    await userClick(second)

    expect(first.text()).not.toContain('123.456.789-00')
    expect(second.text()).toContain('123.456.789-00')
  })

  it('limita a 10 visualizações por minuto em cada escopo', async () => {
    const wrapper = await mountToggleVisibility({ props: { scope: 'cpf' } })

    for (let click = 0; click < 10; click++) {
      await userClick(wrapper)
      await userClick(wrapper)
    }

    await userClick(wrapper)

    expect(wrapper.text()).not.toContain('123.456.789-00')
    expect(NotifyError).toHaveBeenCalledWith(expect.stringContaining('Limite de visualizações atingido. Tente novamente em'))
  })
})
