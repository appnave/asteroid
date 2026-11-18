import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h, inject, markRaw } from 'vue'

import QasStepperFormView from './QasStepperFormView.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

let stepper = null

// cada passo guarda o "stepper" injetado, para o teste chamar next, previous, goTo...
const createStep = name => markRaw(defineComponent({
  name,
  setup () {
    stepper = inject('stepper')

    return () => h('div', { class: 'passo' }, name)
  }
}))

const steps = [
  { component: createStep('Dados'), stepProps: { title: 'Dados' } },
  { component: createStep('Endereco'), stepProps: { title: 'Endereço' } },
  { component: createStep('Revisao'), stepProps: { title: 'Revisão' } }
]

async function mountStepperFormView ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasStepperFormView, {
    props: { steps, modelValue: 1, 'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }), ...props },
    ...options
  })

  await flushPromises()

  return wrapper
}

// o QStepper só monta o passo ativo, então os passos são lidos pelo cabeçalho
const getTabs = wrapper => wrapper.findAll('.q-stepper__tab')
const getTabTitles = wrapper => getTabs(wrapper).map(tab => tab.text())
const getDoneTabs = wrapper => getTabs(wrapper).map(tab => tab.classes().includes('q-stepper__tab--done'))
const getModel = wrapper => wrapper.props('modelValue')

describe('QasStepperFormView', () => {
  it('cria um passo para cada item de "steps", com os "step-props"', async () => {
    const wrapper = await mountStepperFormView()

    expect(getTabTitles(wrapper)).toEqual(['Dados', 'Endereço', 'Revisão'])
    expect(wrapper.findComponent({ name: 'QStep' }).props('name')).toBe(1)
  })

  it('marca como concluídos os passos anteriores', async () => {
    const wrapper = await mountStepperFormView({ props: { modelValue: 3 } })

    expect(getDoneTabs(wrapper)).toEqual([true, true, false])
  })

  describe('"stepper" injetado nos passos', () => {
    it('"next" junta o payload aos valores e vai para o próximo passo', async () => {
      const wrapper = await mountStepperFormView()

      stepper.next({ payload: { name: 'Ana' } })
      await flushPromises()

      stepper.next({ payload: { city: 'Campinas' } })
      await flushPromises()

      expect(getModel(wrapper)).toBe(3)
      expect(stepper.stepsValues.value).toEqual({ name: 'Ana', city: 'Campinas' })
    })

    it('"previous" e "goTo" mudam o passo', async () => {
      const wrapper = await mountStepperFormView({ props: { modelValue: 3 } })

      stepper.previous()
      await flushPromises()

      expect(getModel(wrapper)).toBe(2)

      stepper.goTo(1)
      await flushPromises()

      expect(getModel(wrapper)).toBe(1)
    })

    it('"setStepProps" altera as props de um passo', async () => {
      const wrapper = await mountStepperFormView()

      stepper.setStepProps({ step: 2, payload: { title: 'Endereço de entrega' } })
      await flushPromises()

      expect(getTabTitles(wrapper)[1]).toBe('Endereço de entrega')
    })

    it('"formViewProps" desliga a borda e o aviso de sucesso por padrão', async () => {
      await mountStepperFormView({ props: { formViewProps: { useBoundary: true } } })

      expect(stepper.formViewProps.value).toEqual({ useBoundary: true, useNotifySuccess: false })
    })
  })

  describe('passos com "name"', () => {
    const namedSteps = [
      { ...steps[0], name: 'personal' },
      { ...steps[1], name: 'address' },
      { ...steps[2], name: 'review' }
    ]

    it('usa o "name" do passo', async () => {
      const wrapper = await mountStepperFormView({ props: { steps: namedSteps, modelValue: 'address' } })

      expect(wrapper.findComponent({ name: 'QStep' }).props('name')).toBe('address')
      expect(wrapper.find('.passo').text()).toBe('Endereco')
    })

    // Problema listado no documento: com "name" nos passos, nenhum passo é marcado como concluído.
    it.fails('marca como concluídos os passos anteriores', async () => {
      const wrapper = await mountStepperFormView({ props: { steps: namedSteps, modelValue: 'review' } })

      expect(getDoneTabs(wrapper)).toEqual([true, true, false])
    })
  })
})
