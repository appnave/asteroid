import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasStepper from './QasStepper.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const steps = `
  <q-step :name="1" title="Dados">
    <span class="passo">Dados</span>
    <button class="proximo" @click="params.next()">Próximo</button>
  </q-step>
  <q-step :name="2" title="Endereço"><span class="passo">Endereço</span></q-step>
  <q-step :name="3" title="Revisão"><span class="passo">Revisão</span></q-step>
`

async function mountStepper ({ props = {}, ...options } = {}) {
  const { wrapper } = await mountQas(QasStepper, {
    props: { modelValue: 1, 'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }), ...props },
    slots: { default: steps },
    ...options
  })

  return wrapper
}

const getLastEmitted = wrapper => wrapper.emitted('update:modelValue')?.at(-1)[0]

describe('QasStepper', () => {
  describe('navegação', () => {
    it('"next" e "previous" mudam o passo', async () => {
      const wrapper = await mountStepper()

      wrapper.vm.next()
      await flushPromises()

      expect(getLastEmitted(wrapper)).toBe(2)

      wrapper.vm.previous()
      await flushPromises()

      expect(getLastEmitted(wrapper)).toBe(1)
    })

    it('"goTo" vai para o passo informado', async () => {
      const wrapper = await mountStepper()

      wrapper.vm.goTo(3)
      await flushPromises()

      expect(getLastEmitted(wrapper)).toBe(3)
    })

    it('os slots recebem "next" e "previous"', async () => {
      const wrapper = await mountStepper()

      await wrapper.find('.proximo').trigger('click')
      await flushPromises()

      expect(getLastEmitted(wrapper)).toBe(2)
    })

    it('com "disable", não muda de passo', async () => {
      const wrapper = await mountStepper({ props: { disable: true } })

      wrapper.vm.next()
      await flushPromises()

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.classes()).toContain('qas-stepper--disable')
    })
  })
})
