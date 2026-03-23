# Estrutura de Componente Asteroid

## Organização por Pasta

Cada componente segue a estrutura:
```
ui/src/components/
└── <nome-kebab>/
    ├── Qas<NomePascal>.vue     # Componente principal
    ├── Qas<NomePascal>.yml     # Documentação de API (YAML)
    ├── private/                 # (Opcional) Sub-componentes internos com prefixo Pv
    └── composables/             # (Opcional) Composables específicos do componente
```

## Nomenclatura

| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Nome do componente | `Qas` + PascalCase | `QasFormView`, `QasBtn` |
| Arquivo `.vue` | PascalCase (igual ao nome) | `QasFormView.vue` |
| Pasta do componente | kebab-case | `form-view/`, `btn/` |
| Uso no template | `qas-` + kebab-case | `<qas-form-view>`, `<qas-btn>` |
| Sub-componentes privados | `Pv` + PascalCase | `PvTableGeneratorTd.vue` |
| Arquivo de API | PascalCase + `.yml` | `QasFormView.yml` |

## Composition API (`<script setup>` — padrão para novos componentes, sempre preferir)

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

## Options API (padrão antigo — maioria dos componentes existentes)

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

## Regras Importantes

- Todos componentes precisam públicos (que começam com Qas) precisam ter seu arquivo de documentação `.yml`.
- Toda regra que não seja simples precisam estar bem documentado.
- Sempre prefira separar componentes complexos em vários componentes ao invés de criar composable privada.
- Código sempre bem documentado.
- Caso precise criar um componente privado que vai ser usado em um componente do asteroid:
  - crie uma pasta `/private`
  - Adicione o prefixo `PV<MesmoNoDoComponenteQas><NomePascal>.vue`, ex:
    - Componente privado do `QasFilters` que lida com ações: `PvFiltersActions`.
  - Adicione quantos componentes necessários.
- **Novos componentes:** Sempre usar Composition API com `<script setup>`.
- **Componentes existentes:** Manter Options API se já existir, a menos que haja migração planejada.
- **Atributos de teste:** Todos componentes interagíveis devem incluir `data-cy`:
  ```html
  <q-btn :data-cy="`form-view-submit-${entity}`" />
  ```
- **Importação dentro do `ui/`:** Componentes `Qas*` são importados explicitamente (sem auto-import).
- **Componentes Quasar (`q-*`):** Usados diretamente (auto-importados).
- **Slots:** Arquitetura slot-driven extensiva:
  ```vue
  <slot name="header" v-bind="headerProps" />
  <slot name="default" />
  <slot name="actions" v-bind="{ submit, cancel }" />
  <slot name="footer" />
  ```
- **Debug:** Usar módulo `debug` com namespace `asteroid-ui:qas-<nome>`:
  ```js
  import createDebug from 'debug'
  const debug = createDebug('asteroid-ui:qas-form-view')
  debug('fetching entity %s', this.entity)
  ```
