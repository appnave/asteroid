<template>
  <div>
    <qas-box
      v-if="!isFetchingFilters"
      class="q-mb-lg"
    >
      <qas-header v-bind="headerProps" />

      <q-form
        v-if="hasSettledDefaultFilters"
        class="items-center row"
        @submit="filter"
      >
        <div class="col-12">
          <qas-form-generator
            v-model="model"
            :fields="filtersFields"
            v-bind="props.formGeneratorProps"
          />
        </div>

        <div class="col-12">
          <qas-actions gutter="sm">
            <template #primary>
              <qas-btn class="full-width" :disabled="isDisabledButton" label="Filtrar" type="submit" variant="primary" />
            </template>

            <template #secondary>
              <qas-btn class="full-width" label="Limpar" variant="secondary" @click="clearForm" />
            </template>
          </qas-actions>
        </div>
      </q-form>
    </qas-box>

    <slot v-if="hasInitialFilter" />

    <q-inner-loading :showing="isFetchingFilters">
      <q-spinner
        color="grey"
        size="3em"
      />
    </q-inner-loading>
  </div>
</template>

<script setup>
import QasBox from '../box/QasBox.vue'
import QasHeader from '../header/QasHeader.vue'
import QasFormGenerator from '../form-generator/QasFormGenerator.vue'
import QasActions from '../actions/QasActions.vue'
import QasBtn from '../btn/QasBtn.vue'

import { parseValue, promiseHandler, camelizeFieldsName } from '../../helpers'
import { useContext } from '../../composables'

import { camelize, decamelizeKeys, decamelize } from 'humps'
import { computed, onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'QasReportsFilters' })

const props = defineProps({
  formGeneratorProps: {
    type: Object,
    default: () => ({})
  },

  description: {
    type: String,
    default: ''
  },

  entity: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  useDefaultFilters: {
    type: Boolean,
    default: true
  },

  useFormErrors: {
    type: Boolean
  }
})

// globals
const qas = inject('qas')

// composables
const route = useRoute()
const router = useRouter()
const { context } = useContext()

// models
const model = defineModel({ default: () => ({}), type: Object })
const defaultFilters = defineModel('defaultFilters', { default: () => ({}), type: Object })

// consts
const hasQuery = !!Object.keys(route.query).length

const headerProps = {
  description: props.description,
  labelProps: {
    label: 'Filtros'
  }
}

// refs
const isFetchingFilters = ref(false)
const hasInitialFilter = ref(false)

/**
 * se "props.useDefaultFilters" for true, o padrão vem do endpoint caso não
 * tenha query na URL.
 */
const hasSettledDefaultFilters = ref(props.useDefaultFilters ? false : !hasQuery)

// computeds
const filtersFields = computed(() => {
  const fields = qas.getGetter({ entity: props.entity, key: 'filters' })

  return camelizeFieldsName(fields)
})

/**
 * Só habilita o botão de filtrar se:
 * - Todos os campos obrigatório foram preenchidos
 * - Não tem erros no formulário
 */
const isDisabledButton = computed(() => {
  if (props.useFormErrors || !Object.keys(filtersFields.value).length) return true

  for (const key in filtersFields.value) {
    if (filtersFields.value[key]?.required && !hasValue(model.value?.[key])) return true
  }

  return false
})

// lifecycle
onMounted(handleFilterFields)

// functions
async function fetchFilters () {
  await promiseHandler(
    qas.getAction({ entity: props.entity, key: 'fetchFilters', payload: { ...context.value, url: props.url } }),
    {
      errorMessage: 'Não conseguimos buscar as informações. Por favor, tente novamente em alguns minutos.',
      useLoading: false,
      onLoading: value => {
        isFetchingFilters.value = value
      }
    }
  )
}

async function handleFilterFields () {
  // copia a query para não alterar a URL (deep clone).
  const query = { ...route.query }

  // busca os filtros do endpoint.
  await fetchFilters()

  // Se existir query, então seta os valores na model.
  if (hasQuery) setModelByQuery(query)

  // Se "props.useDefaultFilters" for true, então seta os valores default que vem no endpoint dos fields.
  if (props.useDefaultFilters) await setDefaultModel(query)

  // Se o botão estiver habilitado, então existe o filtro inicial.
  setHasInitialFilter(!isDisabledButton.value)
}

/**
 * Adiciona os valores da query na model.
 *
 * @param {object} query
 */
function setModelByQuery (query) {
  const booleanQueryValues = ['true', 'false']

  for (const key in query) {
    const camelizedKey = camelize(key)
    const field = filtersFields.value[camelizedKey]
    const value = query[key]

    if (!value) continue

    const isBooleanValue = field?.type === 'boolean' || booleanQueryValues.includes(value)

    // Valores booleanos na query são strings, então é necessário fazer a conversão.
    const normalizedValue = isBooleanValue ? parseValue(value) : value

    /**
     * Quando o campo é multiple e existe apenas o valor na query, é necessário
     * transformar o valor em um array, exemplo:
     *
     * URL: ?status=succeeded
     *
     * A query retorna: { status: 'succeeded' }
     *
     * Deveria ser: { status: ['succeeded'] }
     *
     * Então é feito essa conversão.
     */
    model.value[camelizedKey] = field?.multiple && !Array.isArray(value) ? [value] : normalizedValue
  }

  setHasSettledDefaultFilters(true)
}

/**
 * Adiciona os valores default nos campos da model caso não existam na query.
 *
 * @param {object} query
 */
async function setDefaultModel (query) {
  for (const key in filtersFields.value) {
    const decamelizeKey = decamelize(key)
    const field = filtersFields.value[key]

    if (!hasValue(field.default)) continue

    defaultFilters.value[key] = field.default

    if (!query[decamelizeKey]) {
      model.value[key] = field.default
    }
  }

  await filter()

  setHasSettledDefaultFilters(true)
}

async function filter () {
  const query = { ...decamelizeKeys({ ...route.query, ...model.value }) }

  // Remove os campos que estão vazios, para não poluir a URL.
  for (const key in query) {
    query[key] ?? delete query[key]
  }

  await router.push({ query })

  setHasInitialFilter(!isDisabledButton.value)
}

function setHasInitialFilter (value) {
  hasInitialFilter.value = value
}

/**
 * Usado para saber se os filtros default já foram aplicados e assim renderizar
 * o formulário, se não fizer isto, os endpoints de lazyloading são chamados
 * duas vezes e removendo os filtros default.
 */
function setHasSettledDefaultFilters (value) {
  hasSettledDefaultFilters.value = value
}

/**
 * Valores como null, '', 0 são considerados falsy, mas não undefined, então
 * é necessário fazer essa verificação.
 *
 * @param value {any} - Valor a ser verificado
 */
function hasValue (value) {
  return value !== undefined
}

function clearForm () {
  hasInitialFilter.value = false

  model.value = {}

  router.push({ query: {} })
}
</script>
