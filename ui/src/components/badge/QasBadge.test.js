import { describe, it, expect } from 'vitest'

import QasBadge from './QasBadge.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountBadge (options) {
  const { wrapper } = await mountQas(QasBadge, options)

  return wrapper
}

const getBadge = wrapper => wrapper.findComponent({ name: 'QBadge' })
const getChip = wrapper => wrapper.findComponent({ name: 'QChip' })

describe('QasBadge', () => {
  describe('badge simples', () => {
    it('exibe o label em um QBadge com a cor padrão', async () => {
      const wrapper = await mountBadge({ props: { label: 'Ativo' } })

      expect(getBadge(wrapper).exists()).toBe(true)
      expect(getBadge(wrapper).props('color')).toBe('light-blue-2')
      expect(wrapper.text()).toBe('Ativo')
    })
  })

  describe('badge removível', () => {
    it('com "removable", usa um QChip com botão de remover', async () => {
      const wrapper = await mountBadge({ props: { label: 'Filtro', removable: true } })

      expect(getChip(wrapper).exists()).toBe(true)
      expect(getChip(wrapper).props('removable')).toBe(true)
      expect(getBadge(wrapper).exists()).toBe(false)
    })

    it('emite "remove" ao clicar para remover', async () => {
      const wrapper = await mountBadge({ props: { label: 'Filtro', removable: true } })

      getChip(wrapper).vm.$emit('remove')

      expect(wrapper.emitted('remove')).toHaveLength(1)
    })
  })

  describe('estilo "subtle"', () => {
    it('com "use-subtle", usa a cor como fundo suave e borda, sem a cor sólida', async () => {
      const wrapper = await mountBadge({ props: { label: 'Pendente', color: 'primary', useSubtle: true } })

      expect(getBadge(wrapper).props('color')).toBeUndefined()
      expect(getBadge(wrapper).classes()).toContain('q-badge--subtle')
      expect(getBadge(wrapper).attributes('style')).toMatch(/--qas-badge-subtle-bg: rgba\(/)
    })

    it('exibe o ícone só no estilo "subtle"', async () => {
      const subtle = await mountBadge({ props: { label: 'Pendente', icon: 'sym_r_schedule', useSubtle: true } })
      const solid = await mountBadge({ props: { label: 'Pendente', icon: 'sym_r_schedule' } })

      expect(subtle.findComponent({ name: 'QIcon' }).props('name')).toBe('sym_r_schedule')
      expect(solid.findComponent({ name: 'QIcon' }).exists()).toBe(false)
    })
  })
})
