import { describe, it, expect } from 'vitest'

import QasPasswordStrengthChecker from './QasPasswordStrengthChecker.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountStrengthChecker (props = {}) {
  const { wrapper } = await mountQas(QasPasswordStrengthChecker, { props })

  return wrapper
}

const getLabel = wrapper => wrapper.find('.text-subtitle2').text()

describe('QasPasswordStrengthChecker', () => {
  it('sem senha, não exibe nada', async () => {
    const wrapper = await mountStrengthChecker()

    expect(wrapper.find('.text-subtitle2').exists()).toBe(false)
  })

  it.each([
    ['abc', 'Muito fraco', 0],
    ['abc1', 'Fraco', 1],
    ['abc1!', 'Bom', 2],
    ['Abc1!', 'Forte', 3],
    ['Abcdef1!', 'Muito forte', 4]
  ])('"%s" é "%s"', async (password, label, level) => {
    const wrapper = await mountStrengthChecker({ password })

    expect(getLabel(wrapper)).toBe(label)
    expect(wrapper.emitted('update:currentLevel').at(-1)).toEqual([level])
  })

  it('"minlength" define o tamanho mínimo', async () => {
    const wrapper = await mountStrengthChecker({ password: 'Abc1!', minlength: 5 })

    expect(getLabel(wrapper)).toBe('Muito forte')
  })

  it('critérios desligados contam como atendidos', async () => {
    const wrapper = await mountStrengthChecker({ password: 'abcdefgh', useNumbers: false, useSpecial: false, useUppercase: false })

    expect(getLabel(wrapper)).toBe('Muito forte')
  })

  // Problema listado no documento: uma senha sem nenhum critério atendido tem score -1 e quebra o componente.
  it.fails.each([' ', 'ç', 'é'])('"%s" é "Muito fraco"', async password => {
    const wrapper = await mountStrengthChecker({ password })

    expect(getLabel(wrapper)).toBe('Muito fraco')
  })
})
