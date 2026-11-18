import { describe, it, expect } from 'vitest'
import { defineComponent, h, inject } from 'vue'

import QasBox from './QasBox.vue'
import QasSkeleton from '../skeleton/QasSkeleton.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountBox (options) {
  const { wrapper } = await mountQas(QasBox, options)

  return wrapper
}

describe('QasBox', () => {
  describe('aparência', () => {
    it('tem sombra e espaçamento "md" por padrão', async () => {
      const wrapper = await mountBox()

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['shadow-2', 'q-px-md', 'q-py-md']))
      expect(wrapper.classes()).not.toContain('border-grey')
    })

    it('com "use-spacing" false, remove o espaçamento', async () => {
      const wrapper = await mountBox({ props: { useSpacing: false } })

      expect(wrapper.classes().some(name => /^q-p[xy]-/.test(name))).toBe(false)
    })
  })

  describe('conteúdo', () => {
    it('com "skeleton", exibe o carregamento sobre o conteúdo', async () => {
      const wrapper = await mountBox({ props: { skeleton: true } })

      expect(wrapper.findComponent(QasSkeleton).exists()).toBe(true)
    })

    it('avisa os componentes internos que estão dentro de um QasBox', async () => {
      const Child = defineComponent({
        setup () {
          const isBox = inject('isBox', false)

          return () => h('span', { class: 'child' }, String(isBox))
        }
      })

      const wrapper = await mountBox({ slots: { default: () => h(Child) } })

      expect(wrapper.find('.child').text()).toBe('true')
    })
  })
})
