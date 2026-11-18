import { describe, it, expect } from 'vitest'

import QasPasswordInput from './QasPasswordInput.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasInput from '../input/QasInput.vue'
import QasPasswordStrengthChecker from '../password-strength-checker/QasPasswordStrengthChecker.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountPasswordInput ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasPasswordInput, { props, ...options })

  return wrapper
}

const getInput = wrapper => wrapper.findComponent(QasInput)
const getToggleButton = wrapper => wrapper.findComponent(QasBtn)

describe('QasPasswordInput', () => {
  it('esconde a senha por padrão', async () => {
    const wrapper = await mountPasswordInput({ props: { modelValue: 'Abc1!' } })

    expect(getInput(wrapper).vm.$attrs.type).toBe('password')
    expect(getToggleButton(wrapper).props('icon')).toBe('sym_r_visibility')
  })

  it('o botão alterna entre mostrar e esconder a senha', async () => {
    const wrapper = await mountPasswordInput({ props: { modelValue: 'Abc1!' } })

    await getToggleButton(wrapper).find('button').trigger('click')

    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(getToggleButton(wrapper).props('icon')).toBe('sym_r_visibility_off')
  })

  it('sem senha, desabilita o botão e não exibe a força da senha', async () => {
    const wrapper = await mountPasswordInput()

    expect(getToggleButton(wrapper).props('disable')).toBe(true)
    expect(wrapper.findComponent(QasPasswordStrengthChecker).exists()).toBe(false)
  })

  it('com senha, exibe a força da senha repassando as regras', async () => {
    const wrapper = await mountPasswordInput({ props: { modelValue: 'Abc1!', minlength: 5 } })

    expect(wrapper.findComponent(QasPasswordStrengthChecker).props()).toMatchObject({ password: 'Abc1!', minlength: 5 })
  })

  it('emite o valor digitado e o nível da senha', async () => {
    const wrapper = await mountPasswordInput({ props: { modelValue: 'Abcdef1!' } })

    getInput(wrapper).vm.$emit('update:modelValue', 'novaSenha')

    expect(wrapper.emitted('update:modelValue')).toEqual([['novaSenha']])
    expect(wrapper.emitted('update:currentLevel').at(-1)).toEqual([4])
  })
})
