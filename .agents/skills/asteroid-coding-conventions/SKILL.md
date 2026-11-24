# Convenções de Código do Asteroid

## Nomenclatura

### Componentes

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Nome do componente | `Qas` + PascalCase | `QasFormView`, `QasBtn` |
| Arquivo `.vue` | PascalCase (igual ao nome) | `QasFormView.vue` |
| Pasta do componente | kebab-case | `form-view/`, `btn/` |
| Uso no template | `qas-` + kebab-case | `<qas-form-view>`, `<qas-btn>` |
| Sub-componentes privados | `Pv` + PascalCase | `PvTableGeneratorTd.vue` |
| Arquivo de API | PascalCase + `.yml` | `QasFormView.yml` |

### Composables

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivo | `use-<nome>.js` (kebab-case) | `use-form.js` |
| Export | `use<Nome>` (camelCase) | `useForm` |
| Composables privados | Em pasta `private/` | `composables/private/use-internal.js` |

### Helpers

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivo | kebab-case | `is-empty.js`, `filter-object.js` |
| Export | camelCase (default export) | `isEmpty`, `filterObject` |
| Helpers privados | Em pasta `private/` | `helpers/private/has-parent.js` |

### Mixins

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivo | kebab-case | `view.js`, `form.js` |
| Export | `<nome>Mixin` | `viewMixin`, `formMixin` |
| Propriedades internas | Prefixo `mx_` | `mx_isFetching`, `mx_setFields()` |

### CSS

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Classes de componente | BEM-like com `qas-` | `qas-form-view__btn`, `qas-btn--primary` |
| Variáveis CSS | `--qas-<nome>` | `--qas-background-color` |
| Variáveis Sass | `$<nome>` | `$primary`, `$generic-border-radius` |
| Mixins Sass | `set-<ação>` | `@include set-brand()`, `@include set-typography()` |

### Enums

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivo | PascalCase | `Align.js`, `Status.js` |
| Export | Objeto PascalCase | `Align`, `Status` |

## Estrutura de Componente

### Options API (padrão atual — maioria dos componentes)

```vue
<template>
  <div class="qas-meu-componente">
    <qas-sub-componente :data-cy="`meu-componente-acao-${entity}`" />
  </div>
</template>

<script>
import { getAction } from '@bildvitta/store-adapter'
import QasSubComponente from '../sub-componente/QasSubComponente.vue'

export default {
  name: 'QasMeuComponente',
  
  components: {
    QasSubComponente
  },
  
  mixins: [viewMixin],
  
  props: {
    entity: {
      type: String,
      required: true
    },
    
    label: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:modelValue'],
  
  data () {
    return {
      isLoading: false
    }
  },
  
  computed: {
    classes () {
      return {
        'qas-meu-componente--active': this.isActive
      }
    }
  },
  
  methods: {
    handleClick () {
      // ...
    }
  }
}
</script>
```

### Composition API (`<script setup>` — padrão para novos componentes, sempre preferir quando possível)

```vue
<template>
  <div class="qas-meu-componente">
    <q-btn v-bind="buttonProps" />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useScreen } from '../../composables'

defineOptions({
  name: 'QasMeuComponente',
  inheritAttrs: false
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'tertiary'].includes(value)
  }
})

// emits
const emit = defineEmits(['click'])

// globals
const qas = inject('qas')

// composables
const { isSmallScreen } = useScreen()

// computeds
const buttonProps = computed(() => ({
  label: props.label,
  // ...
}))
</script>
```

## Padrões de Template

### Atributos de Teste
Todos componentes interagíveis incluem `data-cy` para E2E:
```html
<q-btn :data-cy="`form-view-submit-${entity}`" />
```

### Importação de Componentes
- Componentes `Qas*` são importados localmente (não usam registro global)
- Componentes `q-*` (Quasar) são usados diretamente (auto-importados)
- `unplugin-vue-components` faz auto-import nos projetos host, mas dentro do próprio UI os imports são explícitos

### Slots
Arquitetura slot-driven extensiva:
```vue
<slot name="header" v-bind="headerProps" />
<slot name="default" />
<slot name="actions" v-bind="{ submit, cancel }" />
<slot name="footer" />
```

## Documentação de API (YML)

### Estrutura Completa

```yaml
type: component

# Mixins de API do Quasar (herda props)
mixins:
  - quasar/dist/api/QBtn.json

meta:
  desc: "Descrição do componente em português brasileiro."

props:
  label:
    desc: "Label principal do componente."
    type: String
    default: "''"
    required: false
    examples: ["'Minha label'"]
    
  model-value:
    desc: "Valor do v-model."
    type: [String, Number]
    model: true           # Marca como v-model prop
    
  callback:
    desc: "Função de callback."
    type: Function
    params:
      value:
        desc: "Valor atual"
        type: String

events:
  click:
    desc: "Emitido ao clicar no componente."
    params:
      event:
        desc: "Evento nativo do click"
        type: Event

  "update:model-value":
    desc: "Emitido ao alterar o valor."
    params:
      value:
        desc: "Novo valor"
        type: [String, Number]

slots:
  default:
    desc: "Conteúdo principal do componente."
  header:
    desc: "Cabeçalho customizado."
    scope:
      title:
        desc: "Título atual"
        type: String
```

### Regras do YML
- **Todas as descrições em português brasileiro**
- Props em **kebab-case** no YML (mesmo sendo camelCase no JS)
- `model: true` para props que suportam `v-model`
- `mixins` faz merge com API JSON do Quasar
- Valores `default` entre aspas simples quando string

## Idioma

- **Código:** Inglês (nomes de variáveis, funções, componentes)
- **Documentação (YML, Markdown, CHANGELOG):** **Português brasileiro (pt-BR)**
- **Formatação padrão:** pt-BR (datas dd/MM/yyyy, moeda BRL, separador decimal vírgula)

## Store-Adapter Pattern

```js
// NUNCA chamar APIs diretamente. Sempre via store-adapter:
import { getAction, getState } from '@bildvitta/store-adapter'

// Fetch
getAction.call(this, { entity: this.entity, action: 'fetchList', payload })

// State
getState.call(this, { entity: this.entity, key: 'list' })
```

### Actions disponíveis:
- `fetchSingle` — Buscar registro único
- `fetchList` — Buscar lista
- `create` — Criar registro
- `update` — Atualizar parcialmente
- `replace` — Substituir completamente
- `destroy` — Excluir registro

## Debug

Componentes usam o módulo `debug` com namespace `asteroid-ui:qas-<nome>`:
```js
import createDebug from 'debug'
const debug = createDebug('asteroid-ui:qas-form-view')
debug('fetching entity %s', this.entity)
```

## Testes

- **Framework:** Vitest + jsdom + @vue/test-utils
- **Localização:** Testes inline nos helpers e testes em arquivos separados
- **Coverage:** Foco atual em helpers e componentes simples

## Git Flow

| Branch | Tipo de release | Tag NPM |
|--------|----------------|---------|
| `main` | Stable (ex: 3.20.0) | `latest` |
| `develop` | Beta (ex: 3.20.0-beta.1) | `beta` |
| `feature/*` | Alpha (ex: 3.20.0-alpha.1) | `alpha` |
