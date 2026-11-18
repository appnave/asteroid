import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

import QasBtn from './QasBtn.vue'
import QasTooltip from '../tooltip/QasTooltip.vue'

import { mountQas } from '../../../../test/utils/mount-qas.js'

async function mountButton (options) {
  const { wrapper } = await mountQas(QasBtn, options)

  return wrapper
}

const getQBtn = wrapper => wrapper.findComponent({ name: 'QBtn' })
const getIcons = wrapper => wrapper.findAllComponents({ name: 'QIcon' }).map(icon => icon.props('name'))

describe('QasBtn', () => {
  describe('variante, cor e tamanho', () => {
    it('é "tertiary", "primary" e "lg" por padrão', async () => {
      const wrapper = await mountButton({ props: { label: 'Salvar' } })

      expect(getQBtn(wrapper).classes()).toEqual(expect.arrayContaining([
        'qas-btn--lg',
        'qas-btn--tertiary',
        'qas-btn--tertiary-primary'
      ]))
    })

    it('dentro de um QasBox, usa o tamanho "sm" nas variantes "primary" e "secondary"', async () => {
      const primary = await mountButton({ props: { label: 'Salvar', variant: 'primary' }, provide: { isBox: true } })
      const tertiary = await mountButton({ props: { label: 'Ver mais' }, provide: { isBox: true } })

      expect(getQBtn(primary).classes()).toContain('qas-btn--sm')
      expect(getQBtn(tertiary).classes()).toContain('qas-btn--lg')
    })

    it('usa os valores padrão injetados por componentes pais (ex: QasTableGenerator)', async () => {
      const wrapper = await mountButton({ props: { label: 'Ação' }, provide: { btnPropsDefaults: { size: 'sm' } } })

      expect(getQBtn(wrapper).classes()).toContain('qas-btn--sm')
    })

    it('aceita valores padrão injetados de forma reativa', async () => {
      const btnPropsDefaults = ref({ variant: 'secondary' })
      const wrapper = await mountButton({ props: { label: 'Ação' }, provide: { btnPropsDefaults } })

      expect(getQBtn(wrapper).classes()).toContain('qas-btn--secondary')
    })

    it('dentro de um QasHeader, usa o tamanho "lg" mesmo com padrão injetado', async () => {
      const wrapper = await mountButton({
        props: { label: 'Ação' },
        provide: { isHeader: true, btnPropsDefaults: { size: 'sm' } }
      })

      expect(getQBtn(wrapper).classes()).toContain('qas-btn--lg')
    })

    it('as props têm prioridade sobre os valores injetados', async () => {
      const wrapper = await mountButton({ props: { label: 'Ação', size: 'md' }, provide: { btnPropsDefaults: { size: 'sm' } } })

      expect(getQBtn(wrapper).classes()).toContain('qas-btn--md')
    })
  })

  describe('conteúdo', () => {
    it('com só um ícone e sem label, marca o botão como "somente ícone"', async () => {
      const wrapper = await mountButton({ props: { icon: 'sym_r_close' } })

      expect(getQBtn(wrapper).classes()).toContain('qas-btn--icon-only')
    })
  })

  describe('carregamento e desabilitado', () => {
    it('com "loading", troca o ícone pelo spinner e desabilita o botão', async () => {
      const wrapper = await mountButton({ props: { label: 'Salvar', icon: 'sym_r_save', loading: true } })

      expect(wrapper.findComponent({ name: 'QSpinner' }).exists()).toBe(true)
      expect(getIcons(wrapper)).toEqual([])
      expect(getQBtn(wrapper).props('disable')).toBe(true)
    })
  })

  describe('tooltip', () => {
    it('exibe a "tooltip"', async () => {
      const wrapper = await mountButton({ props: { label: 'Salvar', tooltip: 'Salva o formulário' } })

      expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Salva o formulário')
    })

    it('desabilitado, exibe a "disabled-tooltip" no lugar da "tooltip"', async () => {
      const wrapper = await mountButton({
        props: { label: 'Salvar', disable: true, tooltip: 'Salva o formulário', disabledTooltip: 'Preencha os campos' }
      })

      expect(wrapper.findComponent(QasTooltip).props('text')).toBe('Preencha os campos')
    })
  })

  describe('atributos', () => {
    it('repassa atributos para o QBtn, como "to" e o clique', async () => {
      // cancela a navegação do link, que o jsdom não implementa
      const onClick = vi.fn(event => event.preventDefault())
      const wrapper = await mountButton({ props: { label: 'Abrir' }, attrs: { href: '/usuarios', onClick } })

      await wrapper.find('a, button').trigger('click')

      expect(getQBtn(wrapper).props('href')).toBe('/usuarios')
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('ignora atributos de estilo do QBtn, para manter o visual do design system', async () => {
      const wrapper = await mountButton({ props: { label: 'Salvar' }, attrs: { flat: true, round: true, outline: true } })

      expect(getQBtn(wrapper).props('flat')).toBe(false)
      expect(getQBtn(wrapper).props('round')).toBe(false)
      expect(getQBtn(wrapper).props('outline')).toBe(false)
    })
  })
})
