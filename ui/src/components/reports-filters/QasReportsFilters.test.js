import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasReportsFilters from './QasReportsFilters.vue'
import QasFormGenerator from '../form-generator/QasFormGenerator.vue'
import QasHeader from '../header/QasHeader.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

const defaultFields = {
  company: { name: 'company', label: 'Empresa', type: 'select', required: true },
  startDate: { name: 'start_date', label: 'Início', type: 'date', default: '2026-01-01' },
  status: { name: 'status', label: 'Status', type: 'select', multiple: true },
  active: { name: 'active', label: 'Ativo', type: 'boolean' }
}

function createStore ({ fields = defaultFields, fail = false } = {}) {
  const store = {
    filters: {},
    fetchFilters: vi.fn(async () => {
      if (fail) throw new Error('falhou')

      store.filters = fields
    })
  }

  return { reports: store }
}

async function mountReportsFilters ({ props = {}, store = createStore(), ...options } = {}) {
  const mounted = await mountQas(QasReportsFilters, {
    props: { entity: 'reports', url: 'reports/sales', ...props },
    slots: { default: '<div class="relatorio">Relatório</div>' },
    piniaStore: store,
    ...options
  })

  await flushPromises()

  return { ...mounted, store }
}

const getFilterButton = wrapper => wrapper.findAllComponents({ name: 'QasBtn' }).find(button => button.props('label') === 'Filtrar')
const getClearButton = wrapper => wrapper.findAllComponents({ name: 'QasBtn' }).find(button => button.props('label') === 'Limpar')
const isFilterDisabled = wrapper => getFilterButton(wrapper).find('button').element.disabled
const getModel = wrapper => wrapper.findComponent(QasFormGenerator).props('modelValue')

describe('QasReportsFilters', () => {
  describe('carregamento', () => {
    it('busca os filtros na API com a "url"', async () => {
      const { store } = await mountReportsFilters()

      expect(store.reports.fetchFilters).toHaveBeenCalledWith(expect.objectContaining({ url: 'reports/sales' }))
    })

    it('exibe o cabeçalho "Filtros" com a descrição e os campos com o "name" camelizado', async () => {
      const { wrapper } = await mountReportsFilters({ props: { description: 'Escolha os filtros' } })

      expect(wrapper.findComponent(QasHeader).props()).toMatchObject({ labelProps: { label: 'Filtros' }, description: 'Escolha os filtros' })
      expect(wrapper.findComponent(QasFormGenerator).props('fields').startDate.name).toBe('startDate')
    })

    it('com erro na API, avisa o usuário', async () => {
      await mountReportsFilters({ store: createStore({ fail: true }) })

      expect(NotifyError).toHaveBeenCalledWith('Não conseguimos buscar as informações. Por favor, tente novamente em alguns minutos.')
    })
  })

  describe('filtros padrão', () => {
    it('aplica o "default" dos campos e grava na URL', async () => {
      const { wrapper, router } = await mountReportsFilters()

      expect(getModel(wrapper).startDate).toBe('2026-01-01')
      expect(router.currentRoute.value.query).toEqual({ start_date: '2026-01-01' })
    })

    it('o valor da URL tem prioridade sobre o "default"', async () => {
      const { wrapper } = await mountReportsFilters({ route: '/?start_date=2026-05-01' })

      expect(getModel(wrapper).startDate).toBe('2026-05-01')
    })

    it('aplica "default" 0 e ignora o vazio', async () => {
      const fields = {
        floor: { name: 'floor', type: 'number', default: 0 },
        notes: { name: 'notes', type: 'text', default: '' }
      }

      const { wrapper } = await mountReportsFilters({ store: createStore({ fields }) })

      expect(getModel(wrapper)).toEqual({ floor: 0 })
    })

    it('com "use-default-filters" false, não aplica o "default"', async () => {
      const { wrapper, router } = await mountReportsFilters({ props: { useDefaultFilters: false } })

      expect(getModel(wrapper).startDate).toBeUndefined()
      expect(router.currentRoute.value.query).toEqual({})
    })
  })

  describe('valores da URL', () => {
    it('converte booleanos e transforma valor único de campo "multiple" em lista', async () => {
      const { wrapper } = await mountReportsFilters({ route: '/?active=true&status=paid' })

      expect(getModel(wrapper)).toMatchObject({ active: true, status: ['paid'] })
    })
  })

  describe('botão filtrar', () => {
    it('fica desabilitado enquanto um campo obrigatório não for preenchido', async () => {
      const { wrapper } = await mountReportsFilters()

      expect(isFilterDisabled(wrapper)).toBe(true)
    })

    it('fica habilitado com os campos obrigatórios preenchidos e exibe o relatório', async () => {
      const { wrapper } = await mountReportsFilters({ route: '/?company=a' })

      expect(isFilterDisabled(wrapper)).toBe(false)
      expect(wrapper.find('.relatorio').exists()).toBe(true)
    })

    it('ao filtrar, grava o model na URL e exibe o relatório', async () => {
      const { wrapper, router } = await mountReportsFilters()

      wrapper.findComponent(QasFormGenerator).vm.$emit('update:modelValue', { ...getModel(wrapper), company: 'a' })
      await flushPromises()

      await wrapper.findComponent({ name: 'QForm' }).trigger('submit')
      await flushPromises()

      expect(router.currentRoute.value.query).toEqual({ company: 'a', start_date: '2026-01-01' })
      expect(wrapper.find('.relatorio').exists()).toBe(true)
    })

    it.each([
      [null, true],
      ['', true],
      [0, false]
    ])('com o campo obrigatório %j, desabilitado é %s', async (company, disabled) => {
      const { wrapper } = await mountReportsFilters({ route: '/?company=a' })

      wrapper.findComponent(QasFormGenerator).vm.$emit('update:modelValue', { ...getModel(wrapper), company })
      await flushPromises()

      expect(isFilterDisabled(wrapper)).toBe(disabled)
    })
  })

  it('ao limpar, apaga o model, a URL e esconde o relatório', async () => {
    const { wrapper, router } = await mountReportsFilters({ route: '/?company=a' })

    await getClearButton(wrapper).find('button').trigger('click')
    await flushPromises()

    expect(getModel(wrapper)).toEqual({})
    expect(router.currentRoute.value.query).toEqual({})
    expect(wrapper.find('.relatorio').exists()).toBe(false)
  })
})
