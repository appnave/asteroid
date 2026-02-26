import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils'
import QasStepper from './QasStepper.vue'

const nextMock = vi.fn()
const previousMock = vi.fn()
const goToMock = vi.fn()

const QStepperStub = {
  name: 'QStepper',
  template: '<div class="q-stepper-stub"><slot /></div>',
  props: [
    'modelValue',
    'vertical',
    'flat',
    'animated',
    'contracted',
    'doneColor',
    'activeColor',
    'headerClass',
    'headerNav',
    'inactiveColor',
    'keepAlive',
    'activeIcon',
    'doneIcon',
    'errorIcon',
    'errorColor'
  ],
  emits: ['update:modelValue'],
  methods: {
    next: nextMock,
    previous: previousMock,
    goTo: goToMock
  }
}

function createWrapper (props = {}, stubs = {}) {
  return mountComponent(QasStepper, {
    props,
    global: {
      stubs: {
        QStepper: QStepperStub,
        ...stubs
      }
    }
  })
}

describe('QasStepper', () => {
  describe('renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = createWrapper()

      expect(wrapper.exists()).toBeTruthy()
    })

    it('deve ter a classe "qas-stepper" no elemento raiz', () => {
      const wrapper = createWrapper()

      expect(wrapper.classes()).toContain('qas-stepper')
    })

    it('deve renderizar o q-stepper interno', () => {
      const wrapper = createWrapper()

      expect(wrapper.find('.q-stepper-stub').exists()).toBeTruthy()
    })
  })

  describe('prop disable', () => {
    it('deve aplicar a classe "qas-stepper--disable" quando disable é true', () => {
      const wrapper = createWrapper({ disable: true })

      expect(wrapper.classes()).toContain('qas-stepper--disable')
    })

    it('não deve aplicar a classe "qas-stepper--disable" quando disable é false', () => {
      const wrapper = createWrapper({ disable: false })

      expect(wrapper.classes()).not.toContain('qas-stepper--disable')
    })
  })

  describe('prop useVertical', () => {
    it('deve passar a prop "vertical" ao q-stepper quando useVertical é true', () => {
      const wrapper = createWrapper({ useVertical: true })
      const qStepper = wrapper.findComponent(QStepperStub)

      expect(qStepper.props('vertical')).toBe(true)
    })

    it('não deve passar "vertical=true" ao q-stepper quando useVertical é false', () => {
      const wrapper = createWrapper({ useVertical: false })
      const qStepper = wrapper.findComponent(QStepperStub)

      expect(qStepper.props('vertical')).toBeFalsy()
    })
  })

  describe('métodos expostos', () => {
    it('deve expor o método next()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.next).toBe('function')
    })

    it('deve expor o método previous()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.previous).toBe('function')
    })

    it('deve expor o método goTo()', () => {
      const wrapper = createWrapper()

      expect(typeof wrapper.vm.goTo).toBe('function')
    })
  })

  describe('método next() com disable', () => {
    it('não deve chamar stepper.next() quando disable é true', () => {
      nextMock.mockClear()

      const wrapper = createWrapper({ disable: true })
      wrapper.vm.next()

      expect(nextMock).not.toHaveBeenCalled()
    })

    it('deve chamar stepper.next() quando disable é false', () => {
      nextMock.mockClear()

      const wrapper = createWrapper({ disable: false })
      wrapper.vm.next()

      expect(nextMock).toHaveBeenCalledOnce()
    })
  })

  describe('método previous() com disable', () => {
    it('não deve chamar stepper.previous() quando disable é true', () => {
      previousMock.mockClear()

      const wrapper = createWrapper({ disable: true })
      wrapper.vm.previous()

      expect(previousMock).not.toHaveBeenCalled()
    })

    it('deve chamar stepper.previous() quando disable é false', () => {
      previousMock.mockClear()

      const wrapper = createWrapper({ disable: false })
      wrapper.vm.previous()

      expect(previousMock).toHaveBeenCalledOnce()
    })
  })

  describe('método goTo()', () => {
    it('deve chamar stepper.goTo() com o passo correto', () => {
      goToMock.mockClear()

      const wrapper = createWrapper()
      wrapper.vm.goTo(3)

      expect(goToMock).toHaveBeenCalledWith(3)
    })
  })
})
