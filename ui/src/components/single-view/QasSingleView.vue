<template>
  <qas-container :use-boundary="props.useBoundary">
    <header v-if="hasHeaderSlot">
      <slot name="header" />
    </header>

    <slot v-if="canShowFetchErrorSlot" name="fetch-error" />

    <template v-else-if="hasResult">
      <slot />
    </template>

    <div v-else-if="!viewState.fetching">
      <qas-empty-result-text class="q-my-xl" />
    </div>

    <footer v-if="hasFooterSlot">
      <slot name="footer" />
    </footer>

    <q-inner-loading :showing="viewState.fetching">
      <q-spinner color="grey" size="3em" />
    </q-inner-loading>
  </qas-container>
</template>

<script setup>
import QasContainer from '../container/QasContainer.vue'
import QasEmptyResultText from '../empty-result-text/QasEmptyResultText.vue'

import useView, { baseProps, baseEmits } from '../../composables/private/use-view'
import { useOverlayNavigation } from '../../composables'

import debug from 'debug'
import { decamelize } from 'humps'
import { markRaw, computed, watch, inject } from 'vue'
import { useRoute } from 'vue-router'

const log = debug('asteroid-ui:qas-single-view')

defineOptions({ name: 'QasSingleView' })

const props = defineProps({
  ...baseProps,

  customId: {
    default: '',
    type: [Number, String]
  },

  result: {
    default: () => ({}),
    type: Object
  }
})

const emit = defineEmits([
  ...baseEmits,

  'update:result',
  'fetch-success',
  'fetch-error'
])

const slots = defineSlots()

// globals
const axios = inject('axios')
const qas = inject('qas')

// composables
const route = useRoute()

const { isBackgroundOverlay } = useOverlayNavigation()

const {
  // state
  viewState,

  // computed
  hasHeaderSlot,
  hasFooterSlot,
  canShowFetchErrorSlot,

  // functions
  errorHandler,
  fetchHandler,
  setErrors,
  setFields,
  setMetadata,
  setResult,
  updateModels
} = useView({ emit, props, slots, mode: 'single' })

// Expose
defineExpose({ fetchSingle, fetchHandler })

// computed
const id = computed(() => props.customId || route.params.id)

const resultModel = computed(() => {
  if (props.useStore) return qas.getGetter({ entity: props.entity, key: 'byId' })(id.value) || {}

  return viewState.value.result || {}
})

const hasResult = computed(() => !!resultModel.value)

// watch
watch(() => route, (to, from) => {
  if (isBackgroundOverlay.value) return

  if (to.name === from.name) {
    fetchHandler({ id: id.value, url: props.url }, fetchSingle)
  }
})

watch(() => resultModel.value, value => emit('update:result', markRaw({ ...value })))

// created
fetchHandler({ id: id.value, url: props.url }, fetchSingle)

// functions
async function fetchSingle (externalPayload = {}) {
  viewState.value.fetching = true

  try {
    const payload = { id: id.value, url: props.url, ...externalPayload }

    const response = await getAction(payload)

    const { errors, fields, metadata, result } = response.data

    setErrors(errors)
    setFields(fields)
    setMetadata(metadata)

    /**
     * result só precisa ser adicionado ao estado se não estiver usando store,
     * pois com a store é usado o getter.
     */
    !props.useStore && setResult(result)

    updateModels({
      errors: viewState.value.errors,
      fields: viewState.value.fields,
      metadata: viewState.value.metadata,

      ...(!props.useStore && { result: viewState.value.result })
    })

    emit('fetch-success', response)

    log(`[${props.entity}]:fetchSingle:success`, response)
  } catch (error) {
    errorHandler(error)
    emit('fetch-error', error)

    log(`[${props.entity}]:fetchSingle:error`, error)
  } finally {
    viewState.value.fetching = false
  }
}

function getAction (payload) {
  if (props.useStore) {
    return qas.getAction({
      entity: props.entity,
      key: 'fetchSingle',
      payload
    })
  }

  const { id: unusedID, url: unusedURL, ...externalPayload } = payload

  const decamelizedEntity = decamelize(props.entity, { separator: '-' })

  const url = props.url || `${decamelizedEntity}/${id.value}`

  return axios.get(url, { ...externalPayload })
}
</script>
