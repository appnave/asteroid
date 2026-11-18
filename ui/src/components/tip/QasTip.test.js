import { describe, it, expect } from 'vitest'

import QasTip from './QasTip.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountTip (props = {}) {
  const { wrapper } = await mountQas(QasTip, { props: { text: 'Campo usado no contrato', ...props } })

  return wrapper
}

const getIcon = wrapper => wrapper.findComponent({ name: 'QIcon' })

describe('QasTip', () => {
  it('exibe o ícone de ajuda com o texto na tooltip e no aria-label', async () => {
    const wrapper = await mountTip()

    expect(getIcon(wrapper).props()).toMatchObject({ name: 'sym_r_help', size: '16px', color: 'grey-8' })
    expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Campo usado no contrato')
    expect(wrapper.attributes('aria-label')).toBe('Campo usado no contrato')
  })
})
