import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'

import QasSortable from './QasSortable.vue'

import NotifyError from '../../plugins/notify-error/NotifyError.js'

import { mountQas } from '../../../../test/utils/mount-qas.js'

// o plugin Notify do Quasar não é instalado nos testes
vi.mock('../../plugins/notify-error/NotifyError.js', () => ({ default: vi.fn() }))

const makeItems = () => [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C' }]

function createStore ({ fail = false } = {}) {
  return {
    banners: {
      replace: vi.fn(async () => {
        if (fail) throw new Error('falhou')

        return { data: { status: 'ok' } }
      })
    }
  }
}

async function mountSortable ({ props = {}, store = createStore(), ...options } = {}) {
  const mounted = await mountQas(QasSortable, {
    props: { entity: 'banners', modelValue: makeItems(), ...props },
    slots: { default: '<div v-for="item in 3" :key="item" class="item">{{ item }}</div>' },
    piniaStore: store,
    ...options
  })

  return { ...mounted, store }
}

// simula o SortableJS avisando que um item mudou de posição
async function moveItem (wrapper, oldIndex, newIndex) {
  wrapper.vm.sortable.options.onUpdate({ oldIndex, newIndex })
  await flushPromises()
}

describe('QasSortable', () => {
  beforeEach(() => {
    NotifyError.mockClear()
  })

  it('ao mover, emite a nova ordem e "sort"', async () => {
    const { wrapper } = await mountSortable()

    await moveItem(wrapper, 0, 2)

    expect(wrapper.emitted('update:modelValue').at(-1)[0].map(item => item.id)).toEqual(['b', 'c', 'a'])
    expect(wrapper.emitted('sort')).toHaveLength(1)
  })

  it('ao mover, salva a ordem na API e emite "success"', async () => {
    const { wrapper, store } = await mountSortable()

    await moveItem(wrapper, 2, 0)

    expect(store.banners.replace).toHaveBeenCalledWith({ payload: { order: ['c', 'a', 'b'] }, url: 'banners/sort' })
    expect(wrapper.emitted('success')).toHaveLength(1)
  })

  it('com "use-save-on-sort" false, não salva na API', async () => {
    const { wrapper, store } = await mountSortable({ props: { useSaveOnSort: false } })

    await moveItem(wrapper, 0, 1)

    expect(store.banners.replace).not.toHaveBeenCalled()
  })

  it('com erro na API, avisa o usuário e emite "error"', async () => {
    const { wrapper } = await mountSortable({ store: createStore({ fail: true }) })

    await moveItem(wrapper, 0, 1)

    expect(NotifyError).toHaveBeenCalledWith('Ops! Erro ao salvar ordenação.', 'falhou')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('não altera o "model-value" recebido', async () => {
    const modelValue = makeItems()
    const { wrapper } = await mountSortable({ props: { modelValue, useSaveOnSort: false } })

    await moveItem(wrapper, 0, 2)

    expect(modelValue.map(item => item.id)).toEqual(['a', 'b', 'c'])
  })
})
