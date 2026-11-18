import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasDateTimeInput from './QasDateTimeInput.vue'
import QasBtn from '../btn/QasBtn.vue'
import QasInput from '../input/QasInput.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountDateTimeInput ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasDateTimeInput, { props, ...options })

  await flushPromises()

  return wrapper
}

const getInput = wrapper => wrapper.findComponent(QasInput)
const getLastEmitted = wrapper => wrapper.emitted('update:modelValue')?.at(-1)[0]
const getPickerIcons = wrapper => wrapper.findAllComponents(QasBtn).map(button => button.props('icon'))

async function type (wrapper, value) {
  getInput(wrapper).vm.$emit('update:modelValue', value)
  await flushPromises()
}

async function blur (wrapper) {
  wrapper.findComponent({ name: 'QInput' }).vm.$emit('blur')
  await flushPromises()
}

// as datas com horário usam o fuso de quem roda o teste, então o esperado é calculado no mesmo fuso
const toLocalISOString = (...dateParts) => new Date(...dateParts).toISOString()

describe('QasDateTimeInput', () => {
  describe('máscara e seletores', () => {
    it('data e hora por padrão, com os dois seletores', async () => {
      const wrapper = await mountDateTimeInput()

      expect(getInput(wrapper).props('mask')).toBe('##/##/#### ##:##')
      expect(getPickerIcons(wrapper)).toEqual(['sym_r_calendar_today', 'sym_r_access_time'])
    })

    it('com "use-date-only", só a data e o seletor de data', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      expect(getInput(wrapper).props('mask')).toBe('##/##/####')
      expect(getPickerIcons(wrapper)).toEqual(['sym_r_calendar_today'])
    })

    it('com "use-time-only", só a hora e o seletor de hora', async () => {
      const wrapper = await mountDateTimeInput({ props: { useTimeOnly: true } })

      expect(getInput(wrapper).props('mask')).toBe('##:##')
      expect(getPickerIcons(wrapper)).toEqual(['sym_r_access_time'])
    })
  })

  describe('valor exibido', () => {
    it('exibe a data do model no formato da máscara', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true, modelValue: '2025-08-20' } })

      expect(getInput(wrapper).props('modelValue')).toBe('20/08/2025')
    })

    it('exibe data e hora no fuso local', async () => {
      const wrapper = await mountDateTimeInput({ props: { modelValue: toLocalISOString(2025, 7, 20, 10, 30) } })

      expect(getInput(wrapper).props('modelValue')).toBe('20/08/2025 10:30')
    })

    it('atualiza o campo quando o model muda', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true, modelValue: '2025-08-20' } })

      await wrapper.setProps({ modelValue: '2026-01-05' })

      expect(getInput(wrapper).props('modelValue')).toBe('05/01/2026')
    })
  })

  describe('valor emitido', () => {
    it('com "use-date-only", emite a data no formato "yyyy-MM-dd"', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      await type(wrapper, '20/08/2025')

      expect(getLastEmitted(wrapper)).toBe('2025-08-20')
    })

    it('com "use-date-only" e "use-iso", emite a data em ISO', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true, useIso: true } })

      await type(wrapper, '20/08/2025')

      expect(getLastEmitted(wrapper)).toBe(toLocalISOString(2025, 7, 20))
    })

    it('data e hora são emitidas em ISO', async () => {
      const wrapper = await mountDateTimeInput()

      await type(wrapper, '20/08/2025 10:30')

      expect(getLastEmitted(wrapper)).toBe(toLocalISOString(2025, 7, 20, 10, 30))
    })

    it('não emite enquanto o valor estiver incompleto', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      await type(wrapper, '20/08')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('validação', () => {
    it.each([
      [{ useDateOnly: true }, '32/01/2025'],
      [{ useTimeOnly: true }, '24:00'],
      [{}, '20/08/2025 25:00']
    ])('com %j, "%s" é inválido e limpa o model', async (props, value) => {
      const wrapper = await mountDateTimeInput({ props })

      await type(wrapper, value)

      expect(getLastEmitted(wrapper)).toBe('')
      expect(getInput(wrapper).props()).toMatchObject({ error: true, errorMessage: 'Data inválida.' })
    })

    it('ao sair com o valor incompleto, avisa e limpa o model', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      await type(wrapper, '20/08')
      await blur(wrapper)

      expect(getLastEmitted(wrapper)).toBe('')
      expect(getInput(wrapper).props()).toMatchObject({ error: true, errorMessage: 'Data incompleta.' })
    })

    it('ao sair com só a data preenchida, completa a hora com 00:00', async () => {
      const wrapper = await mountDateTimeInput()

      await type(wrapper, '20/08/2025')
      await blur(wrapper)

      expect(getInput(wrapper).props('modelValue')).toBe('20/08/2025 00:00')
      expect(getLastEmitted(wrapper)).toBe(toLocalISOString(2025, 7, 20, 0, 0))
    })

    it.each([
      '31/02/2025',
      '29/02/2025',
      '00/01/2025'
    ])('"%s" é inválido', async value => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      await type(wrapper, value)

      expect(getLastEmitted(wrapper)).toBe('')
    })

    it('data que não existe com horário também é inválida', async () => {
      const wrapper = await mountDateTimeInput()

      await type(wrapper, '31/04/2004 10:00')

      expect(getLastEmitted(wrapper)).toBe('')
      expect(getInput(wrapper).props()).toMatchObject({ error: true, errorMessage: 'Data inválida.' })
    })

    it('29/02 em ano bissexto continua válido, e a data incompleta não acusa erro', async () => {
      const wrapper = await mountDateTimeInput({ props: { useDateOnly: true } })

      await type(wrapper, '31/0')

      expect(getInput(wrapper).props('error')).toBe(false)

      await type(wrapper, '29/02/2024')

      expect(getLastEmitted(wrapper)).toBe('2024-02-29')
    })
  })
})
