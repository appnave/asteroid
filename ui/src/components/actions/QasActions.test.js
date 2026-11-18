import { describe, it, expect, afterEach } from 'vitest'
import { Screen } from 'quasar'

import QasActions from './QasActions.vue'
import QasBtn from '../btn/QasBtn.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountActions ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasActions, { props, ...options })

  return wrapper
}

const getButtons = wrapper => wrapper.findAllComponents(QasBtn)

describe('QasActions', () => {
  afterEach(() => {
    Screen.xs = false
  })

  it('exibe os botões na ordem terciário, secundário e primário, cada um com a sua variante', async () => {
    const wrapper = await mountActions({
      props: {
        primaryButtonProps: { label: 'Salvar' },
        secondaryButtonProps: { label: 'Cancelar' },
        tertiaryButtonProps: { label: 'Limpar' }
      }
    })

    expect(getButtons(wrapper).map(button => [button.props('label'), button.props('variant')])).toEqual([
      ['Limpar', 'tertiary'],
      ['Cancelar', 'secondary'],
      ['Salvar', 'primary']
    ])
  })

  it('a variante não pode ser trocada pelas props do botão', async () => {
    const wrapper = await mountActions({ props: { primaryButtonProps: { label: 'Salvar', variant: 'tertiary' } } })

    expect(getButtons(wrapper)[0].props('variant')).toBe('primary')
  })

  it('só exibe os botões informados', async () => {
    const wrapper = await mountActions({ props: { primaryButtonProps: { label: 'Salvar' } } })

    expect(getButtons(wrapper)).toHaveLength(1)
  })

  it('em telas pequenas ou com "use-full-width", empilha os botões com o primário em cima', async () => {
    const fullWidth = await mountActions({ props: { primaryButtonProps: { label: 'Salvar' }, useFullWidth: true } })

    Screen.xs = true

    const small = await mountActions({ props: { primaryButtonProps: { label: 'Salvar' } } })

    expect(fullWidth.classes()).toEqual(expect.arrayContaining(['column', 'reverse']))
    expect(small.classes()).toEqual(expect.arrayContaining(['column', 'reverse', 'q-col-gutter-md']))
  })
})
