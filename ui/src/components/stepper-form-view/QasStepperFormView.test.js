import { describe, it, expect, beforeEach } from 'vitest'
import { markRaw } from 'vue'
import { mountComponent } from '../../test-utils/mount-helper.js'
import QasStepperFormView from './QasStepperFormView.vue'

const StepComponentA = markRaw({ template: '<div>Step A</div>', name: 'StepA' })
const StepComponentB = markRaw({ template: '<div>Step B</div>', name: 'StepB' })

const defaultSteps = [
  { component: StepComponentA, stepProps: { title: 'Passo 1' } },
  { component: StepComponentB, stepProps: { title: 'Passo 2' } }
]

describe('QasStepperFormView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mountComponent(QasStepperFormView, {
      props: {
        steps: defaultSteps
      }
    })
  })

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renderiza QasStepper', () => {
      const stepper = wrapper.findComponent({ name: 'QasStepper' })
      expect(stepper.exists()).toBe(true)
    })

    it('renderiza um q-step para cada step', () => {
      // stepPropsList é inicializado com uma entrada por step (v-for)
      expect(wrapper.vm.stepPropsList.length).toBe(defaultSteps.length)
    })
  })

  describe('Props', () => {
    it('steps é obrigatório', () => {
      expect(QasStepperFormView.props?.steps?.required).toBe(true)
    })

    it('formViewProps tem default vazio', () => {
      const def = QasStepperFormView.props?.formViewProps?.default()
      expect(def).toEqual({})
    })

    it('stepperProps tem default vazio', () => {
      const def = QasStepperFormView.props?.stepperProps?.default()
      expect(def).toEqual({})
    })
  })

  describe('Model', () => {
    it('model começa em 1 por padrão', () => {
      expect(wrapper.vm.model).toBe(1)
    })

    it('aceita modelValue personalizado', () => {
      const w = mountComponent(QasStepperFormView, {
        props: { steps: defaultSteps, modelValue: 2 }
      })
      expect(w.vm.model).toBe(2)
    })
  })

  describe('Computed', () => {
    it('defaultFormViewProps inclui useBoundary: false', () => {
      expect(wrapper.vm.defaultFormViewProps.useBoundary).toBe(false)
    })

    it('defaultFormViewProps inclui useNotifySuccess: false', () => {
      expect(wrapper.vm.defaultFormViewProps.useNotifySuccess).toBe(false)
    })

    it('defaultFormViewProps mescla com formViewProps passadas', () => {
      const w = mountComponent(QasStepperFormView, {
        props: {
          steps: defaultSteps,
          formViewProps: { customProp: true }
        }
      })
      expect(w.vm.defaultFormViewProps.customProp).toBe(true)
      expect(w.vm.defaultFormViewProps.useBoundary).toBe(false)
    })
  })

  describe('Métodos', () => {
    it('isDone retorna false para o step atual (step 1 = índice 0)', () => {
      expect(wrapper.vm.isDone(0)).toBe(false)
    })

    it('isDone retorna true quando model avançou além do step', () => {
      const w = mountComponent(QasStepperFormView, {
        props: { steps: defaultSteps, modelValue: 3 }
      })
      expect(w.vm.isDone(0)).toBe(true)
      expect(w.vm.isDone(1)).toBe(true)
    })

    it('getStepName retorna step.name quando definido', () => {
      const name = wrapper.vm.getStepName({ step: { name: 'custom-step' }, stepIndex: 0 })
      expect(name).toBe('custom-step')
    })

    it('getStepName retorna stepIndex + 1 quando name não definido', () => {
      const name = wrapper.vm.getStepName({ step: {}, stepIndex: 0 })
      expect(name).toBe(1)
    })

    it('setStepProps atualiza stepProps de um step específico', () => {
      wrapper.vm.setStepProps({ step: 1, payload: { title: 'Novo título' } })
      expect(wrapper.vm.stepPropsList[0]).toEqual({ title: 'Novo título' })
    })

    it('expõe setStepProps via defineExpose', () => {
      expect(typeof wrapper.vm.setStepProps).toBe('function')
    })
  })
})
