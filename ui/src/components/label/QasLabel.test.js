import { describe, it, expect } from 'vitest'

import QasLabel from './QasLabel.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountLabel (options) {
  const { wrapper } = await mountQas(QasLabel, options)

  return wrapper
}

describe('QasLabel', () => {
  describe('texto', () => {
    it('exibe o label em um título h4 por padrão', async () => {
      const wrapper = await mountLabel({ props: { label: 'Dados pessoais' } })

      expect(wrapper.element.tagName).toBe('H4')
      expect(wrapper.text()).toBe('Dados pessoais')
    })

    it('com "required", adiciona "*" ao label', async () => {
      const wrapper = await mountLabel({ props: { label: 'Nome', required: true } })

      expect(wrapper.text()).toBe('Nome*')
    })

    it('com "count", adiciona o contador ao label', async () => {
      const wrapper = await mountLabel({ props: { label: 'Arquivos', count: 3 } })

      expect(wrapper.text()).toBe('Arquivos (3)')
    })

    it('não exibe contador quando "count" é zero', async () => {
      const wrapper = await mountLabel({ props: { label: 'Arquivos', count: 0 } })

      expect(wrapper.text()).toBe('Arquivos')
    })

    it('combina contador e "required"', async () => {
      const wrapper = await mountLabel({ props: { label: 'Arquivos', count: 2, required: true } })

      expect(wrapper.text()).toBe('Arquivos (2)*')
    })
  })
})
