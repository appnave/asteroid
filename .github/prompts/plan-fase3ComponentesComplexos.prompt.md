# Plano: Fase 3 — Testes Unitários de Componentes Complexos

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar testes abrangentes para 39 componentes `Qas*` complexos, organizados em 5 grupos executáveis em paralelo após uma tarefa de infraestrutura inicial obrigatória.

**Architecture:** As Views (`QasFormView`, `QasListView`, `QasSingleView`) recebem tratamento especial com mocks completos de API. A regra "sem stubs" requer que `vitest.config.js` receba novos componentes no `componentWithDynamicSlots` e que `setup.js` registre componentes Quasar globalmente. Cada teste valida: todas as props, emits, slots, computeds, watchers, hooks de lifecycle e `data-cy`.

**Tech Stack:** Vitest, @vue/test-utils, jsdom, Quasar, Vue 3, @bildvitta/store-adapter

---

## Tarefa 0 — Atualizar Infraestrutura de Testes (pré-requisito obrigatório)

**Motivação:** Sem stubs, os componentes Quasar que usam slots dinâmicos (`#slot-name` via variáveis) precisam estar no `componentWithDynamicSlots` para não serem tratados como `customElements`. Além disso, mocks adicionais são necessários.

### Passo 1: Atualizar `vitest.config.js` — adicionar ao Set `componentWithDynamicSlots`

Adicionar os seguintes tags ao Set existente em `vitest.config.js`:
- `q-table` (QasTableGenerator: slots `#body-cell-*`, `#header-cell-*`, `#body-selection`)
- `q-tree` (QasTreeGenerator: slot `#default-header`)
- `q-step` (QasStepperFormView: conteúdo de cada step)
- `q-uploader` (QasUploader: slots `#header`, `#list`)
- `q-tabs` (QasTabsGenerator: iteração de slots dinâmicos)
- `q-tab` (QasTabsGenerator: `QRouteTab`)
- `q-form` (QasFormView: evento `@submit`)
- `q-pull-to-refresh` (QasListView: evento `@refresh`)
- `q-layout` (QasLayout: slots nomeados)
- `q-header` (QasAppBar: estrutura de barra)
- `q-page-container` (QasLayout)
- `q-drawer` (QasLayout)
- `q-virtual-scroll` (QasTableGenerator com `useVirtualScroll`)

### Passo 2: Atualizar `ui/src/test-utils/setup.js` — adicionar mocks e registros globais

1. **`window.addEventListener`/`removeEventListener` spy global** — necessário para QasFormView, QasListView e QasUploader que ouvem eventos custom no window (`delete-success`, `submit-success`)
2. **`window.dispatchEvent` spy** — QasFormView usa `createSubmitSuccessEvent`
3. **Mock de `AutoNumeric`** — `vi.mock('autonumeric', ...)` retornando objeto com `set`, `getValue`, `destroy`, `remove` como `vi.fn()`
4. **Mock de `sortablejs`** — `vi.mock('sortablejs', ...)` retornando classe com `create`, `destroy`, `option` como `vi.fn()`
5. **Registrar componentes Quasar como globais** via `config.global.components` do `@vue/test-utils`:
   - `QTable`, `QTree`, `QStep`, `QStepper`, `QTabs`, `QTab`, `QRouteTab`, `QForm`, `QPullToRefresh`, `QLayout`, `QHeader`, `QPageContainer`, `QDrawer`, `QVirtualScroll`, `QUploader` — importados de `quasar/dist/quasar.client.js`
   - Isso substitui o comentário do bloco `config.global.components` já presente no arquivo

### Passo 3: Atualizar `ui/src/test-utils/mount-helper.js` — expandir `defaultProvide`

- Adicionar `axios` como objeto com `get`, `post`, `put`, `delete`, `patch` como `vi.fn(() => Promise.resolve({ data: {} }))`
- Adicionar `qas: { getAction: vi.fn(), getGetter: vi.fn(), getState: vi.fn() }`
- Adicionar `isFetchListSucceeded: ref(false)` (necessário para `QasBoardGenerator`)
- Manter todos os provides existentes: `isBox`, `isDialog`, `isHeader`, `isTableGenerator`, `isFormGenerator`, `isExpansionItem`, `isListView`, `btnPropsDefaults`, `stepper`

### Passo 4: Atualizar `ui/src/test-utils/factories.js` — adicionar factories específicas

- `createFieldsStub(keys)` — gera campos no formato esperado pelo `QasFormGenerator`/`QasFormView`
- `createStoreAdapterMock({ list, totalPages, result })` — configura `getAction`/`getState` do store-adapter
- `createAxiosMock({ data, status })` — stub de resposta axios
- `createRouterMock({ params, query })` — retorna mock de route/router configurável

### Passo 5: Rodar todos os testes existentes para garantir que nada quebrou

```bash
npm run test
```

Esperado: todos os testes das fases 0, 1 e 2 ainda passando.

### Passo 6: Commit

```bash
git add vitest.config.js ui/src/test-utils/
git commit -m "test: atualiza infraestrutura para suportar testes da fase 3"
```

---

## Grupo A — Views (prioridade máxima)

> Execute A1, A2, A3 sequencialmente — cada uma depende dos padrões estabelecidos pela anterior.

---

### Tarefa A1: `QasFormView`

**Arquivo de teste:** `ui/src/components/form-view/QasFormView.test.js`
**Componente:** `ui/src/components/form-view/QasFormView.vue`

#### Passo 1: Criar o arquivo de teste com estrutura base e os primeiros casos de lifecycle

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountComponent } from '@test-utils/mount-helper'
import { getAction, getState } from '@bildvitta/store-adapter'
import { useRouter } from 'vue-router'
import QasFormView from './QasFormView.vue'

const defaultEntity = 'users'
const defaultUrl = '/api/users'

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasFormView, {
    props: {
      entity: defaultEntity,
      url: defaultUrl,
      ...props
    },
    ...mountOptions
  })
}

describe('QasFormView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAction.mockResolvedValue({ data: { results: {}, fields: {}, metadata: {} } })
    getState.mockReturnValue({})
  })
  // ... cenários abaixo
})
```

#### Passo 2: Adicionar cenários de lifecycle `created`

```js
describe('lifecycle created', () => {
  it('chama getAction fetchSingle quando mode="update"', async () => {
    useRouter.mockReturnValue({
      currentRoute: { value: { params: { id: '42' } } }
    })
    const wrapper = factory({ mode: 'update' })
    await wrapper.vm.$nextTick()
    expect(getAction).toHaveBeenCalledWith('users/fetchSingle', expect.objectContaining({ id: '42' }))
  })

  it('não chama getAction quando mode="create"', async () => {
    factory({ mode: 'create' })
    await flushPromises()
    expect(getAction).not.toHaveBeenCalled()
  })
})
```

#### Passo 3: Adicionar cenários de submit

```js
describe('submit', () => {
  it('emite submit-success e dispara window event após submit bem-sucedido', async () => {
    getAction.mockResolvedValueOnce({ data: { result: { id: 1 } } })
    const spy = vi.spyOn(window, 'dispatchEvent')
    const wrapper = factory({ mode: 'create' })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(wrapper.emitted('submit-success')).toBeTruthy()
    expect(spy).toHaveBeenCalledWith(expect.any(CustomEvent))
  })

  it('emite submit-error quando getAction rejeita', async () => {
    getAction.mockRejectedValueOnce(new Error('erro'))
    const wrapper = factory({ mode: 'create' })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(wrapper.emitted('submit-error')).toBeTruthy()
  })

  it('beforeSubmit retornando false cancela o submit', async () => {
    const beforeSubmit = vi.fn().mockResolvedValue(false)
    const wrapper = factory({ beforeSubmit })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(getAction).not.toHaveBeenCalledWith(expect.stringContaining('create'), expect.anything())
  })

  it('beforeSubmit retornando objeto usa esse objeto como payload', async () => {
    const payload = { name: 'custom' }
    const beforeSubmit = vi.fn().mockResolvedValue(payload)
    getAction.mockResolvedValueOnce({ data: {} })
    const wrapper = factory({ beforeSubmit })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(getAction).toHaveBeenCalledWith(expect.any(String), expect.objectContaining(payload))
  })
})
```

#### Passo 4: Adicionar cenários de props booleanas e slots

```js
describe('props de exibição', () => {
  it('useSubmitButton=false oculta botão de submit', () => {
    const wrapper = factory({ useSubmitButton: false })
    expect(wrapper.find('[data-cy="submit-button"]').exists()).toBe(false)
  })

  it('useCancelButton=true exibe botão de cancelar', () => {
    const wrapper = factory({ useCancelButton: true, cancelRoute: '/usuarios' })
    expect(wrapper.find('[data-cy="cancel-button"]').exists()).toBe(true)
  })

  it('disable=true desabilita o botão de submit', () => {
    const wrapper = factory({ disable: true })
    const submitBtn = wrapper.find('[data-cy="submit-button"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('useActions=false não renderiza área de ações', () => {
    const wrapper = factory({ useActions: false })
    expect(wrapper.find('.qas-form-view__actions').exists()).toBe(false)
  })
})

describe('slots', () => {
  it('slot header renderiza conteúdo customizado', () => {
    const wrapper = factory({}, { slots: { header: '<div data-cy="custom-header">header</div>' } })
    expect(wrapper.find('[data-cy="custom-header"]').exists()).toBe(true)
  })

  it('slot footer renderiza conteúdo customizado', () => {
    const wrapper = factory({}, { slots: { footer: '<div data-cy="custom-footer">footer</div>' } })
    expect(wrapper.find('[data-cy="custom-footer"]').exists()).toBe(true)
  })

  it('slot fetch-error exibido quando mx_hasFetchError=true', async () => {
    const wrapper = factory({}, { slots: { 'fetch-error': '<div data-cy="fetch-error-slot">erro</div>' } })
    wrapper.vm.mx_hasFetchError = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-cy="fetch-error-slot"]').exists()).toBe(true)
  })
})
```

#### Passo 5: Adicionar cenários de emits de model

```js
describe('emits de model', () => {
  it('emite update:errors quando API retorna errors', async () => {
    getAction.mockResolvedValueOnce({ data: { errors: { name: 'obrigatório' } } })
    const wrapper = factory({ mode: 'update' })
    await flushPromises()
    expect(wrapper.emitted('update:errors')).toBeTruthy()
  })

  it('emite update:fields quando API retorna fields', async () => {
    getAction.mockResolvedValueOnce({ data: { fields: { name: { type: 'text' } } } })
    const wrapper = factory({ mode: 'update' })
    await flushPromises()
    expect(wrapper.emitted('update:fields')).toBeTruthy()
  })

  it('emite update:metadata quando API retorna metadata', async () => {
    getAction.mockResolvedValueOnce({ data: { metadata: { title: 'Usuário' } } })
    const wrapper = factory({ mode: 'update' })
    await flushPromises()
    expect(wrapper.emitted('update:metadata')).toBeTruthy()
  })
})
```

#### Passo 6: Adicionar cenário de useStore=false e modo replace

```js
describe('useStore=false', () => {
  it('usa axios.post diretamente quando useStore=false e mode=create', async () => {
    const axiosMock = { post: vi.fn().mockResolvedValue({ data: {} }), get: vi.fn().mockResolvedValue({ data: {} }) }
    const wrapper = factory({ useStore: false, mode: 'create' }, {
      global: { provide: { axios: axiosMock } }
    })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(axiosMock.post).toHaveBeenCalled()
    expect(getAction).not.toHaveBeenCalled()
  })
})

describe('modo replace', () => {
  it('usa getAction entity/replace quando mode="replace"', async () => {
    getAction.mockResolvedValueOnce({ data: {} })
    const wrapper = factory({ mode: 'replace' })
    await wrapper.vm.mx_submit()
    await flushPromises()
    expect(getAction).toHaveBeenCalledWith('users/replace', expect.anything())
  })
})
```

#### Passo 7: Rodar teste e corrigir

```bash
npx vitest run ui/src/components/form-view/
```

#### Passo 8: Commit

```bash
git add ui/src/components/form-view/QasFormView.test.js
git commit -m "test: adiciona testes abrangentes para QasFormView"
```

---

### Tarefa A2: `QasListView`

**Arquivo de teste:** `ui/src/components/list-view/QasListView.test.js`
**Componente:** `ui/src/components/list-view/QasListView.vue`

#### Passo 1: Criar arquivo de teste com estrutura base

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils/mount-helper'
import { getAction, getState } from '@bildvitta/store-adapter'
import { useRouter, useRoute } from 'vue-router'
import QasListView from './QasListView.vue'

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasListView, {
    props: { entity: 'users', url: '/api/users', ...props },
    ...mountOptions
  })
}

describe('QasListView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAction.mockResolvedValue({ data: {} })
    getState.mockImplementation(key => {
      if (key === 'users/list') return [{ id: 1, name: 'João' }]
      if (key === 'users/totalPages') return 3
      return null
    })
  })
  // ... cenários abaixo
})
```

#### Passo 2: Cenários de lifecycle e fetch

```js
describe('lifecycle created — fetch', () => {
  it('chama getAction fetchList no created', async () => {
    factory()
    await flushPromises()
    expect(getAction).toHaveBeenCalledWith('users/fetchList', expect.anything())
  })

  it('getState users/list alimenta resultados', async () => {
    const wrapper = factory()
    await flushPromises()
    expect(wrapper.vm.resultsModel).toEqual([{ id: 1, name: 'João' }])
  })

  it('getState users/totalPages controla paginação', async () => {
    const wrapper = factory({ usePagination: true })
    await flushPromises()
    expect(wrapper.vm.totalPages).toBe(3)
  })
})
```

#### Passo 3: Cenários de paginação

```js
describe('paginação', () => {
  it('changePage chama router.push com query page', async () => {
    const pushMock = vi.fn()
    useRouter.mockReturnValue({ push: pushMock, currentRoute: { value: { query: {} } } })
    const wrapper = factory({ usePagination: true })
    await flushPromises()
    await wrapper.vm.changePage(2)
    expect(pushMock).toHaveBeenCalledWith(expect.objectContaining({ query: expect.objectContaining({ page: 2 }) }))
  })

  it('QasPagination visível quando totalPages > 1 e usePagination=true', async () => {
    const wrapper = factory({ usePagination: true })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QasPagination' }).exists()).toBe(true)
  })

  it('QasPagination não renderiza quando usePagination=false', async () => {
    const wrapper = factory({ usePagination: false })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QasPagination' }).exists()).toBe(false)
  })
})
```

#### Passo 4: Cenários de filtros e resultados vazios

```js
describe('filtros', () => {
  it('useFilter=true renderiza QasFilters', async () => {
    const wrapper = factory({ useFilter: true })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QasFilters' }).exists()).toBe(true)
  })

  it('useFilter=false não renderiza QasFilters', async () => {
    const wrapper = factory({ useFilter: false })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QasFilters' }).exists()).toBe(false)
  })
})

describe('resultados vazios', () => {
  it('QasEmptyResultText visível quando results.length = 0 e sem fetch', async () => {
    getState.mockImplementation(key => {
      if (key === 'users/list') return []
      if (key === 'users/totalPages') return 0
      return null
    })
    const wrapper = factory()
    await flushPromises()
    expect(wrapper.findComponent({ name: 'QasEmptyResultText' }).exists()).toBe(true)
  })
})
```

#### Passo 5: Cenários de eventos window

```js
describe('eventos window delete-success', () => {
  it('useAutoRefetchOnDelete=true re-chama fetchList ao receber delete-success', async () => {
    const wrapper = factory({ useAutoRefetchOnDelete: true })
    await flushPromises()
    vi.clearAllMocks()
    window.dispatchEvent(new CustomEvent('delete-success'))
    await flushPromises()
    expect(getAction).toHaveBeenCalledWith('users/fetchList', expect.anything())
  })
})
```

#### Passo 6: Cenários de provide, slots e emits

```js
describe('provide', () => {
  it('provide isListView = true', () => {
    const wrapper = factory()
    expect(wrapper.vm.$.provides).toMatchObject({ isListView: true })
  })
})

describe('slots', () => {
  it('slot header renderiza conteúdo customizado', async () => {
    const wrapper = factory({}, { slots: { header: '<div data-cy="list-header">header</div>' } })
    await flushPromises()
    expect(wrapper.find('[data-cy="list-header"]').exists()).toBe(true)
  })

  it('slot fetch-error exibido quando mx_hasFetchError=true', async () => {
    const wrapper = factory({}, { slots: { 'fetch-error': '<div data-cy="fetch-error">erro</div>' } })
    wrapper.vm.mx_hasFetchError = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-cy="fetch-error"]').exists()).toBe(true)
  })
})

describe('emits', () => {
  it('emite fetch-success após fetch bem-sucedido', async () => {
    const wrapper = factory()
    await flushPromises()
    expect(wrapper.emitted('fetch-success')).toBeTruthy()
  })

  it('emite fetch-error quando getAction falha', async () => {
    getAction.mockRejectedValueOnce(new Error('erro'))
    const wrapper = factory()
    await flushPromises()
    expect(wrapper.emitted('fetch-error')).toBeTruthy()
  })
})
```

#### Passo 7: Cenário useStore=false

```js
describe('useStore=false', () => {
  it('usa axios.get diretamente quando useStore=false', async () => {
    const axiosMock = { get: vi.fn().mockResolvedValue({ data: { results: [], metadata: {} } }) }
    factory({ useStore: false }, { global: { provide: { axios: axiosMock } } })
    await flushPromises()
    expect(axiosMock.get).toHaveBeenCalled()
    expect(getAction).not.toHaveBeenCalled()
  })
})
```

#### Passo 8: Rodar e corrigir

```bash
npx vitest run ui/src/components/list-view/
```

#### Passo 9: Commit

```bash
git add ui/src/components/list-view/QasListView.test.js
git commit -m "test: adiciona testes abrangentes para QasListView"
```

---

### Tarefa A3: `QasSingleView`

**Arquivo de teste:** `ui/src/components/single-view/QasSingleView.test.js`
**Componente:** `ui/src/components/single-view/QasSingleView.vue`

#### Passo 1: Criar arquivo de teste

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from '@test-utils/mount-helper'
import { useRoute } from 'vue-router'
import QasSingleView from './QasSingleView.vue'

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasSingleView, {
    props: { entity: 'users', url: '/api/users', ...props },
    ...mountOptions
  })
}

describe('QasSingleView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRoute.mockReturnValue({ name: 'home', params: { id: '10' }, query: {}, meta: {}, path: '/users/10' })
  })
})
```

#### Passo 2: Cenários de expose e lifecycle

```js
describe('expose', () => {
  it('expõe fetchSingle acessível via wrapper.vm', () => {
    const wrapper = factory()
    expect(typeof wrapper.vm.fetchSingle).toBe('function')
  })

  it('expõe fetchHandler acessível via wrapper.vm', () => {
    const wrapper = factory()
    expect(typeof wrapper.vm.fetchHandler).toBe('function')
  })
})

describe('lifecycle created', () => {
  it('chama fetchSingle com route.params.id', async () => {
    const qasProvide = { getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 } } }), getGetter: vi.fn().mockReturnValue({}) }
    factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
    await flushPromises()
    expect(qasProvide.getAction).toHaveBeenCalledWith('users/fetchSingle', expect.objectContaining({ id: '10' }))
  })

  it('usa customId quando fornecido ao invés de route.params.id', async () => {
    const qasProvide = { getAction: vi.fn().mockResolvedValue({ data: { result: {} } }), getGetter: vi.fn().mockReturnValue({}) }
    factory({ useStore: true, customId: 'custom-99' }, { global: { provide: { qas: qasProvide } } })
    await flushPromises()
    expect(qasProvide.getAction).toHaveBeenCalledWith('users/fetchSingle', expect.objectContaining({ id: 'custom-99' }))
  })
})
```

#### Passo 3: Cenários de useStore=false, emits e slots

```js
describe('useStore=false', () => {
  it('usa axios.get diretamente quando useStore=false', async () => {
    const axiosMock = { get: vi.fn().mockResolvedValue({ data: { result: { id: 10 } } }) }
    factory({ useStore: false }, { global: { provide: { axios: axiosMock } } })
    await flushPromises()
    expect(axiosMock.get).toHaveBeenCalledWith('/api/users/10', expect.anything())
  })
})

describe('emits', () => {
  it('emite fetch-success com resultado após fetch', async () => {
    const qasProvide = { getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 } } }), getGetter: vi.fn().mockReturnValue({ id: 10 }) }
    const wrapper = factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
    await flushPromises()
    expect(wrapper.emitted('fetch-success')).toBeTruthy()
  })

  it('emite fetch-error quando fetch falha', async () => {
    const qasProvide = { getAction: vi.fn().mockRejectedValue(new Error('erro')), getGetter: vi.fn().mockReturnValue({}) }
    const wrapper = factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
    await flushPromises()
    expect(wrapper.emitted('fetch-error')).toBeTruthy()
  })

  it('emite update:result quando result muda', async () => {
    const qasProvide = { getAction: vi.fn().mockResolvedValue({ data: { result: { id: 10 } } }), getGetter: vi.fn().mockReturnValue({ id: 10 }) }
    const wrapper = factory({ useStore: true }, { global: { provide: { qas: qasProvide } } })
    await flushPromises()
    expect(wrapper.emitted('update:result')).toBeTruthy()
  })
})

describe('slots', () => {
  it('slot default recebe result, fields, metadata como scoped', async () => {
    let slotProps = null
    const wrapper = factory({}, {
      slots: {
        default: (props) => {
          slotProps = props
          return '<div />'
        }
      }
    })
    await flushPromises()
    expect(slotProps).toHaveProperty('result')
    expect(slotProps).toHaveProperty('fields')
    expect(slotProps).toHaveProperty('metadata')
  })

  it('slot fetch-error exibido quando fetch falha', async () => {
    const qasProvide = { getAction: vi.fn().mockRejectedValue(new Error('erro')), getGetter: vi.fn().mockReturnValue({}) }
    const wrapper = factory({ useStore: true }, {
      global: { provide: { qas: qasProvide } },
      slots: { 'fetch-error': '<div data-cy="fetch-error-single">erro</div>' }
    })
    await flushPromises()
    expect(wrapper.find('[data-cy="fetch-error-single"]').exists()).toBe(true)
  })
})
```

#### Passo 4: Rodar e corrigir

```bash
npx vitest run ui/src/components/single-view/
```

#### Passo 5: Commit

```bash
git add ui/src/components/single-view/QasSingleView.test.js
git commit -m "test: adiciona testes abrangentes para QasSingleView"
```

---

## Grupo B — Formulários (executável em paralelo após Tarefa 0)

> Agente B executa B1→B6 sequencialmente.

---

### Tarefa B1: `QasFormGenerator`

**Arquivo de teste:** `ui/src/components/form-generator/QasFormGenerator.test.js`

#### Passo 1: Estrutura base

```js
import { describe, it, expect, vi } from 'vitest'
import { mountComponent } from '@test-utils/mount-helper'
import QasFormGenerator from './QasFormGenerator.vue'

const defaultFields = {
  name: { label: 'Nome', type: 'text', component: 'QasInput' },
  email: { label: 'E-mail', type: 'text', component: 'QasInput' }
}

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasFormGenerator, {
    props: {
      modelValue: { name: '', email: '' },
      fields: defaultFields,
      ...props
    },
    ...mountOptions
  })
}
```

#### Passo 2: Cenários de renderização e campos

```js
describe('renderização de campos', () => {
  it('renderiza QasField para cada campo visível em fields', () => {
    const wrapper = factory()
    expect(wrapper.findAllComponents({ name: 'QasField' })).toHaveLength(2)
  })

  it('campos com hidden=true não renderizam', () => {
    const fields = { ...defaultFields, secret: { label: 'Secreto', type: 'text', hidden: true } }
    const wrapper = factory({ fields })
    expect(wrapper.findAllComponents({ name: 'QasField' })).toHaveLength(2)
  })

  it('order define a sequência dos campos visíveis', () => {
    const wrapper = factory({ order: ['email', 'name'] })
    const fieldNames = wrapper.findAllComponents({ name: 'QasField' }).map(f => f.props('name'))
    expect(fieldNames[0]).toBe('email')
    expect(fieldNames[1]).toBe('name')
  })
})
```

#### Passo 3: Cenários de useBox, skeleton, disable

```js
describe('prop useBox', () => {
  it('useBox=true fora de FormGenerator aninhado envolve em QasBox', () => {
    const wrapper = factory({ useBox: true })
    expect(wrapper.findComponent({ name: 'QasBox' }).exists()).toBe(true)
  })

  it('useBox=true dentro de FormGenerator aninhado usa div ao invés de QasBox', () => {
    const wrapper = factory({ useBox: true }, {
      global: { provide: { isFormGenerator: true } }
    })
    expect(wrapper.findComponent({ name: 'QasBox' }).exists()).toBe(false)
  })
})

describe('prop skeleton', () => {
  it('skeleton=true exibe QasSkeleton ao invés dos campos', () => {
    const wrapper = factory({ skeleton: true })
    expect(wrapper.findComponent({ name: 'QasSkeleton' }).exists()).toBe(true)
  })
})

describe('prop disable', () => {
  it('disable=true passa disable=true para QasField', () => {
    const wrapper = factory({ disable: true })
    wrapper.findAllComponents({ name: 'QasField' }).forEach(field => {
      expect(field.props('disable')).toBe(true)
    })
  })
})
```

#### Passo 4: Cenários de emit e slots dinâmicos

```js
describe('emit update:modelValue', () => {
  it('updateModelValue emite update:modelValue com campo correto', async () => {
    const wrapper = factory()
    await wrapper.vm.updateModelValue('name', 'João')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toMatchObject({ name: 'João', email: '' })
  })
})

describe('slots dinâmicos', () => {
  it('slot field-{name} substitui o campo correspondente', () => {
    const wrapper = factory({}, {
      slots: { 'field-name': '<input data-cy="custom-name-field" />' }
    })
    expect(wrapper.find('[data-cy="custom-name-field"]').exists()).toBe(true)
  })
})
```

#### Passo 5: Rodar, corrigir, commit

```bash
npx vitest run ui/src/components/form-generator/
git add ui/src/components/form-generator/QasFormGenerator.test.js
git commit -m "test: adiciona testes abrangentes para QasFormGenerator"
```

---

### Tarefa B2: `QasSelect`

**Arquivo de teste:** `ui/src/components/select/QasSelect.test.js`

#### Passo 1: Estrutura base e cenários principais

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountComponent } from '@test-utils/mount-helper'
import QasSelect from './QasSelect.vue'

const defaultOptions = [
  { label: 'Opção 1', value: 1 },
  { label: 'Opção 2', value: 2 },
  { label: 'Opção 3', value: 3 }
]

function factory (props = {}, mountOptions = {}) {
  return mountComponent(QasSelect, {
    props: { options: defaultOptions, modelValue: null, ...props },
    ...mountOptions
  })
}
```

#### Passo 2: Cenários de props

```js
describe('prop required', () => {
  it('required=true adiciona indicador de campo obrigatório', () => {
    const wrapper = factory({ required: true, label: 'Campo' })
    expect(wrapper.find('.qas-label--required').exists()).toBe(true)
  })
})

describe('prop multiple', () => {
  it('multiple=true ativa seleção múltipla com chips', () => {
    const wrapper = factory({ multiple: true, modelValue: [1, 2] })
    expect(wrapper.findComponent({ name: 'QSelect' }).props('multiple')).toBe(true)
  })
})

describe('prop useAutoSelect', () => {
  it('useAutoSelect=true seleciona automaticamente com uma única opção', async () => {
    const wrapper = factory({ useAutoSelect: true, options: [{ label: 'Única', value: 1 }], modelValue: null })
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe(1)
  })
})

describe('prop noOptionLabel', () => {
  it('noOptionLabel exibido no slot no-option quando lista vazia', async () => {
    const wrapper = factory({ options: [], noOptionLabel: 'Sem resultados', useSearch: false })
    // triggeramos o evento de abertura do popup
    await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('popup-show')
    expect(wrapper.text()).toContain('Sem resultados')
  })
})

describe('emits', () => {
  it('emite popup-show ao abrir', async () => {
    const wrapper = factory()
    await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('popup-show')
    expect(wrapper.emitted('popup-show')).toBeTruthy()
  })

  it('emite popup-hide ao fechar', async () => {
    const wrapper = factory()
    await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('popup-hide')
    expect(wrapper.emitted('popup-hide')).toBeTruthy()
  })
})

describe('updateUnsavedChangesCache', () => {
  it('chama updateUnsavedChangesCache ao alterar valor', async () => {
    const updateCache = vi.fn()
    const wrapper = factory({}, { global: { provide: { updateUnsavedChangesCache: updateCache } } })
    await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('update:modelValue', 1)
    expect(updateCache).toHaveBeenCalled()
  })
})
```

#### Passo 3: Rodar, corrigir, commit

```bash
npx vitest run ui/src/components/select/
git add ui/src/components/select/QasSelect.test.js
git commit -m "test: adiciona testes abrangentes para QasSelect"
```

---

### Tarefa B3: `QasInput`

**Arquivo de teste:** `ui/src/components/input/QasInput.test.js`

Cenários a implementar:

```js
describe('QasInput', () => {
  describe('prop required', () => {
    it('required=true exibe indicador de obrigatório')
  })

  describe('prop mask', () => {
    it('mask="phone" aplica máscara de telefone ao q-input')
    it('mask="document" alterna entre CPF e CNPJ conforme tamanho')
  })

  describe('prop useCopy', () => {
    it('useCopy=true renderiza QasCopy no slot append')
  })

  describe('prop useRemoveErrorOnType', () => {
    it('useRemoveErrorOnType=true limpa error ao digitar (emit update:modelValue)')
  })

  describe('prop type', () => {
    it('type="textarea" passa autogrow ao q-input')
  })

  describe('prop icon', () => {
    it('icon renderiza q-icon no slot prepend')
  })

  describe('prop unmaskedValue', () => {
    it('unmaskedValue=true emite valor sem máscara no update:modelValue')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/input/
git add ui/src/components/input/QasInput.test.js
git commit -m "test: adiciona testes abrangentes para QasInput"
```

---

### Tarefa B4: `QasNumericInput`

**Arquivo de teste:** `ui/src/components/numeric-input/QasNumericInput.test.js`

Cenários a implementar (todos dependem do mock de `AutoNumeric` da Tarefa 0):

```js
describe('QasNumericInput', () => {
  describe('prop mode', () => {
    it('mode="money" inicializa AutoNumeric com preset Brazilian')
    it('mode="percent" aplica configuração de percentual')
    it('mode="integer" desabilita decimais')
  })

  describe('prop required', () => {
    it('required=true exibe indicador de obrigatório')
  })

  describe('prop useNegative', () => {
    it('useNegative=true configura AutoNumeric com allowNegative=true')
  })

  describe('watch modelValue', () => {
    it('chamada de set no AutoNumeric quando modelValue muda externamente')
  })

  describe('evento blur', () => {
    it('blur emite update:model com valor formatado via AutoNumeric.getValue()')
  })

  describe('prop icon', () => {
    it('icon renderiza q-icon no prepend')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/numeric-input/
git add ui/src/components/numeric-input/QasNumericInput.test.js
git commit -m "test: adiciona testes abrangentes para QasNumericInput"
```

---

### Tarefa B5: `QasFilters`

**Arquivo de teste:** `ui/src/components/filters/QasFilters.test.js`

Cenários a implementar:

```js
describe('QasFilters', () => {
  describe('prop useSearch', () => {
    it('useSearch=true renderiza QasSearchInput')
    it('useSearch=false não renderiza QasSearchInput')
  })

  describe('prop useFilterButton', () => {
    it('useFilterButton=true exibe PvFiltersActions')
  })

  describe('prop useChip', () => {
    it('useChip=true exibe chips com filtros ativos')
    it('removeFilter remove chip e re-dispara filtro')
  })

  describe('método filter', () => {
    it('filter() chama mx_fetchHandler com filtros atuais')
  })

  describe('prop useUpdateRoute', () => {
    it('useUpdateRoute=true chama router.push com query de filtros')
  })

  describe('prop orderByOptions', () => {
    it('changeOrderBy cria chip de ordenação e aplica à query')
  })

  describe('slot default', () => {
    it('slot default recebe context, filter, filters e remove-filter como scoped')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/filters/
git add ui/src/components/filters/QasFilters.test.js
git commit -m "test: adiciona testes abrangentes para QasFilters"
```

---

### Tarefa B6: `QasNestedFields`

**Arquivo de teste:** `ui/src/components/nested-fields/QasNestedFields.test.js`

Cenários a implementar:

```js
describe('QasNestedFields', () => {
  const defaultModelValue = [{ name: 'João' }, { name: 'Maria' }]
  const defaultField = { name: { label: 'Nome', type: 'text' } }

  describe('renderização', () => {
    it('renderiza uma linha por item em modelValue')
  })

  describe('método add', () => {
    it('add() adiciona rowObject ao model e emite update:modelValue')
  })

  describe('método destroy', () => {
    it('destroy(index) marca item com destroyed=true e emite update:modelValue')
  })

  describe('prop useDuplicate', () => {
    it('useDuplicate=true exibe botão de duplicar que clona item')
  })

  describe('showDestroyButton', () => {
    it('false quando length <= 1 e useDestroyAlways=false')
    it('true quando length > 1')
    it('true quando useDestroyAlways=true independente do length')
  })

  describe('prop useInlineActions', () => {
    it('useInlineActions=true usa QasActionsMenu inline')
  })

  describe('prop useBox', () => {
    it('useBox=true envolve cada linha em QasBox')
  })

  describe('prop useAnimation', () => {
    it('useAnimation=true usa TransitionGroup ao invés de div wrapper')
  })

  describe('prop disabledRows', () => {
    it('disabledRows=[0] desabilita a linha de índice 0')
  })

  describe('computed transformedErrors', () => {
    it('converte array de errors para objeto indexado por número')
  })

  describe('prop fieldsHandlerFn', () => {
    it('fieldsHandlerFn é chamada com fields, index e item para cada linha')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/nested-fields/
git add ui/src/components/nested-fields/QasNestedFields.test.js
git commit -m "test: adiciona testes abrangentes para QasNestedFields"
```

---

## Grupo C — Tabela, Galeria e Listas (executável em paralelo após Tarefa 0)

> Agente C executa C1→C6 sequencialmente.

---

### Tarefa C1: `QasTableGenerator`

**Arquivo de teste:** `ui/src/components/table-generator/QasTableGenerator.test.js`

Cenários:

```js
describe('QasTableGenerator', () => {
  const defaultResults = [{ id: 1, name: 'João' }, { id: 2, name: 'Maria' }]
  const defaultFields = { name: { label: 'Nome', type: 'text' } }

  describe('renderização básica', () => {
    it('renderiza q-table com results passados via props')
    it('emptyResultText exibe QasEmptyResultText quando results=[]]')
    it('useBox=false renderiza div ao invés de QasBox')
  })

  describe('prop skeleton', () => {
    it('skeleton=true gera linhas e colunas de placeholder')
    it('skeleton=false renderiza dados reais')
  })

  describe('prop actionsMenuProps', () => {
    it('actionsMenuProps como Function adiciona coluna actions ao final')
    it('cada linha chama actionsMenuProps com o item da linha')
  })

  describe('prop useSelection', () => {
    it('useSelection=true ativa selection=multiple')
    it('emit update:selected ao alterar seleção')
  })

  describe('prop fields vs columns', () => {
    it('fields=[] com columns usa columns diretamente')
    it('fields preenchido gera columns a partir dos fields')
  })

  describe('provide', () => {
    it('provide isTableGenerator=true verificado em componente filho')
    it('provide btnPropsDefaults com size=sm')
  })

  describe('slots dinâmicos', () => {
    it('slot body-cell-{name} substitui renderização da célula')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/table-generator/
git add ui/src/components/table-generator/QasTableGenerator.test.js
git commit -m "test: adiciona testes abrangentes para QasTableGenerator"
```

---

### Tarefa C2: `QasGallery`

**Arquivo de teste:** `ui/src/components/gallery/QasGallery.test.js`

Cenários:

```js
describe('QasGallery', () => {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg']

  describe('exibição de imagens', () => {
    it('renderiza QasGalleryCard para cada imagem até initialSize')
    it('não renderiza imagens além de initialSize inicialmente')
  })

  describe('botão ver mais', () => {
    it('visível quando images.length > initialSize')
    it('oculto quando useLoadAll=true')
    it('showMore incrementa displayedImages por initialSize')
  })

  describe('prop useDestroy', () => {
    it('useDestroy=true passa prop de delete para QasGalleryCard')
  })

  describe('prop useObjectModel', () => {
    it('useObjectModel=true aceita array de objetos {url}')
  })

  describe('computed normalizedImages', () => {
    it('converte strings para objetos {url}')
    it('mantém objetos {url} inalterados')
  })

  describe('prop showMoreAlign', () => {
    it('showMoreAlign="center" aplica classe de alinhamento correto')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/gallery/
git add ui/src/components/gallery/QasGallery.test.js
git commit -m "test: adiciona testes abrangentes para QasGallery"
```

---

### Tarefa C3: `QasUploader`

**Arquivo de teste:** `ui/src/components/uploader/QasUploader.test.js`

Cenários:

```js
describe('QasUploader', () => {
  describe('renderização básica', () => {
    it('renderiza q-uploader com factory e método PUT')
  })

  describe('prop useHeader', () => {
    it('useHeader=true exibe QasHeader com label')
    it('useHeader=false não exibe QasHeader')
  })

  describe('prop readonly', () => {
    it('readonly=true oculta o q-uploader')
  })

  describe('prop maxFiles', () => {
    it('maxFiles é repassado ao q-uploader')
  })

  describe('prop useGalleryCard', () => {
    it('useGalleryCard=true exibe grid de cards')
    it('useGalleryCard=false exibe lista simples')
  })

  describe('prop useObjectModel', () => {
    it('useObjectModel=true registra listener submit-success no window')
  })

  describe('emit rejected', () => {
    it('emit rejected propaga ao receber arquivo rejeitado')
  })

  describe('computed transformedErrors', () => {
    it('transforma array de erros em objeto via constructObject')
  })

  describe('computed hasAllFileRejected', () => {
    it('true quando todos arquivos foram rejeitados')
    it('false quando ao menos um foi aceito')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/uploader/
git add ui/src/components/uploader/QasUploader.test.js
git commit -m "test: adiciona testes abrangentes para QasUploader"
```

---

### Tarefa C4: `QasTransfer`

**Arquivo de teste:** `ui/src/components/transfer/QasTransfer.test.js`

Cenários:

```js
describe('QasTransfer', () => {
  const options = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' }
  ]

  describe('renderização', () => {
    it('renderiza dois QasSearchBox (coluna de opções e coluna de selecionados)')
  })

  describe('seleção de item', () => {
    it('click em item da primeira coluna adiciona à firstQueue')
    it('botão Selecionar move firstQueue para selectedList e emite update:modelValue')
  })

  describe('remoção de item', () => {
    it('click em item selecionado adiciona à secondQueue')
    it('botão Remover devolve secondQueue aos options e emite update:modelValue')
  })

  describe('watch options', () => {
    it('watch options reinicializa optionsList e selectedList')
  })

  describe('watch modelValue', () => {
    it('watch modelValue chama setSelectedFromValue ao mudar externamente')
  })

  describe('prop emitValue', () => {
    it('emitValue=true emite apenas os valores primitivos no update:modelValue')
    it('emitValue=false emite os objetos completos')
  })

  describe('computed getItemClass', () => {
    it('destaca itens que estão na fila de seleção')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/transfer/
git add ui/src/components/transfer/QasTransfer.test.js
git commit -m "test: adiciona testes abrangentes para QasTransfer"
```

---

### Tarefa C5: `QasSelectList`

**Arquivo de teste:** `ui/src/components/select-list/QasSelectList.test.js`

Cenários:

```js
describe('QasSelectList', () => {
  describe('renderização', () => {
    it('renderiza via QasSearchBox')
  })

  describe('método add', () => {
    it('add(item) adiciona ao model e emite add com o item')
    it('add(item) emite update:modelValue com lista atualizada')
  })

  describe('método remove', () => {
    it('remove(item) remove do model e emite remove com o item')
    it('remove(item) emite update:modelValue com lista atualizada')
  })

  describe('método clearSelection', () => {
    it('clearSelection limpa model e emite clear')
    it('emite update:modelValue com array vazio')
  })

  describe('computed isClearSelectionDisabled', () => {
    it('true quando model está vazio')
    it('true quando readonly=true')
    it('false quando model tem itens e não é readonly')
  })

  describe('computed sortList', () => {
    it('ordena colocando itens selecionados primeiro')
  })

  describe('prop useEmitLabelValueOnly', () => {
    it('useEmitLabelValueOnly=true emite apenas {label, value}')
    it('useEmitLabelValueOnly=false emite objeto completo')
  })

  describe('prop deleteOnly', () => {
    it('deleteOnly=true oculta botão de adicionar')
  })

  describe('slot item', () => {
    it('slot item recebe add, remove, updateModel e item como scoped')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/select-list/
git add ui/src/components/select-list/QasSelectList.test.js
git commit -m "test: adiciona testes abrangentes para QasSelectList"
```

---

### Tarefa C6: `QasSearchBox`

**Arquivo de teste:** `ui/src/components/search-box/QasSearchBox.test.js`

Cenários:

```js
describe('QasSearchBox', () => {
  const list = [
    { label: 'João Silva', value: 1 },
    { label: 'Maria Santos', value: 2 },
    { label: 'Pedro Costa', value: 3 }
  ]

  describe('filtro via Fuse.js', () => {
    it('filtrar com termo presente retorna itens correspondentes')
    it('filtrar com termo ausente emite empty-result')
  })

  describe('prop useLazyLoading', () => {
    it('useLazyLoading=true renderiza q-infinite-scroll')
  })

  describe('computed showEmptyResult', () => {
    it('true quando lista filtrada está vazia e não está carregando')
  })

  describe('computed showSpinnerDots', () => {
    it('true durante fetch quando já existem resultados exibidos')
  })

  describe('computed showInnerLoading', () => {
    it('true durante fetch quando não existem resultados exibidos')
  })

  describe('watch mx_filteredOptions', () => {
    it('emite update:results quando mx_filteredOptions muda')
  })

  describe('computed containerHeight', () => {
    it('usa emptyListHeight quando lista está vazia')
    it('usa maxHeight quando lista tem items')
  })

  describe('watch modelValue', () => {
    it('sincroniza mx_search com modelValue externo')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/search-box/
git add ui/src/components/search-box/QasSearchBox.test.js
git commit -m "test: adiciona testes abrangentes para QasSearchBox"
```

---

## Grupo D — Layout, Navegação e Geradores (executável em paralelo após grupos A, B e C)

> Agente D executa D1→D6 sequencialmente.

---

### Tarefa D1: `QasLayout`

**Arquivo de teste:** `ui/src/components/layout/QasLayout.test.js`

Cenários:

```js
describe('QasLayout', () => {
  describe('renderização condicional por tela', () => {
    it('renderiza QasAppBar quando Screen.gt.lg=false (mobile/tablet)')
    it('renderiza QasAppMenu quando Screen.gt.lg=true (desktop)')
  })

  describe('método toggleMenuDrawer', () => {
    it('alterna menuDrawer entre true e false')
    it('emite update:modelValue com novo valor')
  })

  describe('expose toggleNotificationsDrawer', () => {
    it('toggleNotificationsDrawer acessível via wrapper.vm')
    it('alterna notificationsDrawer entre true e false')
  })

  describe('emit sign-out', () => {
    it('signOut() emite sign-out')
  })

  describe('watch initialUnreadNotificationsCount', () => {
    it('chama setUnreadNotificationsCount quando prop muda')
  })

  describe('prop appMenuProps', () => {
    it('appMenuProps são repassados para QasAppMenu via merge')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/layout/
git add ui/src/components/layout/QasLayout.test.js
git commit -m "test: adiciona testes abrangentes para QasLayout"
```

---

### Tarefa D2: `QasAppBar`

**Arquivo de teste:** `ui/src/components/app-bar/QasAppBar.test.js`

Cenários:

```js
describe('QasAppBar', () => {
  const defaultAppUserProps = { name: 'João', email: 'joao@email.com' }

  describe('prop title', () => {
    it('renderiza title como texto quando brand não fornecido')
  })

  describe('prop brand', () => {
    it('renderiza img com src correto quando brand fornecido')
    it('não renderiza texto do title quando brand fornecido')
  })

  describe('computed hasDevelopmentBadge', () => {
    it('true quando window.location.hostname é localhost')
    it('false quando hostname não é localhost')
  })

  describe('emit toggle-menu', () => {
    it('toggleMenuDrawer emite toggle-menu ao clicar no menu')
  })

  describe('prop appUserProps', () => {
    it('appUserProps existente renderiza QasAppUser')
    it('appUserProps vazio não renderiza QasAppUser')
  })

  describe('prop notifications', () => {
    it('unreadCount > 0 exibe badge com contagem')
    it('unreadCount = 0 não exibe badge')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/app-bar/
git add ui/src/components/app-bar/QasAppBar.test.js
git commit -m "test: adiciona testes abrangentes para QasAppBar"
```

---

### Tarefa D3: `QasTabsGenerator`

**Arquivo de teste:** `ui/src/components/tabs-generator/QasTabsGenerator.test.js`

Cenários:

```js
describe('QasTabsGenerator', () => {
  const tabs = [
    { label: 'Aba 1', value: 'tab1' },
    { label: 'Aba 2', value: 'tab2' },
    { label: 'Aba 3', value: 'tab3', disabled: true }
  ]

  describe('renderização de tabs', () => {
    it('renderiza QTab para cada tab em tabs')
    it('useRouteTab=true usa QRouteTab ao invés de QTab')
  })

  describe('prop counters', () => {
    it('counters com valor formata label como "Label (XX)"')
    it('skeleton=true exibe QasSkeleton no lugar do contador')
  })

  describe('prop querySlug', () => {
    it('querySlug sincroniza tab ativa com query string via router')
    it('watch modelValue atualiza query string quando querySlug definido')
  })

  describe('tabs disabled', () => {
    it('tab com disabled=true não altera o modelValue')
  })

  describe('slots dinâmicos', () => {
    it('slot tab-{value} substitui aba correspondente')
    it('slot tab-after-{value} adiciona conteúdo interno à aba')
  })

  describe('emit update:modelValue', () => {
    it('emite update:modelValue ao selecionar tab')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/tabs-generator/
git add ui/src/components/tabs-generator/QasTabsGenerator.test.js
git commit -m "test: adiciona testes abrangentes para QasTabsGenerator"
```

---

### Tarefa D4: `QasBoardGenerator`

**Arquivo de teste:** `ui/src/components/board-generator/QasBoardGenerator.test.js`

Cenários:

```js
describe('QasBoardGenerator', () => {
  const headers = [{ id: 'col1', label: 'Coluna 1' }, { id: 'col2', label: 'Coluna 2' }]

  describe('expose', () => {
    it('fetchColumns acessível via wrapper.vm')
    it('fetchColumn acessível via wrapper.vm')
    it('reset acessível via wrapper.vm')
    it('cancelDrop acessível via wrapper.vm')
  })

  describe('método fetchColumns', () => {
    it('chama axios.get para cada header em paralelo')
    it('emite fetch-columns-success após buscar todas as colunas')
    it('emite fetch-columns-error quando alguma coluna falha')
  })

  describe('inject isFetchListSucceeded', () => {
    it('watch isFetchListSucceeded=true dispara fetchColumns automaticamente')
  })

  describe('prop limitPerColumn', () => {
    it('hasSeeMore exibe botão ver mais quando há mais itens que o limite')
  })

  describe('prop useDragAndDropX', () => {
    it('useDragAndDropX=true inicializa Sortable (mockado) nos containers')
  })

  describe('slots', () => {
    it('slot header-column recebe dados da coluna como scoped')
    it('slot column-item recebe dados do item como scoped')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/board-generator/
git add ui/src/components/board-generator/QasBoardGenerator.test.js
git commit -m "test: adiciona testes abrangentes para QasBoardGenerator"
```

---

### Tarefa D5: `QasTreeGenerator`

**Arquivo de teste:** `ui/src/components/tree-generator/QasTreeGenerator.test.js`

Cenários:

```js
describe('QasTreeGenerator', () => {
  const nodes = [
    { id: 1, label: 'Raiz', children: [{ id: 2, label: 'Filho' }] }
  ]

  describe('renderização básica', () => {
    it('renderiza q-tree com parsedNodes')
  })

  describe('prop useAddButton', () => {
    it('useAddButton=true exibe item Adicionar subnível no menu')
    it('useAddButton=false oculta item Adicionar subnível')
  })

  describe('prop useDestroyButton', () => {
    it('useDestroyButton=true exibe item Excluir no menu')
    it('useDestroyButton=false oculta item Excluir')
  })

  describe('prop readonly', () => {
    it('readonly=true não renderiza menu de ações por nó')
  })

  describe('método handleTreeFormDialog', () => {
    it('abre QasDialog com formulário ao chamar handleTreeFormDialog')
  })

  describe('método onDestroy', () => {
    it('abre dialog de confirmação ao chamar onDestroy')
  })

  describe('prop lazyNodes + emit update:lazyNodes', () => {
    it('onLazyLoad emite update:lazyNodes com nó carregado')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/tree-generator/
git add ui/src/components/tree-generator/QasTreeGenerator.test.js
git commit -m "test: adiciona testes abrangentes para QasTreeGenerator"
```

---

### Tarefa D6: `QasStepperFormView`

**Arquivo de teste:** `ui/src/components/stepper-form-view/QasStepperFormView.test.js`

Cenários:

```js
describe('QasStepperFormView', () => {
  const steps = [
    { title: 'Passo 1', fields: { name: { label: 'Nome', type: 'text' } } },
    { title: 'Passo 2', fields: { email: { label: 'E-mail', type: 'text' } } }
  ]

  describe('renderização', () => {
    it('renderiza QasStepper com q-step para cada item em steps')
  })

  describe('computed isDone', () => {
    it('isDone(0) retorna true quando model > 1 (step atual é 2)')
    it('isDone(1) retorna false quando model = 2 (step atual é 2)')
  })

  describe('provide stepper', () => {
    it('provide stepper expõe next, previous, goTo, setStepProps, stepsValues')
  })

  describe('método nextStep', () => {
    it('nextStep faz merge do payload no stepsValues e avança model')
  })

  describe('expose setStepProps', () => {
    it('setStepProps acessível via wrapper.vm')
    it('setStepProps com index atualiza props do step específico')
    it('setStepProps sem index atualiza props de todos os steps')
  })

  describe('model inicial', () => {
    it('inicia em 1 por padrão')
  })

  describe('defaultFormViewProps', () => {
    it('aplica useBoundary=false e useNotifySuccess=false por padrão ao QasFormView interno')
  })
})
```

Rodar, corrigir, commit:
```bash
npx vitest run ui/src/components/stepper-form-view/
git add ui/src/components/stepper-form-view/QasStepperFormView.test.js
git commit -m "test: adiciona testes abrangentes para QasStepperFormView"
```

---

## Grupo E — Demais Componentes da Lista Original

> Agente E executa em paralelo internamente — componentes independentes podem ser feitos concorrentemente.

**E1. `QasGridGenerator`** — `ui/src/components/grid-generator/QasGridGenerator.test.js`
- renderiza grid com colunas dinâmicas baseado em `fields`
- `columns`/`commonColumns` geram classes corretas (`col-12 col-sm-6` etc.)
- `gutter` aplica classes de espaçamento
- slots por `field.name` substituem células

**E2. `QasPasswordInput`** — `ui/src/components/password-input/QasPasswordInput.test.js`
- toggle de visibilidade altera `type` entre `password` e `text`
- `iconRight` muda com visibilidade
- integração com `QasPasswordStrengthChecker` quando `useStrengthChecker=true`
- `required` e obrigatório

**E3. `QasReportsFilters`** — `ui/src/components/reports-filters/QasReportsFilters.test.js`
- mock store-adapter para filtros
- emits de filtros ativos
- `useChip` exibe chips

**E4. `QasChartView`** — `ui/src/components/chart-view/QasChartView.test.js`
- mock de dados via store-adapter
- props de configuração passadas para chart interno
- loading state

**E5. `QasSortable`** — `ui/src/components/sortable/QasSortable.test.js`
- mock de reordenação via store-adapter
- `update:modelValue` após reordenar
- `useStoreActions=false` usa axios

**E6. `QasAppMenu`** — `ui/src/components/app-menu/QasAppMenu.test.js`
- menu items renderizados
- item ativo destacado via router
- dropdown expandido ao clicar
- emit `update:modelValue`

**E7. `QasAppUser`** — `ui/src/components/app-user/QasAppUser.test.js`
- dados do usuário (nome, email, avatar)
- menu de usuário dropwdown
- emit sign-out

**E8. `QasSelectListDialog`** — `ui/src/components/select-list-dialog/QasSelectListDialog.test.js`
- dialog abre/fecha
- integração com QasSelectList
- emit `update:modelValue` com seleção

**E9. `QasSelectFilter`** — `ui/src/components/select-filter/QasSelectFilter.test.js`
- filtros sincronizados com vue-router query
- watch route.query atualiza seleção
- emit `update:modelValue`

**E10. `QasSearchInput`** — `ui/src/components/search-input/QasSearchInput.test.js`
- debounce no input
- botão clear limpa valor e emite `clear`
- emit `update:modelValue`

**E11. `QasOptionGroup`** — `ui/src/components/option-group/QasOptionGroup.test.js`
- `type` controla radio/checkbox/toggle
- `options` renderizam corretamente
- emit `update:modelValue` ao selecionar

**E12. `QasPdfViewer`** — `ui/src/components/pdf-viewer/QasPdfViewer.test.js`
- mock de PDF.js (sem renderização real)
- props `src`, `page`, `totalPages`
- emit `update:page` na paginação

**E13. `QasMap`** — `ui/src/components/map/QasMap.test.js`
- mock de Leaflet (sem renderização real)
- props `markers`, `center`, `zoom`
- emit ao clicar no mapa

**E14. `QasSignaturePad`** — `ui/src/components/signature-pad/QasSignaturePad.test.js`
- mock de canvas API
- `clear()` limpa assinatura
- `save()` emite `update:modelValue`

**E15. `QasSignatureUploader`** — `ui/src/components/signature-uploader/QasSignatureUploader.test.js`
- integração com uploader
- preview da assinatura

**E16. `QasResizer`** — `ui/src/components/resizer/QasResizer.test.js`
- mock de ResizeObserver
- `width`/`height` emitidos ao redimensionar
- cleanup no unmount

**E17. `QasLazyLoadingComponents`** — `ui/src/components/lazy-loading-components/QasLazyLoadingComponents.test.js`
- renderiza placeholder enquanto carrega
- componente real renderizado após carregamento
- prop `components` controla o que carregar

**E18. `QasWelcome`** — `ui/src/components/welcome/QasWelcome.test.js`
- atalhos renderizados
- slots de conteúdo
- sub-componentes Pv montados corretamente

Para cada componente do Grupo E:
1. Criar arquivo de teste com estrutura base
2. Implementar todos os cenários listados (sem omitir)
3. Rodar `npx vitest run ui/src/components/<nome>/`
4. Corrigir falhas
5. Commit individual por componente

---

## Estratégia de Paralelismo

```
Tarefa 0 (infraestrutura) — obrigatória primeiro
    ↓
┌─────────────────┬──────────────────┬───────────────────┐
│  AGENTE A       │   AGENTE B       │   AGENTE C        │
│  Views          │   Formulários    │   Tabela/Galeria   │
│  A1: FormView   │   B1: FormGen    │   C1: TableGen     │
│  A2: ListView   │   B2: Select     │   C2: Gallery      │
│  A3: SingleView │   B3: Input      │   C3: Uploader     │
│                 │   B4: Numeric    │   C4: Transfer     │
│                 │   B5: Filters    │   C5: SelectList   │
│                 │   B6: Nested     │   C6: SearchBox    │
└─────────────────┴──────────────────┴───────────────────┘
    ↓ todos concluídos
┌────────────────────────────────────┐
│  AGENTE D                          │
│  Layout/Navegação/Geradores        │
│  D1: Layout  D2: AppBar            │
│  D3: Tabs    D4: Board             │
│  D5: Tree    D6: StepperFormView   │
└────────────────────────────────────┘
    ↓
┌─────────────────┐
│  AGENTE E       │
│  Restantes      │
│  E1 → E18       │
└─────────────────┘
```

**Restrições por agente:**
- Não modificar arquivos fora do escopo do grupo
- Não alterar `vitest.config.js` ou `setup.js` (apenas Tarefa 0 faz isso)
- Cada agente deve rodar o vitest do componente após cada arquivo
- Não usar stubs — montar componentes reais

---

## Verificação Final

```bash
# Por componente individual
npx vitest run ui/src/components/<nome>/

# Por grupo
npx vitest run ui/src/components/{form-view,list-view,single-view}/

# Todos os testes
npm run test

# Com cobertura
npx vitest run --coverage --reporter=verbose

# Lint dos arquivos de teste
npm run lint
```

---

## Decisões de Implementação

- **Sem stubs:** Tarefa 0 adiciona novos `componentWithDynamicSlots`; componentes `Qas*` internos montados reais
- **Views com prioridade:** Grupo A (Views) deve ser executado e validado antes dos demais — padrões de mock estabelecidos
- **`AutoNumeric`/`Sortable` mocados via `vi.mock`:** Evita side effects de DOM; chamadas verificadas via `vi.fn()`
- **Sem snapshots:** Apenas testes comportamentais por prop/emit/slot/computed/watch (conforme skill vue-testing-best-practices)
- **`data-cy` verificados:** Cada teste de componente interativo valida `[data-cy]` nos elementos
- **Descrições em pt-BR:** Alinhado com padrão existente das fases 0, 1 e 2
- **`mountComponent` como base:** Todos os testes usam o helper com `defaultProvide`; ajustes por teste via override do `global.provide`
- **`flushPromises` obrigatório:** Todo teste com operações assíncronas (fetch, store, timers) usa `await flushPromises()`
- **Factories locais:** Cada arquivo de teste define sua própria `factory()` local para facilitar leitura
- **`beforeEach` com `vi.clearAllMocks()`:** Todo describe raiz reseta mocks para isolamento entre testes
