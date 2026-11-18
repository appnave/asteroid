import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasSelectFilter from './QasSelectFilter.vue'
import QasSelect from '../select/QasSelect.vue'

import useDefaultFilters from '../../composables/use-default-filters'

import { mountQas } from '../../../../test/utils/mount-qas.js'

const options = [
  { label: 'Empresa A', value: 'a' },
  { label: 'Empresa B', value: 'b' }
]

async function mountSelectFilter ({ props = {}, ...mountOptions } = {}) {
  const mounted = await mountQas(QasSelectFilter, { props: { options, ...props }, ...mountOptions })

  await flushPromises()

  return mounted
}

const getSelect = wrapper => wrapper.findComponent(QasSelect)

async function selectValue (wrapper, value) {
  getSelect(wrapper).vm.$emit('update:modelValue', value)
  await flushPromises()
}

describe('QasSelectFilter', () => {
  // o estado dos filtros padrão é global, então é limpo entre os testes
  beforeEach(() => {
    useDefaultFilters().filterQuery.value = {}
  })

  it('usa o valor da URL ao montar', async () => {
    const { wrapper } = await mountSelectFilter({ route: '/?company=b' })

    expect(getSelect(wrapper).props('modelValue')).toBe('b')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['b'])
  })

  it('ao selecionar, grava o valor na URL mantendo as outras queries', async () => {
    const { wrapper, router } = await mountSelectFilter({ route: '/?page=2' })

    await selectValue(wrapper, 'a')

    expect(router.currentRoute.value.query).toEqual({ page: '2', company: 'a' })
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['a'])
  })

  it('com "multiple", transforma o valor único da URL em lista', async () => {
    const { wrapper } = await mountSelectFilter({ props: { multiple: true }, route: '/?company=a' })

    expect(getSelect(wrapper).props('modelValue')).toEqual(['a'])
  })

  it('salva o filtro no estado global de filtros padrão', async () => {
    const { wrapper } = await mountSelectFilter()

    await selectValue(wrapper, 'b')

    expect(useDefaultFilters().filterQuery.value.company).toBe('b')
  })

  it('avisa quem escuta a mudança de filtros padrão, só quando muda', async () => {
    const callback = vi.fn()
    const { onDefaultFiltersChange, removeOnDefaultFiltersChange } = useDefaultFilters()

    onDefaultFiltersChange(callback)

    const { wrapper } = await mountSelectFilter()

    await selectValue(wrapper, 'a')
    await selectValue(wrapper, 'a')

    removeOnDefaultFiltersChange(callback)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({ company: 'a' }, { company: undefined })
  })
})
